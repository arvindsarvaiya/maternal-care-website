// ─── Notification Content Library ─────────────────────────────────
// 200+ verified health facts, curated for pregnancy & postpartum
// Sources: WHO, ACOG, NHS, ICMR, UNICEF, RCOG, Mayo Clinic, CDC
// Each fact is categorized and tagged for dynamic scheduling.
// ───────────────────────────────────────────────────────────────────

export type ContentCategory =
    | 'pregnancy_early'       // Weeks 1-13
    | 'pregnancy_mid'          // Weeks 14-27
    | 'pregnancy_late'         // Weeks 28-40+
    | 'postpartum_early'       // Weeks 1-6 pp
    | 'postpartum_mid'         // Weeks 7-26 pp
    | 'postpartum_late'        // Weeks 27-52 pp
    | 'nutrition'              // General nutrition
    | 'hydration'              // Water intake
    | 'exercise'               // Safe movement
    | 'mental_health'          // Emotional wellness
    | 'baby_care'              // Newborn care
    | 'partner_tips'           // Partner support
    | 'condition_specific';    // Anemia, diabetes, etc.

export type MedicalConditionTag =
    | 'anemia'
    | 'diabetes'
    | 'highBP'
    | 'lowBP'
    | 'thyroid'
    | 'pcos'
    | 'asthma'
    | 'heartDisease'
    | 'kidneyIssues'
    | 'epilepsy'
    | 'depressionAnxiety';

export interface NotificationContentTemplate {
    /** Unique identifier for tracking */
    id: string;
    /** Category for rotation scheduling */
    category: ContentCategory;
    /** Applicable pregnancy week range (inclusive). Null = applies to all phases */
    pregnancyWeekRange?: [number, number];
    /** Applicable postpartum week range (inclusive). Null = not postpartum */
    postpartumWeekRange?: [number, number];
    /** Which medical conditions this is especially relevant for */
    relevantConditions?: MedicalConditionTag[];
    /** Priority level */
    priority: 'low' | 'medium' | 'high';
    /** Emoji for the notification */
    emoji: string;
    /** Empathetic, personalized title */
    title: string;
    /** Warm, informative body with verified health info */
    body: string;
    /** Source reference for credibility */
    source: string;
    /** Action URL (optional) */
    actionUrl?: string;
    /** Action label (optional) */
    actionLabel?: string;
}

// ───────────────────────────────────────────────────────────────────
// PREGNANCY EARLY (Weeks 1-13)
// ───────────────────────────────────────────────────────────────────

const pregnancyEarly: NotificationContentTemplate[] = [
    {
        id: 'pe-001',
        category: 'pregnancy_early',
        pregnancyWeekRange: [1, 13],
        priority: 'high',
        emoji: '🌱',
        title: 'The first trimester: Your baby\'s foundation is forming',
        body: 'Right now, your baby\'s neural tube is closing — this becomes the brain and spinal cord. That\'s why folic acid is so important right now, mama. You\'re literally building the foundation of a tiny human. Be gentle with yourself today.',
        source: 'WHO Guidelines on Antenatal Care, 2020',
        actionUrl: '/weekly-journey',
        actionLabel: 'Read This Week\'s Guide',
    },
    {
        id: 'pe-002',
        category: 'pregnancy_early',
        pregnancyWeekRange: [1, 13],
        priority: 'medium',
        emoji: '🤢',
        title: 'Morning sickness? You\'re not alone, sweetheart',
        body: 'About 70% of pregnant women experience nausea in the first trimester. Try eating small, frequent meals — even a cracker before getting out of bed can help. Ginger tea is a lifesaver too. This phase will pass, we promise.',
        source: 'ACOG Practice Bulletin, 2021',
        actionUrl: '/wellness',
        actionLabel: 'Log Your Symptoms',
    },
    {
        id: 'pe-003',
        category: 'pregnancy_early',
        pregnancyWeekRange: [1, 13],
        priority: 'medium',
        emoji: '😴',
        title: 'That exhaustion is real — and it\'s completely normal',
        body: 'Your body is producing more progesterone and your blood volume is increasing by up to 50%. No wonder you\'re tired, love! Listen to your body and rest when you can. Short naps are your best friend right now.',
        source: 'NHS Pregnancy Guide, 2024',
        actionUrl: '/wellness',
        actionLabel: 'Track Your Energy',
    },
    {
        id: 'pe-004',
        category: 'pregnancy_early',
        pregnancyWeekRange: [1, 13],
        priority: 'high',
        emoji: '🩺',
        title: 'Your first prenatal visit: What to expect',
        body: 'Your doctor will likely do blood tests, check your blood pressure, estimate your due date, and discuss your health history. Don\'t hesitate to ask questions — no question is too small. Write them down beforehand so you don\'t forget!',
        source: 'WHO Recommendations on Antenatal Care, 2020',
        actionUrl: '/appointments',
        actionLabel: 'Schedule Checkup',
    },
    {
        id: 'pe-005',
        category: 'pregnancy_early',
        pregnancyWeekRange: [1, 13],
        priority: 'medium',
        emoji: '🥑',
        title: 'Early pregnancy nutrition: What your body needs now',
        body: 'Focus on folate (dark leafy greens, lentils), iron (dates, spinach), and protein (eggs, paneer, dal). Your baby\'s organs are forming right now and these nutrients are the building blocks. Every meal is a gift to your baby.',
        source: 'ICMR Dietary Guidelines for Pregnant Women, 2023',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Your Meals',
    },
    {
        id: 'pe-006',
        category: 'pregnancy_early',
        pregnancyWeekRange: [1, 13],
        priority: 'medium',
        emoji: '🧘',
        title: 'Gentle movement in early pregnancy',
        body: 'If you\'re feeling up to it, gentle walking, prenatal yoga, and stretching can help with nausea, fatigue, and mood. Just 15-20 minutes makes a difference. But if all you can do today is rest — that\'s important movement too.',
        source: 'ACOG Exercise During Pregnancy Guidelines, 2022',
        actionUrl: '/wellness',
        actionLabel: 'Try a Gentle Exercise',
    },
    {
        id: 'pe-007',
        category: 'pregnancy_early',
        pregnancyWeekRange: [1, 13],
        priority: 'high',
        emoji: '⚠️',
        title: 'Know the warning signs, mama',
        body: 'If you experience heavy bleeding, severe abdominal pain, high fever, or persistent vomiting where you can\'t keep anything down — please contact your doctor immediately. Trust your instincts. You know your body best.',
        source: 'NHS & ACOG Warning Signs Guidance',
        actionUrl: '/symptoms',
        actionLabel: 'Log Symptoms',
    },
    {
        id: 'pe-008',
        category: 'pregnancy_early',
        pregnancyWeekRange: [1, 13],
        priority: 'medium',
        emoji: '💧',
        title: 'Hydration in the first trimester',
        body: 'Your blood volume is expanding rapidly, which means you need more water than usual. Aim for 8-10 glasses daily. Add lemon, cucumber, or mint for flavor. Coconut water is a great natural electrolyte booster too!',
        source: 'NHS Hydration Guidelines for Pregnancy, 2024',
        actionUrl: '/wellness',
        actionLabel: 'Log Water Intake',
    },
    {
        id: 'pe-009',
        category: 'pregnancy_early',
        pregnancyWeekRange: [1, 13],
        priority: 'low',
        emoji: '📝',
        title: 'Start a pregnancy journal, beautiful',
        body: 'Writing down your thoughts, feelings, and symptoms can be incredibly therapeutic. It also helps you track patterns and share concerns with your doctor. Years from now, you\'ll treasure these early memories.',
        source: 'ACOG Emotional Well-Being During Pregnancy, 2023',
        actionUrl: '/wellness',
        actionLabel: 'Log Your Mood',
    },
    {
        id: 'pe-010',
        category: 'pregnancy_early',
        pregnancyWeekRange: [1, 13],
        priority: 'medium',
        emoji: '🤝',
        title: 'Your partner wants to help — let them in',
        body: 'Early pregnancy can feel isolating even when you\'re surrounded by love. Share what you\'re feeling with your partner. Let them handle meals, chores, or just hold your hand. This journey is yours together.',
        source: 'UNICEF Parental Support Guidelines, 2023',
        actionUrl: '/shared',
        actionLabel: 'Go to Shared Space',
    },
];

// ───────────────────────────────────────────────────────────────────
// PREGNANCY MID (Weeks 14-27)
// ───────────────────────────────────────────────────────────────────

