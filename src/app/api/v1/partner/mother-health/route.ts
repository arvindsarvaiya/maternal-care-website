import { NextRequest } from 'next/server';
import { getAuthPayload, success, badRequest, unauthorized } from '@/lib/api-utils';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { calcPostpartumWeek } from '@/lib/postpartum-calculator';
import { calcPregnancyWeek } from '@/lib/pregnancy-calculator';

/**
 * GET /api/v1/partner/mother-health
 * Partner fetches their linked mother's recent mood and symptom data.
 * Query params:
 *   - days: number of days to look back (default 7)
 *   - limit: max records per type (default 10)
 */
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const url = new URL(req.url);
        const days = parseInt(url.searchParams.get('days') || '7');
        const limit = parseInt(url.searchParams.get('limit') || '10');

        // Find the partner's linked family
        const membership = await prisma.familyMember.findFirst({
            where: {
                userId: payload.userId,
                memberRole: 'partner',
                inviteStatus: 'accepted',
            },
            include: { family: true },
        });

        if (!membership) {
            return success({
                linked: false,
                message: 'Not linked to any mother account yet.',
                moodHistory: [],
                recentSymptoms: [],
                pregnancyInfo: null,
                suggestions: [],
            });
        }

        const motherUserId = membership.family.motherUserId;
        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - days);

        // Fetch mother's mood history
        const moodMetricType = await prisma.wellnessMetricType.findUnique({
            where: { metricName: 'mood' },
        });

        let moodLogs: any[] = [];
        if (moodMetricType) {
            moodLogs = await prisma.wellnessLog.findMany({
                where: {
                    userId: motherUserId,
                    metricTypeId: moodMetricType.id,
                    logDate: { gte: sinceDate },
                },
                orderBy: { logDate: 'desc' },
                take: limit,
                include: { metricType: { select: { metricName: true, unitLabel: true } } },
            });
        }

        // Fetch mother's recent symptoms
        const symptomLogs = await prisma.symptomLog.findMany({
            where: {
                userId: motherUserId,
                loggedAt: { gte: sinceDate },
            },
            orderBy: { loggedAt: 'desc' },
            take: limit,
            include: {
                symptomType: { select: { symptomName: true } },
                severity: { select: { severityName: true, severityRank: true } },
            },
        });

        // Fetch mother's pregnancy info for week calculation
        // Priority: PregnancyProfile (authoritative) > MotherHealthProfile (fallback)
        const pregnancyProfile = await prisma.pregnancyProfile.findUnique({
            where: { userId: motherUserId },
        });

        let currentWeek = 0;
        let trimester = '';
        let phase: 'pregnancy' | 'postpartum' | null = null;
        let postpartumWeek = 0;

        // Determine phase and calculate week from pregnancy profile (authoritative source)
        // Dynamically re-evaluates phase from due date vs current date (mirrors pregnancy profile API)
        if (pregnancyProfile) {
            const profilePhase = pregnancyProfile.phase || 'pregnancy';

            // Always re-evaluate phase based on due date vs current date
            // This ensures the phase dynamically changes as time passes
            let effectivePhase = profilePhase;
            if (pregnancyProfile.dueDate) {
                const now = new Date();
                const due = new Date(pregnancyProfile.dueDate);
                due.setHours(0, 0, 0, 0);
                now.setHours(0, 0, 0, 0);
                effectivePhase = due < now ? 'postpartum' : 'pregnancy';
            }

            if (effectivePhase === 'postpartum' && pregnancyProfile.deliveryDate) {
                phase = 'postpartum';
                const ppInfo = calcPostpartumWeek(pregnancyProfile.deliveryDate);
                postpartumWeek = ppInfo?.week || 0;
            } else if (effectivePhase === 'pregnancy') {
                phase = 'pregnancy';
                const info = calcPregnancyWeek({
                    lmpDate: pregnancyProfile.lmpDate,
                    dueDate: pregnancyProfile.dueDate,
                });
                if (info) {
                    currentWeek = info.week;
                    trimester = info.trimester === 1 ? 'first' : info.trimester === 2 ? 'second' : 'third';
                }
            }
        }

        // Fallback: use mother-health profile when pregnancy profile lacks dates
        // (mirrors mother/page.tsx lines 247-260 and weekly-journey/page.tsx fallback logic)
        if (currentWeek === 0 && postpartumWeek === 0) {
            const motherHealthProfile = await prisma.motherHealthProfile.findUnique({
                where: { userId: motherUserId },
            });

            if (motherHealthProfile) {
                const info = calcPregnancyWeek({
                    lmpDate: motherHealthProfile.lmpDate,
                    dueDate: motherHealthProfile.dueDate,
                });
                if (info) {
                    currentWeek = info.week;
                    trimester = info.trimester === 1 ? 'first' : info.trimester === 2 ? 'second' : 'third';
                    // If we fell back to mother-health, we're in pregnancy phase
                    phase = 'pregnancy';
                } else if (motherHealthProfile.weeksOfPregnancy) {
                    // Last resort: use the stored weeksOfPregnancy value
                    currentWeek = Math.min(42, Math.max(1, motherHealthProfile.weeksOfPregnancy));
                    if (currentWeek <= 13) trimester = 'first';
                    else if (currentWeek <= 26) trimester = 'second';
                    else trimester = 'third';
                    phase = 'pregnancy';
                }
            }
        }

        // Generate AI-style suggestions based on mood and symptom data
        const suggestions = generateSuggestions(moodLogs, symptomLogs, currentWeek, trimester, phase, postpartumWeek);

        return success({
            linked: true,
            motherName: await getMotherName(motherUserId),
            currentWeek,
            trimester,
            phase,
            postpartumWeek,
            days,
            moodHistory: moodLogs.map(l => ({
                id: l.id,
                logDate: l.logDate instanceof Date ? l.logDate.toISOString().split('T')[0] : l.logDate,
                value: l.numericValue,
            })),
            recentSymptoms: symptomLogs.map(s => ({
                id: s.id,
                symptomType: s.symptomType.symptomName,
                severity: s.severity.severityName,
                severityRank: s.severity.severityRank,
                loggedAt: s.loggedAt.toISOString(),
                notes: s.notes,
            })),
            suggestions,
            latestMood: moodLogs.length > 0 ? {
                value: moodLogs[0].numericValue,
                date: moodLogs[0].logDate instanceof Date ? moodLogs[0].logDate.toISOString().split('T')[0] : moodLogs[0].logDate,
            } : null,
        });
    } catch (err) {
        logger.error('Get mother health error:', 'partner-mother-health', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch mother health data');
    }
}

