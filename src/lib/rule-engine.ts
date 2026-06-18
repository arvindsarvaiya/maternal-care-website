import prisma from './prisma';
import { logger } from './logger';
import { computePregnancyWeek, computePregnancyWeekFromDueDate, detectEmergencyKeywords } from './utils';

// ─── Rule Engine Types ───

export interface RuleContext {
    userId: string;
    pregnancyWeek?: number;
    trimester?: number;
    symptoms?: { name: string; severity: string; occurrences?: number }[];
    moodHistory?: { value: number; date: Date }[];
    upcomingAppointments?: { id: string; scheduledAt: Date; type: string }[];
    highRiskFlag?: boolean;
    partnerAvailable?: boolean;
}

export interface RuleOutput {
    type: 'task' | 'notification' | 'guidance' | 'escalation' | 'partner_prompt';
    priority: 'low' | 'medium' | 'high' | 'emergency';
    title: string;
    description: string;
    action?: string;
    targetUserIds?: string[];
    isEmergency?: boolean;
    supportAction?: {
        category: string;
        suggestion: string;
    };
}

// ─── Rule Definitions ───

interface RuleDefinition {
    name: string;
    condition: (ctx: RuleContext) => boolean;
    output: (ctx: RuleContext) => RuleOutput;
}

export const rules: RuleDefinition[] = [
    // ─── Nausea (First Trimester) ───
    {
        name: 'nausea_first_trimester',
        condition: (ctx) => {
            return (
                (ctx.trimester === 1 || (ctx.pregnancyWeek && ctx.pregnancyWeek <= 13)) &&
                ctx.symptoms?.some(s => s.name.toLowerCase().includes('nausea')) || false
            );
        },
        output: (ctx) => ({
            type: 'guidance',
            priority: 'medium',
            title: 'Nausea Relief Guidance',
            description: 'Nausea is common in the first trimester. Try eating small, frequent meals. Ginger tea, crackers, and avoiding strong smells may help. Stay hydrated with small sips of water throughout the day.',
            action: 'show_nausea_guidance',
        }),
    },
    {
        name: 'nausea_partner_support',
        condition: (ctx) => {
            return (
                (ctx.trimester === 1 || (ctx.pregnancyWeek && ctx.pregnancyWeek <= 13)) &&
                ctx.symptoms?.some(s => s.name.toLowerCase().includes('nausea')) || false
            );
        },
        output: (ctx) => ({
            type: 'partner_prompt',
            priority: 'medium',
            title: 'Partner Support: Nausea Relief',
            description: 'She is experiencing nausea. Offer light, bland meals. Avoid strong cooking smells. Keep crackers or dry toast nearby. Ask if she would like ginger tea or ice chips.',
            action: 'partner_nausea_support',
            supportAction: {
                category: 'meal_support',
                suggestion: 'Prepare light meals and avoid strong cooking smells',
            },
        }),
    },

    // ─── Anemia / Iron ───
    {
        name: 'anemia_support',
        condition: (ctx) => {
            return ctx.symptoms?.some(s => s.name.toLowerCase().includes('anemia')) || ctx.highRiskFlag === true || false;
        },
        output: (ctx) => ({
            type: 'guidance',
            priority: 'high',
            title: 'Iron & Anemia Support',
            description: 'Iron-rich foods are important. Include leafy greens, lean red meat, beans, and fortified cereals. Take iron supplements as prescribed. Pair with vitamin C for better absorption. Avoid tea/coffee with meals as they reduce iron absorption.',
            action: 'show_anemia_guidance',
        }),
    },
    {
        name: 'anemia_meal_partner',
        condition: (ctx) => {
            return ctx.symptoms?.some(s => s.name.toLowerCase().includes('anemia')) || ctx.highRiskFlag === true || false;
        },
        output: (ctx) => ({
            type: 'partner_prompt',
            priority: 'high',
            title: 'Partner: Help with Iron-Rich Meals',
            description: 'Prepare iron-rich meals: spinach dal, lean meat, beans. Include vitamin C sources like lemon or tomatoes. Remind her about iron supplements if prescribed.',
            action: 'partner_iron_meals',
            supportAction: {
                category: 'meal_support',
                suggestion: 'Prepare iron-rich meals with vitamin C sources',
            },
        }),
    },

    // ─── Upcoming Appointments (within 2 days) ───
    {
        name: 'appointment_reminder_2days',
        condition: (ctx) => {
            if (!ctx.upcomingAppointments?.length) return false;
            const now = new Date();
            return ctx.upcomingAppointments.some(apt => {
                const diffMs = new Date(apt.scheduledAt).getTime() - now.getTime();
                const diffHours = diffMs / 3600000;
                return diffHours > 0 && diffHours <= 48;
            });
        },
        output: (ctx) => {
            const nextApt = ctx.upcomingAppointments!.
                filter(a => {
                    const diffMs = new Date(a.scheduledAt).getTime() - Date.now();
                    return diffMs > 0 && diffMs <= 48 * 3600000;
                })
                .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];

            return {
                type: 'notification',
                priority: 'high',
                title: 'Upcoming Appointment',
                description: `You have a ${nextApt.type} appointment in the next 2 days. Please prepare any questions for your provider and confirm transport arrangements.`,
                action: 'remind_appointment',
            };
        },
    },
    {
        name: 'appointment_prep_tasks',
        condition: (ctx) => {
            if (!ctx.upcomingAppointments?.length) return false;
            const now = new Date();
            return ctx.upcomingAppointments.some(apt => {
                const diffMs = new Date(apt.scheduledAt).getTime() - now.getTime();
                const diffHours = diffMs / 3600000;
                return diffHours > 0 && diffHours <= 48;
            });
        },
        output: (ctx) => ({
            type: 'task',
            priority: 'high',
            title: 'Appointment Preparation Tasks',
            description: 'Prepare questions list for provider. Confirm transport. Arrange childcare if needed. Pack medical records and previous reports.',
            action: 'create_appointment_prep_tasks',
        }),
    },

    // ─── Low Mood (3 consecutive days) ───
    {
        name: 'low_mood_3days',
        condition: (ctx) => {
            if (!ctx.moodHistory || ctx.moodHistory.length < 3) return false;
            const recent = ctx.moodHistory.slice(-3);
            return recent.every(m => m.value <= 2); // Assuming 1-5 scale, <=2 is low
        },
        output: (ctx) => ({
            type: 'escalation',
            priority: 'high',
            title: 'Emotional Wellbeing Check',
            description: 'You have reported low mood for several days. This is common during pregnancy, but persistent low mood deserves attention. Consider talking to someone you trust or your healthcare provider. If you have thoughts of harming yourself, please seek immediate help.',
            action: 'suggest_emotional_support',
        }),
    },
    {
        name: 'low_mood_partner',
        condition: (ctx) => {
            if (!ctx.moodHistory || ctx.moodHistory.length < 3) return false;
            const recent = ctx.moodHistory.slice(-3);
            return recent.every(m => m.value <= 2);
        },
        output: (ctx) => ({
            type: 'partner_prompt',
            priority: 'high',
            title: 'Emotional Support',
            description: 'She has been feeling low recently. Offer a listening ear without trying to "fix" things. Ask how she is feeling. Offer gentle companionship. Suggest a walk or a favorite activity if she is open to it.',
            action: 'partner_emotional_support',
            supportAction: {
                category: 'emotional_support',
                suggestion: 'Listen without judgment. Offer gentle companionship.',
            },
        }),
    },

    // ─── Emergency Warning Signs ───
    {
        name: 'emergency_bleeding',
        condition: (ctx) => {
            return ctx.symptoms?.some(s =>
                s.name.toLowerCase().includes('bleeding') ||
                s.name.toLowerCase().includes('heavy bleeding')
            ) || false;
        },
        output: (ctx) => ({
            type: 'escalation',
            priority: 'emergency',
            title: '⚠️ Seek Immediate Medical Care',
            description: 'Bleeding during pregnancy requires immediate medical evaluation. Please contact your healthcare provider or go to the nearest emergency department right now. Do not wait.',
            action: 'emergency_escalation',
            isEmergency: true,
        }),
    },
    {
        name: 'emergency_severe_headache',
        condition: (ctx) => {
            return ctx.symptoms?.some(s =>
                s.name.toLowerCase().includes('severe headache') ||
                (s.name.toLowerCase().includes('headache') && s.severity === 'severe')
            ) || false;
        },
        output: (ctx) => ({
            type: 'escalation',
            priority: 'emergency',
            title: '⚠️ Severe Headache — Seek Care',
            description: 'A severe headache during pregnancy can be a sign of preeclampsia. Please seek immediate medical attention. Contact your healthcare provider or go to the emergency department.',
            action: 'emergency_escalation',
            isEmergency: true,
        }),
    },
    {
        name: 'emergency_reduced_movement',
        condition: (ctx) => {
            return ctx.symptoms?.some(s =>
                s.name.toLowerCase().includes('reduced movement') ||
                s.name.toLowerCase().includes('no movement')
            ) || false;
        },
        output: (ctx) => ({
            type: 'escalation',
            priority: 'emergency',
            title: '⚠️ Reduced Fetal Movement — Urgent',
            description: 'Reduced or absent fetal movement needs immediate evaluation. Please go to your hospital or contact your healthcare provider immediately. Do not wait for the next scheduled appointment.',
            action: 'emergency_escalation',
            isEmergency: true,
        }),
    },

    // ─── Hospital Bag (Third Trimester, Week 34+) ───
    {
        name: 'hospital_bag_prep',
        condition: (ctx) => {
            return (ctx.pregnancyWeek && ctx.pregnancyWeek >= 34) || false;
        },
        output: (ctx) => ({
            type: 'task',
            priority: 'medium',
            title: 'Prepare Hospital Bag',
            description: 'Pack your hospital bag with essentials: comfortable clothes, toiletries, phone charger, important documents, baby clothes, maternity pads, and snacks.',
            action: 'hospital_bag_checklist',
        }),
    },
    {
        name: 'hospital_bag_partner',
        condition: (ctx) => {
            return (ctx.pregnancyWeek && ctx.pregnancyWeek >= 34) || false;
        },
        output: (ctx) => ({
            type: 'partner_prompt',
            priority: 'medium',
            title: 'Partner: Help Pack Hospital Bag',
            description: 'Help prepare the hospital bag. Confirm you know the route to the hospital. Keep the car fueled. Have emergency contacts ready.',
            action: 'partner_hospital_bag',
            supportAction: {
                category: 'preparation',
                suggestion: 'Help pack the hospital bag and confirm hospital route',
            },
        }),
    },

    // ─── Hydration Reminder ───
    {
        name: 'hydration_reminder',
        condition: () => true, // Always applicable
        output: () => ({
            type: 'guidance',
            priority: 'low',
            title: 'Stay Hydrated',
            description: 'Aim for 8-10 glasses of water daily during pregnancy. Proper hydration helps prevent UTIs, constipation, and preterm contractions.',
            action: 'hydration_reminder',
        }),
    },

    // ─── Rest Reminder ───
    {
        name: 'rest_reminder',
        condition: (ctx) => {
            return (ctx.trimester === 3 || (ctx.pregnancyWeek && ctx.pregnancyWeek >= 28)) || false;
        },
        output: (ctx) => ({
            type: 'guidance',
            priority: 'medium',
            title: 'Rest & Side Sleeping',
            description: 'In the third trimester, try to sleep on your left side to improve blood flow. Take rest breaks during the day. Elevate your feet when sitting to reduce swelling.',
            action: 'rest_guidance',
        }),
    },

    // ─── Partner Daily Check-in ───
    {
        name: 'partner_daily_checkin',
        condition: () => true,
        output: () => ({
            type: 'partner_prompt',
            priority: 'low',
            title: 'Daily Support Check-in',
            description: 'Ask how she is feeling today — without interrupting. Offer specific help: "Can I get you water?" or "Would you like a short walk?" is better than "Let me know if you need anything."',
            action: 'partner_daily_checkin',
            supportAction: {
                category: 'emotional_support',
                suggestion: 'Ask how she is feeling and offer specific, practical help',
            },
        }),
    },
];