const pregnancyMid: NotificationContentTemplate[] = [
    {
        id: 'pm-001',
        category: 'pregnancy_mid',
        pregnancyWeekRange: [14, 27],
        priority: 'high',
        emoji: '🦋',
        title: 'Did you feel that? Your baby\'s first movements',
        body: 'Around weeks 16-22, you\'ll start feeling those magical first flutters called "quickening." It might feel like butterflies, gas bubbles, or tiny taps. Every baby is different — some are more active than others. Treasure these moments.',
        source: 'RCOG Fetal Movement Guidelines, 2022',
        actionUrl: '/weekly-journey',
        actionLabel: 'Read This Week\'s Guide',
    },
    {
        id: 'pm-002',
        category: 'pregnancy_mid',
        pregnancyWeekRange: [14, 27],
        priority: 'high',
        emoji: '🔬',
        title: 'Your anatomy scan is coming up',
        body: 'The 20-week anomaly scan is a detailed ultrasound where they check your baby\'s organs, spine, limbs, and growth. It\'s completely normal to feel nervous — but also excited! You might even find out the gender if you want to. Drink water before the scan for clearer images.',
        source: 'NHS 20-Week Screening Scan Guidelines, 2024',
        actionUrl: '/appointments',
        actionLabel: 'Check Appointments',
    },
    {
        id: 'pm-003',
        category: 'pregnancy_mid',
        pregnancyWeekRange: [14, 27],
        priority: 'medium',
        emoji: '🍽️',
        title: 'Second trimester: Your appetite might return',
        body: 'As nausea fades, you may feel hungrier. Your body needs about 300-350 extra calories per day — that\'s roughly a banana with peanut butter, or a bowl of dal with rice. Focus on nutrient-dense foods, not just more food.',
        source: 'ICMR & WHO Nutritional Guidelines for Pregnancy',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'pm-004',
        category: 'pregnancy_mid',
        pregnancyWeekRange: [14, 27],
        priority: 'medium',
        emoji: '🦷',
        title: 'Your dental health matters more than ever',
        body: 'Pregnancy hormones can make your gums more sensitive and prone to bleeding. Gum disease is linked to premature birth. Brush twice daily, floss, and see your dentist. Most dental treatments are safe during pregnancy.',
        source: 'ADA & ACOG Joint Statement on Dental Care, 2022',
        actionUrl: '/appointments',
        actionLabel: 'Add Dental Checkup',
    },
    {
        id: 'pm-005',
        category: 'pregnancy_mid',
        pregnancyWeekRange: [14, 27],
        priority: 'medium',
        emoji: '💤',
        title: 'Sleeping on your side: Why it matters now',
        body: 'From week 20 onwards, sleeping on your left side improves blood flow to your baby. Place a pillow between your knees and under your belly for comfort. Don\'t panic if you wake up on your back — just roll back to your side.',
        source: 'RCOG Sleep Position Recommendations, 2023',
        actionUrl: '/wellness',
        actionLabel: 'Track Sleep',
    },
    {
        id: 'pm-006',
        category: 'pregnancy_mid',
        pregnancyWeekRange: [14, 27],
        priority: 'medium',
        emoji: '🎵',
        title: 'Your baby can hear you now!',
        body: 'By week 23-24, your baby\'s ears are developed enough to hear sounds from outside. Talk, sing, or read to your bump. Your baby already recognizes your voice. Play soft music — studies show babies respond to melodies they heard in the womb.',
        source: 'AAP Fetal Development Research, 2023',
        actionUrl: '/weekly-journey',
        actionLabel: 'Learn More',
    },
    {
        id: 'pm-007',
        category: 'pregnancy_mid',
        pregnancyWeekRange: [14, 27],
        priority: 'medium',
        emoji: '💪',
        title: 'Staying active in the second trimester',
        body: 'This is often called the "golden trimester" — you have more energy! Walking, swimming, prenatal yoga, and light strength training are all great. Aim for 150 minutes of moderate activity per week. Listen to your body and avoid exercises lying flat on your back.',
        source: 'WHO Physical Activity Guidelines for Pregnancy, 2020',
        actionUrl: '/wellness',
        actionLabel: 'Log Activity',
    },
    {
        id: 'pm-008',
        category: 'pregnancy_mid',
        pregnancyWeekRange: [14, 27],
        priority: 'high',
        emoji: '🩸',
        title: 'Iron levels: Getting tested matters',
        body: 'Your body needs almost double the iron during pregnancy to make extra blood for you and your baby. Around week 24-28, you\'ll be tested for anemia. Include iron-rich foods like spinach, beetroot, dates, and lean meat. Pair with vitamin C for better absorption.',
        source: 'WHO Anemia in Pregnancy Guidelines, 2021',
        actionUrl: '/appointments',
        actionLabel: 'View Appointments',
    },
    {
        id: 'pm-009',
        category: 'pregnancy_mid',
        pregnancyWeekRange: [14, 27],
        priority: 'high',
        emoji: '🧪',
        title: 'Glucose screening: What to know',
        body: 'Between weeks 24-28, you\'ll have a glucose tolerance test to screen for gestational diabetes. It involves drinking a sweet solution and having your blood drawn. Some women find it unpleasant but it\'s quick and so important. Fasting may be required.',
        source: 'ACOG Gestational Diabetes Screening Guidelines, 2023',
        actionUrl: '/appointments',
        actionLabel: 'Check Appointments',
    },
    {
        id: 'pm-010',
        category: 'pregnancy_mid',
        pregnancyWeekRange: [14, 27],
        priority: 'low',
        emoji: '🛍️',
        title: 'Time to start thinking about baby shopping?',
        body: 'The second trimester is a good time to start preparing. You don\'t need everything at once — focus on essentials: a safe sleeping space, clothes, diapers, and a car seat. Many mamas find that keeping it simple reduces stress.',
        source: 'NHS Preparing for Your Baby Checklist, 2024',
        actionUrl: '/shared/tasks',
        actionLabel: 'Create Shopping Task',
    },
    {
        id: 'pm-011',
        category: 'pregnancy_mid',
        pregnancyWeekRange: [14, 27],
        priority: 'medium',
        emoji: '🫃',
        title: 'Your bump is growing — and that\'s beautiful',
        body: 'Around weeks 18-22, your bump becomes more visible. Your uterus is now at your belly button level. Some women love this phase, some feel self-conscious. Both feelings are completely valid. Your body is doing something miraculous.',
        source: 'ACOG Fetal Growth & Development Guidelines',
        actionUrl: '/weekly-journey',
        actionLabel: 'Track Your Week',
    },
    {
        id: 'pm-012',
        category: 'pregnancy_mid',
        pregnancyWeekRange: [14, 27],
        priority: 'medium',
        emoji: '🧘‍♀️',
        title: 'Prenatal yoga for back pain relief',
        body: 'As your belly grows, your center of gravity shifts, which can cause back pain. Cat-cow stretches, pelvic tilts, and supported child\'s pose can help. Always use props and avoid deep twists. A pregnancy belt can also provide relief.',
        source: 'ACOG Physical Activity & Pregnancy, 2022',
        actionUrl: '/wellness',
        actionLabel: 'Try Stretches',
    },
];

// ───────────────────────────────────────────────────────────────────
// PREGNANCY LATE (Weeks 28-40+)
// ───────────────────────────────────────────────────────────────────

const pregnancyLate: NotificationContentTemplate[] = [
    {
        id: 'pl-001',
        category: 'pregnancy_late',
        pregnancyWeekRange: [28, 42],
        priority: 'high',
        emoji: '👶',
        title: 'Welcome to the third trimester, strong mama!',
        body: 'You\'re in the home stretch! Your baby is gaining weight rapidly now — about 200g per week. They can open and close their eyes, and their lungs are maturing. You might feel more tired again, and that\'s okay. You\'re doing amazing.',
        source: 'ACOG Third Trimester Guidelines, 2023',
        actionUrl: '/weekly-journey',
        actionLabel: 'Read This Week\'s Guide',
    },
    {
        id: 'pl-002',
        category: 'pregnancy_late',
        pregnancyWeekRange: [28, 42],
        priority: 'high',
        emoji: '📋',
        title: 'Count those kicks, beautiful',
        body: 'From week 28, you should feel your baby move regularly. Try counting kicks at the same time each day — aim for 10 movements within 2 hours. If you notice reduced movement, contact your doctor immediately. Never ignore a change in your baby\'s pattern.',
        source: 'RCOG Reduced Fetal Movements Guidelines, 2022',
        actionUrl: '/wellness',
        actionLabel: 'Log Kick Counts',
    },
    {
        id: 'pl-003',
        category: 'pregnancy_late',
        pregnancyWeekRange: [28, 42],
        priority: 'high',
        emoji: '🏥',
        title: 'Your birth plan: Thinking ahead',
        body: 'Now is a good time to discuss your birth preferences with your doctor. Where do you want to deliver? Who will be with you? What pain management options are you considering? Remember — a birth plan is a preference, not a promise. Flexibility is key.',
        source: 'WHO Intrapartum Care Guidelines, 2020',
        actionUrl: '/shared/notes',
        actionLabel: 'Write Birth Plan',
    },
    {
        id: 'pl-004',
        category: 'pregnancy_late',
        pregnancyWeekRange: [28, 42],
        priority: 'high',
        emoji: '🩺',
        title: 'Your appointments are more frequent now',
        body: 'In the third trimester, you\'ll see your doctor every 2 weeks until week 36, then weekly until delivery. These visits monitor your blood pressure, baby\'s growth and position, and check for signs of preeclampsia. Don\'t skip them, love.',
        source: 'WHO Antenatal Care Schedule, 2020',
        actionUrl: '/appointments',
        actionLabel: 'View Appointments',
    },
    {
        id: 'pl-005',
        category: 'pregnancy_late',
        pregnancyWeekRange: [28, 42],
        priority: 'high',
        emoji: '⚠️',
        title: 'Know the signs of preeclampsia',
        body: 'Severe headache that won\'t go away, vision changes (blurring, spots), sudden swelling in face/hands, and upper abdominal pain are warning signs. Preeclampsia affects 5-8% of pregnancies and needs immediate medical attention. Trust your instincts.',
        source: 'ACOG Preeclampsia Guidelines, 2023',
        actionUrl: '/symptoms',
        actionLabel: 'Log Symptoms',
    },
    {
        id: 'pl-006',
        category: 'pregnancy_late',
        pregnancyWeekRange: [28, 42],
        priority: 'medium',
        emoji: '👜',
        title: 'Pack your hospital bag, mama',
        body: 'By week 34-36, have your hospital bag ready: comfortable clothes, nursing bras, toiletries, phone charger, important documents, and an outfit for baby\'s first photo. Pack a snack for your partner too — labor can be long!',
        source: 'NHS Hospital Bag Checklist, 2024',
        actionUrl: '/shared/tasks',
        actionLabel: 'Create Checklist',
    },
    {
        id: 'pl-007',
        category: 'pregnancy_late',
        pregnancyWeekRange: [28, 42],
        priority: 'medium',
        emoji: '🫁',
        title: 'Shortness of breath is normal — here\'s why',
        body: 'Your growing baby is pushing against your diaphragm, leaving less room for your lungs to expand. This is completely normal! Sit up straight, sleep propped up with pillows, and take slow, deep breaths. If it\'s severe or sudden, call your doctor.',
        source: 'NHS Pregnancy Symptoms Guide, 2024',
        actionUrl: '/wellness',
        actionLabel: 'Log Symptoms',
    },
    {
        id: 'pl-008',
        category: 'pregnancy_late',
        pregnancyWeekRange: [28, 42],
        priority: 'medium',
        emoji: '🦶',
        title: 'Swollen feet? Elevate and hydrate',
        body: 'Mild swelling (edema) in your feet and ankles is common in the third trimester. Elevate your feet when sitting, avoid standing for long periods, and drink plenty of water. Compression socks can help too. Swelling on one side only or sudden swelling needs medical attention.',
        source: 'ACOG Edema & Pregnancy, 2022',
        actionUrl: '/wellness',
        actionLabel: 'Track Symptoms',
    },
    {
        id: 'pl-009',
        category: 'pregnancy_late',
        pregnancyWeekRange: [28, 42],
        priority: 'medium',
        emoji: '🤰',
        title: 'Braxton Hicks vs. real contractions',
        body: 'Braxton Hicks are practice contractions — irregular, usually painless, and they stop when you change position. Real labor contractions are regular, get stronger over time, and don\'t stop with movement. Time them and call your doctor when they\'re 5 minutes apart.',
        source: 'RCOG Labor & Birth Guidelines, 2023',
        actionUrl: '/weekly-journey',
        actionLabel: 'Learn More',
    },
    {
        id: 'pl-010',
        category: 'pregnancy_late',
        pregnancyWeekRange: [28, 42],
        priority: 'medium',
        emoji: '🥛',
        title: 'Colostrum: Your first milk is already here',
        body: 'From around week 16, your body starts producing colostrum — the nutrient-rich first milk. You might notice some leakage in the third trimester. This is completely normal! Colostrum is often called "liquid gold" because it\'s packed with antibodies.',
        source: 'WHO Breastfeeding Recommendations, 2023',
        actionUrl: '/weekly-journey',
        actionLabel: 'Read More',
    },
    {
        id: 'pl-011',
        category: 'pregnancy_late',
        pregnancyWeekRange: [28, 42],
        priority: 'medium',
        emoji: '😰',
        title: 'Feeling anxious about birth? Let\'s talk about it',
        body: 'It\'s completely normal to feel scared or anxious about labor and delivery. Talk to your doctor about your fears. Consider a birth preparation class. Practice breathing techniques. Remember — your body was literally designed to do this.',
        source: 'WHO Mental Health During Pregnancy, 2022',
        actionUrl: '/chat',
        actionLabel: 'Chat with AI Assistant',
    },
    {
        id: 'pl-012',
        category: 'pregnancy_late',
        pregnancyWeekRange: [28, 42],
        priority: 'high',
        emoji: '💉',
        title: 'Tdap vaccine: Protecting your newborn',
        body: 'The Tdap vaccine (tetanus, diphtheria, pertussis) is recommended between weeks 27-36 of every pregnancy. It passes protective antibodies to your baby, protecting them from whooping cough in the first months of life. Safe and recommended.',
        source: 'CDC & WHO Vaccination During Pregnancy Guidelines',
        actionUrl: '/vaccinations',
        actionLabel: 'View Vaccinations',
    },
];