async function getMotherName(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true },
    });
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
}

function generateSuggestions(
    moodLogs: any[],
    symptomLogs: any[],
    currentWeek: number,
    trimester: string,
    phase: 'pregnancy' | 'postpartum' | null = null,
    postpartumWeek: number = 0
): string[] {
    const suggestions: string[] = [];

    // Mood-based suggestions
    const moodValues = moodLogs.map(l => l.numericValue).filter((v): v is number => v !== null);
    const avgMood = moodValues.length > 0 ? moodValues.reduce((a, b) => a + b, 0) / moodValues.length : 0;

    if (avgMood > 0 && avgMood < 3) {
        if (phase === 'postpartum') {
            suggestions.push('💛 Her mood has been low recently. Postpartum emotions can be intense — be patient, listen without judgment, and offer reassurance.');
            suggestions.push('🌿 Watch for signs of postpartum depression: persistent sadness, withdrawal, lack of interest in the baby. If you notice these, gently encourage her to speak with her doctor.');
        } else {
            suggestions.push('💛 Her mood has been low recently. Consider planning a relaxing evening together — watch her favorite movie or cook her a special meal.');
            suggestions.push('🌿 Gentle encouragement helps. Remind her she\'s doing an amazing job and that you\'re proud of her.');
        }
        suggestions.push('🎵 Create a calming playlist for her — soothing music can help lift her spirits.');
    } else if (avgMood >= 4) {
        suggestions.push('😊 She seems to be in good spirits! Keep up the positive energy and continue being present.');
    }

    // Symptom-based suggestions
    const symptomNames = symptomLogs.map(s => s.symptomType.symptomName.toLowerCase());
    const severeSymptoms = symptomLogs.filter(s => s.severity.severityRank >= 3);

    if (symptomNames.some(s => s.includes('nausea') || s.includes('morning sickness'))) {
        suggestions.push('🤢 She\'s experiencing nausea. Keep crackers or dry toast by the bedside, and encourage small frequent meals.');
        suggestions.push('🍋 Ginger tea or lemon water can help soothe nausea. Have these ready for her.');
    }

    if (symptomNames.some(s => s.includes('back') || s.includes('back pain') || s.includes('backache'))) {
        suggestions.push('💆 Back pain is common. Offer gentle back rubs and ensure she has comfortable pillows for support.');
        suggestions.push('🛁 A warm (not hot) bath with Epsom salts can help relieve back discomfort.');
    }

    if (symptomNames.some(s => s.includes('fatigue') || s.includes('tired'))) {
        if (phase === 'postpartum') {
            suggestions.push('😴 Postpartum fatigue is real — she\'s recovering from delivery AND caring for a newborn. Take over night feedings when possible (use pumped milk or formula).');
            suggestions.push('☕ Encourage her to sleep when the baby sleeps. Take over household chores so she can truly rest.');
        } else {
            suggestions.push('😴 Fatigue is normal during pregnancy. Take over some household chores so she can rest more.');
            suggestions.push('☕ Encourage short naps during the day and ensure she stays hydrated.');
        }
    }

    if (symptomNames.some(s => s.includes('headache'))) {
        suggestions.push('💧 Ensure she\'s drinking enough water. Dehydration can cause headaches. Keep a water bottle nearby.');
        suggestions.push('🌑 Dim the lights and reduce screen time if she has a headache. A cool compress on the forehead can help.');
    }

    if (severeSymptoms.length > 0) {
        suggestions.push('⚠️ She has reported some severe symptoms. Please check in with her and consider contacting your healthcare provider if symptoms persist.');
    }

    // Postpartum-specific suggestions
    if (phase === 'postpartum') {
        // Postpartum phase-based tips
        if (postpartumWeek <= 2) {
            suggestions.push('🏥 She\'s in the immediate recovery phase. Focus on her comfort — help with perineal care, bring her water and snacks while breastfeeding, and limit visitors.');
            suggestions.push('🍼 Help with night feedings so she can get longer stretches of sleep. Even one 4-hour block can make a huge difference.');
        } else if (postpartumWeek <= 6) {
            suggestions.push('🩹 Early recovery continues. She may start feeling more mobile but still needs rest. Take over heavy lifting and household chores.');
            suggestions.push('📅 Schedule her 6-week postpartum checkup if not already booked. This is crucial for assessing recovery.');
        } else if (postpartumWeek <= 12) {
            suggestions.push('🌱 She\'s in late recovery. Encourage gentle exercise like walking together with the baby. Watch for signs of postpartum depression which can appear months after birth.');
        } else {
            suggestions.push('💪 Extended recovery phase. Continue sharing the load — parenting is a marathon, not a sprint. Keep checking in on her emotional well-being.');
        }

        // Postpartum mental health
        suggestions.push('🧠 Postpartum mental health matters. Ask her how she\'s REALLY feeling — not just "how are you?" but "how are you coping today?"');
        suggestions.push('👶 Bond with the baby through skin-to-skin contact, bath time, and diaper changes. This gives her breaks AND strengthens your connection.');

        // Ensure 6-week checkup
        if (postpartumWeek >= 4 && postpartumWeek <= 8) {
            suggestions.push('🏥 The 6-week postpartum checkup is important. Make sure she\'s scheduled and offer to go with her.');
        }
    } else {
        // Trimester-based suggestions (pregnancy)
        if (trimester === 'first') {
            suggestions.push('📅 First trimester can be the most challenging. Be extra patient and supportive — her body is going through major changes.');
            suggestions.push('🍽️ Help with meal prep — certain smells may trigger nausea, so be flexible with food choices.');
        } else if (trimester === 'second') {
            suggestions.push('👶 Second trimester often brings more energy. It\'s a great time to start preparing the nursery together.');
            suggestions.push('📚 Consider reading a pregnancy book together to understand what\'s happening each week.');
        } else if (trimester === 'third') {
            suggestions.push('🏥 Third trimester is preparation time. Help pack the hospital bag and ensure the car seat is installed.');
            suggestions.push('🦶 Foot massages can help with swelling. Offer to massage her feet after a long day.');
            suggestions.push('📋 Help track contractions and be ready for the big day! Make sure you know the route to the hospital.');
        }

        // Week-specific tips
        if (currentWeek >= 36) {
            suggestions.push('🎒 Make sure the hospital bag is fully packed. Include comfortable clothes, phone chargers, and important documents.');
            suggestions.push('🚗 Keep the car fueled and ready. Discuss the birth plan together so you\'re both prepared.');
        }
    }

    // Always include general supportive suggestions
    if (suggestions.length < 3) {
        suggestions.push('❤️ The most important thing you can do is be present and listen. Sometimes she just needs to vent.');
        suggestions.push('📸 Consider documenting this journey together — take weekly photos to look back on.');
        suggestions.push('🤝 Attend appointments with her when possible. Your presence means more than you know.');
    }

    // Deduplicate and limit
    return [...new Set(suggestions)].slice(0, 8);
}