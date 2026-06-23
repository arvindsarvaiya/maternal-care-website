// ─── Notification & Reminder Engine ───────────────────────────────
// This module handles notification generation, priority-based queuing,
// channel delivery logic, and rule-engine output processing.
//
// Schema reference:
//   - Notification (userId, notificationTypeId, statusId, channelId, scheduledFor, sentAt, readAt, payloadJson)
//   - NotificationType (typeName: 'appointment' | 'medication' | 'weekly_update' | 'partner_activity' | 'system' | 'rule_triggered')
//   - NotificationStatus (statusName: 'pending' | 'sent' | 'delivered' | 'read' | 'dismissed' | 'failed')
//   - ReminderChannel (channelName: 'push' | 'email' | 'sms' | 'in_app')
//   - ReminderTemplate (notificationTypeId, languageId, channelId, templateTitle, templateBody)
//   - RuleOutput (type: 'notification', priority, description, action)
// ───────────────────────────────────────────────────────────────────

import { RuleOutput } from './rule-engine';

// ─── Types ─────────────────────────────────────────────────────────

export type NotificationCategory =
    | 'appointment'
    | 'medication'
    | 'weekly_update'
    | 'partner_activity'
    | 'system'
    | 'rule_triggered';

export type NotificationStatus =
    | 'pending'
    | 'sent'
    | 'delivered'
    | 'read'
    | 'dismissed'
    | 'failed';

export type ReminderChannelType = 'push' | 'email' | 'sms' | 'in_app';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'emergency';

/** Medical conditions from MotherHealthProfile used for personalization */
export interface MedicalConditionsForNotifications {
    anemia?: boolean;
    diabetes?: boolean;
    highBP?: boolean;
    lowBP?: boolean;
    thyroidDisorder?: boolean;
    pcos?: boolean;
    asthma?: boolean;
    heartDisease?: boolean;
    kidneyIssues?: boolean;
    epilepsy?: boolean;
    depressionAnxiety?: boolean;
}

export interface NotificationItem {
    id: string;
    userId?: string;
    category: NotificationCategory;
    title: string;
    body: string;
    status: NotificationStatus;
    priority: NotificationPriority;
    channel: ReminderChannelType;
    scheduledFor: Date;
    sentAt?: Date;
    readAt?: Date;
    createdAt: Date;
    sourceRuleName?: string;
    actionUrl?: string;
    actionLabel?: string;
    payload?: Record<string, unknown>;
}

// ─── Configuration ─────────────────────────────────────────────────

export const NOTIFICATION_CATEGORY_CONFIG: Record<
    NotificationCategory,
    { label: string; icon: string; color: string }
> = {
    appointment: { label: 'Appointment', icon: '📅', color: 'trust' },
    medication: { label: 'Medication', icon: '💊', color: 'terracotta' },
    weekly_update: { label: 'Weekly Update', icon: '📖', color: 'sage' },
    partner_activity: { label: 'Partner Activity', icon: '💑', color: 'rose' },
    system: { label: 'System', icon: '⚙️', color: 'calm' },
    rule_triggered: { label: 'Smart Alert', icon: '🤖', color: 'warning' },
};

export const CHANNEL_CONFIG: Record<ReminderChannelType, { label: string; icon: string }> = {
    push: { label: 'Push', icon: '🔔' },
    email: { label: 'Email', icon: '📧' },
    sms: { label: 'SMS', icon: '📱' },
    in_app: { label: 'In-App', icon: '💬' },
};

export const PRIORITY_CONFIG: Record<NotificationPriority, { label: string; color: string }> = {
    low: { label: 'Low', color: 'calm' },
    medium: { label: 'Medium', color: 'trust' },
    high: { label: 'High', color: 'warning' },
    emergency: { label: 'Emergency', color: 'danger' },
};

// ─── Mock Notification Generator ───────────────────────────────────

