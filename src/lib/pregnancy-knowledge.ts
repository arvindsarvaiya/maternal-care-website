// Pregnancy Knowledge Database — Week 1-40
// Each week contains detailed guidance for all categories

export interface WeekKnowledge {
    week: number;
    babyDevelopment: string[];
    babySize: string;
    babyWeight: string;
    babyLength: string;
    motherBodyChanges: string[];
    commonSymptoms: string[];
    nutritionalFocus: string[];
    exerciseGuidance: string[];
    hydrationGuidance: string[];
    medicalReminders: string[];
    warningSigns: string[];
    weeklyGuidance: string[];
}

export interface PersonalizationFactors {
    bmi?: number;
    allergies?: string[];
    medicalConditions?: {
        anemia?: boolean;
        diabetes?: boolean;
        hypertension?: boolean;
        thyroidDisorder?: boolean;
        highRiskPregnancy?: boolean;
        lowBP?: boolean;
        highBP?: boolean;
        pcos?: boolean;
        asthma?: boolean;
        heartDisease?: boolean;
        kidneyIssues?: boolean;
        epilepsy?: boolean;
    };
    diet?: 'veg' | 'non-veg';
    mood?: number;
}

export const pregnancyKnowledgeBase: WeekKnowledge[] = [
    // Week 1
    {
        week: 1,
        babyDevelopment: [
            "Fertilization occurs - sperm meets egg",
            "Zygote begins dividing rapidly",
            "Genetic blueprint is established",
            "Baby's sex is determined at conception"
        ],
        babySize: "Not yet visible",
        babyWeight: "Microscopic",
        babyLength: "Microscopic",
        motherBodyChanges: [
            "Ovulation occurs",
            "Uterus prepares for potential pregnancy",
            "Hormone levels begin shifting",
            "No visible changes yet"
        ],
        commonSymptoms: [
            "Mild cramping (similar to period)",
            "Breast tenderness",
            "Increased energy",
            "Heightened sense of smell"
        ],
        nutritionalFocus: [
            "Start taking folic acid supplements (400-800mcg)",
            "Focus on balanced diet with protein",
            "Include leafy greens for folate",
            "Avoid alcohol and limit caffeine"
        ],
        exerciseGuidance: [
            "Continue regular physical activity",
            "Walking, swimming, light jogging",
            "Avoid high-impact sports if trying to conceive",
            "Stay hydrated during exercise"
        ],
        hydrationGuidance: [
            "Drink 8-10 glasses of water daily",
            "Carry water bottle everywhere",
            "Limit caffeinated beverages",
            "Monitor urine color (should be pale yellow)"
        ],
        medicalReminders: [
            "Schedule preconception checkup if planning",
            "Review current medications with doctor",
            "Start prenatal vitamins if not already",
            "Update vaccinations if needed"
        ],
        warningSigns: [
            "Severe abdominal pain",
            "Heavy bleeding",
            "Fever above 100.4°F",
            "Dizziness or fainting"
        ],
        weeklyGuidance: [
            "This is actually the week of your last menstrual period",
            "Your due date is calculated from this date",
            "Focus on healthy habits now",
            "Start tracking your cycle if trying to conceive"
        ]
    },
    // Week 2
    {
        week: 2,
        babyDevelopment: [
            "Ovulation typically occurs",
            "Egg is released from ovary",
            "Sperm travels to meet egg",
            "Fertilization may happen in fallopian tube"
        ],
        babySize: "Not yet visible",
        babyWeight: "Microscopic",
        babyLength: "Microscopic",
        motherBodyChanges: [
            "Estrogen levels peak",
            "Cervical mucus becomes fertile",
            "Basal body temperature rises",
            "Increased libido possible"
        ],
        commonSymptoms: [
            "Mild pelvic discomfort",
            "Breast tenderness",
            "Energy surge",
            "Ovulation pain (mittelschmerz)"
        ],
        nutritionalFocus: [
            "Continue folic acid supplementation",
            "Eat antioxidant-rich foods",
            "Include omega-3 fatty acids",
            "Maintain balanced macronutrients"
        ],
        exerciseGuidance: [
            "Moderate exercise is beneficial",
            "Yoga and stretching",
            "Avoid overheating during exercise",
            "Listen to your body's signals"
        ],
        hydrationGuidance: [
            "Maintain 8-10 glasses water daily",
            "Electrolyte balance important",
            "Coconut water as natural electrolyte",
            "Avoid excessive sugary drinks"
        ],
        medicalReminders: [
            "Continue prenatal vitamins",
            "Track ovulation if trying to conceive",
            "Avoid medications not approved by doctor",
            "Maintain healthy sleep schedule"
        ],
        warningSigns: [
            "Severe pelvic pain",
            "Unusual discharge",
            "Fever or chills",
            "Sudden severe headache"
        ],
        weeklyGuidance: [
            "Your body is preparing for potential pregnancy",
            "This is your fertile window if trying to conceive",
            "Reduce stress through relaxation techniques",
            "Avoid exposure to harmful chemicals"
        ]
    },
    // Week 3
    {
        week: 3,
        babyDevelopment: [
            "Fertilization occurs if sperm meets egg",
            "Rapid cell division begins",
            "Blastocyst forms and travels to uterus",
            "Implantation begins in uterine lining"
        ],
        babySize: "Smaller than a grain of salt",
        babyWeight: "Microscopic",
        babyLength: "0.1mm",
        motherBodyChanges: [
            "Implantation may cause light spotting",
            "Hormone levels begin rising",
            "Uterus starts preparing",
            "Blood flow to uterus increases"
        ],
        commonSymptoms: [
            "Light spotting (implantation bleeding)",
            "Mild cramping",
            "Breast tenderness increases",
            "Fatigue may begin"
        ],
        nutritionalFocus: [
            "Increase protein intake",
            "Focus on iron-rich foods",
            "Include vitamin C sources",
            "Continue folic acid supplementation"
        ],
        exerciseGuidance: [
            "Light to moderate exercise",
            "Walking is excellent",
            "Avoid high-intensity workouts",
            "Stay cool and hydrated"
        ],
        hydrationGuidance: [
            "Increase water intake to 10 glasses",
            "Herbal teas can be soothing",
            "Avoid excessive caffeine",
            "Monitor for dehydration signs"
        ],
        medicalReminders: [
            "Continue prenatal vitamins",
            "Avoid alcohol completely",
            "Limit caffeine to 200mg daily",
            "Avoid smoking and secondhand smoke"
        ],
        warningSigns: [
            "Heavy bleeding (more than spotting)",
            "Severe abdominal pain",
            "Shoulder pain (could be ectopic)",
            "Fever or infection signs"
        ],
        weeklyGuidance: [
            "If conception occurred, implantation is happening",
            "You might not feel any different yet",
            "Continue healthy habits",
            "Consider taking a pregnancy test soon"
        ]
    },
    // Week 4
    {
        week: 4,
        babyDevelopment: [
            "Embryo implants in uterus",
            "Amniotic sac begins forming",
            "Placenta starts developing",
            "Basic cell layers established"
        ],
        babySize: "Poppy seed",
        babyWeight: "Negligible",
        babyLength: "0.5mm",
        motherBodyChanges: [
            "hCG hormone production begins",
            "Missed period likely",
            "Breast changes continue",
            "Uterus begins enlarging"
        ],
        commonSymptoms: [
            "Missed period",
            "Nausea may begin",
            "Increased urination",
            "Extreme fatigue"
        ],
        nutritionalFocus: [
            "Small, frequent meals to combat nausea",
            "Ginger for nausea relief",
            "Complex carbohydrates for sustained energy",
            "Continue prenatal vitamins"
        ],
        exerciseGuidance: [
            "Gentle walking recommended",
            "Prenatal yoga can help",
            "Avoid exercises that cause dizziness",
            "Listen to your body - rest when needed"
        ],
        hydrationGuidance: [
            "Sip water throughout the day",
            "Ginger tea can help with nausea",
            "Avoid large amounts at once",
            "Add lemon to water for taste"
        ],
        medicalReminders: [
            "Confirm pregnancy with test",
            "Schedule first prenatal appointment",
            "Continue prenatal vitamins",
            "Avoid harmful substances"
        ],
        warningSigns: [
            "Heavy bleeding with clots",
            "Severe abdominal pain",
            "Dizziness or fainting",
            "Signs of ectopic pregnancy"
        ],
        weeklyGuidance: [
            "This is when you might get a positive pregnancy test",
            "hCG levels are rising rapidly",
            "Your body is working hard",
            "Rest is important now"
        ]
    },
    // Week 5
    {
        week: 5,
        babyDevelopment: [
            "Heart begins forming",
            "Neural tube closes",
            "Basic brain structure forms",
            "Arm and leg buds appear"
        ],
        babySize: "Sesame seed",
        babyWeight: "Negligible",
        babyLength: "1-2mm",
        motherBodyChanges: [
            "Blood volume increases",
            "Heart works harder",
            "Hormone levels surge",
            "Uterus grows to grape size"
        ],
        commonSymptoms: [
            "Morning sickness may start",
            "Breast tenderness increases",
            "Frequent urination",
            "Food aversions develop"
        ],
        nutritionalFocus: [
            "Vitamin B6 for nausea",
            "Small protein-rich meals",
            "Avoid strong food smells",
            "Crackers before getting up"
        ],
        exerciseGuidance: [
            "Short, frequent walks",
            "Gentle stretching",
            "Avoid lying flat on back",
            "Stop if feeling dizzy"
        ],
        hydrationGuidance: [
            "Small sips throughout day",
            "Ice chips can help with nausea",
            "Clear fluids when nauseous",
            "Avoid dehydration at all costs"
        ],
        medicalReminders: [
            "First prenatal visit around week 6-8",
            "Discuss family medical history",
            "Screen for genetic conditions if desired",
            "Start pregnancy journal"
        ],
        warningSigns: [
            "Severe nausea (hyperemesis)",
            "Vaginal bleeding",
            "Severe cramping",
            "Signs of dehydration"
        ],
        weeklyGuidance: [
            "Your baby's heart is beginning to form",
            "Morning sickness may be challenging",
            "Rest when your body demands it",
            "Share news with partner when ready"
        ]
    },
    // Week 6
    {
        week: 6,
        babyDevelopment: [
            "Heartbeat may be detectable",
            "Facial features begin forming",
            "Neural connections develop",
            "Limbs continue growing"
        ],
        babySize: "Lentil",
        babyWeight: "Negligible",
        babyLength: "4-5mm",
        motherBodyChanges: [
            "Uterus grows to plum size",
            "Blood flow increases significantly",
            "Breasts become fuller",
            "Waistline may start expanding"
        ],
        commonSymptoms: [
            "Morning sickness peaks",
            "Extreme fatigue common",
            "Mood swings possible",
            "Heightened sense of smell"
        ],
        nutritionalFocus: [
            "Eat every 2-3 hours",
            "Combine protein with carbs",
            "Avoid spicy or greasy foods",
            "Continue prenatal vitamins"
        ],
        exerciseGuidance: [
            "Very gentle activity only",
            "Short walks when feeling well",
            "Rest is priority this week",
            "Avoid exercise when nauseous"
        ],
        hydrationGuidance: [
            "Sip water constantly",
            "Electrolyte drinks if vomiting",
            "Room temperature water better",
            "Add fruit for flavor"
        ],
        medicalReminders: [
            "Schedule first prenatal ultrasound",
            "Discuss due date confirmation",
            "Blood work for hCG levels",
            "Rh factor testing"
        ],
        warningSigns: [
            "Unable to keep fluids down",
            "Heavy bleeding",
            "Severe abdominal pain",
            "Fever or infection"
        ],
        weeklyGuidance: [
            "First prenatal visit typically this week",
            "Ultrasound may show heartbeat",
            "Emotional ups and downs are normal",
            "Take time to process the news"
        ]
    },
    // Week 7
    {
        week: 7,
        babyDevelopment: [
            "Brain develops rapidly",
            "Arms and legs lengthen",
            "Fingers and toes begin forming",
            "Facial features become distinct"
        ],
        babySize: "Blueberry",
        babyWeight: "Less than 1 gram",
        babyLength: "7-10mm",
        motherBodyChanges: [
            "Uterus grows to small orange",
            "Cervix softens",
            "Mucus plug forms",
            "Blood volume increases 20%"
        ],
        commonSymptoms: [
            "Nausea continues",
            "Food cravings/aversions",
            "Excessive saliva",
            "Headaches possible"
        ],
        nutritionalFocus: [
            "Focus on nutrient-dense foods",
            "Small, bland meals",
            "Avoid triggers for nausea",
            "Iron-rich foods important"
        ],
        exerciseGuidance: [
            "Light walking when possible",
            "Gentle prenatal yoga",
            "Avoid high-impact activities",
            "Listen to body's fatigue signals"
        ],
        hydrationGuidance: [
            "8-10 glasses daily minimum",
            "Herbal teas (safe ones)",
            "Avoid sugary drinks",
            "Monitor urine output"
        ],
        medicalReminders: [
            "Continue prenatal vitamins",
            "Report any bleeding to doctor",
            "Discuss genetic screening options",
            "Update medication list with doctor"
        ],
        warningSigns: [
            "Heavy bleeding",
            "Severe cramping",
            "Fever above 100.4°F",
            "Inability to keep food down"
        ],
        weeklyGuidance: [
            "Baby's facial features are forming",
            "You might be showing early",
            "Morning sickness may be intense",
            "Consider maternity clothes soon"
        ]
    },
    // Week 8
    {
        week: 8,
        babyDevelopment: [
            "All major organs forming",
            "Baby moves spontaneously",
            "Eyelids developing",
            "Nose and upper lip forming"
        ],
        babySize: "Raspberry",
        babyWeight: "1 gram",
        babyLength: "11-14mm",
        motherBodyChanges: [
            "Uterus size of tennis ball",
            "Waistline expanding",
            "Breasts grow significantly",
            "Skin changes may begin"
        ],
        commonSymptoms: [
            "Nausea may peak",
            "Breast tenderness intense",
            "Fatigue still strong",
            "Constipation may start"
        ],
        nutritionalFocus: [
            "Fiber-rich foods for constipation",
            "Protein at every meal",
            "Calcium-rich foods",
            "Continue prenatal vitamins"
        ],
        exerciseGuidance: [
            "Short walks (10-15 minutes)",
            "Gentle stretching",
            "Swimming if feeling well",
            "Avoid overheating"
        ],
        hydrationGuidance: [
            "Increase water for constipation",
            "Warm water with lemon",
            "Prune juice can help",
            "Stay hydrated despite nausea"
        ],
        medicalReminders: [
            "First prenatal visit if not done",
            "Discuss genetic testing options",
            "Blood pressure check",
            "Weight tracking begins"
        ],
        warningSigns: [
            "Severe abdominal pain",
            "Heavy bleeding",
            "Signs of infection",
            "Severe headaches"
        ],
        weeklyGuidance: [
            "All major organs are forming now",
            "Baby is moving though you can't feel it",
            "Your clothes may feel tight",
            "Consider telling close family"
        ]
    },
    // Week 9
    {
        week: 9,
        babyDevelopment: [
            "Baby is now a fetus",
            "Basic physiology complete",
            "Fingers and toes distinct",
            "Sex organs developing"
        ],
        babySize: "Green olive",
        babyWeight: "2 grams",
        babyLength: "16-18mm",
        motherBodyChanges: [
            "Uterus grows to grapefruit",
            "Blood volume increases 30-50%",
            "Metabolism increases",
            "Skin pigmentation may change"
        ],
        commonSymptoms: [
            "Nausea may slightly improve",
            "Breast fullness continues",
            "Frequent urination",
            "Mood swings possible"
        ],
        nutritionalFocus: [
            "DHA for brain development",
            "Choline-rich foods",
            "Lean proteins",
            "Colorful fruits and vegetables"
        ],
        exerciseGuidance: [
            "Moderate walking encouraged",
            "Prenatal yoga classes",
            "Avoid contact sports",
            "Stay cool during exercise"
        ],
        hydrationGuidance: [
            "8-10 glasses water daily",
            "Coconut water for electrolytes",
            "Herbal teas (safe varieties)",
            "Limit caffeine to 200mg"
        ],
        medicalReminders: [
            "Schedule nuchal translucency scan (11-14 weeks)",
            "Discuss prenatal screening options",
            "Continue prenatal vitamins",
            "Report any unusual symptoms"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe cramping",
            "Fever or chills",
            "Sudden swelling"
        ],
        weeklyGuidance: [
            "Critical period for organ development complete",
            "Baby's fingers and toes are separating",
            "You may start feeling more energetic",
            "Plan for maternity leave discussions"
        ]
    },
    // Week 10
    {
        week: 10,
        babyDevelopment: [
            "All vital organs formed",
            "Baby can swallow amniotic fluid",
            "Tooth buds form in gums",
            "Spinal cord visible"
        ],
        babySize: "Kumquat",
        babyWeight: "4 grams",
        babyLength: "22-27mm",
        motherBodyChanges: [
            "Morning sickness may decrease",
            "Veins more visible",
            "Round ligament pain may start",
            "Energy levels may improve"
        ],
        commonSymptoms: [
            "Nausea improving for many",
            "Breast tenderness continues",
            "Mild cramping from stretching",
            "Increased appetite"
        ],
        nutritionalFocus: [
            "Focus on balanced meals",
            "Include healthy fats",
            "Calcium for baby's bones",
            "Iron for blood volume"
        ],
        exerciseGuidance: [
            "20-30 minutes moderate activity",
            "Walking, swimming, stationary bike",
            "Prenatal yoga beneficial",
            "Avoid exercises with fall risk"
        ],
        hydrationGuidance: [
            "Maintain 8-10 glasses",
            "Water before meals",
            "Avoid dehydration",
            "Monitor urine color"
        ],
        medicalReminders: [
            "Schedule nuchal translucency scan",
            "Discuss genetic testing if desired",
            "Dental checkup recommended",
            "Continue prenatal vitamins"
        ],
        warningSigns: [
            "Heavy bleeding",
            "Severe abdominal pain",
            "High fever",
            "Signs of preterm labor"
        ],
        weeklyGuidance: [
            "Risk of miscarriage decreases significantly",
            "Baby's organs are fully formed",
            "You might start feeling better",
            "Consider announcing pregnancy"
        ]
    },
    // Week 11
    {
        week: 11,
        babyDevelopment: [
            "Baby can open and close fists",
            "Tooth buds visible",
            "Intestines developing",
            "Baby is very active"
        ],
        babySize: "Fig",
        babyWeight: "7 grams",
        babyLength: "30-35mm",
        motherBodyChanges: [
            "Hair and nails grow faster",
            "Skin may glow or break out",
            "Uterus moves up in abdomen",
            "Less pressure on bladder"
        ],
        commonSymptoms: [
            "Nausea continues to improve",
            "Energy returning",
            "Breast changes stabilize",
            "Mood improvements"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Complex carbohydrates",
            "Healthy fats for brain",
            "Iron and calcium continue important"
        ],
        exerciseGuidance: [
            "Regular moderate exercise",
            "30 minutes daily recommended",
            "Strength training with light weights",
            "Avoid lying on back after 16 weeks"
        ],
        hydrationGuidance: [
            "8-10 glasses water",
            "Add electrolytes if exercising",
            "Herbal teas for variety",
            "Avoid sugary drinks"
        ],
        medicalReminders: [
            "Nuchal translucency scan this week",
            "First trimester screening",
            "Discuss CVS if high risk",
            "Regular prenatal checkups"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe cramping",
            "Fever",
            "Decreased symptoms (sudden)"
        ],
        weeklyGuidance: [
            "Nuchal translucency scan scheduled",
            "Baby is very active moving around",
            "You may start feeling more like yourself",
            "Plan for second trimester energy"
        ]
    },
    // Week 12
    {
        week: 12,
        babyDevelopment: [
            "Reflexes developing",
            "Baby can suck thumb",
            "Fingernails form",
            "Vocal cords developing"
        ],
        babySize: "Lime",
        babyWeight: "14 grams",
        babyLength: "40-50mm",
        motherBodyChanges: [
            "Uterus at belly button level",
            "May start showing noticeably",
            "Heartburn may begin",
            "Constipation common"
        ],
        commonSymptoms: [
            "Nausea significantly improved",
            "Energy levels increasing",
            "Breast fullness continues",
            "Occasional headaches"
        ],
        nutritionalFocus: [
            "Small frequent meals for heartburn",
            "Fiber for constipation",
            "Protein at each meal",
            "Continue prenatal vitamins"
        ],
        exerciseGuidance: [
            "30 minutes moderate exercise",
            "Swimming excellent",
            "Prenatal yoga",
            "Avoid high-impact activities"
        ],
        hydrationGuidance: [
            "8-10 glasses water",
            "Warm water aids digestion",
            "Limit caffeine",
            "Add lemon for heartburn"
        ],
        medicalReminders: [
            "End of first trimester",
            "Schedule next prenatal visit",
            "Discuss genetic test results",
            "Dental cleaning recommended"
        ],
        warningSigns: [
            "Heavy bleeding",
            "Severe abdominal pain",
            "High fever",
            "Sudden weight loss"
        ],
        weeklyGuidance: [
            "First trimester ends this week",
            "Miscarriage risk drops significantly",
            "You may start feeling better",
            "Many announce pregnancy now"
        ]
    },
    // Week 13
    {
        week: 13,
        babyDevelopment: [
            "Fingerprints forming",
            "Baby can make facial expressions",
            "Bone marrow producing blood cells",
            "Baby practices breathing movements"
        ],
        babySize: "Lemon",
        babyWeight: "23 grams",
        babyLength: "60-70mm",
        motherBodyChanges: [
            "Welcome to second trimester",
            "Energy levels surge",
            "Morning sickness fades",
            "Visible baby bump appears"
        ],
        commonSymptoms: [
            "Increased energy",
            "Improved mood",
            "Round ligament pain",
            "Breast changes continue"
        ],
        nutritionalFocus: [
            "Increased calorie needs (300 extra)",
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume"
        ],
        exerciseGuidance: [
            "30-45 minutes exercise",
            "Walking, swimming, prenatal yoga",
            "Light strength training",
            "Avoid exercises on back"
        ],
        hydrationGuidance: [
            "10 glasses water daily",
            "Coconut water for electrolytes",
            "Herbal teas",
            "Monitor hydration during exercise"
        ],
        medicalReminders: [
            "Second trimester begins",
            "Schedule anatomy scan (18-22 weeks)",
            "Discuss gestational diabetes screening",
            "Continue prenatal vitamins"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Signs of infection"
        ],
        weeklyGuidance: [
            "Welcome to the 'honeymoon phase' of pregnancy",
            "Energy and mood typically improve",
            "Start planning nursery",
            "Consider maternity clothes shopping"
        ]
    },
    // Week 14
    {
        week: 14,
        babyDevelopment: [
            "Baby can squint and frown",
            "Hair pattern on head",
            "Baby practices swallowing",
            "Lanugo (fine hair) covers body"
        ],
        babySize: "Nectarine",
        babyWeight: "43 grams",
        babyLength: "80-90mm",
        motherBodyChanges: [
            "Colostrum production begins",
            "Linea nigra may appear",
            "Skin pigmentation changes",
            "Uterus moves up in abdomen"
        ],
        commonSymptoms: [
            "Increased energy",
            "Breast changes (leakage possible)",
            "Round ligament pain",
            "Occasional dizziness"
        ],
        nutritionalFocus: [
            "Protein for tissue growth",
            "Calcium for skeleton",
            "DHA for brain development",
            "Fiber for digestion"
        ],
        exerciseGuidance: [
            "45 minutes moderate exercise",
            "Swimming and walking ideal",
            "Prenatal yoga for flexibility",
            "Kegel exercises recommended"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolyte drinks if exercising",
            "Limit caffeine to 200mg",
            "Add fruit to water"
        ],
        medicalReminders: [
            "Schedule anatomy scan",
            "Discuss quad screen if desired",
            "Start thinking about birth plan",
            "Regular prenatal visits"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "High fever",
            "Severe headaches"
        ],
        weeklyGuidance: [
            "Baby's facial expressions developing",
            "You might feel baby's first movements soon",
            "Second trimester energy peak",
            "Good time for travel and activities"
        ]
    },
    // Week 15
    {
        week: 15,
        babyDevelopment: [
            "Baby can sense light",
            "Taste buds developing",
            "Baby sucks thumb frequently",
            "Legs longer than arms now"
        ],
        babySize: "Apple",
        babyWeight: "70 grams",
        babyLength: "100mm",
        motherBodyChanges: [
            "Uterus above pubic bone",
            "Pregnancy 'glow' may appear",
            "Hair growth increases",
            "Nails grow faster"
        ],
        commonSymptoms: [
            "Increased energy",
            "Breast changes continue",
            "Nasal congestion",
            "Bleeding gums possible"
        ],
        nutritionalFocus: [
            "Vitamin C for tissue repair",
            "Protein for baby's growth",
            "Iron for blood volume",
            "Calcium for bones"
        ],
        exerciseGuidance: [
            "45 minutes daily exercise",
            "Swimming excellent for relief",
            "Walking with good posture",
            "Prenatal Pilates beneficial"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Warm water for congestion",
            "Herbal teas",
            "Avoid sugary beverages"
        ],
        medicalReminders: [
            "Schedule anatomy scan soon",
            "Discuss amniocentesis if high risk",
            "Start Kegel exercises",
            "Dental checkup if needed"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Severe swelling"
        ],
        weeklyGuidance: [
            "Baby can sense light through your belly",
            "First movements (quickening) may be felt",
            "Enjoy the energy boost",
            "Start researching childbirth classes"
        ]
    },
    // Week 16
    {
        week: 16,
        babyDevelopment: [
            "Baby can hear sounds",
            "Facial muscles working",
            "Baby makes facial expressions",
            "Skeleton hardening"
        ],
        babySize: "Avocado",
        babyWeight: "100 grams",
        babyLength: "110-120mm",
        motherBodyChanges: [
            "Uterus halfway to belly button",
            "May feel first movements",
            "Back pain may begin",
            "Posture changes"
        ],
        commonSymptoms: [
            "First baby movements (quickening)",
            "Back pain",
            "Round ligament pain",
            "Increased vaginal discharge"
        ],
        nutritionalFocus: [
            "Omega-3 for brain development",
            "Protein for muscle growth",
            "Calcium for bones",
            "Iron for blood volume"
        ],
        exerciseGuidance: [
            "45 minutes moderate exercise",
            "Swimming for back relief",
            "Prenatal yoga",
            "Avoid exercises on back"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if active",
            "Limit caffeine",
            "Coconut water beneficial"
        ],
        medicalReminders: [
            "Anatomy scan coming up",
            "Discuss gender reveal if desired",
            "Start childbirth class research",
            "Regular prenatal visits"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe back pain",
            "Fever",
            "Decreased fetal movement"
        ],
        weeklyGuidance: [
            "You may feel baby's first movements",
            "Baby can hear your voice now",
            "Talk and sing to your baby",
            "Consider finding out baby's gender"
        ]
    },
    // Week 17
    {
        week: 17,
        babyDevelopment: [
            "Fat accumulation begins",
            "Skeleton transforming from cartilage",
            "Baby can hear external sounds",
            "Umbilical cord strengthens"
        ],
        babySize: "Turnip",
        babyWeight: "140 grams",
        babyLength: "130mm",
        motherBodyChanges: [
            "Uterus about 2 inches below navel",
            "Center of gravity shifts",
            "Balance may be affected",
            "Stretch marks may appear"
        ],
        commonSymptoms: [
            "Baby movements more noticeable",
            "Back pain increases",
            "Leg cramps possible",
            "Hemorrhoids may develop"
        ],
        nutritionalFocus: [
            "Magnesium for leg cramps",
            "Fiber for hemorrhoids",
            "Protein for baby's growth",
            "Calcium for bones"
        ],
        exerciseGuidance: [
            "45 minutes moderate exercise",
            "Swimming for back relief",
            "Walking with good posture",
            "Stretching for flexibility"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Magnesium-rich foods",
            "Electrolytes if cramping",
            "Avoid dehydration"
        ],
        medicalReminders: [
            "Anatomy scan scheduled soon",
            "Discuss gestational diabetes test",
            "Start thinking about birth plan",
            "Kegel exercises continue"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe leg pain",
            "Fever",
            "Severe headaches"
        ],
        weeklyGuidance: [
            "Baby's skeleton is hardening",
            "Fat accumulation starting",
            "You're showing more noticeably",
            "Start planning nursery"
        ]
    },
    // Week 18
    {
        week: 18,
        babyDevelopment: [
            "Baby's ears in final position",
            "Baby can hear your heartbeat",
            "Vernix (waxy coating) forms",
            "Baby yawns and stretches"
        ],
        babySize: "Bell pepper",
        babyWeight: "190 grams",
        babyLength: "140mm",
        motherBodyChanges: [
            "Uterus at belly button level",
            "Feeling baby's movements clearly",
            "Back pain common",
            "Digestion slows"
        ],
        commonSymptoms: [
            "Regular baby movements",
            "Back pain",
            "Heartburn",
            "Constipation"
        ],
        nutritionalFocus: [
            "Small meals for heartburn",
            "Fiber for constipation",
            "Protein for baby's growth",
            "Calcium for bones"
        ],
        exerciseGuidance: [
            "45 minutes moderate exercise",
            "Swimming excellent",
            "Prenatal yoga",
            "Avoid high-impact activities"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Warm water for digestion",
            "Ginger tea for heartburn",
            "Limit caffeine"
        ],
        medicalReminders: [
            "Anatomy scan this week (18-22 weeks)",
            "Gender can often be determined",
            "Discuss birth preferences",
            "Gestational diabetes screening"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Decreased fetal movement"
        ],
        weeklyGuidance: [
            "Anatomy scan scheduled - see baby in detail",
            "Gender can often be determined",
            "Baby's movements becoming regular",
            "Start serious nursery planning"
        ]
    },
    // Week 19
    {
        week: 19,
        babyDevelopment: [
            "Senses developing rapidly",
            "Baby can taste amniotic fluid",
            "Brain developing specialized areas",
            "Lungs developing branches"
        ],
        babySize: "Heirloom tomato",
        babyWeight: "240 grams",
        babyLength: "150mm",
        motherBodyChanges: [
            "Uterus grows significantly",
            "Skin stretching",
            "Breast size increases",
            "Balance continues shifting"
        ],
        commonSymptoms: [
            "Baby movements stronger",
            "Back pain",
            "Skin changes (stretch marks)",
            "Dizziness when standing quickly"
        ],
        nutritionalFocus: [
            "Vitamin E for skin",
            "Protein for baby's growth",
            "Omega-3 for brain",
            "Iron for blood volume"
        ],
        exerciseGuidance: [
            "45 minutes moderate exercise",
            "Swimming for relief",
            "Prenatal yoga",
            "Avoid exercises on back"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if active",
            "Herbal teas",
            "Avoid sugary drinks"
        ],
        medicalReminders: [
            "Anatomy scan if not done",
            "Discuss birth plan preferences",
            "Start childbirth classes",
            "Regular prenatal visits"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Severe headaches"
        ],
        weeklyGuidance: [
            "Baby's senses are developing rapidly",
            "You may feel baby responding to sounds",
            "Halfway through pregnancy soon",
            "Start researching pediatricians"
        ]
    },
    // Week 20
    {
        week: 20,
        babyDevelopment: [
            "Halfway point reached",
            "Baby covered in vernix",
            "Hair and nails growing",
            "Baby swallows more amniotic fluid"
        ],
        babySize: "Banana",
        babyWeight: "300 grams",
        babyLength: "160mm",
        motherBodyChanges: [
            "Uterus at belly button",
            "Belly button may pop out",
            "Breast colostrum increases",
            "Shortness of breath possible"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Back pain",
            "Heartburn",
            "Swelling in hands/feet"
        ],
        nutritionalFocus: [
            "Balanced nutrition crucial",
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume"
        ],
        exerciseGuidance: [
            "45 minutes moderate exercise",
            "Swimming excellent",
            "Walking with good posture",
            "Prenatal yoga"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if swelling",
            "Limit caffeine",
            "Coconut water beneficial"
        ],
        medicalReminders: [
            "Anomaly scan if not done",
            "Mid-pregnancy checkup",
            "Discuss birth plan",
            "Gestational diabetes test"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Sudden swelling"
        ],
        weeklyGuidance: [
            "Congratulations - halfway there!",
            "Baby's movements are strong and regular",
            "You're visibly pregnant",
            "Start planning maternity leave"
        ]
    },
    // Week 21
    {
        week: 21,
        babyDevelopment: [
            "Baby's movements more coordinated",
            "Bone marrow producing blood cells",
            "Baby's eyebrows visible",
            "Taste buds fully functional"
        ],
        babySize: "Carrot",
        babyWeight: "360 grams",
        babyLength: "170mm",
        motherBodyChanges: [
            "Uterus grows above navel",
            "Stretch marks may darken",
            "Skin may itch",
            "Breast changes continue"
        ],
        commonSymptoms: [
            "Active baby movements",
            "Back pain",
            "Braxton Hicks possible",
            "Leg cramps"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Magnesium for cramps",
            "Omega-3 for brain"
        ],
        exerciseGuidance: [
            "45 minutes moderate exercise",
            "Swimming for back relief",
            "Prenatal yoga",
            "Avoid high-impact activities"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Magnesium-rich foods",
            "Electrolytes if cramping",
            "Avoid dehydration"
        ],
        medicalReminders: [
            "Regular prenatal visits",
            "Discuss birth plan",
            "Start childbirth classes",
            "Monitor blood pressure"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Severe headaches"
        ],
        weeklyGuidance: [
            "Baby's movements are becoming a pattern",
            "You may notice sleep/wake cycles",
            "Start tracking baby's movements",
            "Prepare for third trimester"
        ]
    },
    // Week 22
    {
        week: 22,
        babyDevelopment: [
            "Baby's eyes can perceive light",
            "Touch sense well developed",
            "Baby grasps umbilical cord",
            "Brain growth rapid"
        ],
        babySize: "Spaghetti squash",
        babyWeight: "430 grams",
        babyLength: "180mm",
        motherBodyChanges: [
            "Uterus about 1 inch above navel",
            "Weight gain increasing",
            "Breast size stable",
            "Skin stretching continues"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Back pain",
            "Braxton Hicks contractions",
            "Swelling in ankles"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume",
            "Fiber for digestion"
        ],
        exerciseGuidance: [
            "45 minutes moderate exercise",
            "Swimming excellent",
            "Walking with support belt",
            "Prenatal yoga"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if swelling",
            "Limit caffeine",
            "Add lemon to water"
        ],
        medicalReminders: [
            "Regular prenatal checkups",
            "Gestational diabetes test if not done",
            "Discuss birth plan",
            "Monitor blood pressure"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Sudden severe swelling"
        ],
        weeklyGuidance: [
            "Baby's eyes can sense light",
            "Baby responds to your voice",
            "Start thinking about baby gear",
            "Consider hospital tour"
        ]
    },
    // Week 23
    {
        week: 23,
        babyDevelopment: [
            "Baby can hear your voice clearly",
            "Skin still wrinkled",
            "Lungs developing surfactant",
            "Baby practices breathing"
        ],
        babySize: "Large mango",
        babyWeight: "500 grams",
        babyLength: "200mm",
        motherBodyChanges: [
            "Uterus continues growing",
            "Weight gain steady",
            "Back pain increases",
            "Balance affected"
        ],
        commonSymptoms: [
            "Active baby movements",
            "Back pain",
            "Braxton Hicks",
            "Swelling in extremities"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume",
            "Vitamin C for tissue repair"
        ],
        exerciseGuidance: [
            "45 minutes moderate exercise",
            "Swimming for relief",
            "Walking with good posture",
            "Prenatal yoga"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if active",
            "Limit caffeine",
            "Coconut water beneficial"
        ],
        medicalReminders: [
            "Regular prenatal visits",
            "Discuss birth plan",
            "Start childbirth classes",
            "Monitor for preeclampsia signs"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Severe headaches with vision changes"
        ],
        weeklyGuidance: [
            "Baby hears and recognizes your voice",
            "Read and sing to your baby",
            "Start finalizing baby registry",
            "Plan maternity leave details"
        ]
    },
    // Week 24
    {
        week: 24,
        babyDevelopment: [
            "Baby's face fully formed",
            "Skin still translucent",
            "Baby responds to sounds",
            "Lungs developing rapidly"
        ],
        babySize: "Corn on the cob",
        babyWeight: "600 grams",
        babyLength: "210mm",
        motherBodyChanges: [
            "Uterus significantly larger",
            "Stretch marks may appear",
            "Skin may be itchy",
            "Glucose screening test this week"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Back pain",
            "Braxton Hicks",
            "Swelling"
        ],
        nutritionalFocus: [
            "Balanced diet for glucose test",
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume"
        ],
        exerciseGuidance: [
            "45 minutes moderate exercise",
            "Swimming excellent",
            "Walking with support",
            "Prenatal yoga"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if active",
            "Limit caffeine",
            "Avoid sugary drinks before glucose test"
        ],
        medicalReminders: [
            "Glucose screening test (24-28 weeks)",
            "Regular prenatal visits",
            "Discuss birth plan",
            "Monitor blood pressure"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "High blood pressure"
        ],
        weeklyGuidance: [
            "Glucose screening test for gestational diabetes",
            "Baby's face is fully formed",
            "Start preparing baby's room",
            "Research pediatricians"
        ]
    },
    // Week 25
    {
        week: 25,
        babyDevelopment: [
            "Baby responds to light and sound",
            "Skin becoming less wrinkled",
            "Baby's hair growing",
            "Lungs developing"
        ],
        babySize: "Rutabaga",
        babyWeight: "660 grams",
        babyLength: "220mm",
        motherBodyChanges: [
            "Uterus size of soccer ball",
            "Weight gain steady",
            "Back pain common",
            "Shortness of breath"
        ],
        commonSymptoms: [
            "Active baby movements",
            "Back pain",
            "Braxton Hicks",
            "Swelling in hands/feet"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume",
            "Fiber for digestion"
        ],
        exerciseGuidance: [
            "45 minutes moderate exercise",
            "Swimming for relief",
            "Walking with good posture",
            "Prenatal yoga"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if swelling",
            "Limit caffeine",
            "Add fruit to water"
        ],
        medicalReminders: [
            "Regular prenatal visits",
            "Discuss birth plan",
            "Start childbirth classes",
            "Monitor blood pressure"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Severe headaches"
        ],
        weeklyGuidance: [
            "Baby responds to light and sound",
            "Start playing music for baby",
            "Finalize baby registry",
            "Prepare nursery"
        ]
    },
    // Week 26
    {
        week: 26,
        babyDevelopment: [
            "Baby's eyes open",
            "Baby responds to touch",
            "Lungs developing surfactant",
            "Brain growth continues"
        ],
        babySize: "Scallion",
        babyWeight: "760 grams",
        babyLength: "230mm",
        motherBodyChanges: [
            "Uterus continues growing",
            "Braxton Hicks increase",
            "Back pain significant",
            "Swelling common"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Back pain",
            "Braxton Hicks",
            "Swelling in ankles/feet"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume",
            "Omega-3 for brain"
        ],
        exerciseGuidance: [
            "45 minutes moderate exercise",
            "Swimming for relief",
            "Walking with support belt",
            "Prenatal yoga"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if swelling",
            "Limit caffeine",
            "Coconut water beneficial"
        ],
        medicalReminders: [
            "Regular prenatal visits",
            "Discuss birth plan",
            "Start childbirth classes",
            "Glucose test if not done"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Severe swelling"
        ],
        weeklyGuidance: [
            "Baby's eyes can open now",
            "Baby responds to your touch",
            "Start packing hospital bag",
            "Finalize birth plan"
        ]
    },
    // Week 27
    {
        week: 27,
        babyDevelopment: [
            "Baby's lungs maturing",
            "Baby has regular sleep cycles",
            "Brain very active",
            "Baby can dream"
        ],
        babySize: "Cauliflower",
        babyWeight: "875 grams",
        babyLength: "240mm",
        motherBodyChanges: [
            "Welcome to third trimester",
            "Uterus pushes on diaphragm",
            "Shortness of breath increases",
            "Fatigue returns"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Shortness of breath",
            "Back pain",
            "Swelling increases"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume",
            "Complex carbs for energy"
        ],
        exerciseGuidance: [
            "30-45 minutes moderate exercise",
            "Swimming excellent",
            "Walking with support",
            "Prenatal yoga"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if active",
            "Limit caffeine",
            "Avoid dehydration"
        ],
        medicalReminders: [
            "Third trimester begins",
            "Regular prenatal visits (every 2 weeks)",
            "Discuss birth plan",
            "Monitor blood pressure"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Severe headaches"
        ],
        weeklyGuidance: [
            "Welcome to the third trimester",
            "Baby has sleep cycles you can notice",
            "Start preparing for baby's arrival",
            "Finalize maternity leave plans"
        ]
    },
    // Week 28
    {
        week: 28,
        babyDevelopment: [
            "Baby can blink eyes",
            "Eyelashes present",
            "Baby can cough",
            "Lungs producing surfactant"
        ],
        babySize: "Eggplant",
        babyWeight: "1 kg",
        babyLength: "250mm",
        motherBodyChanges: [
            "Uterus significantly larger",
            "Braxton Hicks more frequent",
            "Back pain increases",
            "Difficulty sleeping"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Back pain",
            "Braxton Hicks",
            "Swelling in extremities"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume",
            "Fiber for constipation"
        ],
        exerciseGuidance: [
            "30-45 minutes moderate exercise",
            "Swimming for relief",
            "Walking with support belt",
            "Gentle stretching"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if swelling",
            "Limit caffeine",
            "Add lemon to water"
        ],
        medicalReminders: [
            "Regular prenatal visits (every 2 weeks)",
            "Rh immunoglobulin if Rh negative",
            "Discuss birth plan",
            "Monitor blood pressure"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Severe headaches"
        ],
        weeklyGuidance: [
            "Baby's eyes can blink now",
            "Start kick count monitoring",
            "Prepare nursery",
            "Finalize baby gear"
        ]
    },
    // Week 29
    {
        week: 29,
        babyDevelopment: [
            "Baby's brain growing rapidly",
            "Baby can regulate body temperature",
            "Muscles and lungs maturing",
            "Baby is very active"
        ],
        babySize: "Butternut squash",
        babyWeight: "1.1 kg",
        babyLength: "260mm",
        motherBodyChanges: [
            "Uterus continues growing",
            "Pressure on bladder increases",
            "Frequent urination",
            "Back pain significant"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Frequent urination",
            "Back pain",
            "Swelling"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume",
            "Magnesium for cramps"
        ],
        exerciseGuidance: [
            "30-45 minutes moderate exercise",
            "Swimming excellent",
            "Walking with support",
            "Prenatal yoga"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if cramping",
            "Limit caffeine",
            "Coconut water beneficial"
        ],
        medicalReminders: [
            "Regular prenatal visits",
            "Kick count monitoring",
            "Discuss birth plan",
            "Monitor blood pressure"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Decreased fetal movement"
        ],
        weeklyGuidance: [
            "Start daily kick counts",
            "Baby is very active now",
            "Prepare hospital bag",
            "Finalize birth preferences"
        ]
    },
    // Week 30
    {
        week: 30,
        babyDevelopment: [
            "Baby's brain has grooves and wrinkles",
            "Baby can store iron",
            "Lungs nearly mature",
            "Baby is gaining weight rapidly"
        ],
        babySize: "Cabbage",
        babyWeight: "1.3 kg",
        babyLength: "270mm",
        motherBodyChanges: [
            "Uterus pushes against ribs",
            "Shortness of breath worse",
            "Heartburn common",
            "Difficulty sleeping"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Shortness of breath",
            "Heartburn",
            "Back pain"
        ],
        nutritionalFocus: [
            "Small meals for heartburn",
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume"
        ],
        exerciseGuidance: [
            "30 minutes moderate exercise",
            "Swimming for relief",
            "Walking with good posture",
            "Gentle stretching"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Small sips for heartburn",
            "Limit caffeine",
            "Ginger tea for heartburn"
        ],
        medicalReminders: [
            "Regular prenatal visits",
            "Kick count monitoring",
            "Discuss birth plan",
            "Monitor for preeclampsia"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Severe headaches with vision changes"
        ],
        weeklyGuidance: [
            "Baby's brain is developing rapidly",
            "Kick counts are important now",
            "Start hospital bag preparation",
            "Plan for postpartum recovery"
        ]
    },
    // Week 31
    {
        week: 31,
        babyDevelopment: [
            "Baby can turn head side to side",
            "All five senses working",
            "Baby gaining weight quickly",
            "Lungs almost mature"
        ],
        babySize: "Coconut",
        babyWeight: "1.5 kg",
        babyLength: "280mm",
        motherBodyChanges: [
            "Uterus very large",
            "Braxton Hicks more frequent",
            "Back pain significant",
            "Pelvic pressure increases"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Pelvic pressure",
            "Back pain",
            "Swelling"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume",
            "Fiber for digestion"
        ],
        exerciseGuidance: [
            "30 minutes moderate exercise",
            "Swimming for relief",
            "Walking with support",
            "Gentle stretching"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if swelling",
            "Limit caffeine",
            "Add fruit to water"
        ],
        medicalReminders: [
            "Regular prenatal visits (every 2 weeks)",
            "Kick count monitoring",
            "Discuss birth plan",
            "Monitor blood pressure"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Severe headaches"
        ],
        weeklyGuidance: [
            "Baby's senses are fully functional",
            "Baby is gaining weight rapidly",
            "Finalize hospital bag",
            "Prepare for breastfeeding"
        ]
    },
    // Week 32
    {
        week: 32,
        babyDevelopment: [
            "Baby is practicing breathing",
            "Baby's skin becoming opaque",
            "Baby's nails reach fingertips",
            "Baby is gaining fat"
        ],
        babySize: "Squash",
        babyWeight: "1.7 kg",
        babyLength: "290mm",
        motherBodyChanges: [
            "Uterus pushes on stomach",
            "Heartburn severe",
            "Shortness of breath",
            "Pelvic pressure increases"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Pelvic pressure",
            "Heartburn",
            "Back pain"
        ],
        nutritionalFocus: [
            "Small frequent meals",
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume"
        ],
        exerciseGuidance: [
            "30 minutes moderate exercise",
            "Swimming excellent",
            "Walking with support",
            "Gentle stretching"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Small sips for heartburn",
            "Limit caffeine",
            "Ginger tea beneficial"
        ],
        medicalReminders: [
            "Regular prenatal visits",
            "Kick count monitoring",
            "Discuss birth plan",
            "Start weekly visits soon"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Decreased fetal movement"
        ],
        weeklyGuidance: [
            "Baby is practicing breathing movements",
            "Baby's skin is becoming opaque",
            "Start weekly prenatal visits soon",
            "Finalize birth plan"
        ]
    },
    // Week 33
    {
        week: 33,
        babyDevelopment: [
            "Baby's bones hardening",
            "Baby's immune system developing",
            "Baby is gaining weight rapidly",
            "Baby's head may engage"
        ],
        babySize: "Pineapple",
        babyWeight: "1.9 kg",
        babyLength: "300mm",
        motherBodyChanges: [
            "Uterus at maximum size",
            "Breathing may improve if baby drops",
            "Pelvic pressure increases",
            "Frequent urination"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Pelvic pressure",
            "Frequent urination",
            "Back pain"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume",
            "Fiber for digestion"
        ],
        exerciseGuidance: [
            "30 minutes moderate exercise",
            "Swimming for relief",
            "Walking with support",
            "Gentle stretching"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if active",
            "Limit caffeine",
            "Add lemon to water"
        ],
        medicalReminders: [
            "Regular prenatal visits",
            "Kick count monitoring",
            "Discuss birth plan",
            "Start weekly visits"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Severe headaches"
        ],
        weeklyGuidance: [
            "Baby's bones are hardening",
            "Baby may start dropping into pelvis",
            "Start weekly prenatal visits",
            "Finalize hospital bag"
        ]
    },
    // Week 34
    {
        week: 34,
        babyDevelopment: [
            "Baby's nervous system maturing",
            "Baby's lungs nearly mature",
            "Baby's fat layers increasing",
            "Baby's head may engage"
        ],
        babySize: "Cantaloupe",
        babyWeight: "2.1 kg",
        babyLength: "310mm",
        motherBodyChanges: [
            "Baby may drop into pelvis",
            "Breathing may improve",
            "Pelvic pressure increases",
            "Braxton Hicks more frequent"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Pelvic pressure",
            "Braxton Hicks",
            "Frequent urination"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume",
            "Complex carbs for energy"
        ],
        exerciseGuidance: [
            "30 minutes moderate exercise",
            "Swimming excellent",
            "Walking with support",
            "Gentle stretching"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if active",
            "Limit caffeine",
            "Coconut water beneficial"
        ],
        medicalReminders: [
            "Weekly prenatal visits begin",
            "Kick count monitoring",
            "Group B Strep test (35-37 weeks)",
            "Discuss birth plan"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Decreased fetal movement"
        ],
        weeklyGuidance: [
            "Weekly prenatal visits begin",
            "Baby may drop (lightening)",
            "Have hospital bag ready",
            "Know signs of labor"
        ]
    },
    // Week 35
    {
        week: 35,
        babyDevelopment: [
            "Baby's kidneys fully developed",
            "Baby's liver can process waste",
            "Baby's nervous system mature",
            "Baby is gaining weight rapidly"
        ],
        babySize: "Honeydew melon",
        babyWeight: "2.4 kg",
        babyLength: "320mm",
        motherBodyChanges: [
            "Baby likely engaged in pelvis",
            "Breathing improves",
            "Pelvic pressure significant",
            "Cervix may begin softening"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Pelvic pressure",
            "Braxton Hicks",
            "Frequent urination"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume",
            "Fiber for digestion"
        ],
        exerciseGuidance: [
            "30 minutes moderate exercise",
            "Swimming for relief",
            "Walking with support",
            "Gentle stretching"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if active",
            "Limit caffeine",
            "Add fruit to water"
        ],
        medicalReminders: [
            "Weekly prenatal visits",
            "Kick count monitoring",
            "Group B Strep test",
            "Discuss birth plan"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Decreased fetal movement"
        ],
        weeklyGuidance: [
            "Baby's organs are nearly mature",
            "Group B Strep test this week",
            "Finalize birth plan",
            "Prepare for labor"
        ]
    },
    // Week 36
    {
        week: 36,
        babyDevelopment: [
            "Baby considered 'early term'",
            "Baby's fat layers increasing",
            "Baby's lungs mature",
            "Baby's head likely engaged"
        ],
        babySize: "Papaya",
        babyWeight: "2.6 kg",
        babyLength: "330mm",
        motherBodyChanges: [
            "Baby likely engaged",
            "Cervix begins effacing",
            "Braxton Hicks more frequent",
            "Pelvic pressure significant"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Pelvic pressure",
            "Braxton Hicks",
            "Nesting instinct may kick in"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume",
            "Complex carbs for labor energy"
        ],
        exerciseGuidance: [
            "30 minutes moderate exercise",
            "Walking excellent for labor prep",
            "Swimming for relief",
            "Gentle stretching"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if active",
            "Limit caffeine",
            "Coconut water beneficial"
        ],
        medicalReminders: [
            "Weekly prenatal visits",
            "Kick count monitoring",
            "Discuss labor signs",
            "Hospital bag ready"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Decreased fetal movement"
        ],
        weeklyGuidance: [
            "Baby is considered early term",
            "Labor could start anytime",
            "Know the signs of labor",
            "Rest and prepare"
        ]
    },
    // Week 37
    {
        week: 37,
        babyDevelopment: [
            "Baby considered full term",
            "Baby's lungs fully mature",
            "Baby's grasp firm",
            "Baby is gaining weight"
        ],
        babySize: "Winter melon",
        babyWeight: "2.9 kg",
        babyLength: "340mm",
        motherBodyChanges: [
            "Cervix continues effacing",
            "Baby may drop further",
            "Braxton Hicks more intense",
            "Nesting instinct strong"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Pelvic pressure",
            "Braxton Hicks",
            "Nesting instinct"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume",
            "Complex carbs for labor energy"
        ],
        exerciseGuidance: [
            "30 minutes moderate exercise",
            "Walking excellent for labor prep",
            "Swimming for relief",
            "Gentle stretching"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if active",
            "Limit caffeine",
            "Add fruit to water"
        ],
        medicalReminders: [
            "Weekly prenatal visits",
            "Kick count monitoring",
            "Discuss labor signs",
            "Hospital bag ready"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Decreased fetal movement"
        ],
        weeklyGuidance: [
            "Baby is full term - could arrive anytime",
            "Know the difference between Braxton Hicks and labor",
            "Rest when possible",
            "Stay in touch with healthcare provider"
        ]
    },
    // Week 38
    {
        week: 38,
        babyDevelopment: [
            "Baby's brain and lungs fully mature",
            "Baby's nervous system ready",
            "Baby's lanugo disappearing",
            "Baby is gaining weight"
        ],
        babySize: "Pumpkin",
        babyWeight: "3.1 kg",
        babyLength: "350mm",
        motherBodyChanges: [
            "Cervix may begin dilating",
            "Baby's head deeply engaged",
            "Braxton Hicks more frequent",
            "Nesting instinct strong"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Pelvic pressure",
            "Braxton Hicks",
            "Nesting instinct"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume",
            "Complex carbs for labor energy"
        ],
        exerciseGuidance: [
            "30 minutes moderate exercise",
            "Walking excellent for labor prep",
            "Swimming for relief",
            "Gentle stretching"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if active",
            "Limit caffeine",
            "Coconut water beneficial"
        ],
        medicalReminders: [
            "Weekly prenatal visits",
            "Kick count monitoring",
            "Discuss labor signs",
            "Hospital bag ready"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Decreased fetal movement"
        ],
        weeklyGuidance: [
            "Baby is fully mature and ready",
            "Labor could start any day",
            "Stay active with walking",
            "Rest and prepare mentally"
        ]
    },
    // Week 39
    {
        week: 39,
        babyDevelopment: [
            "Baby's chest is prominent",
            "Baby's lungs fully mature",
            "Baby's nervous system ready",
            "Baby is gaining final weight"
        ],
        babySize: "Watermelon",
        babyWeight: "3.3 kg",
        babyLength: "360mm",
        motherBodyChanges: [
            "Cervix may be dilating",
            "Baby's head deeply engaged",
            "Braxton Hicks more intense",
            "Nesting instinct strong"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Pelvic pressure",
            "Braxton Hicks",
            "Nesting instinct"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume",
            "Complex carbs for labor energy"
        ],
        exerciseGuidance: [
            "30 minutes moderate exercise",
            "Walking excellent for labor prep",
            "Swimming for relief",
            "Gentle stretching"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if active",
            "Limit caffeine",
            "Add fruit to water"
        ],
        medicalReminders: [
            "Weekly prenatal visits",
            "Kick count monitoring",
            "Discuss labor signs",
            "Hospital bag ready"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Decreased fetal movement"
        ],
        weeklyGuidance: [
            "Baby is fully ready for birth",
            "Labor could start any day",
            "Stay calm and rested",
            "Know when to go to hospital"
        ]
    },
    // Week 40
    {
        week: 40,
        babyDevelopment: [
            "Baby is fully mature",
            "Baby's lungs fully developed",
            "Baby's nervous system ready",
            "Baby is ready for birth"
        ],
        babySize: "Small pumpkin",
        babyWeight: "3.4 kg",
        babyLength: "370mm",
        motherBodyChanges: [
            "Cervix may be dilating",
            "Baby's head deeply engaged",
            "Braxton Hicks may be intense",
            "Nesting instinct strong"
        ],
        commonSymptoms: [
            "Strong baby movements",
            "Pelvic pressure",
            "Braxton Hicks",
            "Nesting instinct"
        ],
        nutritionalFocus: [
            "Protein for baby's growth",
            "Calcium for bones",
            "Iron for blood volume",
            "Complex carbs for labor energy"
        ],
        exerciseGuidance: [
            "30 minutes moderate exercise",
            "Walking excellent for labor prep",
            "Swimming for relief",
            "Gentle stretching"
        ],
        hydrationGuidance: [
            "10 glasses water",
            "Electrolytes if active",
            "Limit caffeine",
            "Coconut water beneficial"
        ],
        medicalReminders: [
            "Weekly prenatal visits",
            "Kick count monitoring",
            "Discuss labor signs",
            "Hospital bag ready"
        ],
        warningSigns: [
            "Vaginal bleeding",
            "Severe abdominal pain",
            "Fever",
            "Decreased fetal movement"
        ],
        weeklyGuidance: [
            "Your due date is here",
            "Baby is fully ready for birth",
            "Labor could start any day",
            "Stay calm and rested"
        ]
    }
];