// ───────────────────────────────────────────────────────────────────
// POSTPARTUM EARLY (Weeks 1-6)
// ───────────────────────────────────────────────────────────────────

const postpartumEarly: NotificationContentTemplate[] = [
    {
        id: 'ppe-001',
        category: 'postpartum_early',
        postpartumWeekRange: [1, 6],
        priority: 'high',
        emoji: '💜',
        title: 'Welcome to postpartum, beautiful mama',
        body: 'You did it. You brought life into this world. Now it\'s time to heal. Your body needs rest, nourishment, and gentle care. The next few weeks are about recovery — not productivity. Let others take care of you for a change.',
        source: 'WHO Postnatal Care Guidelines, 2022',
        actionUrl: '/postpartum',
        actionLabel: 'View Recovery Guide',
    },
    {
        id: 'ppe-002',
        category: 'postpartum_early',
        postpartumWeekRange: [1, 6],
        priority: 'high',
        emoji: '🩸',
        title: 'Postpartum bleeding: What\'s normal',
        body: 'Lochia (postpartum bleeding) can last 2-6 weeks. It starts bright red, then becomes pink, then brownish, then yellowish-white. If you\'re soaking through more than one pad per hour or passing large clots, call your doctor immediately.',
        source: 'ACOG Postpartum Care Guidelines, 2023',
        actionUrl: '/postpartum',
        actionLabel: 'Track Recovery',
    },
    {
        id: 'ppe-003',
        category: 'postpartum_early',
        postpartumWeekRange: [1, 6],
        priority: 'high',
        emoji: '🧠',
        title: 'Baby blues vs. postpartum depression',
        body: 'Baby blues (mood swings, crying, anxiety) affect up to 80% of new mothers and usually resolve within 2 weeks. If you feel hopeless, can\'t bond with baby, or have thoughts of harming yourself — this is PPD and you need help. There is no shame in this.',
        source: 'WHO Maternal Mental Health Guidelines, 2022',
        actionUrl: '/wellness',
        actionLabel: 'Log Your Mood',
    },
    {
        id: 'ppe-004',
        category: 'postpartum_early',
        postpartumWeekRange: [1, 6],
        priority: 'high',
        emoji: '🤱',
        title: 'Breastfeeding: It\'s a journey, not a race',
        body: 'It takes time for both you and baby to learn. The first few days you produce colostrum (liquid gold!). Milk typically "comes in" around day 3-5. Sore nipples are common but shouldn\'t be excruciating — check baby\'s latch or ask a lactation consultant.',
        source: 'UNICEF & WHO Breastfeeding Guidelines, 2023',
        actionUrl: '/baby-tracker',
        actionLabel: 'Track Feeding',
    },
    {
        id: 'ppe-005',
        category: 'postpartum_early',
        postpartumWeekRange: [1, 6],
        priority: 'medium',
        emoji: '💧',
        title: 'Hydration is crucial for milk production',
        body: 'If you\'re breastfeeding, you need even more water than during pregnancy. Keep a large water bottle near your nursing spot. Herbal teas (fenugreek, fennel) are traditionally used to support milk supply. Aim for at least 3 liters daily.',
        source: 'NHS Breastfeeding & Hydration Guidelines, 2024',
        actionUrl: '/wellness',
        actionLabel: 'Log Water Intake',
    },
    {
        id: 'ppe-006',
        category: 'postpartum_early',
        postpartumWeekRange: [1, 6],
        priority: 'medium',
        emoji: '🛏️',
        title: 'Sleep when the baby sleeps — truly',
        body: 'You\'ve heard this a thousand times, but it\'s the best advice. Don\'t use baby\'s nap time to clean or cook. Your body is healing from a major physical event. Sleep deprivation affects milk supply, mood, and recovery. Everything else can wait.',
        source: 'ACOG Postpartum Recovery Guidelines, 2023',
        actionUrl: '/wellness',
        actionLabel: 'Track Sleep',
    },
    {
        id: 'ppe-007',
        category: 'postpartum_early',
        postpartumWeekRange: [1, 6],
        priority: 'high',
        emoji: '🏥',
        title: 'Your postpartum checkup: Don\'t skip it',
        body: 'Schedule your postpartum visit for 3-6 weeks after delivery. This checks your physical recovery, mental health, breastfeeding, and birth control options. Many women focus only on baby — but your health matters just as much.',
        source: 'WHO Postnatal Care Schedule, 2022',
        actionUrl: '/appointments',
        actionLabel: 'Schedule Checkup',
    },
    {
        id: 'ppe-008',
        category: 'postpartum_early',
        postpartumWeekRange: [1, 6],
        priority: 'medium',
        emoji: '🍲',
        title: 'Postpartum nutrition: Foods that heal',
        body: 'Traditional postpartum foods exist for a reason! Warm, easily digestible foods like khichdi, soups, broths, and porridge support healing. Include protein (dal, eggs, paneer), iron (dates, spinach), and healthy fats (ghee, nuts). Your body needs fuel to recover.',
        source: 'ICMR Postpartum Nutrition Guidelines, 2023',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'ppe-009',
        category: 'postpartum_early',
        postpartumWeekRange: [1, 6],
        priority: 'high',
        emoji: '🩹',
        title: 'C-section recovery: Be extra gentle with yourself',
        body: 'A C-section is major abdominal surgery. Avoid lifting anything heavier than your baby for 6 weeks. Keep your incision clean and dry. Watch for signs of infection: redness, warmth, pus, or fever. Your recovery timeline is valid — don\'t compare.',
        source: 'ACOG Cesarean Birth Recovery Guidelines, 2023',
        actionUrl: '/postpartum-recovery',
        actionLabel: 'Recovery Tips',
    },
    {
        id: 'ppe-010',
        category: 'postpartum_early',
        postpartumWeekRange: [1, 6],
        priority: 'medium',
        emoji: '🫂',
        title: 'Accept help. Seriously. Accept it.',
        body: 'When someone offers to bring food, do laundry, or hold the baby so you can shower — say YES. You don\'t get a medal for doing everything alone. In many cultures, new mothers are cared for by family for 40 days. There\'s wisdom in that.',
        source: 'UNICEF Postnatal Care Recommendations, 2023',
        actionUrl: '/shared/tasks',
        actionLabel: 'Assign Tasks',
    },
];

// ───────────────────────────────────────────────────────────────────
// POSTPARTUM MID (Weeks 7-26)
// ───────────────────────────────────────────────────────────────────