const MOCK_TITLES: Record<NotificationCategory, string[]> = {
    appointment: [
        'Upcoming prenatal checkup tomorrow',
        'Ultrasound scan in 2 days',
        'Appointment reminder: Dr. Sharma at 10:30 AM',
        'Lab tests scheduled for Friday',
        'Vaccination appointment confirmed',
    ],
    medication: [
        'Time to take your iron supplement',
        'Calcium tablet reminder',
        'Folic acid daily reminder',
        'Vitamin D3 supplement due',
        'Medication refill needed: Iron tablets',
    ],
    weekly_update: [
        'Week 20: Your baby is the size of a banana!',
        'Week 21: Baby\'s heartbeat can be heard',
        'Week 22: Quickening — feel those first flutters',
        'Week 23: Baby\'s sense of balance developing',
        'Week 19: Vernix caseosa forming on baby\'s skin',
    ],
    partner_activity: [
        'Partner completed a support task',
        'Partner shared a new note',
        'Partner joined the shared space',
        'Partner updated the task board',
        'Partner sent you a message',
    ],
    system: [
        'Welcome to MaternalCare!',
        'Your profile has been updated',
        'New feature: Chat Assistant now available',
        'Privacy settings updated successfully',
        'Weekly report is ready to view',
    ],
    rule_triggered: [
        'Mood check: You seem to be feeling low lately',
        'Warning: High-risk symptom pattern detected',
        'Third trimester checklist is now available',
        'Missed appointment alert — please reschedule',
        'Wellness score below threshold',
    ],
};

const MOCK_BODIES: Record<NotificationCategory, string[]> = {
    appointment: [
        'Your prenatal checkup with Dr. Sharma is scheduled for tomorrow at 10:30 AM. Please bring your previous ultrasound reports.',
        'Anatomy scan scheduled in 2 days. Full bladder required for the procedure. Arrive 15 minutes early.',
        'Reminder: Your appointment with Dr. Patel is in 1 hour. Please confirm your attendance.',
        'Lab tests (CBC, iron levels, glucose) are scheduled for Friday morning. Fasting is required — no food or drink after 10 PM Thursday.',
        'Your Tdap vaccination appointment has been confirmed for next Monday at 11:00 AM.',
    ],
    medication: [
        'Time to take your daily iron supplement (Ferrous Sulfate 325mg). Take with vitamin C for better absorption.',
        'Your calcium supplement (500mg) is due. Avoid taking it at the same time as iron for best absorption.',
        'Don\'t forget your daily folic acid (400mcg). Consistent intake supports healthy neural tube development.',
        'Your weekly Vitamin D3 (60,000 IU) is due today. Take with a meal containing healthy fats.',
        'You have 3 days of iron tablets remaining. Consider refilling your prescription soon.',
    ],
    weekly_update: [
        'Your baby is now about the size of a banana! (Week 20). Taste buds are forming, and your baby can swallow. This week focuses on fetal movement patterns.',
        'Week 21: Your baby\'s heartbeat can now be heard with a stethoscope. Bone marrow is making red blood cells. Read our full update for diet and wellness tips.',
        'Week 22: You may begin feeling quickening — those first subtle flutters of movement! Your baby\'s eyebrows and eyelids are fully formed.',
        'Week 23: Your baby\'s sense of balance is developing. The inner ear is now fully formed. Your baby weighs about 500g now!',
        'Week 19: A protective coating called vernix caseosa is forming on your baby\'s skin. Your baby can now hear sounds from outside the womb.',
    ],
    partner_activity: [
        'Your partner completed the "Prepare hospital bag" task. Check the shared task board for updates.',
        'Your partner shared a new note: "Questions for Dr. Sharma." View it in the shared notes section.',
        'Your partner has joined your MaternalCare shared space. You can now collaborate on tasks and notes.',
        'Your partner updated the task board with a new item: "Install baby car seat." Check your shared tasks.',
        'Your partner sent you a supportive message via the Chat Assistant. Tap to view.',
    ],
    system: [
        'Welcome to MaternalCare! Track your pregnancy week by week, log symptoms, and connect with your support network. Start by setting up your profile.',
        'Your profile information has been updated successfully. Your changes are reflected across the platform.',
        'The Chat Assistant is now live! Get instant answers about your pregnancy week, symptoms, nutrition, and more. Available anytime.',
        'Your privacy and sharing settings have been updated. Review or change these anytime from Settings.',
        'Your weekly pregnancy report is ready! View detailed metrics, growth milestones, and personalized recommendations.',
    ],
    rule_triggered: [
        'We\'ve noticed you\'ve been logging low mood for the past 3 days. Your partner has been notified, and self-care resources are available in the Wellness section.',
        'High-risk symptom pattern detected: multiple severe symptoms logged within 24 hours. Please contact your healthcare provider immediately. Emergency contact: 108.',
        'You\'re now in the third trimester (28+ weeks)! A new shared checklist has been created for you and your partner. Review your birth plan preparation tasks.',
        'Our system detected a missed prenatal appointment. Regular checkups are essential for monitoring your health and your baby\'s development. Please reschedule.',
        'Your wellness score has dropped below the healthy threshold. Consider increasing water intake, getting more rest, and logging your meals for better tracking.',
    ],
};