// ─── Helper Functions ───

/**
 * Get knowledge data for a specific week (1–40).
 * Returns null if week is out of range.
 */
export function getWeekKnowledge(week: number): WeekKnowledge | null {
    if (week < 1 || week > 40) return null;
    return pregnancyKnowledgeBase[week - 1] ?? null;
}

/**
 * Personalize week knowledge based on the mother's profile factors.
 * Returns a modified copy of the week knowledge with condition-specific
 * additions filtered in or highlighted.
 */
export function personalizeWeekKnowledge(
    week: number,
    factors: PersonalizationFactors,
): WeekKnowledge | null {
    const base = getWeekKnowledge(week);
    if (!base) return null;

    const personalized: WeekKnowledge = { ...base };

    // ─── Medical condition overlays ───

    const extraNutrition: string[] = [];
    const extraWarning: string[] = [];
    const extraExercise: string[] = [];
    const extraMedical: string[] = [];
    const extraHydration: string[] = [];

    if (factors.medicalConditions?.anemia) {
        extraNutrition.push(
            'Increase iron-rich foods: lean red meat, spinach, lentils, jaggery',
            'Take iron supplement with vitamin C for better absorption',
            'Avoid tea/coffee within 1 hour of iron-rich meals',
        );
        extraWarning.push('Watch for extreme fatigue, pale skin, or shortness of breath — signs of worsening anemia');
    }

    if (factors.medicalConditions?.diabetes || factors.medicalConditions?.highRiskPregnancy) {
        extraNutrition.push(
            'Monitor blood sugar levels regularly',
            'Choose complex carbohydrates over simple sugars',
            'Eat small, frequent meals to maintain stable glucose',
            'Limit refined carbs and sugary snacks',
        );
        extraMedical.push('Schedule regular glucose monitoring checks');
        extraWarning.push('Watch for excessive thirst, frequent urination, or blurred vision');
    }

    if (factors.medicalConditions?.hypertension || factors.medicalConditions?.highBP) {
        extraNutrition.push(
            'Reduce sodium intake — avoid processed and salty foods',
            'Include potassium-rich foods: bananas, sweet potatoes, spinach',
            'Limit pickles, papad, and salty snacks',
        );
        extraExercise.push('Avoid strenuous exercise — stick to gentle walking and stretching');
        extraMedical.push('Monitor blood pressure daily and report any spikes');
        extraWarning.push('Watch for severe headaches, vision changes, or sudden swelling — signs of preeclampsia');
    }

    if (factors.medicalConditions?.lowBP) {
        extraNutrition.push(
            'Stay well-hydrated to help maintain blood pressure',
            'Eat small, frequent meals to prevent dizziness',
            'Include adequate salt in diet (unless contraindicated)',
        );
        extraHydration.push('Increase fluid intake to help stabilize blood pressure');
        extraWarning.push('Watch for dizziness when standing up quickly — rise slowly');
    }

    if (factors.medicalConditions?.thyroidDisorder) {
        extraNutrition.push(
            'Take thyroid medication as prescribed — do not skip',
            'Avoid excessive soy products which may interfere with thyroid medication',
            'Include iodine-rich foods if advised by your doctor',
        );
        extraMedical.push('Get thyroid levels checked as recommended by your doctor');
    }

    if (factors.medicalConditions?.pcos) {
        extraNutrition.push(
            'Focus on anti-inflammatory foods: turmeric, berries, leafy greens',
            'Maintain balanced blood sugar with complex carbs and protein',
        );
    }

    if (factors.medicalConditions?.asthma) {
        extraExercise.push('Avoid exercise in cold or dusty environments');
        extraMedical.push('Keep asthma medication accessible at all times');
        extraWarning.push('Watch for wheezing, chest tightness, or difficulty breathing');
    }

    if (factors.medicalConditions?.heartDisease) {
        extraExercise.push('Only exercise as explicitly approved by your cardiologist');
        extraMedical.push('Coordinate care between cardiologist and obstetrician');
        extraWarning.push('Watch for chest pain, palpitations, or unusual shortness of breath');
    }

    if (factors.medicalConditions?.kidneyIssues) {
        extraNutrition.push('Monitor protein intake as advised by your doctor');
        extraHydration.push('Follow specific fluid intake guidelines from your doctor');
        extraMedical.push('Regular kidney function tests as scheduled');
    }

    if (factors.medicalConditions?.epilepsy) {
        extraMedical.push('Continue anti-epileptic medication as prescribed — do not stop');
        extraWarning.push('Report any seizure activity immediately to your doctor');
    }

    // ─── BMI overlays ───

    if (factors.bmi !== undefined) {
        if (factors.bmi < 18.5) {
            extraNutrition.push(
                'Focus on nutrient-dense, calorie-rich healthy foods',
                'Include healthy fats: nuts, avocado, ghee in moderation',
                'Aim for gradual, healthy weight gain as recommended',
            );
        } else if (factors.bmi >= 30) {
            extraNutrition.push(
                'Focus on nutrient quality over quantity',
                'Choose whole foods over processed options',
                'Discuss appropriate weight gain targets with your doctor',
            );
            extraMedical.push('Monitor for gestational diabetes risk');
        }
    }

    // ─── Diet preference overlays ───

    if (factors.diet === 'veg') {
        extraNutrition.push(
            'Ensure adequate protein: dal, paneer, tofu, soy, chickpeas',
            'Include plant-based iron: spinach, lentils, jaggery, sesame seeds',
            'Consider B12 supplementation as advised by your doctor',
            'Combine iron foods with vitamin C sources for better absorption',
        );
    }

    // ─── Allergy overlays ───

    if (factors.allergies && factors.allergies.length > 0) {
        extraNutrition.push(
            `Avoid allergens: ${factors.allergies.join(', ')}`,
            'Read food labels carefully for hidden allergens',
            'Discuss safe alternatives with your nutritionist',
        );
    }

    // ─── Mood overlays ───

    if (factors.mood !== undefined && factors.mood <= 2) {
        extraExercise.push('Even a short 10-minute walk can help lift your mood');
        extraMedical.push('Consider speaking with a counselor or your doctor about your feelings');
    }

    // ─── Merge overlays ───

    if (extraNutrition.length > 0) {
        personalized.nutritionalFocus = [...extraNutrition, ...base.nutritionalFocus];
    }
    if (extraWarning.length > 0) {
        personalized.warningSigns = [...extraWarning, ...base.warningSigns];
    }
    if (extraExercise.length > 0) {
        personalized.exerciseGuidance = [...extraExercise, ...base.exerciseGuidance];
    }
    if (extraMedical.length > 0) {
        personalized.medicalReminders = [...extraMedical, ...base.medicalReminders];
    }
    if (extraHydration.length > 0) {
        personalized.hydrationGuidance = [...extraHydration, ...base.hydrationGuidance];
    }

    return personalized;
}

