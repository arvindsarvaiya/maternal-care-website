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
    medicalConditions?: {
        anemia: boolean;
        diabetes: boolean;
        hypertension: boolean;
        highBP: boolean;
        lowBP: boolean;
        thyroidDisorder: boolean;
        pcos: boolean;
        asthma: boolean;
        heartDisease: boolean;
        kidneyIssues: boolean;
        epilepsy: boolean;
        highRiskPregnancy: boolean;
        depressionAnxiety: boolean;
    };
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

    // ─── Anemia / Iron (symptom-based OR medical condition) ───
    {
        name: 'anemia_support',
        condition: (ctx) => {
            return ctx.symptoms?.some(s => s.name.toLowerCase().includes('anemia')) || ctx.highRiskFlag === true || ctx.medicalConditions?.anemia === true || false;
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
            return ctx.symptoms?.some(s => s.name.toLowerCase().includes('anemia')) || ctx.highRiskFlag === true || ctx.medicalConditions?.anemia === true || false;
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

    // ─── Medical Condition: Diabetes ───
    {
        name: 'diabetes_blood_sugar_guidance',
        condition: (ctx) => ctx.medicalConditions?.diabetes === true,
        output: () => ({
            type: 'guidance',
            priority: 'high',
            title: 'Diabetes: Blood Sugar Monitoring',
            description: 'Monitor your blood sugar regularly as recommended by your doctor. Eat balanced meals with complex carbs, lean proteins, and healthy fats. Avoid sugary drinks and processed foods. Keep your glucose meter and supplies accessible.',
            action: 'diabetes_guidance',
        }),
    },
    {
        name: 'diabetes_partner_support',
        condition: (ctx) => ctx.medicalConditions?.diabetes === true,
        output: () => ({
            type: 'partner_prompt',
            priority: 'high',
            title: 'Partner: Diabetes Meal Support',
            description: 'Help prepare balanced, low-glycemic meals. Avoid bringing sugary snacks home. Remind her about blood sugar checks. Know the signs of high and low blood sugar.',
            action: 'partner_diabetes_support',
            supportAction: {
                category: 'meal_support',
                suggestion: 'Prepare balanced low-glycemic meals and avoid sugary snacks',
            },
        }),
    },

    // ─── Medical Condition: Hypertension / High BP ───
    {
        name: 'hypertension_bp_guidance',
        condition: (ctx) => ctx.medicalConditions?.hypertension === true || ctx.medicalConditions?.highBP === true,
        output: () => ({
            type: 'guidance',
            priority: 'high',
            title: 'Hypertension: Blood Pressure Care',
            description: 'Monitor your blood pressure daily. Reduce salt intake. Avoid processed and packaged foods. Stay hydrated and get adequate rest. Do not skip your prenatal appointments as BP monitoring is critical.',
            action: 'hypertension_guidance',
        }),
    },
    {
        name: 'hypertension_stress_partner',
        condition: (ctx) => ctx.medicalConditions?.hypertension === true || ctx.medicalConditions?.highBP === true,
        output: () => ({
            type: 'partner_prompt',
            priority: 'high',
            title: 'Partner: Help Reduce Stress',
            description: 'Help create a calm, low-stress environment. Encourage rest and relaxation. Prepare low-sodium meals. Accompany her to BP check appointments.',
            action: 'partner_hypertension_support',
            supportAction: {
                category: 'emotional_support',
                suggestion: 'Create a calm environment and prepare low-sodium meals',
            },
        }),
    },

    // ─── Medical Condition: Low BP ───
    {
        name: 'lowbp_guidance',
        condition: (ctx) => ctx.medicalConditions?.lowBP === true,
        output: () => ({
            type: 'guidance',
            priority: 'medium',
            title: 'Low Blood Pressure: Stay Safe',
            description: 'Stand up slowly from sitting or lying positions. Stay well hydrated and increase salt intake slightly if advised by your doctor. Eat smaller, more frequent meals to prevent post-meal drops in BP.',
            action: 'lowbp_guidance',
        }),
    },

    // ─── Medical Condition: Thyroid Disorder ───
    {
        name: 'thyroid_medication_reminder',
        condition: (ctx) => ctx.medicalConditions?.thyroidDisorder === true,
        output: () => ({
            type: 'guidance',
            priority: 'high',
            title: 'Thyroid: Medication Consistency',
            description: 'Take your thyroid medication at the same time every day, preferably on an empty stomach. Do not skip doses. Regular thyroid level checks are important during pregnancy as dosage may need adjustment.',
            action: 'thyroid_guidance',
        }),
    },

    // ─── Medical Condition: PCOS ───
    {
        name: 'pcos_metabolic_guidance',
        condition: (ctx) => ctx.medicalConditions?.pcos === true,
        output: () => ({
            type: 'guidance',
            priority: 'medium',
            title: 'PCOS: Metabolic Health During Pregnancy',
            description: 'Focus on a balanced diet with adequate protein and fiber. Monitor for gestational diabetes as PCOS increases risk. Gentle exercise like walking can help with insulin sensitivity. Stay connected with your healthcare provider.',
            action: 'pcos_guidance',
        }),
    },

    // ─── Medical Condition: Asthma ───
    {
        name: 'asthma_breathing_guidance',
        condition: (ctx) => ctx.medicalConditions?.asthma === true,
        output: () => ({
            type: 'guidance',
            priority: 'high',
            title: 'Asthma: Breathing Management',
            description: 'Continue using your prescribed inhalers as directed. Avoid known triggers. Practice breathing exercises. Keep your rescue inhaler accessible. Inform your obstetrician about your asthma management plan.',
            action: 'asthma_guidance',
        }),
    },

    // ─── Medical Condition: Heart Disease ───
    {
        name: 'heart_disease_activity_modification',
        condition: (ctx) => ctx.medicalConditions?.heartDisease === true,
        output: () => ({
            type: 'guidance',
            priority: 'high',
            title: 'Heart Condition: Activity & Rest',
            description: 'Follow your cardiologist\'s recommendations for activity during pregnancy. Avoid overexertion. Take frequent rest breaks. Monitor for shortness of breath, chest pain, or palpitations and report promptly.',
            action: 'heart_disease_guidance',
        }),
    },

    // ─── Medical Condition: Kidney Issues ───
    {
        name: 'kidney_hydration_monitoring',
        condition: (ctx) => ctx.medicalConditions?.kidneyIssues === true,
        output: () => ({
            type: 'guidance',
            priority: 'high',
            title: 'Kidney Health: Fluid & Monitoring',
            description: 'Follow your doctor\'s fluid intake recommendations. Monitor for signs of swelling, reduced urine output, or high blood pressure. Attend all prenatal and nephrology appointments. Report any changes promptly.',
            action: 'kidney_guidance',
        }),
    },

    // ─── Medical Condition: Epilepsy ───
    {
        name: 'epilepsy_seizure_safety',
        condition: (ctx) => ctx.medicalConditions?.epilepsy === true,
        output: () => ({
            type: 'guidance',
            priority: 'high',
            title: 'Epilepsy: Seizure Safety',
            description: 'Take anti-seizure medications exactly as prescribed. Do not stop or adjust medications without consulting your doctor. Have a seizure safety plan. Ensure someone knows what to do if you have a seizure.',
            action: 'epilepsy_guidance',
        }),
    },

    // ─── Medical Condition: Depression / Anxiety ───
    {
        name: 'depression_anxiety_mental_health',
        condition: (ctx) => ctx.medicalConditions?.depressionAnxiety === true,
        output: () => ({
            type: 'guidance',
            priority: 'high',
            title: 'Mental Health: You Are Not Alone',
            description: 'Perinatal depression and anxiety are common and treatable. Continue any prescribed medications only as advised by your doctor. Practice self-compassion. Reach out to your support network. Consider speaking with a perinatal mental health specialist.',
            action: 'mental_health_support',
        }),
    },
    {
        name: 'depression_anxiety_partner',
        condition: (ctx) => ctx.medicalConditions?.depressionAnxiety === true,
        output: () => ({
            type: 'partner_prompt',
            priority: 'high',
            title: 'Partner: Mental Health Support',
            description: 'Be patient and understanding. Listen without judgment. Help with practical tasks to reduce her load. Encourage but don\'t push. Know the warning signs of worsening depression and have emergency contacts ready.',
            action: 'partner_mental_health_support',
            supportAction: {
                category: 'emotional_support',
                suggestion: 'Listen without judgment and help with practical tasks',
            },
        }),
    },

    // ─── High Risk Pregnancy ───
    {
        name: 'high_risk_pregnancy_extra_care',
        condition: (ctx) => ctx.medicalConditions?.highRiskPregnancy === true || ctx.highRiskFlag === true,
        output: () => ({
            type: 'guidance',
            priority: 'high',
            title: 'High-Risk Pregnancy: Extra Care',
            description: 'Your pregnancy is flagged as high-risk. Attend all scheduled appointments. Follow your doctor\'s specific recommendations. Monitor baby movements daily. Have your hospital bag ready early. Know the warning signs that require immediate attention.',
            action: 'high_risk_guidance',
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
    const [profile, symptoms, logs, motherHealth] = await Promise.all([
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
        prisma.motherHealthProfile.findUnique({ where: { userId } }),
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
        medicalConditions: motherHealth ? {
            anemia: motherHealth.anemia ?? false,
            diabetes: motherHealth.diabetes ?? false,
            hypertension: motherHealth.highBP ?? false,
            highBP: motherHealth.highBP ?? false,
            lowBP: motherHealth.lowBP ?? false,
            thyroidDisorder: motherHealth.thyroidDisorder ?? false,
            pcos: motherHealth.pcos ?? false,
            asthma: motherHealth.asthma ?? false,
            heartDisease: motherHealth.heartDisease ?? false,
            kidneyIssues: motherHealth.kidneyIssues ?? false,
            epilepsy: motherHealth.epilepsy ?? false,
            highRiskPregnancy: false, // Set from pregnancy profile highRiskFlag instead
            depressionAnxiety: motherHealth.depressionAnxiety ?? false,
        } : undefined,
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