let mockNotificationId = 1000;

export function generateMockNotifications(count: number = 25): NotificationItem[] {
    const categories: NotificationCategory[] = [
        'appointment',
        'medication',
        'weekly_update',
        'partner_activity',
        'system',
        'rule_triggered',
    ];
    const channels: ReminderChannelType[] = ['push', 'email', 'sms', 'in_app'];
    const statuses: NotificationStatus[] = ['read', 'read', 'read', 'delivered', 'delivered', 'sent', 'pending'];
    const priorities: NotificationPriority[] = ['low', 'medium', 'high', 'emergency'];

    const notifications: NotificationItem[] = [];

    const now = Date.now();
    const HOUR = 3600000;
    const DAY = 86400000;

    for (let i = 0; i < count; i++) {
        const category = categories[i % categories.length];
        const priority =
            category === 'rule_triggered'
                ? priorities[Math.floor(Math.random() * 2) + 2] // high or emergency
                : category === 'appointment'
                    ? priorities[Math.floor(Math.random() * 2) + 1] // medium or high
                    : priorities[Math.floor(Math.random() * 3)]; // low, medium, high

        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const channel = channels[Math.floor(Math.random() * channels.length)];

        const titleIdx = i % MOCK_TITLES[category].length;
        const bodyIdx = i % MOCK_BODIES[category].length;

        // Distribute timestamps: recent → older
        const hoursAgo = Math.floor(i * 3.5 + Math.random() * 4);
        const createdAt = new Date(now - hoursAgo * HOUR);

        let readAt: Date | undefined;
        let sentAt: Date | undefined;

        if (status === 'read') {
            readAt = new Date(createdAt.getTime() + 2 * HOUR);
            sentAt = new Date(createdAt.getTime() + HOUR);
        } else if (status === 'delivered' || status === 'sent') {
            sentAt = new Date(createdAt.getTime() + HOUR);
        }

        const scheduledFor = new Date(createdAt.getTime() - HOUR);

        notifications.push({
            id: `notif-${mockNotificationId++}`,
            category,
            title: MOCK_TITLES[category][titleIdx],
            body: MOCK_BODIES[category][bodyIdx],
            status,
            priority,
            channel,
            scheduledFor,
            sentAt,
            readAt,
            createdAt,
            actionUrl:
                category === 'appointment'
                    ? '/appointments'
                    : category === 'medication'
                        ? '/wellness'
                        : category === 'weekly_update'
                            ? '/weekly-journey'
                            : category === 'partner_activity'
                                ? '/shared'
                                : category === 'rule_triggered'
                                    ? '/mother'
                                    : undefined,
            actionLabel:
                category === 'appointment'
                    ? 'View Appointments'
                    : category === 'medication'
                        ? 'Go to Wellness'
                        : category === 'weekly_update'
                            ? 'Read Update'
                            : category === 'partner_activity'
                                ? 'Open Shared Space'
                                : category === 'rule_triggered'
                                    ? 'Take Action'
                                    : undefined,
            sourceRuleName:
                category === 'rule_triggered'
                    ? [
                        'mood_decline_detector',
                        'high_risk_symptom_detector',
                        'third_trimester_checklist',
                        'missed_appointment_alert',
                        'wellness_drop_alert',
                    ][i % 5]
                    : undefined,
        });
    }

    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// ─── Personalized Notification Generator ───────────────────────────

/**
 * Generate personalized health tips as notifications based on the
 * mother's medical conditions. These are condition-specific reminders
 * that appear in the notification feed alongside rule-triggered alerts.
 */
export function generatePersonalizedNotifications(
    medicalConditions: MedicalConditionsForNotifications,
    userId?: string,
): NotificationItem[] {
    const notifications: NotificationItem[] = [];
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10); // "2026-06-19"

    let id = 9000;

    const add = (title: string, body: string, priority: NotificationPriority = 'medium', suffix?: string) => {
        const idSuffix = suffix ? `-${suffix}` : `-${id++}`;
        notifications.push({
            id: `personalized-${todayStr}${idSuffix}`,
            userId,
            category: 'rule_triggered',
            title,
            body,
            status: 'pending',
            priority,
            channel: 'in_app',
            scheduledFor: now,
            createdAt: now,
            actionUrl: '/wellness',
            actionLabel: 'View Wellness Tips',
            payload: { personalized: true, date: todayStr },
        });
    };

    if (medicalConditions.anemia) {
        add(
            '🩸 Anemia Care: Boost your iron intake today',
            'Include iron-rich foods like spinach, lentils, jaggery, and lean red meat. Take your iron supplement with vitamin C for better absorption. Avoid tea/coffee within 1 hour of iron-rich meals.',
            'high',
        );
    }

    if (medicalConditions.diabetes) {
        add(
            '🍬 Diabetes Management: Monitor your blood sugar',
            'Choose complex carbohydrates over simple sugars. Eat small, frequent meals to maintain stable glucose levels. Check your blood sugar as recommended by your doctor.',
            'high',
        );
    }

    if (medicalConditions.highBP) {
        add(
            '💓 Blood Pressure Care: Keep sodium in check',
            'Reduce sodium intake — avoid processed and salty foods. Include potassium-rich foods like bananas and sweet potatoes. Monitor your blood pressure daily.',
            'high',
        );
    }

    if (medicalConditions.lowBP) {
        add(
            '💓 Low BP: Stay hydrated and nourished',
            'Stay well-hydrated to help maintain blood pressure. Eat small, frequent meals to prevent dizziness. Rise slowly from sitting or lying positions.',
            'medium',
        );
    }

    if (medicalConditions.thyroidDisorder) {
        add(
            '🦋 Thyroid Care: Don\'t skip your medication',
            'Take your thyroid medication as prescribed — consistency is key. Avoid excessive soy products near medication time. Get your levels checked as recommended.',
            'high',
        );
    }

    if (medicalConditions.pcos) {
        add(
            '🔄 PCOS Wellness: Focus on anti-inflammatory foods',
            'Include turmeric, berries, and leafy greens in your diet. Maintain balanced blood sugar with complex carbs and protein. Stay active with gentle exercise.',
            'medium',
        );
    }

    if (medicalConditions.asthma) {
        add(
            '🫁 Asthma Safety: Keep your inhaler handy',
            'Avoid exercise in cold or dusty environments. Keep your asthma medication accessible at all times. Watch for wheezing, chest tightness, or difficulty breathing.',
            'high',
        );
    }

    if (medicalConditions.heartDisease) {
        add(
            '❤️ Heart Health: Pace yourself today',
            'Only exercise as approved by your cardiologist. Coordinate care between your cardiologist and obstetrician. Watch for chest pain, palpitations, or unusual shortness of breath.',
            'high',
        );
    }

    if (medicalConditions.kidneyIssues) {
        add(
            '🫘 Kidney Care: Monitor your fluid intake',
            'Follow your doctor\'s specific fluid intake guidelines. Monitor your protein intake as advised. Attend all scheduled kidney function tests.',
            'high',
        );
    }

    if (medicalConditions.epilepsy) {
        add(
            '🧠 Epilepsy Safety: Stay on track with medication',
            'Continue anti-epileptic medication as prescribed — do not stop. Report any seizure activity immediately to your doctor. Ensure someone is aware of your condition.',
            'high',
        );
    }

    if (medicalConditions.depressionAnxiety) {
        add(
            '💚 Mental Wellness: You\'re not alone',
            'Be kind to yourself today. Consider speaking with a counselor or your doctor about your feelings. Even a short 10-minute walk can help lift your mood. Reach out to your support network.',
            'high',
        );
    }

    // ─── Daily Diet & Nutrition Tips (1-2 per day) ───
    // Rotate through a pool of tips based on the day of the month
    const dietTipPool = [
        {
            title: '🥗 Nutrition Tip: Eat the rainbow',
            body: 'Include colorful fruits and vegetables in your meals today. Each color provides different essential vitamins and antioxidants for you and your baby.',
        },
        {
            title: '💧 Nutrition Tip: Stay hydrated',
            body: 'Aim for 8-10 glasses of water today. Proper hydration helps prevent constipation, reduces swelling, and supports amniotic fluid levels.',
        },
        {
            title: '🥛 Nutrition Tip: Calcium-rich foods',
            body: 'Include dairy, fortified plant milk, leafy greens, or sesame seeds today. Your baby needs calcium for developing strong bones and teeth.',
        },
        {
            title: '🥩 Nutrition Tip: Iron-rich meals',
            body: 'Add spinach, lentils, lean meat, or beans to your plate today. Iron helps prevent anemia and supports your baby\'s oxygen supply.',
        },
        {
            title: '🐟 Nutrition Tip: Omega-3 for brain development',
            body: 'Include walnuts, flaxseeds, chia seeds, or low-mercury fish today. Omega-3s support your baby\'s brain and eye development.',
        },
        {
            title: '🍳 Nutrition Tip: Protein power',
            body: 'Make sure you get enough protein today — eggs, paneer, dal, chicken, or tofu. Protein is essential for your baby\'s tissue growth.',
        },
        {
            title: '🥑 Nutrition Tip: Healthy fats',
            body: 'Include avocados, nuts, olive oil, or ghee in moderation today. Healthy fats support hormone production and baby\'s development.',
        },
        {
            title: '🍊 Nutrition Tip: Vitamin C boost',
            body: 'Add citrus fruits, bell peppers, amla, or tomatoes to your meals today. Vitamin C helps iron absorption and strengthens immunity.',
        },
        {
            title: '🌾 Nutrition Tip: Fiber for digestion',
            body: 'Include whole grains, oats, fruits with skin, and vegetables today. Fiber helps prevent constipation which is common during pregnancy.',
        },
        {
            title: '🍌 Nutrition Tip: Potassium for cramps',
            body: 'Add bananas, sweet potatoes, coconut water, or spinach today. Potassium helps reduce muscle cramps and maintain fluid balance.',
        },
        {
            title: '🥜 Nutrition Tip: Folate-rich foods',
            body: 'Include dark leafy greens, chickpeas, peanuts, or fortified cereals today. Folate is crucial for preventing neural tube defects.',
        },
        {
            title: '🫘 Nutrition Tip: Zinc for immunity',
            body: 'Add pumpkin seeds, chickpeas, cashews, or whole grains today. Zinc supports your immune system and cell growth.',
        },
        {
            title: '🥚 Nutrition Tip: Vitamin D matters',
            body: 'Get some morning sunlight and include eggs, mushrooms, or fortified milk today. Vitamin D helps calcium absorption.',
        },
        {
            title: '🍵 Nutrition Tip: Herbal teas',
            body: 'Consider ginger tea (for nausea) or chamomile tea (for relaxation). Avoid excessive caffeine — stick to 200mg per day max.',
        },
        {
            title: '🍽️ Nutrition Tip: Small frequent meals',
            body: 'Try eating 5-6 smaller meals instead of 3 large ones today. This helps with digestion, heartburn, and maintaining steady energy.',
        },
    ];

    const dayOfMonth = now.getDate();
    // Select 2 tips based on day of month (rotating pool)
    const tipIndex1 = dayOfMonth % dietTipPool.length;
    const tipIndex2 = (dayOfMonth + 7) % dietTipPool.length;

    const selectedTips = tipIndex1 === tipIndex2
        ? [dietTipPool[tipIndex1]]
        : [dietTipPool[tipIndex1], dietTipPool[tipIndex2]];

    for (const tip of selectedTips) {
        add(tip.title, tip.body, 'medium', `diet-${dietTipPool.indexOf(tip)}`);
    }

    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// ─── Rule Output → Notification Mapper ─────────────────────────────

export function mapRuleOutputToNotification(
    output: RuleOutput,
    userId?: string
): Partial<NotificationItem> {
    return {
        userId,
        category: 'rule_triggered',
        title: output.description.substring(0, 80),
        body: output.description,
        status: 'pending',
        priority: output.priority as NotificationPriority,
        channel: 'in_app',
        scheduledFor: new Date(),
        sourceRuleName: output.action,
        payload: { ruleType: output.type, rawDescription: output.description },
    };
}

export function batchMapRuleOutputs(
    outputs: RuleOutput[],
    userId?: string
): Partial<NotificationItem>[] {
    return outputs
        .filter(o => o.type === 'notification')
        .map(o => mapRuleOutputToNotification(o, userId));
}

// ─── Notification Grouping Helpers ─────────────────────────────────

export type TimeGroup = 'today' | 'yesterday' | 'this_week' | 'earlier';

export function getTimeGroup(date: Date): TimeGroup {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
    const startOfWeek = new Date(startOfToday.getTime() - startOfToday.getDay() * 86400000);

    const d = new Date(date);
    if (d >= startOfToday) return 'today';
    if (d >= startOfYesterday) return 'yesterday';
    if (d >= startOfWeek) return 'this_week';
    return 'earlier';
}

export const TIME_GROUP_LABELS: Record<TimeGroup, string> = {
    today: 'Today',
    yesterday: 'Yesterday',
    this_week: 'This Week',
    earlier: 'Earlier',
};

export function groupNotificationsByTime(
    notifications: NotificationItem[]
): Map<TimeGroup, NotificationItem[]> {
    const groups = new Map<TimeGroup, NotificationItem[]>();
    groups.set('today', []);
    groups.set('yesterday', []);
    groups.set('this_week', []);
    groups.set('earlier', []);

    for (const n of notifications) {
        const group = getTimeGroup(n.createdAt);
        groups.get(group)!.push(n);
    }

    // Remove empty groups
    for (const [key, val] of groups) {
        if (val.length === 0) groups.delete(key);
    }

    return groups;
}

// ─── Notification Statistics ───────────────────────────────────────

export interface NotificationStats {
    total: number;
    unread: number;
    byCategory: Record<NotificationCategory, { total: number; unread: number }>;
    byPriority: Record<NotificationPriority, number>;
}

export function computeNotificationStats(
    notifications: NotificationItem[]
): NotificationStats {
    const stats: NotificationStats = {
        total: notifications.length,
        unread: 0,
        byCategory: {
            appointment: { total: 0, unread: 0 },
            medication: { total: 0, unread: 0 },
            weekly_update: { total: 0, unread: 0 },
            partner_activity: { total: 0, unread: 0 },
            system: { total: 0, unread: 0 },
            rule_triggered: { total: 0, unread: 0 },
        },
        byPriority: { low: 0, medium: 0, high: 0, emergency: 0 },
    };

    for (const n of notifications) {
        const isUnread = n.status !== 'read' && n.status !== 'dismissed';
        if (isUnread) stats.unread++;

        stats.byCategory[n.category].total++;
        if (isUnread) stats.byCategory[n.category].unread++;

        stats.byPriority[n.priority]++;
    }

    return stats;
}

// ─── Channel Delivery Simulation ───────────────────────────────────

export function getChannelsForNotification(
    notification: NotificationItem,
    userPreferences?: {
        pushNotifications: boolean;
        emailNotifications: boolean;
        smsNotifications: boolean;
        quietHours: boolean;
        quietStart: string;
        quietEnd: string;
    }
): ReminderChannelType[] {
    const channels: ReminderChannelType[] = ['in_app']; // Always in-app

    if (!userPreferences) return channels;

    // Check quiet hours
    if (userPreferences.quietHours) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const [startH, startM] = userPreferences.quietStart.split(':').map(Number);
        const [endH, endM] = userPreferences.quietEnd.split(':').map(Number);
        const quietStartMins = startH * 60 + startM;
        const quietEndMins = endH * 60 + endM;

        const inQuietHours =
            quietEndMins > quietStartMins
                ? currentMinutes >= quietStartMins && currentMinutes < quietEndMins
                : currentMinutes >= quietStartMins || currentMinutes < quietEndMins;

        if (inQuietHours && notification.priority !== 'emergency') {
            return channels; // Only in-app during quiet hours, unless emergency
        }
    }

    if (userPreferences.pushNotifications) channels.push('push');
    if (userPreferences.emailNotifications) channels.push('email');
    if (userPreferences.smsNotifications) channels.push('sms');

    // Emergency always goes to all enabled channels
    if (notification.priority === 'emergency') {
        if (!channels.includes('push')) channels.push('push');
        if (!channels.includes('email')) channels.push('email');
    }

    return channels;
}