/**
 * Format week knowledge into the shape expected by the Weekly Journey page.
 * This converts the knowledge database format into the WeekContent-like
 * structure used by the frontend, suitable as a fallback when the API
 * returns no database content.
 */
export function formatWeekKnowledgeForJourney(week: number): {
    weekNumber: number;
    title: string;
    summary: string;
    bodyMarkdown: string;
    dietNotes: string;
    activityNotes: string;
    warningSigns: string;
    babySize: string;
    babyWeight: string;
    babyLength: string;
    babyDevelopment: string[];
    motherBodyChanges: string[];
    commonSymptoms: string[];
    hydrationGuidance: string[];
    medicalReminders: string[];
    weeklyGuidance: string[];
} | null {
    const knowledge = getWeekKnowledge(week);
    if (!knowledge) return null;

    const bulletSection = (heading: string, items: string[]) =>
        `## ${heading}\n${items.map(i => `- ${i}`).join('\n')}`;

    const bodyMarkdown = [
        bulletSection('Baby Development', knowledge.babyDevelopment),
        bulletSection('Mother Body Changes', knowledge.motherBodyChanges),
        bulletSection('Common Symptoms', knowledge.commonSymptoms),
        bulletSection('Weekly Guidance', knowledge.weeklyGuidance),
        bulletSection('Hydration Guidance', knowledge.hydrationGuidance),
        bulletSection('Medical Reminders', knowledge.medicalReminders),
        `Baby Size: ${knowledge.babySize}`,
        `Baby Weight: ${knowledge.babyWeight}`,
        `Baby Length: ${knowledge.babyLength}`,
    ].join('\n\n');

    return {
        weekNumber: knowledge.week,
        title: `Week ${knowledge.week} — ${knowledge.babySize}`,
        summary: knowledge.weeklyGuidance.join(' · '),
        bodyMarkdown,
        dietNotes: knowledge.nutritionalFocus.map(i => `- ${i}`).join('\n'),
        activityNotes: knowledge.exerciseGuidance.map(i => `- ${i}`).join('\n'),
        warningSigns: knowledge.warningSigns.map(i => `- ${i}`).join('\n'),
        babySize: knowledge.babySize,
        babyWeight: knowledge.babyWeight,
        babyLength: knowledge.babyLength,
        babyDevelopment: knowledge.babyDevelopment,
        motherBodyChanges: knowledge.motherBodyChanges,
        commonSymptoms: knowledge.commonSymptoms,
        hydrationGuidance: knowledge.hydrationGuidance,
        medicalReminders: knowledge.medicalReminders,
        weeklyGuidance: knowledge.weeklyGuidance,
    };
}