// ─── Rule Engine Executor ───

export async function evaluateRules(ctx: RuleContext): Promise<RuleOutput[]> {
    const results: RuleOutput[] = [];

    for (const rule of rules) {
        if (!rule.condition) continue;
        try {
            if (rule.condition(ctx)) {
                results.push(rule.output(ctx));
            }
        } catch (err) {
            logger.error('Rule evaluation failed', 'rule-engine', err instanceof Error ? err : undefined, { ruleName: rule.name });
        }
    }

    // Deduplicate by type + title
    const seen = new Set<string>();
    const deduped = results.filter(r => {
        const key = `${r.type}:${r.title}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    // Sort by priority
    const priorityOrder = { emergency: 0, high: 1, medium: 2, low: 3 };
    deduped.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return deduped;
}

// ─── Context Builder ───

export async function buildRuleContext(userId: string): Promise<RuleContext> {
    const [profile, symptoms, logs] = await Promise.all([
        prisma.pregnancyProfile.findUnique({ where: { userId } }),
        prisma.symptomLog.findMany({
            where: { userId },
            include: {
                symptomType: true,
                severity: true,
            },
            orderBy: { loggedAt: 'desc' },
            take: 20,
        }),
        prisma.wellnessLog.findMany({
            where: {
                userId,
                metricType: { metricName: 'mood' },
            },
            orderBy: { logDate: 'desc' },
            take: 14,
        }),
    ]);

    const appointments = await prisma.appointment.findMany({
        where: { userId, scheduledAt: { gte: new Date() } },
        include: { appointmentType: true },
        orderBy: { scheduledAt: 'asc' },
        take: 5,
    });

    let pregnancyWeek: number | undefined;
    let trimester: number | undefined;

    if (profile) {
        if (profile.lmpDate) {
            const { week, trimester: tri } = computePregnancyWeek(profile.lmpDate);
            pregnancyWeek = week;
            trimester = tri;
        } else if (profile.dueDate) {
            const { week, trimester: tri } = computePregnancyWeekFromDueDate(profile.dueDate);
            pregnancyWeek = week;
            trimester = tri;
        }
    }

    return {
        userId,
        pregnancyWeek,
        trimester,
        symptoms: symptoms.map(s => ({
            name: s.symptomType.symptomName,
            severity: s.severity.severityName,
        })),
        moodHistory: logs.map(l => ({
            value: l.numericValue ?? 3,
            date: l.logDate as Date,
        })),
        upcomingAppointments: appointments.map(a => ({
            id: a.id,
            scheduledAt: a.scheduledAt,
            type: a.appointmentType.typeName,
        })),
        highRiskFlag: profile?.highRiskFlag ?? false,
    };
}

// ─── Support Action Generator ───

export function generateSupportActions(ruleOutputs: RuleOutput[]): {
    category: string;
    suggestions: string[];
}[] {
    const actions = ruleOutputs.filter(r => r.supportAction);
    const grouped: Record<string, string[]> = {};

    for (const action of actions) {
        const cat = action.supportAction!.category;
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(action.supportAction!.suggestion);
    }

    return Object.entries(grouped).map(([category, suggestions]) => ({
        category,
        suggestions: [...new Set(suggestions)],
    }));
}