// ─── Notification Scheduling ───────────────────────────────────────

export interface ScheduledReminder {
    notification: Partial<NotificationItem>;
    deliverAt: Date;
    repeatInterval?: number; // milliseconds
    maxDeliveries?: number;
}

export function scheduleAppointmentReminders(
    appointmentDate: Date,
    appointmentTitle: string,
    appointmentId: string,
    userId?: string
): ScheduledReminder[] {
    const reminders: ScheduledReminder[] = [];
    const appointmentTime = appointmentDate.getTime();

    // 48 hours before
    reminders.push({
        notification: {
            userId,
            category: 'appointment',
            title: `Upcoming: ${appointmentTitle} in 2 days`,
            body: `Your appointment "${appointmentTitle}" is in 2 days. Review any preparations needed and confirm your attendance.`,
            priority: 'medium',
            status: 'pending',
            channel: 'in_app',
            actionUrl: `/appointments`,
            actionLabel: 'View Details',
        },
        deliverAt: new Date(appointmentTime - 48 * 3600000),
    });

    // 24 hours before
    reminders.push({
        notification: {
            userId,
            category: 'appointment',
            title: `Reminder: ${appointmentTitle} tomorrow`,
            body: `Your appointment "${appointmentTitle}" is tomorrow. Get a good night's rest and prepare any questions for your provider.`,
            priority: 'high',
            status: 'pending',
            channel: 'in_app',
            actionUrl: `/appointments`,
            actionLabel: 'View Details',
        },
        deliverAt: new Date(appointmentTime - 24 * 3600000),
    });

    // 1 hour before
    reminders.push({
        notification: {
            userId,
            category: 'appointment',
            title: `Appointment in 1 hour: ${appointmentTitle}`,
            body: `Time to leave for your appointment! Don't forget your reports, insurance card, and questions list.`,
            priority: 'high',
            status: 'pending',
            channel: 'in_app',
            actionUrl: `/appointments`,
            actionLabel: 'View Details',
        },
        deliverAt: new Date(appointmentTime - 3600000),
    });

    return reminders;
}

export function scheduleWeeklyUpdateReminder(
    weekNumber: number,
    userId?: string
): ScheduledReminder {
    // Wednesday at 9 AM
    const now = new Date();
    const nextWednesday = new Date(now);
    nextWednesday.setDate(now.getDate() + ((3 + 7 - now.getDay()) % 7));
    nextWednesday.setHours(9, 0, 0, 0);

    return {
        notification: {
            userId,
            category: 'weekly_update',
            title: `Week ${weekNumber} update is ready!`,
            body: `Your personalized guidance for week ${weekNumber} of pregnancy is now available. Learn about your baby's development and what to expect this week.`,
            priority: 'low',
            status: 'pending',
            channel: 'in_app',
            actionUrl: `/weekly-journey`,
            actionLabel: 'Read Now',
        },
        deliverAt: nextWednesday,
        repeatInterval: 7 * 86400000, // weekly
    };
}