/**
 * Format week-specific knowledge for chatbot responses.
 * Returns a concise markdown string for a given topic about a specific week.
 */
export function formatWeekKnowledgeForChat(
    week: number,
    topic: 'nutrition' | 'exercise' | 'symptoms' | 'warning_signs' | 'baby_development' | 'mother_changes' | 'hydration' | 'medical' | 'overview',
): string | null {
    const knowledge = getWeekKnowledge(week);
    if (!knowledge) return null;

    switch (topic) {
        case 'nutrition':
            return `**Nutrition focus for Week ${week}:**\n\n${knowledge.nutritionalFocus.map(i => `• ${i}`).join('\n')}`;
        case 'exercise':
            return `**Exercise guidance for Week ${week}:**\n\n${knowledge.exerciseGuidance.map(i => `• ${i}`).join('\n')}`;
        case 'symptoms':
            return `**Common symptoms at Week ${week}:**\n\n${knowledge.commonSymptoms.map(i => `• ${i}`).join('\n')}\n\n${knowledge.motherBodyChanges.map(i => `• ${i}`).join('\n')}`;
        case 'warning_signs':
            return `**⚠️ Warning signs to watch for at Week ${week}:**\n\n${knowledge.warningSigns.map(i => `• ${i}`).join('\n')}\n\nIf you experience any of these, contact your healthcare provider immediately.`;
        case 'baby_development':
            return `**Baby development at Week ${week} (${knowledge.babySize}):**\n\n${knowledge.babyDevelopment.map(i => `• ${i}`).join('\n')}\n\n**Size:** ${knowledge.babySize} · **Weight:** ${knowledge.babyWeight} · **Length:** ${knowledge.babyLength}`;
        case 'mother_changes':
            return `**Your body at Week ${week}:**\n\n${knowledge.motherBodyChanges.map(i => `• ${i}`).join('\n')}`;
        case 'hydration':
            return `**Hydration guidance for Week ${week}:**\n\n${knowledge.hydrationGuidance.map(i => `• ${i}`).join('\n')}`;
        case 'medical':
            return `**Medical reminders for Week ${week}:**\n\n${knowledge.medicalReminders.map(i => `• ${i}`).join('\n')}`;
        case 'overview':
            return `**Week ${week} Overview (${knowledge.babySize}):**\n\n${knowledge.weeklyGuidance.map(i => `• ${i}`).join('\n')}\n\n**Baby:** ${knowledge.babySize}, ${knowledge.babyWeight}, ${knowledge.babyLength}\n\n**Key symptoms:** ${knowledge.commonSymptoms.slice(0, 3).join(', ')}\n\n**Nutrition focus:** ${knowledge.nutritionalFocus[0] || 'Balanced diet'}\n\n**Exercise:** ${knowledge.exerciseGuidance[0] || 'Moderate activity'}`;
        default:
            return null;
    }
}