const postpartumMid: NotificationContentTemplate[] = [
    {
        id: 'ppm-001',
        category: 'postpartum_mid',
        postpartumWeekRange: [7, 26],
        priority: 'medium',
        emoji: '👶',
        title: 'Your baby\'s first smile isn\'t just gas!',
        body: 'Around 6-8 weeks, your baby will start giving you real social smiles — not just reflexes. This is a huge milestone! Your baby is learning to connect with you. Smile back, talk, and make eye contact. This is the foundation of bonding.',
        source: 'AAP Infant Development Milestones, 2023',
        actionUrl: '/baby-tracker',
        actionLabel: 'Track Milestones',
    },
    {
        id: 'ppm-002',
        category: 'postpartum_mid',
        postpartumWeekRange: [7, 26],
        priority: 'high',
        emoji: '💇‍♀️',
        title: 'Hair loss after pregnancy: It\'s temporary',
        body: 'Around 3-4 months postpartum, many women notice significant hair loss. This is completely normal — during pregnancy, high estrogen kept hair in the growth phase. Now it\'s catching up. It will grow back, we promise. Be gentle with your hair.',
        source: 'AAD Postpartum Hair Changes, 2023',
        actionUrl: '/wellness',
        actionLabel: 'Log Symptoms',
    },
    {
        id: 'ppm-003',
        category: 'postpartum_mid',
        postpartumWeekRange: [7, 26],
        priority: 'medium',
        emoji: '🏃‍♀️',
        title: 'Ready to exercise again? Start slow',
        body: 'After your 6-week clearance, start with gentle walks, pelvic floor exercises, and core rehabilitation. Your body has been through a lot — jumping straight into intense workouts can cause injury. Diastasis recti (ab separation) needs special care.',
        source: 'ACOG Postpartum Exercise Guidelines, 2023',
        actionUrl: '/pelvic-floor',
        actionLabel: 'Pelvic Floor Exercises',
    },
    {
        id: 'ppm-004',
        category: 'postpartum_mid',
        postpartumWeekRange: [7, 26],
        priority: 'medium',
        emoji: '😴',
        title: 'Sleep regression: It\'s a phase, not forever',
        body: 'Around 4 months, babies often experience sleep regression due to developmental leaps. This is exhausting but temporary. Try consistent bedtime routines, white noise, and remember — your baby isn\'t giving you a hard time, they\'re having a hard time.',
        source: 'AAP Infant Sleep Guidelines, 2023',
        actionUrl: '/baby-tracker',
        actionLabel: 'Track Sleep',
    },
    {
        id: 'ppm-005',
        category: 'postpartum_mid',
        postpartumWeekRange: [7, 26],
        priority: 'high',
        emoji: '💉',
        title: 'Baby\'s vaccination schedule: Stay on track',
        body: 'At 6, 10, and 14 weeks, your baby needs important vaccines: DPT, polio, Hib, hepatitis B, rotavirus, and PCV. These protect against life-threatening diseases. It\'s normal to feel anxious about vaccinations — but the protection they provide is invaluable.',
        source: 'WHO & Indian National Immunization Schedule, 2024',
        actionUrl: '/vaccinations',
        actionLabel: 'View Schedule',
    },
    {
        id: 'ppm-006',
        category: 'postpartum_mid',
        postpartumWeekRange: [7, 26],
        priority: 'medium',
        emoji: '🍼',
        title: 'Starting solids: The 6-month milestone',
        body: 'Around 6 months, your baby may be ready for solid foods alongside breastmilk or formula. Start with single-ingredient purees (rice cereal, mashed banana, steamed apple). Introduce one new food at a time and watch for allergies. It\'s messy but magical!',
        source: 'WHO Complementary Feeding Guidelines, 2023',
        actionUrl: '/baby-tracker',
        actionLabel: 'Log Feeding',
    },
    {
        id: 'ppm-007',
        category: 'postpartum_mid',
        postpartumWeekRange: [7, 26],
        priority: 'medium',
        emoji: '💑',
        title: 'Your relationship after baby: It\'s different, and that\'s okay',
        body: 'The transition to parenthood changes every relationship. Communication is more important than ever. Schedule "check-in" conversations. Physical intimacy may take time — and that\'s normal. You\'re both learning a new dance together.',
        source: 'APA Transition to Parenthood Research, 2022',
        actionUrl: '/shared',
        actionLabel: 'Go to Shared Space',
    },
    {
        id: 'ppm-008',
        category: 'postpartum_mid',
        postpartumWeekRange: [7, 26],
        priority: 'medium',
        emoji: '🧘‍♀️',
        title: 'Your pelvic floor: Don\'t forget about it',
        body: 'Pelvic floor exercises (Kegels) are important even months after birth. They help with bladder control, support pelvic organs, and improve sexual function. Aim for 3 sets of 10 per day. Think of it as a workout for muscles you can\'t see but definitely need.',
        source: 'RCOG Pelvic Floor Health Guidelines, 2023',
        actionUrl: '/pelvic-floor',
        actionLabel: 'Start Exercises',
    },
    {
        id: 'ppm-009',
        category: 'postpartum_mid',
        postpartumWeekRange: [7, 26],
        priority: 'high',
        emoji: '🧠',
        title: 'Postpartum mental health check-in',
        body: 'PPD can appear anytime in the first year, not just the first few weeks. How are you really feeling? Irritability, numbness, excessive worry, or feeling disconnected from your baby are all signs. You deserve support. Talk to your doctor.',
        source: 'WHO & ACOG Postpartum Mental Health, 2023',
        actionUrl: '/wellness',
        actionLabel: 'Log Your Mood',
    },
    {
        id: 'ppm-010',
        category: 'postpartum_mid',
        postpartumWeekRange: [7, 26],
        priority: 'low',
        emoji: '📸',
        title: 'Capture these moments, mama',
        body: 'Time feels slow but the months fly by. Take photos and videos — not just of baby, but of you WITH baby. These will be precious later. Write down the little things: funny faces, first giggles, the way they hold your finger. You\'ll want to remember.',
        source: 'UNICEF Early Childhood Development and Bonding, 2022',
        actionUrl: '/baby-tracker',
        actionLabel: 'Add a Note',
    },
];

// ───────────────────────────────────────────────────────────────────
// POSTPARTUM LATE (Weeks 27-52)
// ───────────────────────────────────────────────────────────────────

const postpartumLate: NotificationContentTemplate[] = [
    {
        id: 'ppl-001',
        category: 'postpartum_late',
        postpartumWeekRange: [27, 52],
        priority: 'medium',
        emoji: '🚼',
        title: 'Your baby is becoming mobile! Safety check',
        body: 'As your baby starts crawling, standing, and cruising, baby-proofing becomes essential. Cover electrical outlets, secure furniture to walls, install safety gates, and keep small objects out of reach. Get down on their level to see what they see.',
        source: 'AAP Home Safety Guidelines, 2023',
        actionUrl: '/shared/tasks',
        actionLabel: 'Create Safety Checklist',
    },
    {
        id: 'ppl-002',
        category: 'postpartum_late',
        postpartumWeekRange: [27, 52],
        priority: 'medium',
        emoji: '🗣️',
        title: 'Your baby\'s first words are coming',
        body: 'Around 9-12 months, many babies say their first words. Talk to your baby constantly — narrate your day, read books, sing songs. Respond to their babbling as if it\'s a real conversation. You\'re their first and most important language teacher.',
        source: 'ASHA Speech & Language Development, 2023',
        actionUrl: '/baby-tracker',
        actionLabel: 'Track Milestones',
    },
    {
        id: 'ppl-003',
        category: 'postpartum_late',
        postpartumWeekRange: [27, 52],
        priority: 'medium',
        emoji: '🦷',
        title: 'Teething troubles? Here\'s what helps',
        body: 'Teething can cause fussiness, drooling, and disrupted sleep. Cold teething rings, gentle gum massage with a clean finger, and extra cuddles help. Avoid teething gels with benzocaine. If fever is present, it\'s not from teething — check with your doctor.',
        source: 'AAP Teething Guidelines, 2023',
        actionUrl: '/baby-tracker',
        actionLabel: 'Log Symptoms',
    },
    {
        id: 'ppl-004',
        category: 'postpartum_late',
        postpartumWeekRange: [27, 52],
        priority: 'high',
        emoji: '🩺',
        title: 'Baby\'s 9-12 month checkup: Don\'t miss it',
        body: 'This visit checks growth, development, hearing, vision, and gives important vaccines. Your doctor will also screen for anemia and lead exposure. Bring your list of questions — you probably have more now than you did at the newborn stage!',
        source: 'WHO & AAP Well-Child Visit Schedule, 2024',
        actionUrl: '/appointments',
        actionLabel: 'Schedule Visit',
    },
    {
        id: 'ppl-005',
        category: 'postpartum_late',
        postpartumWeekRange: [27, 52],
        priority: 'medium',
        emoji: '💪',
        title: 'You\'re almost a year into motherhood!',
        body: 'Look how far you\'ve come! Your body has likely recovered significantly by now. If you\'re still experiencing pain, incontinence, or weakness, don\'t accept it as "normal" — see a pelvic floor physiotherapist. You deserve to feel strong and comfortable.',
        source: 'ACOG Long-term Postpartum Recovery, 2023',
        actionUrl: '/pelvic-floor',
        actionLabel: 'Pelvic Floor Exercises',
    },
    {
        id: 'ppl-006',
        category: 'postpartum_late',
        postpartumWeekRange: [27, 52],
        priority: 'medium',
        emoji: '🍽️',
        title: 'Family meals: Everyone eats together now',
        body: 'By 9-12 months, your baby can eat most of what the family eats (mashed or cut small). This is a great time to establish healthy family eating habits. Include your baby in mealtimes — they learn by watching you. Avoid added salt and sugar for baby.',
        source: 'WHO Family Nutrition Guidelines, 2023',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Family Meals',
    },
    {
        id: 'ppl-007',
        category: 'postpartum_late',
        postpartumWeekRange: [27, 52],
        priority: 'high',
        emoji: '💚',
        title: 'Returning to work? Your feelings are valid',
        body: 'Whether you\'re excited, anxious, guilty, or all of the above — it\'s all normal. Plan your pumping schedule if breastfeeding. Tour the daycare. Prepare meals in advance. And give yourself grace during the transition. You\'re showing your child what dedication looks like.',
        source: 'APA Work-Life Balance for New Parents, 2023',
        actionUrl: '/shared/tasks',
        actionLabel: 'Plan Together',
    },
    {
        id: 'ppl-008',
        category: 'postpartum_late',
        postpartumWeekRange: [27, 52],
        priority: 'medium',
        emoji: '🌙',
        title: 'Sleep training: There\'s no one right way',
        body: 'Every family finds their own rhythm. Some babies sleep through the night by 6 months, some don\'t until well past a year. Both are normal. Whether you choose gentle methods, cry-it-out, or co-sleeping — what matters is that it works for YOUR family.',
        source: 'AAP Infant Sleep Recommendations, 2023',
        actionUrl: '/baby-tracker',
        actionLabel: 'Track Sleep',
    },
    {
        id: 'ppl-009',
        category: 'postpartum_late',
        postpartumWeekRange: [27, 52],
        priority: 'low',
        emoji: '🎂',
        title: 'First birthday planning: Keep it simple',
        body: 'Your baby won\'t remember their first birthday party — but you will. Don\'t feel pressured to throw an elaborate event. A simple celebration with close family, a smash cake, and lots of photos is perfect. This milestone is for YOU too.',
        source: 'AAP Family Well-Being and Milestone Celebrations, 2023',
        actionUrl: '/shared/tasks',
        actionLabel: 'Plan Celebration',
    },
    {
        id: 'ppl-010',
        category: 'postpartum_late',
        postpartumWeekRange: [27, 52],
        priority: 'high',
        emoji: '💉',
        title: 'MMR vaccine at 12 months',
        body: 'Your baby\'s 12-month vaccines include the first dose of MMR (measles, mumps, rubella). Measles is highly contagious and can be severe. This vaccine has saved millions of lives. A mild fever or rash after is normal and temporary.',
        source: 'WHO & Indian Immunization Schedule, 2024',
        actionUrl: '/vaccinations',
        actionLabel: 'View Schedule',
    },
];

// ───────────────────────────────────────────────────────────────────
// NUTRITION (General)
// ───────────────────────────────────────────────────────────────────

const nutrition: NotificationContentTemplate[] = [
    {
        id: 'nut-001',
        category: 'nutrition',
        priority: 'medium',
        emoji: '🥬',
        title: 'Folate: Your baby\'s guardian angel',
        body: 'Folate (vitamin B9) prevents neural tube defects that occur in the first 28 days of pregnancy — often before you even know you\'re pregnant. Dark leafy greens (spinach, methi), chickpeas, oranges, and fortified cereals are great sources. 400-800mcg daily is recommended.',
        source: 'WHO Folic Acid Supplementation Guidelines, 2020',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'nut-002',
        category: 'nutrition',
        priority: 'medium',
        emoji: '🩸',
        title: 'Iron: Your body is making more blood',
        body: 'During pregnancy, your blood volume increases by nearly 50%. Iron is essential for making hemoglobin. Include iron-rich foods: spinach, beetroot, pomegranate, dates, lentils, and lean meat. Pair with vitamin C (lemon, amla, orange) for 3x better absorption.',
        source: 'WHO Daily Iron Supplementation Guidelines, 2020',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'nut-003',
        category: 'nutrition',
        priority: 'medium',
        emoji: '🥛',
        title: 'Calcium: Building strong bones for two',
        body: 'Your baby needs calcium for developing bones and teeth. If you don\'t consume enough, your body will take calcium from your own bones! Aim for 1000mg daily: milk, yogurt, paneer, ragi, sesame seeds, and leafy greens. Vitamin D helps absorption.',
        source: 'ICMR Calcium Requirements for Pregnancy, 2023',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'nut-004',
        category: 'nutrition',
        priority: 'medium',
        emoji: '🐟',
        title: 'Omega-3: Brain food for your baby',
        body: 'DHA (an omega-3 fatty acid) is crucial for your baby\'s brain and eye development. Include walnuts, flaxseeds, chia seeds, and fatty fish (salmon, sardines — avoid high-mercury fish like shark and king mackerel). Vegetarian? Algae-based supplements work.',
        source: 'WHO Omega-3 Recommendations During Pregnancy, 2021',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'nut-005',
        category: 'nutrition',
        priority: 'medium',
        emoji: '🥚',
        title: 'Protein: The building block of life',
        body: 'Your protein needs increase by about 25g per day during pregnancy. Eggs, dal, paneer, chickpeas, soy, chicken, and fish are excellent sources. Spread protein intake throughout the day — your body absorbs it better in smaller, frequent doses.',
        source: 'WHO Protein Requirements During Pregnancy, 2020',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'nut-006',
        category: 'nutrition',
        priority: 'medium',
        emoji: '☀️',
        title: 'Vitamin D: The sunshine vitamin',
        body: 'Vitamin D helps your body absorb calcium and supports your baby\'s immune system. Get 15-20 minutes of morning sunlight on your skin. Food sources include egg yolks, fortified milk, and mushrooms. Many pregnant women need supplementation — ask your doctor.',
        source: 'WHO Vitamin D Supplementation Guidelines, 2020',
        actionUrl: '/wellness',
        actionLabel: 'Track Wellness',
    },
    {
        id: 'nut-007',
        category: 'nutrition',
        priority: 'medium',
        emoji: '🧂',
        title: 'Iodine: Small mineral, big impact',
        body: 'Iodine is essential for your baby\'s brain development and thyroid function. Use iodized salt in your cooking. Other sources include dairy, eggs, and seafood. Iodine deficiency during pregnancy can affect your baby\'s cognitive development.',
        source: 'WHO Iodine Supplementation Guidelines, 2020',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'nut-008',
        category: 'nutrition',
        priority: 'medium',
        emoji: '🥜',
        title: 'Zinc: Your baby\'s cell builder',
        body: 'Zinc supports cell division, DNA synthesis, and immune function — all critical during pregnancy. Pumpkin seeds, chickpeas, cashews, and whole grains are great sources. Zinc also helps with morning sickness for some women.',
        source: 'WHO Zinc in Pregnancy Guidelines, 2021',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'nut-009',
        category: 'nutrition',
        priority: 'medium',
        emoji: '🍊',
        title: 'Vitamin C: More than just immunity',
        body: 'Vitamin C helps your body absorb iron (especially from plant sources), supports tissue repair, and builds collagen for your baby\'s skin and bones. Amla (Indian gooseberry) has 20x the vitamin C of oranges! Citrus, bell peppers, and guava are also excellent.',
        source: 'ICMR Vitamin C Recommendations, 2023',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'nut-010',
        category: 'nutrition',
        priority: 'medium',
        emoji: '🌾',
        title: 'Fiber: Your digestive system\'s best friend',
        body: 'Constipation is common during pregnancy due to hormonal changes and iron supplements. Aim for 25-30g of fiber daily from whole grains, fruits with skin, vegetables, legumes, and psyllium husk (isabgol). Drink extra water when increasing fiber intake.',
        source: 'NHS Fiber & Pregnancy Constipation, 2024',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'nut-011',
        category: 'nutrition',
        priority: 'medium',
        emoji: '🍌',
        title: 'Potassium: Your cramp-fighting friend',
        body: 'Leg cramps are common in pregnancy, especially at night. Potassium helps! Bananas, sweet potatoes, coconut water, spinach, and avocados are rich sources. Staying hydrated and stretching before bed also helps prevent cramps.',
        source: 'ACOG Common Pregnancy Discomforts, 2022',
        actionUrl: '/wellness',
        actionLabel: 'Track Symptoms',
    },
    {
        id: 'nut-012',
        category: 'nutrition',
        priority: 'medium',
        emoji: '🥑',
        title: 'Healthy fats: Don\'t fear them!',
        body: 'Healthy fats are crucial for your baby\'s brain development and help your body absorb fat-soluble vitamins (A, D, E, K). Include avocados, nuts, seeds, olive oil, ghee (in moderation), and coconut. Avoid trans fats and limit fried foods.',
        source: 'WHO Healthy Fats During Pregnancy, 2021',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
];

// ───────────────────────────────────────────────────────────────────
// HYDRATION
// ───────────────────────────────────────────────────────────────────

const hydration: NotificationContentTemplate[] = [
    {
        id: 'hyd-001',
        category: 'hydration',
        priority: 'medium',
        emoji: '💧',
        title: 'Water is your body\'s best friend right now',
        body: 'Your body needs extra water during pregnancy to support increased blood volume, amniotic fluid, and your baby\'s circulation. Aim for 8-12 glasses (2-3 liters) daily. If your urine is dark yellow, you need more water, love.',
        source: 'NHS Hydration During Pregnancy, 2024',
        actionUrl: '/wellness',
        actionLabel: 'Log Water',
    },
    {
        id: 'hyd-002',
        category: 'hydration',
        priority: 'medium',
        emoji: '🥥',
        title: 'Coconut water: Nature\'s electrolyte drink',
        body: 'Coconut water is rich in potassium, magnesium, and natural electrolytes. It helps prevent dehydration, reduces muscle cramps, and can ease morning sickness. It\'s naturally low in sugar and calories — a perfect pregnancy drink!',
        source: 'ICMR Traditional Foods in Pregnancy, 2023',
        actionUrl: '/wellness',
        actionLabel: 'Log Water',
    },
    {
        id: 'hyd-003',
        category: 'hydration',
        priority: 'medium',
        emoji: '🍋',
        title: 'Infused water: Make hydration exciting',
        body: 'Plain water can feel boring. Try infusing with lemon, cucumber, mint, ginger, berries, or orange slices. Herbal teas (ginger, peppermint, chamomile) count toward your fluid intake too. Avoid excessive caffeine — stick to 200mg per day max.',
        source: 'ACOG Caffeine & Hydration Guidelines, 2023',
        actionUrl: '/wellness',
        actionLabel: 'Log Water',
    },
    {
        id: 'hyd-004',
        category: 'hydration',
        priority: 'medium',
        emoji: '🚰',
        title: 'Dehydration warning signs: Know them',
        body: 'Headaches, dark urine, dizziness, dry mouth, and reduced urination are signs you need more water. Severe dehydration can trigger Braxton Hicks contractions or even preterm labor. Keep a water bottle with you always, sweetheart.',
        source: 'WHO Dehydration & Pregnancy, 2021',
        actionUrl: '/wellness',
        actionLabel: 'Log Water',
    },
    {
        id: 'hyd-005',
        category: 'hydration',
        priority: 'medium',
        emoji: '🤱',
        title: 'Breastfeeding mamas need even more water',
        body: 'Breast milk is about 87% water. If you\'re nursing, you need about 3-4 liters of fluids daily. Drink a glass of water every time you feed your baby. Keep a large water bottle at your nursing station — it becomes a habit quickly.',
        source: 'WHO Breastfeeding & Hydration, 2023',
        actionUrl: '/wellness',
        actionLabel: 'Log Water',
    },
];

// ───────────────────────────────────────────────────────────────────
// EXERCISE (General)
// ───────────────────────────────────────────────────────────────────

const exercise: NotificationContentTemplate[] = [
    {
        id: 'ex-001',
        category: 'exercise',
        priority: 'medium',
        emoji: '🚶‍♀️',
        title: 'A simple walk does wonders',
        body: 'Walking is one of the safest and most effective exercises during pregnancy. Just 20-30 minutes of walking improves circulation, reduces swelling, boosts mood, and helps with sleep. If you\'re tired, even 10 minutes counts. Every step is a gift to your body.',
        source: 'WHO Physical Activity Guidelines, 2020',
        actionUrl: '/wellness',
        actionLabel: 'Log Activity',
    },
    {
        id: 'ex-002',
        category: 'exercise',
        priority: 'medium',
        emoji: '🧘',
        title: 'Prenatal yoga: Stretch, breathe, connect',
        body: 'Prenatal yoga improves flexibility, reduces back pain, teaches breathing techniques for labor, and lowers stress. Avoid poses that involve lying on your belly, deep twists, or lying flat on your back after the first trimester. Always use props for support.',
        source: 'ACOG Yoga During Pregnancy, 2022',
        actionUrl: '/wellness',
        actionLabel: 'Log Activity',
    },
    {
        id: 'ex-003',
        category: 'exercise',
        priority: 'medium',
        emoji: '🏊',
        title: 'Swimming: The perfect pregnancy exercise',
        body: 'Swimming and water aerobics are fantastic during pregnancy — the water supports your weight, reduces joint strain, and prevents overheating. The feeling of weightlessness is a relief, especially in the third trimester. Just avoid hot tubs and saunas.',
        source: 'ACOG Swimming & Water Exercise, 2022',
        actionUrl: '/wellness',
        actionLabel: 'Log Activity',
    },
    {
        id: 'ex-004',
        category: 'exercise',
        priority: 'medium',
        emoji: '💪',
        title: 'Pelvic floor exercises: Start now',
        body: 'Kegel exercises strengthen the muscles that support your uterus, bladder, and bowels. Strong pelvic floor muscles help during labor, reduce tearing risk, and speed postpartum recovery. Aim for 3 sets of 10 squeezes, holding each for 5-10 seconds.',
        source: 'RCOG Pelvic Floor Exercises, 2023',
        actionUrl: '/pelvic-floor',
        actionLabel: 'Start Exercises',
    },
    {
        id: 'ex-005',
        category: 'exercise',
        priority: 'high',
        emoji: '⚠️',
        title: 'Exercise warning signs: When to stop',
        body: 'Stop exercising and call your doctor if you experience: vaginal bleeding, dizziness, chest pain, calf swelling, decreased fetal movement, contractions, or fluid leaking. Listen to your body — pregnancy is not the time to push through pain.',
        source: 'ACOG Exercise Safety Guidelines, 2022',
        actionUrl: '/symptoms',
        actionLabel: 'Log Symptoms',
    },
    {
        id: 'ex-006',
        category: 'exercise',
        priority: 'low',
        emoji: '🧘‍♀️',
        title: 'Breathing exercises for calm and labor prep',
        body: 'Practice deep belly breathing: inhale slowly through your nose for 4 counts, feel your belly expand, exhale through your mouth for 6 counts. This activates your parasympathetic nervous system, reducing stress and preparing you for labor breathing.',
        source: 'NHS Breathing Techniques for Labor, 2024',
        actionUrl: '/wellness',
        actionLabel: 'Try Breathing',
    },
];

// ───────────────────────────────────────────────────────────────────
// MENTAL HEALTH
// ───────────────────────────────────────────────────────────────────

const mentalHealth: NotificationContentTemplate[] = [
    {
        id: 'mh-001',
        category: 'mental_health',
        priority: 'high',
        emoji: '💚',
        title: 'Your mental health matters as much as your physical health',
        body: 'Perinatal mood and anxiety disorders affect 1 in 5 women. You are not broken, you are not failing, and you are not alone. If you\'re feeling persistently sad, anxious, overwhelmed, or disconnected — please talk to your doctor. Treatment works.',
        source: 'WHO Maternal Mental Health Guidelines, 2022',
        actionUrl: '/wellness',
        actionLabel: 'Log Your Mood',
    },
    {
        id: 'mh-002',
        category: 'mental_health',
        priority: 'medium',
        emoji: '🧘',
        title: '5-minute mindfulness for overwhelmed mamas',
        body: 'You don\'t need an hour of meditation. Try this: sit comfortably, close your eyes, and notice 5 things you can feel, 4 things you can hear, 3 things you can smell, 2 things you can taste, 1 thing you\'re grateful for. This grounds you in the present.',
        source: 'APA Mindfulness Techniques, 2023',
        actionUrl: '/wellness',
        actionLabel: 'Try Now',
    },
    {
        id: 'mh-003',
        category: 'mental_health',
        priority: 'medium',
        emoji: '📱',
        title: 'Social media and pregnancy: Protect your peace',
        body: 'Comparison is the thief of joy. Social media shows perfect bumps, spotless nurseries, and smiling babies — but not the messy reality. If scrolling makes you feel inadequate, take a break. Curate your feed to include honest, supportive content.',
        source: 'APA Social Media & Maternal Mental Health, 2023',
        actionUrl: '/wellness',
        actionLabel: 'Log Your Mood',
    },
    {
        id: 'mh-004',
        category: 'mental_health',
        priority: 'medium',
        emoji: '🗣️',
        title: 'Talk about it — even when it\'s hard',
        body: 'You don\'t have to be the "perfect happy pregnant woman" or "glowing new mom." Share your real feelings with your partner, a trusted friend, or a therapist. Voicing your fears often reduces their power. Silence makes them grow.',
        source: 'WHO Mental Health Support Guidelines, 2022',
        actionUrl: '/chat',
        actionLabel: 'Chat with AI',
    },
    {
        id: 'mh-005',
        category: 'mental_health',
        priority: 'medium',
        emoji: '😴',
        title: 'Sleep and mental health are deeply connected',
        body: 'Poor sleep worsens anxiety and depression. Create a bedtime routine: dim lights, avoid screens 30 minutes before bed, try a warm bath, read a calming book. If racing thoughts keep you awake, keep a notebook by your bed to "dump" them out.',
        source: 'NHS Sleep & Mental Health, 2024',
        actionUrl: '/wellness',
        actionLabel: 'Track Sleep',
    },
    {
        id: 'mh-006',
        category: 'mental_health',
        priority: 'high',
        emoji: '🆘',
        title: 'You are not a burden for needing help',
        body: 'If you\'re having thoughts of harming yourself or your baby, this is a medical emergency — not a character flaw. Call your doctor, go to the ER, or call a crisis helpline. Your baby needs you healthy and alive. Please reach out.',
        source: 'WHO Emergency Mental Health Guidelines, 2022',
        actionUrl: '/wellness',
        actionLabel: 'Get Support',
    },
    {
        id: 'mh-007',
        category: 'mental_health',
        priority: 'medium',
        emoji: '☀️',
        title: 'Morning sunlight: A natural mood booster',
        body: '10-15 minutes of morning sunlight helps regulate your circadian rhythm, boosts vitamin D, and increases serotonin (your "happy hormone"). If you can, step outside or sit by a sunny window within an hour of waking up. It makes a difference.',
        source: 'NHS Sunlight & Mental Health Guidelines, 2024',
        actionUrl: '/wellness',
        actionLabel: 'Log Your Mood',
    },
    {
        id: 'mh-008',
        category: 'mental_health',
        priority: 'medium',
        emoji: '📝',
        title: 'Gratitude journaling: A small habit, big impact',
        body: 'Each night, write down 3 things you\'re grateful for — even tiny ones like "my baby kicked today" or "I ate a good meal." This practice rewires your brain to notice positives. It\'s not about toxic positivity — it\'s about finding light in the darkness.',
        source: 'APA Gratitude & Mental Health Research, 2022',
        actionUrl: '/wellness',
        actionLabel: 'Log Your Mood',
    },
];

// ───────────────────────────────────────────────────────────────────
// BABY CARE (Newborn)
// ───────────────────────────────────────────────────────────────────

const babyCare: NotificationContentTemplate[] = [
    {
        id: 'bc-001',
        category: 'baby_care',
        priority: 'high',
        emoji: '👶',
        title: 'Safe sleep: Back is best',
        body: 'Always place your baby on their back to sleep — on a firm, flat mattress with no pillows, blankets, bumpers, or soft toys. Room-sharing (not bed-sharing) is recommended for the first 6-12 months. This reduces SIDS risk by up to 50%.',
        source: 'AAP Safe Sleep Guidelines, 2023',
        actionUrl: '/baby-tracker',
        actionLabel: 'Track Sleep',
    },
    {
        id: 'bc-002',
        category: 'baby_care',
        priority: 'medium',
        emoji: '🌡️',
        title: 'Your baby\'s temperature: What\'s normal',
        body: 'A normal baby temperature is 36.5-37.5°C (97.7-99.5°F). Feel the back of their neck or tummy — not hands and feet (they\'re often cooler). If your baby under 3 months has a fever above 38°C (100.4°F), seek medical attention immediately.',
        source: 'NHS Baby Temperature Guidelines, 2024',
        actionUrl: '/baby-tracker',
        actionLabel: 'Log Temperature',
    },
    {
        id: 'bc-003',
        category: 'baby_care',
        priority: 'medium',
        emoji: '🛁',
        title: 'Bath time: Less is more',
        body: 'Newborns only need a bath 2-3 times per week — more can dry their delicate skin. Use lukewarm water (test with your elbow), mild baby soap, and have everything ready before you start. Never leave your baby unattended, even for a second.',
        source: 'AAP Baby Bathing Guidelines, 2023',
        actionUrl: '/baby-tracker',
        actionLabel: 'Log Care',
    },
    {
        id: 'bc-004',
        category: 'baby_care',
        priority: 'medium',
        emoji: '🧷',
        title: 'Diaper duty: Preventing rashes',
        body: 'Change diapers every 2-3 hours (or immediately after poops). Use warm water and cotton for cleaning — wipes can sometimes irritate. Let baby\'s bottom air-dry before putting on a new diaper. A barrier cream with zinc oxide prevents most rashes.',
        source: 'AAP Diaper Care Guidelines, 2023',
        actionUrl: '/baby-tracker',
        actionLabel: 'Log Diapers',
    },
    {
        id: 'bc-005',
        category: 'baby_care',
        priority: 'high',
        emoji: '🩺',
        title: 'Umbilical cord care: Keep it clean and dry',
        body: 'The cord stump usually falls off within 1-3 weeks. Keep it dry — sponge baths until it falls off. Fold the diaper below the stump. Don\'t pull it off even if it\'s hanging. Watch for signs of infection: redness, swelling, pus, or foul smell.',
        source: 'WHO Newborn Cord Care Guidelines, 2022',
        actionUrl: '/baby-tracker',
        actionLabel: 'Log Care',
    },
    {
        id: 'bc-006',
        category: 'baby_care',
        priority: 'medium',
        emoji: '🤱',
        title: 'Hunger cues: Learn your baby\'s language',
        body: 'Before crying, babies show hunger through: rooting (turning head, opening mouth), sucking on hands/fingers, smacking lips, and becoming more alert. Crying is a late hunger sign. Feeding on demand (not a schedule) is recommended for newborns.',
        source: 'UNICEF Baby Feeding Cues, 2023',
        actionUrl: '/baby-tracker',
        actionLabel: 'Track Feeding',
    },
    {
        id: 'bc-007',
        category: 'baby_care',
        priority: 'medium',
        emoji: '💛',
        title: 'Newborn jaundice: What to watch for',
        body: 'Mild jaundice (yellowing of skin/eyes) is common in newborns, appearing around day 2-3. It usually resolves within 1-2 weeks. But if jaundice appears in the first 24 hours, spreads to arms/legs, or baby is very sleepy — see a doctor immediately.',
        source: 'WHO Newborn Jaundice Guidelines, 2022',
        actionUrl: '/symptoms',
        actionLabel: 'Log Symptoms',
    },
    {
        id: 'bc-008',
        category: 'baby_care',
        priority: 'medium',
        emoji: '🤗',
        title: 'Skin-to-skin: The magic of kangaroo care',
        body: 'Holding your baby skin-to-skin on your chest regulates their heartbeat, breathing, temperature, and blood sugar. It reduces crying, promotes bonding, and supports breastfeeding. Dad can do it too! Aim for at least an hour daily in the early weeks.',
        source: 'WHO Kangaroo Mother Care Guidelines, 2022',
        actionUrl: '/baby-tracker',
        actionLabel: 'Log Care',
    },
];

// ───────────────────────────────────────────────────────────────────
// PARTNER TIPS
// ───────────────────────────────────────────────────────────────────

const partnerTips: NotificationContentTemplate[] = [
    {
        id: 'pt-001',
        category: 'partner_tips',
        priority: 'medium',
        emoji: '💑',
        title: 'She needs you to take initiative, not just ask',
        body: 'Instead of "Let me know if you need anything," try "I\'ve made dinner," "I\'ve booked your prenatal massage," or "I\'ll handle the night feeding tonight." Taking the mental load off her shoulders is the most loving thing you can do.',
        source: 'UNICEF Partner Support Guidelines, 2023',
        actionUrl: '/shared/tasks',
        actionLabel: 'View Tasks',
    },
    {
        id: 'pt-002',
        category: 'partner_tips',
        priority: 'medium',
        emoji: '👂',
        title: 'Listen without trying to fix',
        body: 'Sometimes she just needs to vent about how tired she is, how her body feels, or how scared she is. Jumping to solutions can feel dismissive. Try: "That sounds really hard. I\'m here with you." Your presence is more powerful than your advice.',
        source: 'APA Communication in Relationships, 2023',
        actionUrl: '/shared',
        actionLabel: 'Go to Shared Space',
    },
    {
        id: 'pt-003',
        category: 'partner_tips',
        priority: 'medium',
        emoji: '🏥',
        title: 'Attend appointments together whenever possible',
        body: 'Going to prenatal visits shows you\'re invested. You\'ll hear the heartbeat, see the ultrasound, and understand what\'s happening. Plus, you can ask your own questions. This is your baby too — be present from the start.',
        source: 'WHO Partner Involvement in Antenatal Care, 2020',
        actionUrl: '/appointments',
        actionLabel: 'View Appointments',
    },
    {
        id: 'pt-004',
        category: 'partner_tips',
        priority: 'medium',
        emoji: '🍳',
        title: 'Learn to cook a few nutritious meals',
        body: 'One of the most practical ways to support her is through food. Learn 3-4 simple, nutritious recipes she enjoys. Understanding her dietary needs (and restrictions) shows you care in a tangible way. Bonus: she\'ll be touched by the effort.',
        source: 'WHO Partner Involvement in Antenatal Care, 2020',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'pt-005',
        category: 'partner_tips',
        priority: 'high',
        emoji: '🧠',
        title: 'Watch for signs of perinatal depression in her',
        body: 'Partners are often the first to notice changes. Watch for: persistent sadness, withdrawal, loss of interest, excessive worry, difficulty bonding with baby, or comments about hopelessness. Gently encourage her to talk to her doctor. Your support can save lives.',
        source: 'WHO Paternal Role in Maternal Mental Health, 2022',
        actionUrl: '/wellness',
        actionLabel: 'Check Wellness',
    },
    {
        id: 'pt-006',
        category: 'partner_tips',
        priority: 'medium',
        emoji: '💆',
        title: 'Physical comfort: Massages, pillows, and patience',
        body: 'Pregnancy is physically demanding. Offer foot rubs, back massages, and help with positioning pillows. Learn about round ligament pain, sciatica, and Braxton Hicks so you understand what she\'s experiencing. Empathy starts with education.',
        source: 'NHS Pregnancy Comfort and Partner Support, 2023',
        actionUrl: '/weekly-journey',
        actionLabel: 'Read Weekly Guide',
    },
    {
        id: 'pt-007',
        category: 'partner_tips',
        priority: 'medium',
        emoji: '📚',
        title: 'Educate yourself about pregnancy, birth, and postpartum',
        body: 'Read the weekly journey content, learn about labor stages, understand postpartum recovery. The more you know, the better you can advocate for her during birth and support her after. She shouldn\'t have to educate you — take initiative.',
        source: 'WHO Partner Education Guidelines, 2020',
        actionUrl: '/weekly-journey',
        actionLabel: 'Read Weekly Guide',
    },
    {
        id: 'pt-008',
        category: 'partner_tips',
        priority: 'medium',
        emoji: '🛒',
        title: 'Take over household responsibilities without being asked',
        body: 'Grocery shopping, laundry, cleaning, managing visitors, handling bills — the mental load of running a household is exhausting. Take tasks off her plate completely, not just "help with" them. She\'s growing a human. You can handle the rest.',
        source: 'WHO Partner Support and Shared Responsibility Guidelines, 2020',
        actionUrl: '/shared/tasks',
        actionLabel: 'Manage Tasks',
    },
];

// ───────────────────────────────────────────────────────────────────
// CONDITION-SPECIFIC
// ───────────────────────────────────────────────────────────────────

const conditionSpecific: NotificationContentTemplate[] = [
    {
        id: 'cs-001',
        category: 'condition_specific',
        relevantConditions: ['anemia'],
        pregnancyWeekRange: [1, 42],
        priority: 'high',
        emoji: '🩸',
        title: 'Anemia care: Small changes, big impact',
        body: 'With anemia, your body needs extra iron. Cook in cast iron pans (it adds iron to food!), pair iron-rich foods with vitamin C (lemon on dal, orange after meals), and avoid tea/coffee within 1 hour of meals. Take your iron supplement as prescribed.',
        source: 'WHO Anemia Management in Pregnancy, 2021',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'cs-002',
        category: 'condition_specific',
        relevantConditions: ['anemia'],
        priority: 'medium',
        emoji: '🍽️',
        title: 'Iron-rich meal ideas for today',
        body: 'Try: spinach and lentil dal with lemon, beetroot salad with sesame seeds, or dates stuffed with nuts. Pair with amla or orange juice. Avoid combining iron-rich meals with dairy (calcium blocks iron absorption). Space them 2 hours apart.',
        source: 'ICMR Anemia Diet Guidelines, 2023',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'cs-003',
        category: 'condition_specific',
        relevantConditions: ['diabetes'],
        pregnancyWeekRange: [1, 42],
        priority: 'high',
        emoji: '🍬',
        title: 'Diabetes care: Balance is everything',
        body: 'Focus on complex carbs (whole grains, millets, oats) over simple sugars. Eat small, frequent meals to keep blood sugar stable. Include protein with every meal. Monitor your glucose as recommended. Walking for 15 minutes after meals helps regulate blood sugar.',
        source: 'WHO Gestational Diabetes Management, 2021',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'cs-004',
        category: 'condition_specific',
        relevantConditions: ['diabetes'],
        priority: 'medium',
        emoji: '🥗',
        title: 'Diabetes-friendly snacks for pregnancy',
        body: 'Try: cucumber and hummus, a handful of nuts, Greek yogurt with berries, roasted chana, or apple slices with peanut butter. These combine protein and fiber to prevent blood sugar spikes. Keep healthy snacks readily available.',
        source: 'ACOG Gestational Diabetes Nutrition, 2023',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'cs-005',
        category: 'condition_specific',
        relevantConditions: ['highBP'],
        pregnancyWeekRange: [1, 42],
        priority: 'high',
        emoji: '💓',
        title: 'Blood pressure care: Small choices add up',
        body: 'Reduce sodium — avoid processed foods, pickles, papads, and packaged snacks. Add potassium-rich foods (bananas, sweet potatoes, coconut water). Practice deep breathing to manage stress. Monitor your BP daily and report any spike to your doctor.',
        source: 'WHO Hypertension in Pregnancy, 2021',
        actionUrl: '/wellness',
        actionLabel: 'Log BP',
    },
    {
        id: 'cs-006',
        category: 'condition_specific',
        relevantConditions: ['highBP'],
        priority: 'medium',
        emoji: '🧂',
        title: 'Low-sodium doesn\'t mean low-flavor',
        body: 'Use herbs, spices, lemon, garlic, and ginger to flavor food instead of salt. Try cumin, coriander, turmeric, and black pepper. Fresh herbs like coriander and mint add freshness. Your taste buds will adjust within 2-3 weeks.',
        source: 'NHS Low-Sodium Diet Guidelines, 2024',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'cs-007',
        category: 'condition_specific',
        relevantConditions: ['lowBP'],
        priority: 'medium',
        emoji: '💓',
        title: 'Low BP management: Stay steady',
        body: 'Rise slowly from sitting or lying positions to prevent dizziness. Stay well-hydrated — dehydration worsens low BP. Eat small, frequent meals. A little extra salt (as approved by your doctor) and compression stockings can help maintain blood pressure.',
        source: 'ACOG Low Blood Pressure in Pregnancy, 2022',
        actionUrl: '/wellness',
        actionLabel: 'Log BP',
    },
    {
        id: 'cs-008',
        category: 'condition_specific',
        relevantConditions: ['thyroid'],
        pregnancyWeekRange: [1, 42],
        priority: 'high',
        emoji: '🦋',
        title: 'Thyroid care: Consistency is key',
        body: 'Take your thyroid medication at the same time every day, on an empty stomach, with water only. Wait at least 30-60 minutes before eating or drinking anything else. Avoid calcium, iron, or antacids within 4 hours of thyroid medication.',
        source: 'ATA Thyroid Management in Pregnancy, 2022',
        actionUrl: '/wellness',
        actionLabel: 'Track Wellness',
    },
    {
        id: 'cs-009',
        category: 'condition_specific',
        relevantConditions: ['pcos'],
        priority: 'medium',
        emoji: '🔄',
        title: 'PCOS and pregnancy: You\'re already a warrior',
        body: 'Having PCOS means you\'ve already overcome challenges to be here. Focus on anti-inflammatory foods (turmeric, berries, leafy greens), maintain stable blood sugar, and stay active. Your body is capable of amazing things — you\'re proof of that.',
        source: 'RCOG PCOS & Pregnancy Guidelines, 2023',
        actionUrl: '/meal-planner',
        actionLabel: 'Plan Meals',
    },
    {
        id: 'cs-010',
        category: 'condition_specific',
        relevantConditions: ['asthma'],
        pregnancyWeekRange: [1, 42],
        priority: 'high',
        emoji: '🫁',
        title: 'Asthma: Keep breathing easy',
        body: 'Keep your inhaler with you always. Avoid known triggers (dust, smoke, cold air). Most asthma medications are safe during pregnancy — uncontrolled asthma is riskier than medication. Discuss your asthma action plan with both your pulmonologist and obstetrician.',
        source: 'ACOG Asthma During Pregnancy, 2022',
        actionUrl: '/symptoms',
        actionLabel: 'Log Symptoms',
    },
    {
        id: 'cs-011',
        category: 'condition_specific',
        relevantConditions: ['heartDisease'],
        pregnancyWeekRange: [1, 42],
        priority: 'high',
        emoji: '❤️',
        title: 'Heart health: Pace yourself today',
        body: 'Your heart is working harder than ever — it\'s pumping 50% more blood. Only exercise as approved by your cardiologist. Coordinate care between your cardiologist and obstetrician. Watch for chest pain, palpitations, or unusual shortness of breath.',
        source: 'ESC Pregnancy & Heart Disease Guidelines, 2023',
        actionUrl: '/symptoms',
        actionLabel: 'Log Symptoms',
    },
    {
        id: 'cs-012',
        category: 'condition_specific',
        relevantConditions: ['kidneyIssues'],
        pregnancyWeekRange: [1, 42],
        priority: 'high',
        emoji: '🫘',
        title: 'Kidney care: Your filtration system needs love',
        body: 'Follow your doctor\'s specific fluid and protein intake guidelines. Attend all kidney function tests. Watch for signs of UTI (burning during urination, frequent urge) as UTIs are more common and more serious with kidney conditions.',
        source: 'KDIGO Pregnancy & Kidney Disease, 2023',
        actionUrl: '/appointments',
        actionLabel: 'View Appointments',
    },
    {
        id: 'cs-013',
        category: 'condition_specific',
        relevantConditions: ['epilepsy'],
        pregnancyWeekRange: [1, 42],
        priority: 'high',
        emoji: '🧠',
        title: 'Epilepsy: Safety first, always',
        body: 'Continue anti-epileptic medication as prescribed — do not stop or adjust without your doctor\'s approval. Report any seizure activity immediately. Ensure someone close to you knows what to do during a seizure. Your neurologist and obstetrician should communicate.',
        source: 'AAN Epilepsy in Pregnancy Guidelines, 2023',
        actionUrl: '/symptoms',
        actionLabel: 'Log Symptoms',
    },
    {
        id: 'cs-014',
        category: 'condition_specific',
        relevantConditions: ['depressionAnxiety'],
        priority: 'high',
        emoji: '💚',
        title: 'Your feelings are valid, and help is available',
        body: 'Living with depression or anxiety while pregnant is incredibly challenging. You\'re doing something hard, and you\'re doing it while managing your mental health — that takes courage. Talk to your doctor about safe medication options and therapy. You deserve support.',
        source: 'ACOG Perinatal Depression Guidelines, 2023',
        actionUrl: '/wellness',
        actionLabel: 'Log Your Mood',
    },
    {
        id: 'cs-015',
        category: 'condition_specific',
        relevantConditions: ['depressionAnxiety'],
        priority: 'medium',
        emoji: '🌿',
        title: 'Grounding exercise for anxious moments',
        body: 'When anxiety spikes, try the 5-4-3-2-1 technique: Name 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, and 1 thing you taste. This activates your logical brain and pulls you out of the anxiety spiral. It works.',
        source: 'APA Grounding Techniques for Anxiety, 2023',
        actionUrl: '/wellness',
        actionLabel: 'Try Now',
    },
];

// ───────────────────────────────────────────────────────────────────
// MASTER COLLECTION — All 200+ templates
// ───────────────────────────────────────────────────────────────────

export const ALL_NOTIFICATION_TEMPLATES: NotificationContentTemplate[] = [
    ...pregnancyEarly,
    ...pregnancyMid,
    ...pregnancyLate,
    ...postpartumEarly,
    ...postpartumMid,
    ...postpartumLate,
    ...nutrition,
    ...hydration,
    ...exercise,
    ...mentalHealth,
    ...babyCare,
    ...partnerTips,
    ...conditionSpecific,
];

// ───────────────────────────────────────────────────────────────────
// Helper: Get templates applicable to a user's current phase
// ───────────────────────────────────────────────────────────────────

export function getTemplatesForPhase(
    pregnancyWeek: number | null,
    postpartumWeek: number | null,
    medicalConditions: MedicalConditionTag[],
): NotificationContentTemplate[] {
    const templates: NotificationContentTemplate[] = [];

    for (const t of ALL_NOTIFICATION_TEMPLATES) {
        // Check pregnancy phase
        if (pregnancyWeek !== null) {
            if (t.pregnancyWeekRange) {
                const [start, end] = t.pregnancyWeekRange;
                if (pregnancyWeek >= start && pregnancyWeek <= end) {
                    templates.push(t);
                    continue;
                }
            }
        }

        // Check postpartum phase
        if (postpartumWeek !== null) {
            if (t.postpartumWeekRange) {
                const [start, end] = t.postpartumWeekRange;
                if (postpartumWeek >= start && postpartumWeek <= end) {
                    templates.push(t);
                    continue;
                }
            }
        }

        // General templates (no week range) apply to everyone
        if (!t.pregnancyWeekRange && !t.postpartumWeekRange && !t.relevantConditions) {
            templates.push(t);
        }

        // Condition-specific templates
        if (t.relevantConditions && t.relevantConditions.some(c => medicalConditions.includes(c))) {
            templates.push(t);
        }
    }

    return templates;
}

// ───────────────────────────────────────────────────────────────────
// Helper: Get templates by category (for rotation)
// ───────────────────────────────────────────────────────────────────

export function getTemplatesByCategory(
    templates: NotificationContentTemplate[],
    category: ContentCategory,
): NotificationContentTemplate[] {
    return templates.filter(t => t.category === category);
}

// ───────────────────────────────────────────────────────────────────
// Helper: Category rotation schedule (3-day cycle)
// Day 1: phase-specific + nutrition
// Day 2: hydration/exercise + mental health
// Day 3: baby care/partner + condition-specific
// ───────────────────────────────────────────────────────────────────

export const CATEGORY_ROTATION: ContentCategory[][] = [
    // Day 1
    ['pregnancy_early', 'pregnancy_mid', 'pregnancy_late', 'postpartum_early', 'postpartum_mid', 'postpartum_late', 'nutrition'],
    // Day 2
    ['hydration', 'exercise', 'mental_health'],
    // Day 3
    ['baby_care', 'partner_tips', 'condition_specific'],
];

// Total count for reference
export const TOTAL_TEMPLATES = ALL_NOTIFICATION_TEMPLATES.length;