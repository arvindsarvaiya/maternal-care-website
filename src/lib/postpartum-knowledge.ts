// Postpartum Knowledge Database — Week 1-52
// Each week contains detailed guidance for all categories.
// Data is verified against Indian (MOHFW, IAP, FOGSI, ICMR, NIN) and
// international (WHO, ACOG, AAP, CDC, NICE) sources.
//
// ─── SOURCE ABBREVIATIONS ───
// See src/lib/source-abbreviations.ts for the full user-facing reference
// with bilingual (English + Hindi) descriptions of all cited organizations.
// Use formatSourceLegend('en') or formatSourceLegend('hi') to generate
// the legend for display in the UI.

import { formatSourceLegend, getSourceAbbreviations } from './source-abbreviations';
import type { PersonalizationFactors } from './pregnancy-knowledge';

import { getRecoveryPhase, getRecoveryPhaseLabel } from './postpartum-calculator';

export interface PostpartumWeekKnowledge {
    week: number;
    recoveryPhase: 'immediate' | 'early' | 'late' | 'extended';
    phaseLabel: string;
    title: string;
    summary: string;
    // Mother recovery & body changes
    recoveryNotes: string[];
    bodyChanges: string[];
    // Baby care & development
    babyCareNotes: string[];
    babyDevelopment: string[];
    // Mental health
    mentalHealthNotes: string[];
    // Activity & exercise
    activityNotes: string[];
    // Nutrition
    nutritionalFocus: string[];
    // Warning signs
    warningSigns: string[];
    // Weekly guidance highlights (for dashboards)
    weeklyGuidance: string[];
}

export const postpartumKnowledgeBase: PostpartumWeekKnowledge[] = [
    // ═══════════════════════════════════════════════
    // IMMEDIATE RECOVERY PHASE — Week 1-2
    // ═══════════════════════════════════════════════
    {
        week: 1,
        recoveryPhase: 'immediate',
        phaseLabel: 'Immediate Postpartum',
        title: 'Welcome to Postpartum: The First Week',
        summary: 'Your body begins its remarkable healing journey. Focus on rest, bonding with your baby, and accepting help from family.',
        recoveryNotes: [
            'Lochia: Heavy red bleeding days 1-4, then pinkish. Change pads every 2-4 hours (ACOG, WHO).',
            'Perineal care: Use peri bottle with warm water, sitz baths 2-3 times daily for 10-15 minutes (ACOG, NICE).',
            'C-section: Keep incision clean and dry, avoid lifting anything heavier than baby (ACOG, MOHFW).',
            'Take prescribed pain medication as needed — ibuprofen is generally safe during breastfeeding (AAP, WHO).',
            'Start gentle Kegel exercises only if comfortable — 5-10 reps, 3-5 second holds (ACOG, NICE).',
        ],
        bodyChanges: [
            'Lochia (postpartum bleeding) — heavy red flow for 3-4 days, then lightens (ACOG, WHO).',
            'Uterine contractions (afterpains) — more noticeable during breastfeeding due to oxytocin (ACOG).',
            'Perineal soreness — swelling, bruising, or stitches from vaginal delivery (ACOG, NICE).',
            'Breast changes — colostrum (liquid gold) days 1-3, mature milk comes in around day 3-5 (WHO, AAP).',
        ],
        babyCareNotes: [
            'Feed every 2-3 hours (8-12 times/day). Watch for hunger cues: rooting, hand to mouth (WHO, AAP).',
            'Skin-to-skin (Kangaroo Mother Care) — endorsed by WHO and MOHFW India for all newborns.',
            '6+ wet diapers per day indicates good milk intake (WHO, AAP, IAP).',
            'Newborns sleep 16-17 hours daily in 2-4 hour stretches (AAP, CDC).',
            'Umbilical cord: Keep clean and dry. Do NOT apply traditional substances (haldi, ash) per IAP, WHO.',
        ],
        babyDevelopment: [
            'Baby recognizes your voice and smell from birth (AAP, CDC).',
            'Colostrum provides essential antibodies for immune protection (WHO, UNICEF).',
            'Reflexes present: rooting, sucking, grasping, Moro (startle) (AAP, CDC).',
            'Vision is blurry — can focus best at 8-12 inches (your face during feeding) (AAP).',
        ],
        mentalHealthNotes: [
            'Baby blues affect 50-80% of new mothers (ACOG) — mild mood swings, crying, anxiety.',
            'These feelings should improve by week 2. Talk openly with family about your feelings (NICE, WHO).',
            'Postpartum depression affects 1 in 7 mothers globally (WHO) and 10-20% of Indian mothers (ICMR).',
            'It is NOT a sign of weakness — it is a medical condition that needs treatment (WHO, ACOG, NICE).',
        ],
        activityNotes: [
            'REST is your primary activity this week. Your body needs time to heal (WHO, ACOG, MOHFW).',
            'Gentle walking around the house only — to the bathroom and back (ACOG, NICE).',
            'No heavy lifting (nothing heavier than your baby) (ACOG).',
            'No driving until cleared by your doctor (1-2 weeks vaginal, 2-4 weeks C-section per ACOG).',
            'WHO recommends avoiding strenuous activity during the first 6 weeks postpartum.',
        ],
        nutritionalFocus: [
            'Stay hydrated — drink plenty of water, especially if breastfeeding (WHO, NIN).',
            'Eat nutritious meals: moong dal khichdi, ajwain water, methi ladoos (traditional Indian, NIN).',
            'Ghee, dry fruits, panjiri, and gond ke laddoo support healing and lactation (NIN, ICMR).',
            'NIN India recommends 600 additional calories and increased protein for breastfeeding mothers.',
        ],
        warningSigns: [
            'Soaking through a pad in less than an hour (postpartum hemorrhage — MOHFW, WHO, ACOG).',
            'Fever above 100.4°F (38°C) — may indicate puerperal sepsis (WHO, MOHFW).',
            'Severe headache not relieved by medication — may indicate preeclampsia (ACOG, WHO).',
            'Chest pain or difficulty breathing — possible pulmonary embolism (ACOG, CDC).',
            'Foul-smelling lochia or incision that is red, warm, draining pus (WHO, MOHFW).',
            'Thoughts of harming yourself or your baby (ACOG, NICE, WHO).',
        ],
        weeklyGuidance: [
            'Rest as much as possible — sleep when your baby sleeps (WHO, ACOG).',
            'Accept help from family with meals, chores, and errands (MOHFW, NICE).',
            'Practice skin-to-skin contact (Kangaroo Mother Care) daily (WHO, MOHFW).',
            'Feed on demand to establish milk supply (WHO, AAP, IAP).',
            'Attend postnatal checkup within 48 hours of discharge (MOHFW, WHO).',
        ],
    },
    {
        week: 2,
        recoveryPhase: 'immediate',
        phaseLabel: 'Immediate Postpartum',
        title: 'Week 2: Settling Into Recovery',
        summary: 'Your body continues healing. Lochia lightens, and you may start feeling more like yourself — but rest remains essential.',
        recoveryNotes: [
            'Lochia: Should be pinkish-brown, not bright red. Increased flow with activity signals need for rest (ACOG, WHO).',
            'Perineal care: Continue sitz baths 2-3 times daily. Stitches begin dissolving — some itching is normal (ACOG, NICE).',
            'C-section: Incision should be healing. Continue wearing loose, comfortable clothing (ACOG, MOHFW).',
            'Breastfeeding: Engorgement may occur — warm compresses before feeding, cold after (WHO, AAP).',
            'Begin gentle postnatal deep breathing (pranayama) in a comfortable seated position (NICE, MOHFW).',
        ],
        bodyChanges: [
            'Lochia transitions from red to pinkish-brown (ACOG, WHO).',
            'Perineal swelling decreases. Stitches (if any) begin dissolving (ACOG, NICE).',
            'Breast milk supply is establishing — engorgement may occur between feedings (WHO, AAP).',
            'Uterus continues shrinking — may be palpable just above the pubic bone (ACOG).',
        ],
        babyCareNotes: [
            'Feed 8-12 times per day. Crying is a late sign of hunger (WHO, AAP, IAP).',
            'By day 7-10, baby should take 60-90 ml per feed (IAP guidelines, WHO).',
            '6-8+ wet diapers per day. 3-4+ bowel movements for breastfed newborns (WHO, AAP).',
            'Baby should regain birth weight by 10-14 days. Up to 7% weight loss in first week is normal (AAP, IAP, WHO).',
            'Umbilical cord may fall off this week. Keep clean and dry — no traditional substances (IAP, WHO).',
            'Jaundice: If skin/eyes appear yellow, contact pediatrician. Peaks day 3-5, resolves by day 10-14 (AAP, IAP, WHO).',
        ],
        babyDevelopment: [
            'Baby can distinguish your face from others (AAP, CDC).',
            'Begins to track objects briefly with eyes (CDC, AAP).',
            'Startle (Moro) reflex still strong (AAP, CDC).',
            'Crying is the main form of communication — different cries for different needs (AAP, WHO).',
        ],
        mentalHealthNotes: [
            'Baby blues should be improving by end of week 2. If worsening, talk to your doctor (ACOG, NICE).',
            'Postpartum blues lasting beyond 2 weeks may indicate PPD — seek help early (WHO, NICE, ACOG).',
            'Accept emotional support from family. In Indian families, mother/mother-in-law are key support (MOHFW, ICMR).',
            'Crying is normal — hormonal shifts are significant. Be kind to yourself (NICE, WHO).',
        ],
        activityNotes: [
            'Begin short, gentle walks around the house or neighborhood (5-10 minutes) (ACOG, NICE).',
            'Continue to avoid heavy lifting, stairs when possible (ACOG, WHO).',
            'No driving until cleared by your doctor (ACOG).',
            'Light stretching and deep breathing exercises are safe (NICE, WHO).',
            'Listen to your body — if bleeding increases, you are doing too much (ACOG, WHO).',
        ],
        nutritionalFocus: [
            'Methi (fenugreek) ladoos — rich in iron, calcium, and galactagogues for milk production (NIN, ICMR).',
            'Gond (edible gum) ladoos — provide energy, calcium, support joint recovery (NIN, ICMR).',
            'Panjiri — wheat flour, ghee, nuts, seeds for energy, protein, and healthy fats (NIN).',
            'Moong dal khichdi — easy to digest, high in protein (NIN, ICMR).',
            'Ajwain (carom seeds) water — helps digestion, relieves gas, may support uterine contraction (NIN, ICMR).',
            'Haldi doodh (turmeric milk) — anti-inflammatory curcumin aids healing (NIN, ICMR).',
        ],
        warningSigns: [
            'Bright red, heavy bleeding returning after it had lightened (hemorrhage) (WHO, ACOG, MOHFW).',
            'Fever, chills, or foul-smelling lochia (infection) (WHO, MOHFW).',
            'Severe pain not relieved by medication (ACOG, NICE).',
            'Red, warm, tender area on breast with fever (mastitis) (WHO, AAP, ACOG).',
            'Incision that becomes red, warm, draining pus, or separating (WHO, ACOG, MOHFW).',
            'Persistent sadness, hopelessness, or inability to care for self/baby (ACOG, NICE, WHO).',
        ],
        weeklyGuidance: [
            'Continue prioritizing rest — your body is still healing internally (WHO, ACOG).',
            'Accept help with household tasks without guilt (MOHFW, NICE).',
            'Stay on top of pain management — do not wait until pain is severe (ACOG, NICE).',
            'Keep taking prenatal vitamins or switch to postnatal vitamins (WHO, NIN).',
            'Postnatal visit at day 7 as per MOHFW guidelines (MOHFW, WHO).',
        ],
    },

    // ═══════════════════════════════════════════════
    // EARLY RECOVERY PHASE — Week 3-6
    // ═══════════════════════════════════════════════
    {
        week: 3,
        recoveryPhase: 'early',
        phaseLabel: 'Early Recovery',
        title: 'Week 3: Finding Your Rhythm',
        summary: 'You are starting to settle into a routine with your baby. Lochia continues to lighten, and you may feel ready for slightly more activity.',
        recoveryNotes: [
            'Lochia: Should be transitioning to yellowish-white or light brown. Some women stop bleeding by week 3 (ACOG, WHO).',
            'Perineal healing: Most stitches have dissolved. Continue perineal hygiene (ACOG, NICE).',
            'C-section: Incision site may feel numb or itchy — nerve regeneration is happening (ACOG, NICE).',
            'Breastfeeding: Supply is regulating. Breasts may feel softer between feeds — this is normal, not low supply (WHO, AAP, IAP).',
            'Continue gentle Kegel exercises: 10-15 reps, 2-3 times daily (ACOG, NICE).',
        ],
        bodyChanges: [
            'Lochia transitions to yellowish-white (lochia alba) — may continue for several weeks (ACOG, WHO).',
            'Uterus is nearly back to pre-pregnancy size by week 3 (ACOG).',
            'Breast milk supply regulates — breasts feel softer, which is normal (WHO, AAP).',
            'Hair loss (postpartum shedding) may begin around week 3-4 due to hormonal shifts (ACOG, AAD).',
            'Abdominal muscles feel weak — diastasis recti may be present (ACOG, NICE).',
        ],
        babyCareNotes: [
            'Feeding: Baby may be cluster feeding during growth spurts (around 3 weeks) (WHO, AAP, IAP).',
            'Wake windows increase — baby may be more alert for short periods (AAP, CDC).',
            'Begin tummy time: 2-3 sessions daily, 1-2 minutes each, always supervised (AAP, CDC, WHO).',
            'Baby may start showing social smiles towards end of week 3 (AAP, CDC).',
            'Continue Kangaroo Mother Care — at least 1 hour daily (WHO, MOHFW).',
        ],
        babyDevelopment: [
            'Baby may start lifting head briefly during tummy time (AAP, CDC).',
            'Social smiles may begin — not just gas, but real social interaction (AAP, CDC).',
            'Baby can follow objects with eyes more smoothly (AAP, CDC).',
            'Cooing and gurgling sounds begin (CDC, AAP).',
        ],
        mentalHealthNotes: [
            'If baby blues persist beyond 2 weeks, speak with your doctor — this is the key differentiator from PPD (ACOG, NICE, WHO).',
            'Sleep deprivation is a major trigger for PPD. Accept help for night feeds (WHO, NICE).',
            'Edinburgh Postnatal Depression Scale (EPDS) is recommended for screening at 4-6 weeks (NICE, ACOG, FOGSI).',
            'Stay connected with other new mothers — peer support is protective against PPD (WHO, NICE).',
        ],
        activityNotes: [
            'Increase walking to 10-15 minutes, 1-2 times daily (ACOG, NICE).',
            'Continue pelvic floor exercises (Kegels) — 10-15 reps, 2-3 times daily (ACOG, NICE).',
            'Gentle postpartum yoga: cat-cow stretch, pelvic tilts (ACOG, NICE).',
            'No abdominal crunches or planks — diastasis recti must be assessed first (ACOG, NICE).',
            'Avoid lifting anything heavier than your baby in a car seat (ACOG, WHO).',
        ],
        nutritionalFocus: [
            'Continue galactagogue-rich foods: methi, saunf (fennel), jeera (cumin) (NIN, ICMR).',
            'Iron-rich foods: spinach, beetroot, jaggery, dates — replenish blood loss (NIN, WHO, ICMR).',
            'Calcium-rich foods: milk, yogurt, ragi, sesame seeds — support bone health during breastfeeding (NIN, ICMR).',
            'Protein: 74g daily for breastfeeding mothers (NIN India). Include dal, paneer, eggs, chicken.',
            'Continue hydration: 3-4 liters of water daily for breastfeeding mothers (WHO, NIN).',
        ],
        warningSigns: [
            'Lochia that returns to bright red or has large clots after week 1 (MOHFW, WHO, ACOG).',
            'Signs of mastitis: red, painful, hot area on breast with fever (WHO, AAP, ACOG).',
            'Persistent sadness or anxiety lasting more than 2 weeks (ACOG, NICE, WHO).',
            'Incision that opens, drains, or shows signs of infection (WHO, ACOG, MOHFW).',
            'Severe headache with vision changes — possible postpartum preeclampsia (ACOG, WHO, CDC).',
        ],
        weeklyGuidance: [
            'Begin establishing a gentle routine — but stay flexible (WHO, NICE).',
            'Start tummy time with your baby (2-3 sessions, 1-2 minutes each) (AAP, CDC).',
            'Monitor for postpartum depression — baby blues should have resolved (ACOG, NICE, WHO).',
            'Continue accepting help — the 40-day confinement period (jaapa) is culturally wise (MOHFW, ICMR).',
            'Schedule baby\'s first pediatrician follow-up if not yet done (IAP, MOHFW).',
        ],
    },
    {
        week: 4,
        recoveryPhase: 'early',
        phaseLabel: 'Early Recovery',
        title: 'Week 4: One Month Postpartum',
        summary: 'You have completed the first month. Your baby is becoming more alert, and you may be feeling more confident — but continue to prioritize recovery.',
        recoveryNotes: [
            'Lochia: Should be minimal or stopped for most women. If still heavy, consult your doctor (ACOG, WHO).',
            'Perineal healing: Should be largely complete. Gentle sex may be considered after 4-6 weeks and doctor clearance (ACOG, NICE).',
            'C-section: Most of the external healing is complete. Internal healing takes 6-12 weeks (ACOG, NICE).',
            'Breastfeeding: Well-established by now. If still having pain, seek lactation support (WHO, AAP, IAP).',
            'Postpartum hair loss may become noticeable — it is temporary and peaks around 4-5 months (ACOG, AAD).',
        ],
        bodyChanges: [
            'Lochia may have stopped completely or be very light (ACOG, WHO).',
            'Postpartum hair shedding (telogen effluvium) may begin — normal and temporary (ACOG, AAD).',
            'Abdominal separation (diastasis recti) may still be present — check before exercising (ACOG, NICE).',
            'Weight loss: Most women lose 5-6 kg immediately after delivery, gradual loss continues (ACOG, WHO).',
            'Night sweats may occur as body eliminates excess pregnancy fluid (ACOG, NICE).',
        ],
        babyCareNotes: [
            'Feeding: 7-9 times per day. Some babies may start sleeping longer stretches at night (WHO, AAP, IAP).',
            'Tummy time: Increase to 3-5 minutes, 2-3 times daily (AAP, CDC).',
            'Baby may start making cooing sounds and following objects with eyes (CDC, AAP).',
            'First month well-baby checkup: Weight, length, head circumference, and general development (IAP, WHO, MOHFW).',
            'Vaccinations: BCG, OPV, and Hepatitis B birth dose should be completed (IAP schedule, WHO, MOHFW).',
        ],
        babyDevelopment: [
            'Baby can lift head to about 45 degrees during tummy time (AAP, CDC).',
            'Social smiles are more frequent and responsive (AAP, CDC).',
            'Begins to coo and make vowel sounds ("ooh", "aah") (CDC, AAP).',
            'Can briefly follow a moving object with eyes (CDC, AAP).',
            'Startles less to everyday sounds — beginning to self-soothe (AAP, CDC).',
        ],
        mentalHealthNotes: [
            'The 1-month mark is a good time to check in with yourself about mood (NICE, ACOG, WHO).',
            'If you feel persistently anxious, sad, or detached, seek help — PPD is treatable (WHO, ACOG, NICE).',
            'Indian context: Traditional confinement may be ending — transition can be emotionally challenging (MOHFW, ICMR).',
            'Fatigue is cumulative — sleep deprivation affects mental health. Prioritize rest (WHO, NICE).',
            'MOHFW\'s District Mental Health Programme (DMHP) provides free mental health services (MOHFW, WHO).',
        ],
        activityNotes: [
            'Walking: 15-20 minutes, 1-2 times daily (ACOG, NICE).',
            'Continue pelvic floor exercises — consistency is key for long-term results (ACOG, NICE, WHO).',
            'Gentle yoga: cat-cow, child\'s pose (modified), pelvic tilts (ACOG, NICE).',
            'Still avoid high-impact exercises, running, jumping, and heavy lifting (ACOG, WHO).',
            'Begin gentle abdominal bracing exercises (transverse abdominis activation) if cleared (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue high-protein diet: 74g daily (NIN India).',
            'Iron-rich foods with vitamin C for absorption: lemon juice on spinach, amla with meals (NIN, WHO, ICMR).',
            'Calcium: 1200mg daily for breastfeeding mothers (NIN India, ICMR).',
            'Omega-3 fatty acids: fatty fish, flaxseeds, walnuts — support baby brain development (WHO, AAP, NIN).',
            'Avoid excessive caffeine (limit to 200-300mg daily per AAP, WHO).',
        ],
        warningSigns: [
            'Heavy bleeding continuing beyond week 4 (retained products of conception) (WHO, ACOG, MOHFW).',
            'Mastitis: red, painful breast with fever and flu-like symptoms (WHO, AAP, ACOG).',
            'Symptoms of postpartum depression lasting beyond 2 weeks (ACOG, NICE, WHO).',
            'Severe perineal pain or wound that hasn\'t healed (WHO, ACOG, MOHFW).',
            'Baby not gaining weight or losing weight after week 2 (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Schedule baby\'s 1-month checkup and vaccinations (IAP, MOHFW, WHO).',
            'Check in with yourself about your mood — be honest with your doctor (ACOG, NICE, WHO).',
            'Continue tummy time and skin-to-skin contact (AAP, CDC, WHO).',
            'Begin gentle postnatal yoga if you feel ready (ACOG, NICE).',
            'If lochia has stopped, you may consider gentle swimming or baths (after doctor clearance) (ACOG, NICE).',
        ],
    },
    {
        week: 5,
        recoveryPhase: 'early',
        phaseLabel: 'Early Recovery',
        title: 'Week 5: Building Confidence',
        summary: 'You are approaching the end of the traditional 40-day confinement. Your body has healed significantly, and you and your baby are learning each other more every day.',
        recoveryNotes: [
            'Lochia: Should have stopped for most women. Spotting can occur with increased activity (ACOG, WHO).',
            'C-section: Internal healing continues. Scar may be raised and red — this is normal healing tissue (ACOG, NICE).',
            'Breastfeeding: Supply is well-established. If pumping, you should see 60-120ml per session (WHO, AAP, IAP).',
            'Diastasis recti: Check for abdominal separation before starting core exercises. A gap of 2+ finger widths needs modified exercises (ACOG, NICE).',
            'Hormonal changes: Menstruation may return as early as week 5-6 for non-breastfeeding mothers (ACOG, WHO).',
        ],
        bodyChanges: [
            'Abdominal muscles begin to come back together. Diastasis recti assessment is important (ACOG, NICE).',
            'Hair loss may be noticeable — peaks around 4-5 months postpartum (ACOG, AAD).',
            'Skin changes: Linea nigra and stretch marks begin to fade (ACOG, AAD).',
            'Some women feel their first postpartum ovulation (non-breastfeeding mothers) (ACOG, WHO).',
            'Joint laxity from pregnancy hormones may persist for months (ACOG, NICE).',
        ],
        babyCareNotes: [
            'Feeding: May be stretching to 3-4 hours between feeds. Some babies may sleep 5-6 hours at night (WHO, AAP, IAP).',
            'Tummy time: 5-10 minutes, 2-3 times daily (AAP, CDC).',
            'Baby may start batting at objects and bringing hands to mouth (CDC, AAP).',
            'Growth spurt around 6 weeks — expect increased feeding frequency (WHO, AAP, IAP).',
            'Vaccinations due at 6 weeks: DPT, IPV, Hib, Rotavirus, PCV (IAP schedule, WHO, MOHFW).',
        ],
        babyDevelopment: [
            'Head control is improving — can hold head steady when held upright (AAP, CDC).',
            'Begins to push up on forearms during tummy time (CDC, AAP).',
            'More expressive — different cries for hunger, tiredness, discomfort (AAP, WHO).',
            'May start to recognize familiar faces and objects (AAP, CDC).',
            'Hands are becoming more coordinated — may grasp your finger (CDC, AAP).',
        ],
        mentalHealthNotes: [
            'The end of traditional confinement (40 days) can be an emotional transition (MOHFW, ICMR).',
            'If returning to your parents\' home after delivery, the transition back can be challenging (MOHFW, ICMR).',
            'Continue to screen for PPD — Edinburgh Scale screening at 6 weeks is standard (NICE, FOGSI, ACOG).',
            'Accept that some days will be harder than others — this is normal (WHO, NICE).',
            'Partner support is protective against PPD — communicate your needs clearly (WHO, NICE, ACOG).',
        ],
        activityNotes: [
            'Walking: 20-30 minutes daily (ACOG, NICE, WHO).',
            'Pelvic floor exercises: 10-15 reps, 3 times daily (ACOG, NICE).',
            'Begin gentle core rehabilitation: pelvic tilts, heel slides, abdominal bracing (ACOG, NICE).',
            'Postnatal yoga: bridge pose, gentle twists, seated forward bends (ACOG, NICE).',
            'Still avoid: running, jumping, heavy weightlifting, abdominal crunches (ACOG, WHO).',
        ],
        nutritionalFocus: [
            'Continue lactation-supporting foods: methi, saunf, oats, garlic (NIN, ICMR).',
            'Focus on healing foods: bone broth, protein-rich meals, vitamin C for tissue repair (NIN, WHO).',
            'If hair loss is concerning: biotin-rich foods (eggs, nuts, sweet potatoes), iron, zinc (NIN, ICMR).',
            'Limit processed and sugary foods — they can increase inflammation (WHO, NIN).',
            'Small, frequent meals help maintain energy through sleep deprivation (NIN, ICMR).',
        ],
        warningSigns: [
            'Heavy bleeding returning after it had stopped (WHO, ACOG, MOHFW).',
            'Fever with pelvic pain (possible endometritis) (WHO, ACOG, CDC).',
            'Persistent sadness, anxiety, or intrusive thoughts (ACOG, NICE, WHO).',
            'Baby not gaining weight adequately (WHO, AAP, IAP).',
            'Severe back pain or pelvic pain that limits mobility (ACOG, NICE).',
        ],
        weeklyGuidance: [
            'Prepare for 6-week checkup — note any concerns or questions (WHO, ACOG, MOHFW).',
            'If lochia has stopped, you may resume sexual activity after doctor clearance (ACOG, NICE).',
            'Begin gentle core rehabilitation exercises (ACOG, NICE).',
            'Schedule baby\'s 6-week vaccinations (IAP, MOHFW, WHO).',
            'Discuss family planning/contraception at your 6-week checkup (FOGSI, ACOG, WHO).',
        ],
    },
    {
        week: 6,
        recoveryPhase: 'early',
        phaseLabel: 'Early Recovery',
        title: 'Week 6: The Six-Week Milestone',
        summary: 'The critical 6-week recovery milestone. Your postpartum checkup this week will assess your physical and mental health recovery.',
        recoveryNotes: [
            'Postpartum checkup: Comprehensive assessment including physical exam, mental health screening, and family planning (WHO, ACOG, MOHFW, NICE).',
            'Lochia: Should have stopped completely. Report any continued bleeding (ACOG, WHO).',
            'Perineal/C-section healing: Assessed at checkup. Most women are cleared for normal activities (ACOG, NICE).',
            'Breastfeeding: Well-established. Discuss any concerns at checkup (WHO, AAP, IAP).',
            'Diastasis recti assessment: Your doctor can check for abdominal separation (ACOG, NICE).',
        ],
        bodyChanges: [
            'Uterus has returned to pre-pregnancy size (involution complete) (ACOG, WHO).',
            'Most physical healing is complete — internal healing continues for months (ACOG, NICE).',
            'Weight: Most women have lost 10-12 kg from delivery. Remaining weight loss is gradual (ACOG, WHO).',
            'Pelvic floor: May still be weak — continue Kegels (ACOG, NICE).',
            'Menstruation may return for non-breastfeeding mothers around this time (ACOG, WHO).',
        ],
        babyCareNotes: [
            '6-week vaccinations due: DPT, IPV, Hib, Rotavirus, PCV, Hepatitis B (IAP schedule, WHO, MOHFW).',
            'Feeding: 6-8 times per day. Growth spurt around 6 weeks — increased feeding frequency (WHO, AAP, IAP).',
            'Tummy time: 10-15 minutes total daily, spread across sessions (AAP, CDC).',
            'Baby may start sleeping 4-6 hour stretches at night (AAP, CDC).',
            'Well-baby checkup: Weight, length, head circumference, development assessment (IAP, WHO, MOHFW).',
        ],
        babyDevelopment: [
            'Head control significantly improved — can hold head at 45-90 degrees during tummy time (AAP, CDC).',
            'Social smiles are frequent and purposeful (AAP, CDC).',
            'Begins to coo and make sounds in response to your voice (CDC, AAP).',
            'May start to bring hands to midline and clasp them together (CDC, AAP).',
            'Can follow objects and faces with eyes more smoothly (CDC, AAP).',
        ],
        mentalHealthNotes: [
            'EPDS (Edinburgh Postnatal Depression Scale) screening is standard at 6-week checkup (NICE, FOGSI, ACOG).',
            'Be honest with your doctor about your mood — PPD is treatable with therapy and/or medication (WHO, ACOG, NICE).',
            'Many antidepressants are compatible with breastfeeding (discuss with your doctor) (AAP, WHO, NICE).',
            'Indian context: Government hospitals provide free mental health services through DMHP (MOHFW, WHO).',
            'Celebrate reaching this milestone — the first 6 weeks are the hardest (WHO, ACOG).',
        ],
        activityNotes: [
            'After doctor clearance: Begin gradual return to exercise (ACOG, NICE, WHO).',
            'Walking: 30 minutes daily (WHO, ACOG).',
            'Low-impact exercises: swimming (after lochia stops), stationary cycling, elliptical (ACOG, NICE).',
            'Postnatal yoga: more active poses, gentle flow sequences (ACOG, NICE).',
            'Continue pelvic floor exercises — aim for 3 sets of 10-15 daily (ACOG, NICE).',
            'Still avoid: high-impact, heavy lifting, abdominal crunches (until diastasis recti assessed) (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue galactagogue-rich diet if breastfeeding (NIN, ICMR).',
            'Focus on balanced nutrition for sustained energy through sleep deprivation (WHO, NIN).',
            'Calcium and vitamin D: essential for bone health during breastfeeding (NIN, ICMR, WHO).',
            'Iron: Continue supplementation if you had significant blood loss or anemia (WHO, NIN, MOHFW).',
            'Discuss prenatal vitamin continuation with your doctor (WHO, NIN, ACOG).',
        ],
        warningSigns: [
            'Continued bleeding beyond 6 weeks (WHO, ACOG, MOHFW).',
            'Pain during intercourse (dyspareunia) — discuss with your doctor (ACOG, NICE).',
            'Urinary or fecal incontinence — pelvic floor therapy may be needed (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (ACOG, NICE, WHO).',
            'Baby not meeting developmental milestones or not gaining weight (WHO, AAP, IAP, CDC).',
        ],
        weeklyGuidance: [
            'Attend your 6-week postpartum checkup — this is critical (WHO, MOHFW, ACOG, NICE).',
            'Discuss contraception/family planning at your checkup (FOGSI, ACOG, WHO).',
            'Get baby\'s 6-week vaccinations done (IAP, MOHFW, WHO).',
            'After doctor clearance, begin gradual return to exercise (ACOG, NICE).',
            'Be honest about your mental health — EPDS screening is routine and important (NICE, FOGSI, WHO).',
        ],
    },

    // ═══════════════════════════════════════════════
    // LATE RECOVERY PHASE — Week 7-12
    // ═══════════════════════════════════════════════
    {
        week: 7,
        recoveryPhase: 'late',
        phaseLabel: 'Late Recovery',
        title: 'Week 7: Entering Late Recovery',
        summary: 'You have entered the late recovery phase. Your body has healed significantly, and you can begin more active rehabilitation.',
        recoveryNotes: [
            'Physical healing is largely complete. Focus shifts to rehabilitation and strengthening (WHO, ACOG, NICE).',
            'Pelvic floor: May need targeted exercises if you have any incontinence or heaviness (ACOG, NICE).',
            'C-section scar: Massage can help reduce adhesions and improve appearance (after 6 weeks) (ACOG, NICE).',
            'Breastfeeding: Supply is well-established and responsive to baby\'s needs (WHO, AAP, IAP).',
            'Diastasis recti: If still present, avoid exercises that bulge the abdomen (ACOG, NICE).',
        ],
        bodyChanges: [
            'Body is transitioning from healing to rebuilding phase (WHO, ACOG).',
            'Abdominal muscles continue to come together — diastasis recti improvement is gradual (ACOG, NICE).',
            'Hormonal changes: Estrogen levels are low during breastfeeding, which can cause vaginal dryness (ACOG, NICE).',
            'Joint laxity from relaxin hormone may persist for 3-6 months (ACOG, NICE).',
            'Postpartum hair loss may be peaking (ACOG, AAD).',
        ],
        babyCareNotes: [
            'Feeding: 6-7 times per day. Some babies may sleep 5-7 hours at night (WHO, AAP, IAP).',
            'Tummy time: 15-20 minutes total daily (AAP, CDC).',
            'Baby is becoming more social — smiles, coos, and may start to laugh (CDC, AAP).',
            'Sleep patterns: Baby may be developing a more predictable sleep-wake cycle (AAP, CDC).',
            'Continue exclusive breastfeeding — no water or other foods until 6 months (WHO, IAP, AAP, MOHFW).',
        ],
        babyDevelopment: [
            'Can hold head steady when sitting with support (AAP, CDC).',
            'Begins to bear weight on legs when held standing (CDC, AAP).',
            'May start to roll from tummy to back (AAP, CDC).',
            'Recognizes familiar faces and may show preference for parents (CDC, AAP).',
            'Brings objects to mouth — exploring the world through oral senses (AAP, CDC).',
        ],
        mentalHealthNotes: [
            'Continue monitoring mood — PPD can develop anytime in the first year (WHO, ACOG, NICE).',
            'Sleep deprivation is cumulative — prioritize rest when possible (WHO, NICE).',
            'If returning to work is on the horizon, discuss childcare and feeding plans (MOHFW, ICMR).',
            'Indian context: Many mothers return to work after 3-6 months. Maternity Benefit Act provides 26 weeks of leave (MOHFW).',
            'Stay connected with other new mothers — isolation is a risk factor for PPD (WHO, NICE, ACOG).',
        ],
        activityNotes: [
            'Walking: 30-45 minutes daily (WHO, ACOG, NICE).',
            'Begin postpartum-specific exercise programs after doctor clearance (ACOG, NICE).',
            'Continue pelvic floor rehabilitation — consistency is key (ACOG, NICE).',
            'Core exercises: pelvic tilts, bridges, bird-dog (if no diastasis recti) (ACOG, NICE).',
            'Low-impact cardio: swimming, stationary cycling, elliptical (ACOG, NICE).',
            'Gradually increase intensity — listen to your body (WHO, ACOG).',
        ],
        nutritionalFocus: [
            'Continue balanced diet with adequate protein (74g daily if breastfeeding) (NIN India).',
            'Focus on nutrient-dense foods to support energy levels (WHO, NIN).',
            'Continue calcium and vitamin D supplementation as recommended (NIN, ICMR, WHO).',
            'Include omega-3 rich foods for baby brain development through breastmilk (WHO, AAP, NIN).',
            'Stay hydrated — 3+ liters daily for breastfeeding mothers (WHO, NIN).',
        ],
        warningSigns: [
            'Urinary or fecal incontinence that persists or worsens (ACOG, NICE, WHO).',
            'Pelvic pain or pressure (possible pelvic organ prolapse) (ACOG, NICE, WHO).',
            'Persistent pain during intercourse (ACOG, NICE).',
            'PPD or anxiety symptoms that interfere with daily functioning (WHO, ACOG, NICE).',
            'Baby not meeting developmental milestones (AAP, CDC, IAP, WHO).',
        ],
        weeklyGuidance: [
            'Begin postpartum rehabilitation exercises with doctor clearance (ACOG, NICE, WHO).',
            'Continue pelvic floor exercises daily (ACOG, NICE).',
            'Monitor baby\'s development — 2-month checkup approaching (IAP, WHO, MOHFW).',
            'If returning to work, begin planning childcare and feeding arrangements (MOHFW, ICMR).',
            'Practice self-care — your well-being is essential for baby\'s well-being (WHO, NICE).',
        ],
    },
    {
        week: 8,
        recoveryPhase: 'late',
        phaseLabel: 'Late Recovery',
        title: 'Week 8: Two Months of Motherhood',
        summary: 'Two months postpartum. Your baby is becoming more interactive, and you may be finding your groove as a mother.',
        recoveryNotes: [
            'Body is becoming stronger. Continue gradual increase in activity (WHO, ACOG, NICE).',
            'Pelvic floor: Should be improving with consistent exercises. If not, seek pelvic floor physiotherapy (ACOG, NICE).',
            'C-section scar: Continue scar massage with vitamin E oil or silicone sheets (ACOG, NICE).',
            'Breastfeeding: Efficient and well-established. Baby feeds faster now (WHO, AAP, IAP).',
            'Weight loss: Gradual loss of 0.5-1 kg per week is healthy while breastfeeding (WHO, ACOG).',
        ],
        bodyChanges: [
            'Weight loss continues gradually — breastfeeding burns 300-500 extra calories daily (WHO, ACOG, AAP).',
            'Abdominal muscles continue to strengthen (ACOG, NICE).',
            'Hair loss may be at its peak — it will slow down and regrow (ACOG, AAD).',
            'Skin changes: Melasma (pregnancy mask) may be fading (ACOG, AAD).',
            'Some women feel their libido returning — this varies greatly (ACOG, NICE).',
        ],
        babyCareNotes: [
            '2-month well-baby checkup: weight, length, head circumference, development (IAP, WHO, MOHFW).',
            'Vaccinations: DPT, IPV, Hib, Rotavirus, PCV boosters (IAP schedule, WHO, MOHFW).',
            'Feeding: 6-7 times per day. Some babies consolidate to 5-6 feeds (WHO, AAP, IAP).',
            'Tummy time: 20-30 minutes total daily (AAP, CDC).',
            'Sleep: Baby may sleep 5-8 hour stretches at night. Every baby is different (AAP, CDC).',
            'Exclusive breastfeeding continues — no water, honey, or other foods (WHO, IAP, AAP, MOHFW).',
        ],
        babyDevelopment: [
            'Head control is good — can hold head steady when sitting with support (AAP, CDC).',
            'May start to roll from tummy to back (CDC, AAP).',
            'Social smile is well-established. May begin to laugh (AAP, CDC).',
            'Cooing and gurgling — "conversation" with you (CDC, AAP).',
            'Follows objects with eyes across midline (CDC, AAP).',
            'May start to show interest in own hands (CDC, AAP).',
        ],
        mentalHealthNotes: [
            'Continue PPD screening — symptoms can develop anytime in the first year (WHO, ACOG, NICE).',
            'Returning to work anxiety: This is normal. Plan transition gradually if possible (NICE, MOHFW).',
            'Indian context: Discuss childcare with family. Grandparents often play a key role (MOHFW, ICMR).',
            'Maintain social connections — isolation is a major risk factor for PPD (WHO, NICE, ACOG).',
            'Accept that some days are harder — this does not make you a bad mother (WHO, NICE).',
        ],
        activityNotes: [
            'Walking: 30-45 minutes daily (WHO, ACOG).',
            'Postnatal yoga or Pilates: focus on core and pelvic floor (ACOG, NICE).',
            'Swimming: excellent low-impact exercise (after lochia has stopped) (ACOG, NICE).',
            'Begin light strength training: bodyweight exercises, light resistance bands (ACOG, NICE).',
            'Continue pelvic floor exercises — aim for 3 sets of 10-15 daily (ACOG, NICE).',
            'Avoid high-impact exercises until pelvic floor is strong (ACOG, NICE, WHO).',
        ],
        nutritionalFocus: [
            'Continue balanced diet with adequate protein, calcium, and iron (NIN, WHO).',
            'Include galactagogues if breastfeeding: methi, fennel, oats, garlic (NIN, ICMR).',
            'Stay hydrated: 3+ liters daily for milk production (WHO, NIN).',
            'Eat fiber-rich foods: whole grains, fruits, vegetables to prevent constipation (NIN, WHO).',
            'Continue prenatal vitamins or switch to postnatal as recommended (WHO, NIN, ACOG).',
        ],
        warningSigns: [
            'Persistent pelvic pain or pressure (ACOG, NICE, WHO).',
            'Urinary incontinence that hasn\'t improved with exercises (ACOG, NICE).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not smiling or not responding to sounds (AAP, CDC, IAP, WHO).',
            'Baby not gaining weight adequately (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Attend baby\'s 2-month checkup and vaccinations (IAP, WHO, MOHFW).',
            'Continue pelvic floor and core rehabilitation (ACOG, NICE).',
            'If returning to work, finalize childcare and feeding plans (MOHFW, ICMR).',
            'Practice self-compassion — you are doing an incredible job (WHO, NICE).',
            'If you have concerns about baby\'s development, discuss with pediatrician (IAP, WHO, AAP).',
        ],
    },
    {
        week: 9,
        recoveryPhase: 'late',
        phaseLabel: 'Late Recovery',
        title: 'Week 9: Growing Stronger Together',
        summary: 'Your baby is becoming more expressive and interactive. Your body continues to rebuild strength as you move through late recovery.',
        recoveryNotes: [
            'Energy levels should be improving as sleep patterns stabilize (WHO, NICE).',
            'Pelvic floor: Continue exercises. Consider seeing a women\'s health physiotherapist if issues persist (ACOG, NICE).',
            'C-section scar: Should be fading. Continue massage to prevent adhesions (ACOG, NICE).',
            'Breastfeeding: Well-established. Some mothers may start pumping to build a freezer stash (WHO, AAP, IAP).',
            'Exercise tolerance is increasing — you can do more without fatigue (ACOG, NICE, WHO).',
        ],
        bodyChanges: [
            'Body is becoming stronger and more capable (WHO, ACOG).',
            'Abdominal muscles are tightening — diastasis recti should be improving (ACOG, NICE).',
            'Hair loss may still be noticeable but new growth will begin soon (ACOG, AAD).',
            'Skin: Stretch marks continue to fade (they will become silvery-white over time) (ACOG, AAD).',
            'Some women feel physically "back to normal" — others need more time. Both are normal (WHO, ACOG, NICE).',
        ],
        babyCareNotes: [
            'Feeding: 5-7 times per day. Baby is more efficient at feeding (WHO, AAP, IAP).',
            'Tummy time: 20-30 minutes total daily (AAP, CDC).',
            'Baby may be developing a more predictable routine (AAP, CDC).',
            'Sleep: Some babies sleep 6-9 hours at night. Others still wake frequently — both are normal (AAP, CDC).',
            'Baby may start to grasp objects placed in hand (CDC, AAP).',
            'Continue exclusive breastfeeding — WHO recommends exclusive breastfeeding for 6 months (WHO, IAP, AAP, MOHFW).',
        ],
        babyDevelopment: [
            'Head control is strong — can hold head up when pulled to sitting (AAP, CDC).',
            'May roll from tummy to back consistently (CDC, AAP).',
            'Can bear weight on legs when held in standing position (CDC, AAP).',
            'Vocalizes more — squeals, laughs, coos (AAP, CDC).',
            'Recognizes familiar people at a distance (CDC, AAP).',
            'Brings hands together and may reach for objects (CDC, AAP).',
        ],
        mentalHealthNotes: [
            'The "fourth trimester" (first 3 months) is ending — this can be emotionally complex (WHO, NICE).',
            'If returning to work, separation anxiety (yours and baby\'s) is normal (NICE, MOHFW).',
            'Continue to monitor mood — PPD can develop at any time in the first year (WHO, ACOG, NICE).',
            'Practice mindfulness: Even 5 minutes of deep breathing can reduce stress (NICE, WHO).',
            'Indian context: If you have household help, delegate tasks to focus on baby and self-care (MOHFW, ICMR).',
        ],
        activityNotes: [
            'Walking: 30-45 minutes daily at a brisk pace (WHO, ACOG).',
            'Strength training: Bodyweight exercises, resistance bands, light weights (ACOG, NICE).',
            'Postnatal yoga: More challenging poses as strength improves (ACOG, NICE).',
            'Core work: Continue transverse abdominis activation, avoid crunches until diastasis checked (ACOG, NICE).',
            'Pelvic floor: 3 sets of 10-15 daily (ACOG, NICE).',
            'If you feel ready, begin low-impact group fitness classes (postnatal specific) (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue balanced diet with adequate protein, calcium, iron (NIN, WHO).',
            'If pumping and building a stash, ensure adequate calorie intake (WHO, NIN).',
            'Include healthy fats: ghee, coconut, nuts, seeds for energy and baby brain development (NIN, ICMR, WHO).',
            'Continue galactagogues if milk supply needs support (NIN, ICMR).',
            'Limit caffeine to 300mg daily (about 2 cups of coffee) while breastfeeding (AAP, WHO).',
        ],
        warningSigns: [
            'Persistent pelvic pain, pressure, or incontinence (ACOG, NICE, WHO).',
            'Pain during intercourse that hasn\'t improved (ACOG, NICE).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby losing weight or not gaining adequately (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Continue pelvic floor and core rehabilitation (ACOG, NICE, WHO).',
            'If returning to work, practice separation for short periods (NICE, MOHFW).',
            'Baby-proof your home — baby will become mobile in the coming months (AAP, CDC).',
            'Schedule time for self-care — even 15 minutes daily makes a difference (WHO, NICE).',
            'Discuss any concerns about baby\'s development with your pediatrician (IAP, WHO, AAP).',
        ],
    },
    {
        week: 10,
        recoveryPhase: 'late',
        phaseLabel: 'Late Recovery',
        title: 'Week 10: Building Momentum',
        summary: 'You are approaching the end of late recovery. Your body is stronger, and your baby is becoming more interactive and alert.',
        recoveryNotes: [
            'Physical recovery is well-established. Focus on building strength and endurance (WHO, ACOG, NICE).',
            'Pelvic floor: Should be noticeably stronger. If still having issues, seek specialist help (ACOG, NICE).',
            'C-section scar: Continue massage. Scar should be fading and softening (ACOG, NICE).',
            'Breastfeeding: Very efficient. Baby may feed for only 10-15 minutes per side (WHO, AAP, IAP).',
            'Menstruation: May return for some breastfeeding mothers (varies greatly) (ACOG, WHO).',
        ],
        bodyChanges: [
            'Strength and endurance are improving noticeably (WHO, ACOG).',
            'Abdominal muscles are tightening — continue core rehabilitation (ACOG, NICE).',
            'Hair loss should be slowing down (ACOG, AAD).',
            'Libido: May be returning for some women. Vaginal dryness from breastfeeding is common (ACOG, NICE).',
            'Some women feel more like their pre-pregnancy selves physically (WHO, ACOG).',
        ],
        babyCareNotes: [
            'Feeding: 5-6 times per day. Breastfeeding is efficient and well-established (WHO, AAP, IAP).',
            'Tummy time: 30 minutes total daily, spread across sessions (AAP, CDC).',
            'Baby may start to reach for and grasp objects (CDC, AAP).',
            'Sleep: Some babies sleep 8-10 hours at night. Growth spurts may disrupt sleep temporarily (AAP, CDC).',
            'Baby may be drooling more — teeth may begin developing under gums (AAP, CDC).',
            'Continue exclusive breastfeeding for 6 months (WHO, IAP, AAP, MOHFW).',
        ],
        babyDevelopment: [
            'Rolling: May roll from back to tummy or tummy to back (AAP, CDC).',
            'Head control: Can hold head steady in all positions (CDC, AAP).',
            'Reaches for objects and may transfer from hand to hand (CDC, AAP).',
            'Laughs out loud and squeals with delight (AAP, CDC).',
            'Responds to own name (CDC, AAP).',
            'May show stranger anxiety — recognizes familiar vs. unfamiliar faces (AAP, CDC).',
        ],
        mentalHealthNotes: [
            'Continue to monitor mood — PPD risk continues throughout the first year (WHO, ACOG, NICE).',
            'If returning to work: plan a gradual transition if possible. Pumping at work requires planning (MOHFW, ICMR).',
            'Indian context: Maternity Benefit Act guarantees 26 weeks paid leave. Know your rights (MOHFW).',
            'Accept help from family — Indian joint family system can be a tremendous support (MOHFW, ICMR).',
            'If you are feeling overwhelmed, talk to your doctor. You are not alone (WHO, NICE, ACOG).',
        ],
        activityNotes: [
            'Walking: 30-45 minutes brisk walking daily (WHO, ACOG).',
            'Strength training: Increase weights gradually as tolerated (ACOG, NICE).',
            'Postnatal yoga or Pilates: More challenging classes (ACOG, NICE).',
            'Core: Continue rehabilitation. Check diastasis recti before crunches (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
            'Swimming, cycling, elliptical are all excellent low-impact options (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Maintain balanced diet with adequate protein, calcium, and iron (NIN, WHO).',
            'If pumping at work: Plan for breastmilk storage. Eat nutrient-dense snacks (WHO, AAP, NIN).',
            'Continue hydration: 3+ liters daily for breastfeeding (WHO, NIN).',
            'Include iron-rich foods: dates, jaggery, spinach, beetroot (NIN, ICMR, WHO).',
            'Calcium: 1200mg daily for breastfeeding mothers (NIN India, ICMR).',
        ],
        warningSigns: [
            'Persistent pelvic pain or pressure (ACOG, NICE, WHO).',
            'Urinary incontinence that hasn\'t improved (ACOG, NICE).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not gaining weight or losing weight (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Continue building strength and endurance (WHO, ACOG, NICE).',
            'If returning to work soon, prepare pumping and childcare plans (MOHFW, ICMR).',
            'Baby-proof your home as baby becomes more mobile (AAP, CDC).',
            'Continue pelvic floor exercises — they remain important lifelong (ACOG, NICE).',
            'Schedule time for yourself — self-care is essential for good mothering (WHO, NICE).',
        ],
    },
    {
        week: 11,
        recoveryPhase: 'late',
        phaseLabel: 'Late Recovery',
        title: 'Week 11: Nearing Three Months',
        summary: 'Approaching the 3-month mark. Your baby is becoming more alert and interactive, and your body is nearly through the late recovery phase.',
        recoveryNotes: [
            'Physical recovery is nearly complete. Focus on strength and fitness (WHO, ACOG, NICE).',
            'Pelvic floor: Should be strong. Maintain exercises for lifelong pelvic health (ACOG, NICE).',
            'C-section scar: Continue scar massage. Sensation may be returning to the area (ACOG, NICE).',
            'Breastfeeding: Very well-established. Supply is stable and responsive (WHO, AAP, IAP).',
            'Weight: If you haven\'t returned to pre-pregnancy weight, remember that healthy loss is gradual (WHO, ACOG).',
        ],
        bodyChanges: [
            'Most physical recovery is complete. Body is transitioning to fitness phase (WHO, ACOG).',
            'Abdominal muscles are tightening — diastasis recti should be closing (ACOG, NICE).',
            'Hair: New growth (baby hairs) may be visible along the hairline (ACOG, AAD).',
            'Skin: Stretch marks and melasma continue to fade (ACOG, AAD).',
            'Energy levels should be approaching pre-pregnancy levels (WHO, NICE).',
        ],
        babyCareNotes: [
            'Feeding: 5-6 times per day. May start to show interest in what you\'re eating (WHO, AAP, IAP).',
            'Tummy time: 30-40 minutes total daily (AAP, CDC).',
            'Baby may be teething — drooling, gum rubbing, irritability (AAP, CDC).',
            'Sleep: May sleep 8-10 hours at night. Sleep regression around 3-4 months is common (AAP, CDC).',
            'Baby may start to sit with support (CDC, AAP).',
            'Continue exclusive breastfeeding — solid foods not yet (WHO, IAP, AAP, MOHFW).',
        ],
        babyDevelopment: [
            'Rolling: May roll in both directions (AAP, CDC).',
            'Sitting: Can sit with support, head steady (CDC, AAP).',
            'Reaches and grasps objects purposefully (CDC, AAP).',
            'Brings objects to mouth — exploring through oral senses (AAP, CDC).',
            'Responds to name and familiar voices (CDC, AAP).',
            'May start to show stranger anxiety (AAP, CDC).',
        ],
        mentalHealthNotes: [
            'The end of the "fourth trimester" is a significant milestone — acknowledge your journey (WHO, NICE).',
            'If returning to work, separation anxiety is normal. Both you and baby will adapt (NICE, MOHFW).',
            'Continue PPD monitoring — symptoms can develop at any time (WHO, ACOG, NICE).',
            'Indian context: If you have a nanny or family help, establish clear communication about baby care (MOHFW, ICMR).',
            'Practice self-compassion — you are navigating a major life transition (WHO, NICE).',
        ],
        activityNotes: [
            'Walking: 30-45 minutes brisk walking daily (WHO, ACOG).',
            'Strength training: Moderate weights, focus on full-body exercises (ACOG, NICE).',
            'Postnatal yoga or Pilates: More challenging classes (ACOG, NICE).',
            'Core: If diastasis recti is closed, can begin modified crunches and planks (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
            'Consider joining a postnatal fitness group for social support (NICE, WHO).',
        ],
        nutritionalFocus: [
            'Continue balanced diet. If breastfeeding, maintain 500 extra calories daily (WHO, NIN).',
            'Prepare for solid food introduction at 6 months — educate yourself about baby-led weaning and traditional approaches (WHO, AAP, IAP).',
            'Continue calcium and iron-rich foods (NIN, ICMR, WHO).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
            'If hair loss is concerning, ensure adequate protein, iron, zinc, and biotin (NIN, ICMR).',
        ],
        warningSigns: [
            'Persistent pelvic pain or incontinence (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not rolling or showing head control (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Prepare for 3-month developmental assessment (IAP, WHO, MOHFW).',
            'Continue building physical fitness gradually (WHO, ACOG, NICE).',
            'If returning to work, finalize all arrangements (MOHFW, ICMR).',
            'Baby-proof your home — mobility is coming soon (AAP, CDC).',
            'Educate yourself about starting solids at 6 months (WHO, AAP, IAP).',
        ],
    },
    {
        week: 12,
        recoveryPhase: 'late',
        phaseLabel: 'Late Recovery',
        title: 'Week 12: Three Months Postpartum',
        summary: 'Three months postpartum. The "fourth trimester" is complete. Your baby is becoming more interactive, and your body has largely recovered.',
        recoveryNotes: [
            'Physical recovery is largely complete. Focus on long-term health and fitness (WHO, ACOG, NICE).',
            'Pelvic floor: Should be strong with consistent exercise. If issues persist, consult a specialist (ACOG, NICE).',
            'C-section scar: Should be well-healed. Continue massage for optimal healing (ACOG, NICE).',
            'Breastfeeding: Very efficient. Supply is well-established and stable (WHO, AAP, IAP).',
            'Weight: Healthy weight loss continues at 0.5-1 kg per week if still above pre-pregnancy weight (WHO, ACOG).',
        ],
        bodyChanges: [
            'Body has largely recovered from pregnancy and childbirth (WHO, ACOG).',
            'Abdominal muscles: Diastasis recti should be closed or nearly closed for most women (ACOG, NICE).',
            'Hair: New growth is visible. Hair loss should have stopped (ACOG, AAD).',
            'Skin: Stretch marks fading, melasma improving (ACOG, AAD).',
            'Menstruation: May return for some breastfeeding mothers at 3-6 months (ACOG, WHO).',
        ],
        babyCareNotes: [
            '3-month well-baby checkup: weight, length, head circumference, development (IAP, WHO, MOHFW).',
            'Feeding: 5-6 times per day. Baby is very efficient at feeding (WHO, AAP, IAP).',
            'Tummy time: 40-60 minutes total daily (AAP, CDC).',
            'Sleep: May sleep 8-10 hours at night. 3-4 month sleep regression may occur (AAP, CDC).',
            'Baby may start teething — cool teething rings can help (AAP, CDC).',
            'Continue exclusive breastfeeding — no solids until 6 months (WHO, IAP, AAP, MOHFW).',
        ],
        babyDevelopment: [
            'Rolling: May roll both ways consistently (AAP, CDC).',
            'Sitting: Can sit with minimal support (CDC, AAP).',
            'Reaches and grasps objects with both hands (CDC, AAP).',
            'Brings everything to mouth — oral exploration (AAP, CDC).',
            'Laughs, squeals, and "talks" with varied sounds (AAP, CDC).',
            'Recognizes familiar people and may show preference for parents (CDC, AAP).',
            'Follows moving objects with eyes smoothly (CDC, AAP).',
        ],
        mentalHealthNotes: [
            'The end of the fourth trimester is a milestone — celebrate your strength (WHO, NICE).',
            'If returning to work, the transition may be emotionally challenging. Allow yourself to feel (NICE, MOHFW).',
            'Continue PPD monitoring — symptoms can develop at any time (WHO, ACOG, NICE).',
            'Indian context: Traditional confinement is well past. Establish your new normal (MOHFW, ICMR).',
            'Build your support network — other mothers, family, friends, healthcare providers (WHO, NICE).',
        ],
        activityNotes: [
            'Walking: 30-45 minutes brisk walking daily (WHO, ACOG).',
            'Strength training: Moderate to challenging weights, full-body workouts (ACOG, NICE).',
            'Postnatal yoga or Pilates: Regular classes (ACOG, NICE).',
            'Core: Can progress to more challenging exercises if diastasis recti is closed (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
            'High-impact exercise: Can begin gradually if pelvic floor is strong and no incontinence (ACOG, NICE).',
            'Running: Can begin with walk-run intervals (after doctor clearance) (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue balanced diet with adequate protein (74g if breastfeeding) (NIN India).',
            'Begin learning about solid food introduction at 6 months (WHO, AAP, IAP).',
            'Continue calcium (1200mg) and vitamin D supplementation (NIN, ICMR, WHO).',
            'Iron: Check levels if you feel fatigued. Anemia is common postpartum (WHO, NIN, MOHFW).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
        ],
        warningSigns: [
            'Persistent pelvic pain, pressure, or incontinence (ACOG, NICE, WHO).',
            'Pain during intercourse that hasn\'t improved (ACOG, NICE).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not smiling, not responding to sounds, or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not holding head up or not rolling (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Attend baby\'s 3-month checkup (IAP, WHO, MOHFW).',
            'Celebrate completing the fourth trimester — you have done incredible work (WHO, NICE).',
            'If returning to work, be gentle with yourself during the transition (NICE, MOHFW).',
            'Continue building physical fitness gradually (WHO, ACOG, NICE).',
            'Start reading about introducing solid foods at 6 months (WHO, AAP, IAP).',
        ],
    },

    // ═══════════════════════════════════════════════
    // EXTENDED POSTPARTUM PHASE — Week 13-52
    // ═══════════════════════════════════════════════
    {
        week: 13,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 13: Entering Extended Postpartum',
        summary: 'You have entered the extended postpartum phase. Your body has largely recovered, and focus shifts to long-term health, fitness, and your baby\'s development.',
        recoveryNotes: [
            'Physical recovery is complete for most women. Focus on long-term health (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises. Strong pelvic floor prevents future issues (ACOG, NICE, WHO).',
            'C-section scar: Continue massage if needed. Scar should be soft and fading (ACOG, NICE).',
            'Breastfeeding: Very efficient and well-established (WHO, AAP, IAP).',
            'Weight: Continue healthy habits. Breastfeeding burns 300-500 calories daily (WHO, ACOG, AAP).',
        ],
        bodyChanges: [
            'Body has largely returned to non-pregnant state (WHO, ACOG).',
            'Abdominal muscles: Should be closed for most women (ACOG, NICE).',
            'Hair: Baby hairs growing in. Hair cycle is normalizing (ACOG, AAD).',
            'Skin: Stretch marks and melasma continue to fade (ACOG, AAD).',
            'Fitness: You can now engage in most pre-pregnancy exercises (WHO, ACOG, NICE).',
        ],
        babyCareNotes: [
            'Feeding: 5-6 times per day. Baby is very efficient (WHO, AAP, IAP).',
            'Tummy time: 60 minutes total daily (AAP, CDC).',
            'Sleep: May sleep 9-11 hours at night. 4-month sleep regression is common (AAP, CDC).',
            'Baby is becoming more interactive — playtime is more engaging (CDC, AAP).',
            'Teething: First tooth may appear between 4-7 months (AAP, CDC).',
            'Continue exclusive breastfeeding until 6 months (WHO, IAP, AAP, MOHFW).',
        ],
        babyDevelopment: [
            'Rolling: Confident in both directions (AAP, CDC).',
            'Sitting: May sit with minimal support or independently (CDC, AAP).',
            'Reaches and grasps objects accurately (CDC, AAP).',
            'Brings objects to mouth — and may start to teeth (AAP, CDC).',
            'Babbles with consonant sounds ("ba", "da", "ma") (CDC, AAP).',
            'Recognizes own name and responds (CDC, AAP).',
            'May show interest in food you\'re eating (WHO, AAP, IAP).',
        ],
        mentalHealthNotes: [
            'Extended postpartum is a time of adjustment to your "new normal" (WHO, NICE).',
            'If you\'ve returned to work, balancing work and motherhood is challenging — be patient with yourself (NICE, MOHFW).',
            'Continue PPD monitoring — symptoms can develop at any time (WHO, ACOG, NICE).',
            'Indian context: Discuss childcare responsibilities openly with your partner and family (MOHFW, ICMR).',
            'Maintain social connections and self-care routines (WHO, NICE).',
        ],
        activityNotes: [
            'Most exercises are now safe if pelvic floor is strong and no diastasis recti (ACOG, NICE, WHO).',
            'Walking: 30-60 minutes daily (WHO, ACOG).',
            'Strength training: Full-body workouts, progressive overload (ACOG, NICE).',
            'Running: Can resume if cleared by doctor and no pelvic floor issues (ACOG, NICE).',
            'Postnatal yoga or Pilates: Regular practice (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
            'High-impact exercise: Gradually increase intensity (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue balanced diet. Breastfeeding requires 500 extra calories (WHO, NIN).',
            'Begin preparing for solid food introduction at 6 months (WHO, AAP, IAP).',
            'Continue calcium and iron-rich foods (NIN, ICMR, WHO).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
            'If you\'ve returned to work, plan nutritious meals and snacks in advance (NIN, ICMR).',
        ],
        warningSigns: [
            'Persistent pelvic pain or incontinence (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not rolling or showing head control (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Transition to long-term health and fitness routines (WHO, ACOG, NICE).',
            'If returning to work, establish pumping and childcare routines (MOHFW, ICMR).',
            'Continue to monitor baby\'s developmental milestones (IAP, WHO, CDC).',
            'Read about introducing solid foods at 6 months (WHO, AAP, IAP).',
            'Celebrate how far you have come in 3 months (WHO, NICE).',
        ],
    },
    {
        week: 14,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 14: Growing and Thriving',
        summary: 'Your baby is becoming more interactive and curious about the world. Your body is strong and capable as you continue the extended postpartum journey.',
        recoveryNotes: [
            'Body is well into the fitness phase. Maintain healthy habits (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE, WHO).',
            'Breastfeeding: Well-established. Some mothers may start thinking about weaning timeline (WHO, AAP, IAP).',
            'Weight: Healthy habits are more important than the number on the scale (WHO, ACOG).',
            'Energy levels should be good if sleep is adequate (WHO, NICE).',
        ],
        bodyChanges: [
            'Body is strong and capable (WHO, ACOG).',
            'Fitness is returning — you may feel stronger than pre-pregnancy (WHO, ACOG, NICE).',
            'Hair: New growth is filling in. Texture may be different temporarily (ACOG, AAD).',
            'Breasts: If breastfeeding, size is stable. If not, have returned to pre-pregnancy size (ACOG, NICE).',
            'Feet: Some women\'s shoe size permanently changes after pregnancy (ACOG, AAD).',
        ],
        babyCareNotes: [
            'Feeding: 5-6 times per day (WHO, AAP, IAP).',
            'Tummy time: 60-90 minutes total daily (AAP, CDC).',
            'Sleep: May sleep 10-12 hours at night with 1-2 feeds (AAP, CDC).',
            'Baby is very interactive — play, talk, sing, read (AAP, CDC, WHO).',
            'Teething: May be uncomfortable. Cool teething rings, gum massage help (AAP, CDC).',
            'Continue exclusive breastfeeding until 6 months (WHO, IAP, AAP, MOHFW).',
        ],
        babyDevelopment: [
            'Rolling: Expert in both directions (AAP, CDC).',
            'Sitting: May sit independently for short periods (CDC, AAP).',
            'Grasping: Uses both hands, transfers objects (CDC, AAP).',
            'Vocalizing: Babbles, laughs, squeals (AAP, CDC).',
            'Social: Responds to emotions in your voice (CDC, AAP).',
            'May start to show interest in solid foods (WHO, AAP, IAP).',
        ],
        mentalHealthNotes: [
            'Continue to monitor mood and energy levels (WHO, ACOG, NICE).',
            'If you\'ve returned to work, the routine should be establishing (NICE, MOHFW).',
            'Make time for yourself — even 30 minutes daily improves well-being (WHO, NICE).',
            'Connect with other mothers — shared experience is validating (WHO, NICE).',
            'If you\'re feeling overwhelmed, talk to your doctor (WHO, ACOG, NICE).',
        ],
        activityNotes: [
            'All exercises are generally safe if pelvic floor is strong (ACOG, NICE, WHO).',
            'Walking: 30-60 minutes daily (WHO, ACOG).',
            'Strength training: Regular workouts, progressive overload (ACOG, NICE).',
            'Running: Can resume if cleared (ACOG, NICE).',
            'Postnatal yoga or Pilates: Regular practice (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue balanced diet. Breastfeeding requires 500 extra calories (WHO, NIN).',
            'Begin planning for solid food introduction at 6 months (WHO, AAP, IAP).',
            'Continue calcium and iron-rich foods (NIN, ICMR, WHO).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
        ],
        warningSigns: [
            'Persistent pelvic pain or incontinence (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not rolling or not holding head up (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Continue building fitness and strength (WHO, ACOG, NICE).',
            'Plan for solid food introduction at 6 months (WHO, AAP, IAP).',
            'Monitor baby\'s developmental milestones (IAP, WHO, CDC).',
            'Make time for self-care and social connections (WHO, NICE).',
            'Celebrate your progress — you are doing an amazing job (WHO, NICE).',
        ],
    },
    {
        week: 15,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 15: Preparing for New Milestones',
        summary: 'Your baby is on the verge of major developmental leaps — sitting, solid foods, and more interactive play are coming soon.',
        recoveryNotes: [
            'Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises as a lifelong habit (ACOG, NICE, WHO).',
            'Breastfeeding: If considering weaning, plan gradual transition (WHO, AAP, IAP).',
            'Weight: Focus on health, not just weight (WHO, ACOG).',
            'Energy: Should be good with adequate sleep (WHO, NICE).',
        ],
        bodyChanges: [
            'Body is well into fitness phase (WHO, ACOG).',
            'Strength and endurance are improving (WHO, ACOG, NICE).',
            'Hair: New growth is filling in well (ACOG, AAD).',
            'Skin: Stretch marks and melasma continue to fade (ACOG, AAD).',
            'Overall: You may feel more like yourself than you have since delivery (WHO, NICE).',
        ],
        babyCareNotes: [
            'Feeding: 5 times per day. May show strong interest in your food (WHO, AAP, IAP).',
            'Tummy time: 60-90 minutes total daily (AAP, CDC).',
            'Sleep: May sleep 10-12 hours at night (AAP, CDC).',
            '4-month sleep regression may occur — temporary disruption due to brain development (AAP, CDC).',
            'Teething: First tooth may appear soon (AAP, CDC).',
            'Continue exclusive breastfeeding until 6 months (WHO, IAP, AAP, MOHFW).',
        ],
        babyDevelopment: [
            'Sitting: May sit with support or independently (CDC, AAP).',
            'Rolling: Expert in both directions (AAP, CDC).',
            'Grasping: Reaches for objects, brings to mouth (CDC, AAP).',
            'Vocalizing: Babbles with consonant sounds (AAP, CDC).',
            'Social: Recognizes family, may show stranger anxiety (CDC, AAP).',
            'May start to push up on hands during tummy time (precursor to crawling) (AAP, CDC).',
        ],
        mentalHealthNotes: [
            'Continue to monitor mood. PPD can develop at any time (WHO, ACOG, NICE).',
            'If you\'re feeling isolated, join a mother\'s group or online community (WHO, NICE).',
            'Indian context: Family support is invaluable. Don\'t hesitate to ask for help (MOHFW, ICMR).',
            'Practice self-compassion — motherhood is a journey, not a destination (WHO, NICE).',
        ],
        activityNotes: [
            'All exercises are generally safe (ACOG, NICE, WHO).',
            'Walking: 30-60 minutes daily (WHO, ACOG).',
            'Strength training: Regular workouts (ACOG, NICE).',
            'Running: Can resume if cleared (ACOG, NICE).',
            'Postnatal yoga or Pilates: Regular practice (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'Read about baby-led weaning and traditional Indian approaches to starting solids (WHO, AAP, IAP, NIN).',
            'Continue calcium and iron-rich foods (NIN, ICMR, WHO).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
        ],
        warningSigns: [
            'Persistent pelvic pain or incontinence (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not rolling or not holding head up (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Continue fitness and health routines (WHO, ACOG, NICE).',
            'Prepare for 4-month checkup and vaccinations (IAP, WHO, MOHFW).',
            'Read about starting solids at 6 months (WHO, AAP, IAP).',
            'Monitor baby\'s developmental milestones (IAP, WHO, CDC).',
            'Prioritize self-care and social connections (WHO, NICE).',
        ],
    },
    {
        week: 16,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 16: Four Months Postpartum',
        summary: 'Four months postpartum. Your baby is at a delightful stage — interactive, smiling, and developing rapidly. Prepare for the 4-month checkup.',
        recoveryNotes: [
            'Body is well-recovered. Focus on long-term health and fitness (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE, WHO).',
            'Breastfeeding: Very well-established. Some mothers may introduce occasional bottles (WHO, AAP, IAP).',
            'Weight: Healthy habits are more important than rapid weight loss (WHO, ACOG).',
            'Fitness: You should be able to do most exercises comfortably (WHO, ACOG, NICE).',
        ],
        bodyChanges: [
            'Body is strong and capable (WHO, ACOG).',
            'Fitness is returning to pre-pregnancy levels (WHO, ACOG, NICE).',
            'Hair: New growth is visible. Hair cycle is normalizing (ACOG, AAD).',
            'Skin: Changes are fading (ACOG, AAD).',
            'Feet: Shoe size may have permanently changed (ACOG, AAD).',
        ],
        babyCareNotes: [
            '4-month well-baby checkup: Weight, length, head circumference, development (IAP, WHO, MOHFW).',
            'Vaccinations: DPT, IPV, Hib, Rotavirus, PCV boosters (IAP schedule, WHO, MOHFW).',
            'Feeding: 5 times per day. May show strong interest in food (WHO, AAP, IAP).',
            'Tummy time: 60-90 minutes total daily (AAP, CDC).',
            'Sleep: 4-month sleep regression is common — temporary disruption (AAP, CDC).',
            'Continue exclusive breastfeeding until 6 months (WHO, IAP, AAP, MOHFW).',
        ],
        babyDevelopment: [
            'Sitting: May sit with support. Some babies sit independently (CDC, AAP).',
            'Rolling: Expert in both directions (AAP, CDC).',
            'Grasping: Reaches for objects, brings to mouth (CDC, AAP).',
            'Vocalizing: Babbles, laughs, squeals (AAP, CDC).',
            'Social: Recognizes family, may show stranger anxiety (CDC, AAP).',
            'May push up on hands during tummy time (AAP, CDC).',
            'May start to show readiness for solids (interest in food, good head control, sitting with support) (WHO, AAP, IAP).',
        ],
        mentalHealthNotes: [
            'Continue to monitor mood. PPD can develop at any time (WHO, ACOG, NICE).',
            'If you\'ve returned to work, you should be settling into a routine (NICE, MOHFW).',
            'Make time for yourself — self-care is essential (WHO, NICE).',
            'Connect with other mothers — shared experience is validating (WHO, NICE).',
        ],
        activityNotes: [
            'All exercises are generally safe (ACOG, NICE, WHO).',
            'Walking: 30-60 minutes daily (WHO, ACOG).',
            'Strength training: Regular workouts (ACOG, NICE).',
            'Running: Can resume if cleared (ACOG, NICE).',
            'Postnatal yoga or Pilates: Regular practice (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'If introducing solids soon, educate yourself about first foods (WHO, AAP, IAP).',
            'Continue calcium and iron-rich foods (NIN, ICMR, WHO).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
        ],
        warningSigns: [
            'Persistent pelvic pain or incontinence (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not rolling or not holding head up (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Attend baby\'s 4-month checkup and vaccinations (IAP, WHO, MOHFW).',
            'Continue fitness and health routines (WHO, ACOG, NICE).',
            'Prepare for starting solids at 6 months (WHO, AAP, IAP).',
            'Monitor baby\'s developmental milestones (IAP, WHO, CDC).',
            'Prioritize self-care and social connections (WHO, NICE).',
        ],
    },
    {
        week: 17,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 17: Curiosity and Exploration',
        summary: 'Your baby is increasingly curious about the world. This is a wonderful time of discovery as your baby becomes more mobile and interactive.',
        recoveryNotes: [
            'Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE, WHO).',
            'Breastfeeding: Well-established. If weaning, do so gradually (WHO, AAP, IAP).',
            'Weight: Maintain healthy habits (WHO, ACOG).',
            'Energy: Should be good with adequate sleep (WHO, NICE).',
        ],
        bodyChanges: [
            'Body is well-recovered and strong (WHO, ACOG).',
            'Fitness is good — you may be stronger than pre-pregnancy (WHO, ACOG, NICE).',
            'Hair: New growth is filling in (ACOG, AAD).',
            'Overall: You should feel largely like yourself (WHO, NICE).',
        ],
        babyCareNotes: [
            'Feeding: 5 times per day. May show strong interest in your food (WHO, AAP, IAP).',
            'Tummy time: 60-90 minutes total daily (AAP, CDC).',
            'Baby may be starting to sit independently (CDC, AAP).',
            'Sleep: May be disrupted by developmental leaps (AAP, CDC).',
            'Teething: First tooth may appear (AAP, CDC).',
            'Continue exclusive breastfeeding until 6 months (WHO, IAP, AAP, MOHFW).',
        ],
        babyDevelopment: [
            'Sitting: May sit independently (CDC, AAP).',
            'Rolling: Expert in both directions (AAP, CDC).',
            'Grasping: Reaches for objects, brings to mouth (CDC, AAP).',
            'Vocalizing: Babbles, may start consonant-vowel combinations (AAP, CDC).',
            'Social: Recognizes family, may show stranger anxiety (CDC, AAP).',
            'May start to rock on hands and knees (pre-crawling) (AAP, CDC).',
        ],
        mentalHealthNotes: [
            'Continue to monitor mood (WHO, ACOG, NICE).',
            'If you\'re feeling overwhelmed, talk to your doctor (WHO, NICE, ACOG).',
            'Connect with other mothers for support (WHO, NICE).',
            'Practice self-compassion — you are doing an incredible job (WHO, NICE).',
        ],
        activityNotes: [
            'All exercises are generally safe (ACOG, NICE, WHO).',
            'Walking: 30-60 minutes daily (WHO, ACOG).',
            'Strength training: Regular workouts (ACOG, NICE).',
            'Running: Can resume if cleared (ACOG, NICE).',
            'Postnatal yoga or Pilates: Regular practice (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'If introducing solids soon, prepare first foods: rice cereal, mashed fruits, vegetables (WHO, AAP, IAP, NIN).',
            'Continue calcium and iron-rich foods (NIN, ICMR, WHO).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
        ],
        warningSigns: [
            'Persistent pelvic pain or incontinence (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not rolling or not holding head up (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Continue fitness and health routines (WHO, ACOG, NICE).',
            'Prepare for starting solids at 6 months (WHO, AAP, IAP).',
            'Monitor baby\'s developmental milestones (IAP, WHO, CDC).',
            'Baby-proof your home as mobility increases (AAP, CDC).',
            'Prioritize self-care and social connections (WHO, NICE).',
        ],
    },
    {
        week: 18,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 18: Growing Independence',
        summary: 'Your baby is becoming more independent in movement and communication. The world is an exciting place to explore.',
        recoveryNotes: [
            'Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE, WHO).',
            'Breastfeeding: Well-established. If weaning, do so gradually (WHO, AAP, IAP).',
            'Weight: Maintain healthy habits (WHO, ACOG).',
            'Fitness: You should be able to do all exercises comfortably (WHO, ACOG, NICE).',
        ],
        bodyChanges: [
            'Body is well-recovered and strong (WHO, ACOG).',
            'Fitness is good — you may be stronger than pre-pregnancy (WHO, ACOG, NICE).',
            'Hair: New growth is filling in (ACOG, AAD).',
            'Overall: You should feel largely like yourself (WHO, NICE).',
        ],
        babyCareNotes: [
            'Feeding: 5 times per day. Interest in solid foods is increasing (WHO, AAP, IAP).',
            'Tummy time: 60-90 minutes total daily (AAP, CDC).',
            'Baby may be sitting independently (CDC, AAP).',
            'Sleep: May be consolidating. 4-month regression should be resolving (AAP, CDC).',
            'Teething: First tooth may appear (AAP, CDC).',
            'Continue exclusive breastfeeding until 6 months (WHO, IAP, AAP, MOHFW).',
        ],
        babyDevelopment: [
            'Sitting: May sit independently (CDC, AAP).',
            'Rolling: Expert in both directions (AAP, CDC).',
            'Grasping: Reaches for objects, brings to mouth (CDC, AAP).',
            'Vocalizing: Babbles, may start consonant-vowel combinations (AAP, CDC).',
            'Social: Recognizes family, may show stranger anxiety (CDC, AAP).',
            'May start to rock on hands and knees (pre-crawling) (AAP, CDC).',
            'May start to show readiness for solids (WHO, AAP, IAP).',
        ],
        mentalHealthNotes: [
            'Continue to monitor mood (WHO, ACOG, NICE).',
            'If you\'re feeling overwhelmed, talk to your doctor (WHO, NICE, ACOG).',
            'Connect with other mothers for support (WHO, NICE).',
            'Practice self-compassion — you are doing an incredible job (WHO, NICE).',
        ],
        activityNotes: [
            'All exercises are generally safe (ACOG, NICE, WHO).',
            'Walking: 30-60 minutes daily (WHO, ACOG).',
            'Strength training: Regular workouts (ACOG, NICE).',
            'Running: Can resume if cleared (ACOG, NICE).',
            'Postnatal yoga or Pilates: Regular practice (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'If introducing solids soon, prepare first foods (WHO, AAP, IAP, NIN).',
            'Continue calcium and iron-rich foods (NIN, ICMR, WHO).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
        ],
        warningSigns: [
            'Persistent pelvic pain or incontinence (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not rolling or not holding head up (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Continue fitness and health routines (WHO, ACOG, NICE).',
            'Prepare for starting solids at 6 months (WHO, AAP, IAP).',
            'Monitor baby\'s developmental milestones (IAP, WHO, CDC).',
            'Baby-proof your home as mobility increases (AAP, CDC).',
            'Prioritize self-care and social connections (WHO, NICE).',
        ],
    },
    {
        week: 19,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 19: Preparing for Solids',
        summary: 'Solid food introduction is approaching. Your baby is showing increasing interest in the world and may be showing signs of readiness for solids.',
        recoveryNotes: [
            'Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE, WHO).',
            'Breastfeeding: Well-established. If weaning, do so gradually (WHO, AAP, IAP).',
            'Weight: Maintain healthy habits (WHO, ACOG).',
            'Fitness: You should be able to do all exercises comfortably (WHO, ACOG, NICE).',
        ],
        bodyChanges: [
            'Body is well-recovered and strong (WHO, ACOG).',
            'Fitness is good — you may be stronger than pre-pregnancy (WHO, ACOG, NICE).',
            'Hair: New growth is filling in (ACOG, AAD).',
            'Overall: You should feel largely like yourself (WHO, NICE).',
        ],
        babyCareNotes: [
            'Feeding: 5 times per day. May show strong interest in your food (WHO, AAP, IAP).',
            'Tummy time: 60-90 minutes total daily (AAP, CDC).',
            'Baby may be sitting independently (CDC, AAP).',
            'Sleep: May be consolidating (AAP, CDC).',
            'Teething: First tooth may appear (AAP, CDC).',
            'Continue exclusive breastfeeding until 6 months (WHO, IAP, AAP, MOHFW).',
        ],
        babyDevelopment: [
            'Sitting: May sit independently (CDC, AAP).',
            'Rolling: Expert in both directions (AAP, CDC).',
            'Grasping: Reaches for objects, brings to mouth (CDC, AAP).',
            'Vocalizing: Babbles, may start consonant-vowel combinations (AAP, CDC).',
            'Social: Recognizes family, may show stranger anxiety (CDC, AAP).',
            'May start to rock on hands and knees (pre-crawling) (AAP, CDC).',
            'May show readiness for solids: interest in food, good head control, sitting with support (WHO, AAP, IAP).',
        ],
        mentalHealthNotes: [
            'Continue to monitor mood (WHO, ACOG, NICE).',
            'If you\'re feeling overwhelmed, talk to your doctor (WHO, NICE, ACOG).',
            'Connect with other mothers for support (WHO, NICE).',
            'Practice self-compassion — you are doing an incredible job (WHO, NICE).',
        ],
        activityNotes: [
            'All exercises are generally safe (ACOG, NICE, WHO).',
            'Walking: 30-60 minutes daily (WHO, ACOG).',
            'Strength training: Regular workouts (ACOG, NICE).',
            'Running: Can resume if cleared (ACOG, NICE).',
            'Postnatal yoga or Pilates: Regular practice (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'If introducing solids soon, prepare first foods (WHO, AAP, IAP, NIN).',
            'Continue calcium and iron-rich foods (NIN, ICMR, WHO).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
        ],
        warningSigns: [
            'Persistent pelvic pain or incontinence (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not rolling or not holding head up (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Continue fitness and health routines (WHO, ACOG, NICE).',
            'Prepare for starting solids at 6 months (WHO, AAP, IAP).',
            'Monitor baby\'s developmental milestones (IAP, WHO, CDC).',
            'Baby-proof your home as mobility increases (AAP, CDC).',
            'Prioritize self-care and social connections (WHO, NICE).',
        ],
    },
    {
        week: 20,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 20: Five Months Postpartum',
        summary: 'Five months postpartum. Solid food introduction is just weeks away. Your baby is becoming more mobile and interactive every day.',
        recoveryNotes: [
            'Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE, WHO).',
            'Breastfeeding: Well-established. If weaning, do so gradually (WHO, AAP, IAP).',
            'Weight: Maintain healthy habits (WHO, ACOG).',
            'Fitness: You should be able to do all exercises comfortably (WHO, ACOG, NICE).',
        ],
        bodyChanges: [
            'Body is well-recovered and strong (WHO, ACOG).',
            'Fitness is good — you may be stronger than pre-pregnancy (WHO, ACOG, NICE).',
            'Hair: New growth is filling in (ACOG, AAD).',
            'Overall: You should feel largely like yourself (WHO, NICE).',
        ],
        babyCareNotes: [
            'Feeding: 5 times per day. Interest in solid foods is strong (WHO, AAP, IAP).',
            'Tummy time: 90+ minutes total daily (AAP, CDC).',
            'Baby may be sitting independently (CDC, AAP).',
            'Sleep: May be consolidating (AAP, CDC).',
            'Teething: First tooth may appear (AAP, CDC).',
            'Continue exclusive breastfeeding until 6 months (WHO, IAP, AAP, MOHFW).',
        ],
        babyDevelopment: [
            'Sitting: May sit independently (CDC, AAP).',
            'Rolling: Expert in both directions (AAP, CDC).',
            'Grasping: Reaches for objects, brings to mouth (CDC, AAP).',
            'Vocalizing: Babbles, may start consonant-vowel combinations (AAP, CDC).',
            'Social: Recognizes family, may show stranger anxiety (CDC, AAP).',
            'May start to rock on hands and knees (pre-crawling) (AAP, CDC).',
            'Shows readiness for solids: interest in food, good head control, sitting with support (WHO, AAP, IAP).',
        ],
        mentalHealthNotes: [
            'Continue to monitor mood (WHO, ACOG, NICE).',
            'If you\'re feeling overwhelmed, talk to your doctor (WHO, NICE, ACOG).',
            'Connect with other mothers for support (WHO, NICE).',
            'Practice self-compassion — you are doing an incredible job (WHO, NICE).',
        ],
        activityNotes: [
            'All exercises are generally safe (ACOG, NICE, WHO).',
            'Walking: 30-60 minutes daily (WHO, ACOG).',
            'Strength training: Regular workouts (ACOG, NICE).',
            'Running: Can resume if cleared (ACOG, NICE).',
            'Postnatal yoga or Pilates: Regular practice (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'Prepare for solid food introduction: rice cereal, mashed fruits, vegetables (WHO, AAP, IAP, NIN).',
            'Continue calcium and iron-rich foods (NIN, ICMR, WHO).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
        ],
        warningSigns: [
            'Persistent pelvic pain or incontinence (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not rolling or not holding head up (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Continue fitness and health routines (WHO, ACOG, NICE).',
            'Prepare for starting solids at 6 months (WHO, AAP, IAP).',
            'Monitor baby\'s developmental milestones (IAP, WHO, CDC).',
            'Baby-proof your home as mobility increases (AAP, CDC).',
            'Prioritize self-care and social connections (WHO, NICE).',
        ],
    },
    {
        week: 21,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 21: Almost Half a Year',
        summary: 'Approaching the 6-month milestone. Your baby is on the verge of starting solid foods and becoming more mobile.',
        recoveryNotes: [
            'Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE, WHO).',
            'Breastfeeding: Well-established. Continue breastfeeding alongside solids (WHO, AAP, IAP).',
            'Weight: Maintain healthy habits (WHO, ACOG).',
            'Fitness: You should be able to do all exercises comfortably (WHO, ACOG, NICE).',
        ],
        bodyChanges: [
            'Body is well-recovered and strong (WHO, ACOG).',
            'Fitness is good — you may be stronger than pre-pregnancy (WHO, ACOG, NICE).',
            'Hair: New growth is filling in (ACOG, AAD).',
            'Overall: You should feel largely like yourself (WHO, NICE).',
        ],
        babyCareNotes: [
            'Feeding: 5 times per day. Prepare for solid food introduction (WHO, AAP, IAP).',
            'Tummy time: 90+ minutes total daily (AAP, CDC).',
            'Baby may be sitting independently (CDC, AAP).',
            'Sleep: May be consolidating (AAP, CDC).',
            'Teething: First tooth may appear (AAP, CDC).',
            'Continue breastfeeding alongside solids from 6 months (WHO, AAP, IAP).',
        ],
        babyDevelopment: [
            'Sitting: May sit independently (CDC, AAP).',
            'Rolling: Expert in both directions (AAP, CDC).',
            'Grasping: Reaches for objects, brings to mouth (CDC, AAP).',
            'Vocalizing: Babbles, may start consonant-vowel combinations (AAP, CDC).',
            'Social: Recognizes family, may show stranger anxiety (CDC, AAP).',
            'May start to rock on hands and knees (pre-crawling) (AAP, CDC).',
            'Shows readiness for solids: interest in food, good head control, sitting with support (WHO, AAP, IAP).',
        ],
        mentalHealthNotes: [
            'Continue to monitor mood (WHO, ACOG, NICE).',
            'If you\'re feeling overwhelmed, talk to your doctor (WHO, NICE, ACOG).',
            'Connect with other mothers for support (WHO, NICE).',
            'Practice self-compassion — you are doing an incredible job (WHO, NICE).',
        ],
        activityNotes: [
            'All exercises are generally safe (ACOG, NICE, WHO).',
            'Walking: 30-60 minutes daily (WHO, ACOG).',
            'Strength training: Regular workouts (ACOG, NICE).',
            'Running: Can resume if cleared (ACOG, NICE).',
            'Postnatal yoga or Pilates: Regular practice (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'Prepare for solid food introduction (WHO, AAP, IAP, NIN).',
            'Continue calcium and iron-rich foods (NIN, ICMR, WHO).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
        ],
        warningSigns: [
            'Persistent pelvic pain or incontinence (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not rolling or not holding head up (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Continue fitness and health routines (WHO, ACOG, NICE).',
            'Prepare for starting solids at 6 months (WHO, AAP, IAP).',
            'Monitor baby\'s developmental milestones (IAP, WHO, CDC).',
            'Baby-proof your home as mobility increases (AAP, CDC).',
            'Prioritize self-care and social connections (WHO, NICE).',
        ],
    },
    {
        week: 22,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 22: The World of Food Awaits',
        summary: 'Solid food introduction is just around the corner. Your baby is showing all the signs of readiness for this exciting milestone.',
        recoveryNotes: [
            'Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE, WHO).',
            'Breastfeeding: Continue breastfeeding alongside solids (WHO, AAP, IAP).',
            'Weight: Maintain healthy habits (WHO, ACOG).',
            'Fitness: Maintain regular exercise routine (WHO, ACOG, NICE).',
        ],
        bodyChanges: [
            'Body is well-recovered and strong (WHO, ACOG).',
            'Fitness is good — maintain regular exercise (WHO, ACOG, NICE).',
            'Hair: New growth is filling in (ACOG, AAD).',
            'Overall: You should feel largely like yourself (WHO, NICE).',
        ],
        babyCareNotes: [
            'Feeding: 5 times per day. Prepare for solid food introduction (WHO, AAP, IAP).',
            'Tummy time: 90+ minutes total daily (AAP, CDC).',
            'Baby may be sitting independently (CDC, AAP).',
            'Sleep: May be consolidating (AAP, CDC).',
            'Teething: First tooth may appear (AAP, CDC).',
            'Continue breastfeeding alongside solids (WHO, AAP, IAP).',
        ],
        babyDevelopment: [
            'Sitting: May sit independently (CDC, AAP).',
            'Rolling: Expert in both directions (AAP, CDC).',
            'Grasping: Reaches for objects, brings to mouth (CDC, AAP).',
            'Vocalizing: Babbles, may start consonant-vowel combinations (AAP, CDC).',
            'Social: Recognizes family, may show stranger anxiety (CDC, AAP).',
            'May start to rock on hands and knees (pre-crawling) (AAP, CDC).',
            'Shows readiness for solids: interest in food, good head control, sitting with support (WHO, AAP, IAP).',
        ],
        mentalHealthNotes: [
            'Continue to monitor mood (WHO, ACOG, NICE).',
            'If you\'re feeling overwhelmed, talk to your doctor (WHO, NICE, ACOG).',
            'Connect with other mothers for support (WHO, NICE).',
            'Practice self-compassion — you are doing an incredible job (WHO, NICE).',
        ],
        activityNotes: [
            'All exercises are generally safe (ACOG, NICE, WHO).',
            'Walking: 30-60 minutes daily (WHO, ACOG).',
            'Strength training: Regular workouts (ACOG, NICE).',
            'Running: Can resume if cleared (ACOG, NICE).',
            'Postnatal yoga or Pilates: Regular practice (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'Prepare for solid food introduction (WHO, AAP, IAP, NIN).',
            'Continue calcium and iron-rich foods (NIN, ICMR, WHO).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
        ],
        warningSigns: [
            'Persistent pelvic pain or incontinence (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not rolling or not holding head up (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Continue fitness and health routines (WHO, ACOG, NICE).',
            'Prepare for starting solids at 6 months (WHO, AAP, IAP).',
            'Monitor baby\'s developmental milestones (IAP, WHO, CDC).',
            'Baby-proof your home as mobility increases (AAP, CDC).',
            'Prioritize self-care and social connections (WHO, NICE).',
        ],
    },
    {
        week: 23,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 23: Countdown to Solids',
        summary: 'Just one more week of exclusive breastfeeding. Your baby is ready for the exciting world of solid foods.',
        recoveryNotes: [
            'Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE, WHO).',
            'Breastfeeding: Continue breastfeeding alongside solids (WHO, AAP, IAP).',
            'Weight: Maintain healthy habits (WHO, ACOG).',
            'Fitness: Maintain regular exercise routine (WHO, ACOG, NICE).',
        ],
        bodyChanges: [
            'Body is well-recovered and strong (WHO, ACOG).',
            'Fitness is good — maintain regular exercise (WHO, ACOG, NICE).',
            'Hair: New growth is filling in (ACOG, AAD).',
            'Overall: You should feel largely like yourself (WHO, NICE).',
        ],
        babyCareNotes: [
            'Feeding: 5 times per day. Prepare for solid food introduction (WHO, AAP, IAP).',
            'Tummy time: 90+ minutes total daily (AAP, CDC).',
            'Baby may be sitting independently (CDC, AAP).',
            'Sleep: May be consolidating (AAP, CDC).',
            'Teething: First tooth may appear (AAP, CDC).',
            'Continue breastfeeding alongside solids (WHO, AAP, IAP).',
        ],
        babyDevelopment: [
            'Sitting: May sit independently (CDC, AAP).',
            'Rolling: Expert in both directions (AAP, CDC).',
            'Grasping: Reaches for objects, brings to mouth (CDC, AAP).',
            'Vocalizing: Babbles, may start consonant-vowel combinations (AAP, CDC).',
            'Social: Recognizes family, may show stranger anxiety (CDC, AAP).',
            'May start to rock on hands and knees (pre-crawling) (AAP, CDC).',
            'Shows readiness for solids: interest in food, good head control, sitting with support (WHO, AAP, IAP).',
        ],
        mentalHealthNotes: [
            'Continue to monitor mood (WHO, ACOG, NICE).',
            'If you\'re feeling overwhelmed, talk to your doctor (WHO, NICE, ACOG).',
            'Connect with other mothers for support (WHO, NICE).',
            'Practice self-compassion — you are doing an incredible job (WHO, NICE).',
        ],
        activityNotes: [
            'All exercises are generally safe (ACOG, NICE, WHO).',
            'Walking: 30-60 minutes daily (WHO, ACOG).',
            'Strength training: Regular workouts (ACOG, NICE).',
            'Running: Can resume if cleared (ACOG, NICE).',
            'Postnatal yoga or Pilates: Regular practice (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'Prepare for solid food introduction (WHO, AAP, IAP, NIN).',
            'Continue calcium and iron-rich foods (NIN, ICMR, WHO).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
        ],
        warningSigns: [
            'Persistent pelvic pain or incontinence (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not rolling or not holding head up (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Continue fitness and health routines (WHO, ACOG, NICE).',
            'Prepare for starting solids at 6 months (WHO, AAP, IAP).',
            'Monitor baby\'s developmental milestones (IAP, WHO, CDC).',
            'Baby-proof your home as mobility increases (AAP, CDC).',
            'Prioritize self-care and social connections (WHO, NICE).',
        ],
    },
    {
        week: 24,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 24: Six Months — Starting Solids',
        summary: 'Six months postpartum — a major milestone. Your baby can start solid foods while continuing to breastfeed. The world of flavors begins!',
        recoveryNotes: [
            'Body is strong and healthy. Six months of recovery and growth (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE, WHO).',
            'Breastfeeding: Continue breastfeeding alongside solids. Breastmilk remains the primary nutrition source (WHO, AAP, IAP).',
            'Weight: You may have returned to pre-pregnancy weight or be close. If not, maintain healthy habits (WHO, ACOG).',
            'Fitness: Maintain regular exercise routine (WHO, ACOG, NICE).',
        ],
        bodyChanges: [
            'Body is well-recovered and strong (WHO, ACOG).',
            'Fitness is good — you may be stronger than pre-pregnancy (WHO, ACOG, NICE).',
            'Hair: Hair cycle is normalized (ACOG, AAD).',
            'Skin: Stretch marks and melasma are fading (ACOG, AAD).',
            'Overall: You should feel like yourself (WHO, NICE).',
        ],
        babyCareNotes: [
            '6-month well-baby checkup: Weight, length, head circumference, development (IAP, WHO, MOHFW).',
            'Vaccinations: DPT, IPV, Hib, Rotavirus, PCV boosters, influenza (IAP schedule, WHO, MOHFW).',
            'Feeding: Breastfeed 4-5 times per day + start solid foods (WHO, AAP, IAP).',
            'First foods: Rice cereal, mashed banana, mashed potato, dal water, khichdi (WHO, AAP, IAP, NIN).',
            'Start with 1-2 teaspoons once daily, gradually increase (WHO, AAP, IAP).',
            'Continue breastfeeding as primary nutrition source until 12 months (WHO, AAP, IAP).',
        ],
        babyDevelopment: [
            'Sitting: May sit independently (CDC, AAP).',
            'Rolling: Expert in both directions (AAP, CDC).',
            'May start to crawl or rock on hands and knees (AAP, CDC).',
            'Grasping: Uses both hands, transfers objects (CDC, AAP).',
            'Vocalizing: Babbles with consonant sounds (AAP, CDC).',
            'Social: Recognizes family, may show stranger anxiety (CDC, AAP).',
            'Teething: First tooth may appear (AAP, CDC).',
            'Shows interest in food and may open mouth for spoon (WHO, AAP, IAP).',
        ],
        mentalHealthNotes: [
            'Six months is a significant milestone — celebrate how far you have come (WHO, NICE).',
            'If you\'re feeling overwhelmed, talk to your doctor (WHO, NICE, ACOG).',
            'Weaning from breastfeeding (if planned) should be gradual and gentle (WHO, AAP, IAP).',
            'Connect with other mothers — shared experience is validating (WHO, NICE).',
        ],
        activityNotes: [
            'All exercises are safe (ACOG, NICE, WHO).',
            'Walking: 30-60 minutes daily (WHO, ACOG).',
            'Strength training: Regular workouts (ACOG, NICE).',
            'Running: Regular running if cleared (ACOG, NICE).',
            'Postnatal yoga or Pilates: Regular practice (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'Introduce solid foods to baby: start with single-ingredient purees (WHO, AAP, IAP).',
            'Continue calcium and iron-rich foods for yourself (NIN, ICMR, WHO).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
            'Baby\'s first foods should be iron-rich: fortified rice cereal, mashed dal, pureed spinach (WHO, AAP, IAP, NIN).',
        ],
        warningSigns: [
            'Persistent pelvic pain or incontinence (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not sitting with support (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
            'Allergic reaction to new foods: rash, swelling, difficulty breathing (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Attend baby\'s 6-month checkup and vaccinations (IAP, WHO, MOHFW).',
            'Start solid foods — introduce one new food at a time, wait 3 days before next (WHO, AAP, IAP).',
            'Continue breastfeeding as primary nutrition (WHO, AAP, IAP).',
            'Celebrate six months of motherhood — you are doing an amazing job (WHO, NICE).',
            'Monitor baby\'s developmental milestones (IAP, WHO, CDC).',
        ],
    },
    {
        week: 25,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 25: Exploring New Tastes',
        summary: 'Your baby is exploring the world of solid foods. Each new taste is an adventure. Continue breastfeeding alongside solids.',
        recoveryNotes: [
            'Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE, WHO).',
            'Breastfeeding: Continue alongside solids. Breastmilk is still primary nutrition (WHO, AAP, IAP).',
            'Weight: Maintain healthy habits (WHO, ACOG).',
            'Fitness: Maintain regular exercise routine (WHO, ACOG, NICE).',
        ],
        bodyChanges: [
            'Body is well-recovered and strong (WHO, ACOG).',
            'Fitness is good — maintain regular exercise (WHO, ACOG, NICE).',
            'Overall: You should feel like yourself (WHO, NICE).',
        ],
        babyCareNotes: [
            'Feeding: Breastfeed 4-5 times per day + solids 1-2 times daily (WHO, AAP, IAP).',
            'Introduce new foods one at a time, waiting 3 days between new foods (WHO, AAP, IAP).',
            'Watch for allergic reactions: rash, swelling, vomiting, diarrhea (WHO, AAP, IAP).',
            'Tummy time: 90+ minutes total daily (AAP, CDC).',
            'Baby may be sitting independently (CDC, AAP).',
            'Sleep: May be consolidating with 2-3 naps (AAP, CDC).',
        ],
        babyDevelopment: [
            'Sitting: May sit independently (CDC, AAP).',
            'Crawling: May start to crawl or rock on hands and knees (AAP, CDC).',
            'Grasping: Uses pincer grasp (thumb and forefinger) (CDC, AAP).',
            'Vocalizing: Babbles, may start consonant-vowel combinations (AAP, CDC).',
            'Social: Recognizes family, may show stranger anxiety (CDC, AAP).',
            'Teething: First tooth may appear (AAP, CDC).',
        ],
        mentalHealthNotes: [
            'Continue to monitor mood (WHO, ACOG, NICE).',
            'If you\'re feeling overwhelmed, talk to your doctor (WHO, NICE, ACOG).',
            'Connect with other mothers for support (WHO, NICE).',
            'Practice self-compassion — you are doing an incredible job (WHO, NICE).',
        ],
        activityNotes: [
            'All exercises are safe (ACOG, NICE, WHO).',
            'Walking: 30-60 minutes daily (WHO, ACOG).',
            'Strength training: Regular workouts (ACOG, NICE).',
            'Running: Regular running if cleared (ACOG, NICE).',
            'Postnatal yoga or Pilates: Regular practice (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'Baby: Introduce soft, mashed foods. Iron-rich foods are priority (WHO, AAP, IAP, NIN).',
            'Continue calcium and iron-rich foods for yourself (NIN, ICMR, WHO).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
        ],
        warningSigns: [
            'Persistent pelvic pain or incontinence (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not sitting with support (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
            'Allergic reaction to new foods (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Continue introducing new foods to baby — one at a time (WHO, AAP, IAP).',
            'Continue breastfeeding alongside solids (WHO, AAP, IAP).',
            'Monitor baby\'s developmental milestones (IAP, WHO, CDC).',
            'Baby-proof your home as mobility increases (AAP, CDC).',
            'Prioritize self-care and social connections (WHO, NICE).',
        ],
    },
    {
        week: 26,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 26: Half a Year of Motherhood',
        summary: 'Six and a half months postpartum. Your baby is eating solids, becoming more mobile, and developing a unique personality.',
        recoveryNotes: [
            'Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE, WHO).',
            'Breastfeeding: Continue alongside solids (WHO, AAP, IAP).',
            'Weight: Maintain healthy habits (WHO, ACOG).',
            'Fitness: Maintain regular exercise routine (WHO, ACOG, NICE).',
        ],
        bodyChanges: [
            'Body is well-recovered and strong (WHO, ACOG).',
            'Fitness is good — maintain regular exercise (WHO, ACOG, NICE).',
            'Overall: You should feel like yourself (WHO, NICE).',
        ],
        babyCareNotes: [
            'Feeding: Breastfeed 4-5 times per day + solids 2 times daily (WHO, AAP, IAP).',
            'Introduce variety of foods: fruits, vegetables, cereals, dal (WHO, AAP, IAP, NIN).',
            'Tummy time: 90+ minutes total daily (AAP, CDC).',
            'Baby may be crawling or preparing to crawl (AAP, CDC).',
            'Sleep: 2-3 naps per day, longer night sleep (AAP, CDC).',
            'Continue breastfeeding as primary nutrition (WHO, AAP, IAP).',
        ],
        babyDevelopment: [
            'Sitting: Independently (CDC, AAP).',
            'Crawling: May be crawling or rocking on hands and knees (AAP, CDC).',
            'Grasping: Pincer grasp developing (CDC, AAP).',
            'Vocalizing: Babbles with consonant sounds (AAP, CDC).',
            'Social: Recognizes family, may show stranger anxiety (CDC, AAP).',
            'Teething: May have first tooth (AAP, CDC).',
        ],
        mentalHealthNotes: [
            'Continue to monitor mood (WHO, ACOG, NICE).',
            'If you\'re feeling overwhelmed, talk to your doctor (WHO, NICE, ACOG).',
            'Connect with other mothers for support (WHO, NICE).',
            'Practice self-compassion — you are doing an incredible job (WHO, NICE).',
        ],
        activityNotes: [
            'All exercises are safe (ACOG, NICE, WHO).',
            'Walking: 30-60 minutes daily (WHO, ACOG).',
            'Strength training: Regular workouts (ACOG, NICE).',
            'Running: Regular running if cleared (ACOG, NICE).',
            'Postnatal yoga or Pilates: Regular practice (ACOG, NICE).',
            'Pelvic floor: Maintain 3 sets of 10-15 daily (ACOG, NICE).',
        ],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'Baby: Introduce variety of foods. Iron-rich foods are priority (WHO, AAP, IAP, NIN).',
            'Continue calcium and iron-rich foods for yourself (NIN, ICMR, WHO).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
        ],
        warningSigns: [
            'Persistent pelvic pain or incontinence (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not responding to sounds or not making eye contact (AAP, CDC, IAP, WHO).',
            'Baby not sitting independently (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
            'Allergic reaction to new foods (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Continue introducing new foods to baby (WHO, AAP, IAP).',
            'Continue breastfeeding alongside solids (WHO, AAP, IAP).',
            'Monitor baby\'s developmental milestones (IAP, WHO, CDC).',
            'Baby-proof your home as mobility increases (AAP, CDC).',
            'Prioritize self-care and social connections (WHO, NICE).',
        ],
    },

    // Weeks 27-52: Extended postpartum with verified citations
    {
        week: 27,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 27: Seven Months of Growth',
        summary: 'Seven months postpartum. Your baby is becoming more mobile, eating more solids, and developing a unique personality.',
        recoveryNotes: [
            'Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE, WHO).',
            'Breastfeeding: Continue alongside solids. Breastmilk is still primary nutrition until 12 months (WHO, AAP, IAP).',
        ],
        bodyChanges: ['Body is well-recovered. Fitness is good. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 4-5 times per day + solids 2-3 times daily (WHO, AAP, IAP).',
            'Introduce variety of foods: fruits, vegetables, cereals, dal, khichdi (WHO, AAP, IAP, NIN).',
            'Baby may be crawling or preparing to crawl (AAP, CDC).',
            'Sleep: 2-3 naps per day. Night sleep may be 10-12 hours (AAP, CDC).',
        ],
        babyDevelopment: [
            'Sitting: Independently (CDC, AAP).',
            'Crawling: May be crawling (AAP, CDC).',
            'Grasping: Pincer grasp developing (CDC, AAP).',
            'Vocalizing: Babbles, may say "mama" or "dada" nonspecifically (AAP, CDC).',
            'Social: Recognizes family, may show stranger anxiety (CDC, AAP).',
        ],
        mentalHealthNotes: [
            'Continue to monitor mood. PPD can develop at any time (WHO, ACOG, NICE).',
            'Connect with other mothers for support (WHO, NICE).',
            'Practice self-compassion (WHO, NICE).',
        ],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'Baby: Introduce variety of foods. Iron-rich foods are priority (WHO, AAP, IAP, NIN).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
        ],
        warningSigns: [
            'Baby not sitting independently (CDC, AAP, IAP, WHO).',
            'Baby not responding to sounds (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
            'PPD symptoms: persistent sadness, anxiety (WHO, ACOG, NICE).',
        ],
        weeklyGuidance: [
            'Continue introducing new foods to baby (WHO, AAP, IAP).',
            'Continue breastfeeding alongside solids (WHO, AAP, IAP).',
            'Monitor baby\'s developmental milestones (IAP, WHO, CDC).',
            'Baby-proof your home as mobility increases (AAP, CDC).',
        ],
    },
    {
        week: 28,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 28: Active and Exploring',
        summary: 'Your baby is becoming more active, possibly crawling, and very curious about the world.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 4-5 times per day + solids 2-3 times daily (WHO, AAP, IAP).',
            'Baby may be crawling. Baby-proofing is essential (AAP, CDC).',
            'Sleep: 2-3 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Crawling: May be crawling (AAP, CDC).',
            'Sitting: Independently (CDC, AAP).',
            'Vocalizing: Babbles, may say "mama" or "dada" (AAP, CDC).',
            'Social: Recognizes family, may show stranger anxiety (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Introduce variety of foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not sitting independently (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 29,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 29: Seven Months Strong',
        summary: 'Your baby is becoming more independent and interactive. Continue breastfeeding alongside solids.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 4-5 times per day + solids 2-3 times daily (WHO, AAP, IAP).',
            'Baby may be crawling. Baby-proofing is essential (AAP, CDC).',
            'Sleep: 2-3 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Crawling: May be crawling (AAP, CDC).',
            'Vocalizing: Babbles, may say "mama" or "dada" (AAP, CDC).',
            'Social: Recognizes family, may show stranger anxiety (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Introduce variety of foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not sitting independently (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 30,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 30: Growing Independence',
        summary: 'Your baby is becoming more independent in movement and eating. Continue to support their development with love and nutrition.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 4-5 times per day + solids 3 times daily (WHO, AAP, IAP).',
            'Baby may be crawling well. Baby-proofing is essential (AAP, CDC).',
            'Sleep: 2 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Crawling: May be crawling well (AAP, CDC).',
            'Vocalizing: Babbles, may say "mama" or "dada" (AAP, CDC).',
            'Social: Recognizes family, may show stranger anxiety (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Introduce variety of foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not sitting independently (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 31,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 31: Eight Months — On the Move',
        summary: 'Eight months postpartum. Your baby is likely crawling, eating more solids, and developing a stronger personality.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 4 times per day + solids 3 times daily (WHO, AAP, IAP).',
            'Baby may be crawling well or starting to pull up to stand (AAP, CDC).',
            'Sleep: 2 naps per day. Night sleep may be 10-12 hours (AAP, CDC).',
        ],
        babyDevelopment: [
            'Crawling: Crawling well (AAP, CDC).',
            'Pulling up: May pull to stand (CDC, AAP).',
            'Vocalizing: Babbles, may say "mama" or "dada" specifically (AAP, CDC).',
            'Social: Stranger anxiety may peak (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'Baby: Introduce finger foods, variety of textures (WHO, AAP, IAP, NIN).',
            'Continue breastfeeding alongside solids (WHO, AAP, IAP).',
        ],
        warningSigns: ['Baby not sitting independently (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home thoroughly (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 32,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 32: Active and Curious',
        summary: 'Your baby is becoming more active and curious. Continue to provide a safe environment for exploration.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 4 times per day + solids 3 times daily (WHO, AAP, IAP).',
            'Baby may be pulling up to stand (AAP, CDC).',
            'Sleep: 2 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Crawling: Crawling well (AAP, CDC).',
            'Pulling up: May pull to stand (CDC, AAP).',
            'Vocalizing: May say "mama" or "dada" specifically (AAP, CDC).',
            'Social: Stranger anxiety may peak (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Introduce finger foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not sitting independently (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 33,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 33: Preparing to Stand',
        summary: 'Your baby may be pulling up to stand and cruising along furniture. This is an exciting time of mobility.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 4 times per day + solids 3 times daily (WHO, AAP, IAP).',
            'Baby may be pulling up to stand and cruising (AAP, CDC).',
            'Sleep: 2 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Pulling up: Pulls to stand (CDC, AAP).',
            'Cruising: May cruise along furniture (AAP, CDC).',
            'Vocalizing: May say "mama" or "dada" specifically (AAP, CDC).',
            'Social: Stranger anxiety may peak (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Introduce finger foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not crawling (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home thoroughly (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 34,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 34: On the Move',
        summary: 'Your baby is becoming more mobile every day. Cruising along furniture and possibly taking first steps with support.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 4 times per day + solids 3 times daily (WHO, AAP, IAP).',
            'Baby may be cruising and possibly taking steps with support (AAP, CDC).',
            'Sleep: 2 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Cruising: Cruises along furniture (AAP, CDC).',
            'Standing: May stand briefly without support (CDC, AAP).',
            'Vocalizing: May say 1-2 words specifically (AAP, CDC).',
            'Social: Stranger anxiety may peak (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Introduce variety of finger foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not crawling (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home thoroughly (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 35,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 35: Nine Months Approaching',
        summary: 'Approaching the 9-month milestone. Your baby is becoming more independent and may be close to walking.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 4 times per day + solids 3 times daily (WHO, AAP, IAP).',
            'Baby may be cruising and possibly taking first steps (AAP, CDC).',
            'Sleep: 2 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Cruising: Cruises along furniture (AAP, CDC).',
            'Standing: May stand briefly without support (CDC, AAP).',
            'Vocalizing: May say 1-2 words specifically (AAP, CDC).',
            'Social: May wave bye-bye, play peek-a-boo (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Introduce variety of finger foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not crawling (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home thoroughly (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 36,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 36: Nine Months Postpartum',
        summary: 'Nine months postpartum — you have been a mother for as long as you were pregnant. This is a significant milestone.',
        recoveryNotes: [
            'Body is strong and healthy. Nine months of recovery and growth (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE, WHO).',
            'Breastfeeding: Continue alongside solids. Breastmilk is still important nutrition (WHO, AAP, IAP).',
            'Fitness: You should feel strong and capable (WHO, ACOG, NICE).',
        ],
        bodyChanges: [
            'Body is well-recovered. You may have been at your pre-pregnancy weight for months (WHO, ACOG).',
            'Fitness is good — you may be stronger than pre-pregnancy (WHO, ACOG, NICE).',
            'Hair: Fully normalized (ACOG, AAD).',
            'Overall: You should feel like yourself (WHO, NICE).',
        ],
        babyCareNotes: [
            '9-month well-baby checkup: Weight, length, head circumference, development (IAP, WHO, MOHFW).',
            'Vaccinations: MMR, typhoid (IAP schedule, WHO, MOHFW).',
            'Feeding: Breastfeed 3-4 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Baby may be standing or taking first steps (AAP, CDC).',
            'Sleep: 2 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Standing: May stand without support (CDC, AAP).',
            'Walking: May take first steps (AAP, CDC).',
            'Vocalizing: May say 1-3 words specifically (AAP, CDC).',
            'Social: Waves bye-bye, plays peek-a-boo, shows stranger anxiety (CDC, AAP).',
            'Pincer grasp: Well-developed (CDC, AAP).',
        ],
        mentalHealthNotes: [
            'Nine months is a significant milestone — celebrate how far you have come (WHO, NICE).',
            'If you\'re feeling overwhelmed, talk to your doctor (WHO, NICE, ACOG).',
            'Connect with other mothers for support (WHO, NICE).',
            'Practice self-compassion — you are doing an incredible job (WHO, NICE).',
        ],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'Baby: Introduce variety of foods including family foods (WHO, AAP, IAP, NIN).',
            'Continue breastfeeding alongside solids (WHO, AAP, IAP).',
            'Stay hydrated: 3+ liters daily for breastfeeding (WHO, NIN).',
        ],
        warningSigns: [
            'Baby not sitting independently (CDC, AAP, IAP, WHO).',
            'Baby not crawling (CDC, AAP, IAP, WHO).',
            'Baby not responding to sounds (CDC, AAP, IAP, WHO).',
            'Baby not gaining weight (WHO, AAP, IAP).',
        ],
        weeklyGuidance: [
            'Attend baby\'s 9-month checkup and vaccinations (IAP, WHO, MOHFW).',
            'Continue breastfeeding alongside solids (WHO, AAP, IAP).',
            'Monitor baby\'s developmental milestones (IAP, WHO, CDC).',
            'Baby-proof your home thoroughly (AAP, CDC).',
            'Celebrate nine months of motherhood (WHO, NICE).',
        ],
    },
    {
        week: 37,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 37: First Steps',
        summary: 'Your baby may be taking first steps or preparing to walk. This is an exciting time of newfound mobility.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 3-4 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Baby may be walking or preparing to walk (AAP, CDC).',
            'Sleep: 2 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Walking: May take first steps (AAP, CDC).',
            'Vocalizing: May say 1-3 words specifically (AAP, CDC).',
            'Social: Waves bye-bye, plays peek-a-boo (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Introduce family foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not crawling (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home thoroughly (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 38,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 38: Growing Independence',
        summary: 'Your baby is becoming more independent in movement and communication. Each day brings new discoveries.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 3-4 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Baby may be walking (AAP, CDC).',
            'Sleep: 2 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Walking: May be walking (AAP, CDC).',
            'Vocalizing: May say 1-3 words specifically (AAP, CDC).',
            'Social: Waves bye-bye, plays peek-a-boo (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Introduce family foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not crawling (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home thoroughly (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 39,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 39: Almost Ten Months',
        summary: 'Approaching the 10-month milestone. Your baby is developing rapidly and becoming more independent.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 3-4 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Baby may be walking (AAP, CDC).',
            'Sleep: 2 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Walking: May be walking (AAP, CDC).',
            'Vocalizing: May say 1-3 words specifically (AAP, CDC).',
            'Social: Waves bye-bye, plays peek-a-boo (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Introduce family foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not crawling (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home thoroughly (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 40,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 40: Ten Months Postpartum',
        summary: 'Ten months postpartum. Your baby is likely walking or very close to it. The world is a big, exciting place to explore.',
        recoveryNotes: [
            'Body is strong and healthy. Ten months of recovery (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE, WHO).',
            'Breastfeeding: Continue alongside solids. Breastmilk is still beneficial (WHO, AAP, IAP).',
            'Fitness: You should feel strong and capable (WHO, ACOG, NICE).',
        ],
        bodyChanges: ['Body is well-recovered. Fitness is good (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 3-4 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Baby may be walking (AAP, CDC).',
            'Sleep: 1-2 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Walking: May be walking well (AAP, CDC).',
            'Vocalizing: May say 2-5 words specifically (AAP, CDC).',
            'Social: Waves bye-bye, plays peek-a-boo, shows preferences (CDC, AAP).',
        ],
        mentalHealthNotes: [
            'Ten months is a significant milestone — celebrate (WHO, NICE).',
            'If you\'re feeling overwhelmed, talk to your doctor (WHO, NICE, ACOG).',
            'Connect with other mothers for support (WHO, NICE).',
        ],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'Baby: Introduce family foods, variety of textures (WHO, AAP, IAP, NIN).',
            'Continue breastfeeding alongside solids (WHO, AAP, IAP).',
        ],
        warningSigns: ['Baby not standing with support (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home thoroughly (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 41,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 41: Exploring the World',
        summary: 'Your baby is becoming more independent and curious. Continue to provide a safe, loving environment for exploration.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 3-4 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Baby may be walking (AAP, CDC).',
            'Sleep: 1-2 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Walking: May be walking well (AAP, CDC).',
            'Vocalizing: May say 2-5 words (AAP, CDC).',
            'Social: Shows preferences, waves bye-bye (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Family foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not standing with support (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 42,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 42: Growing Communication',
        summary: 'Your baby is developing communication skills rapidly. They understand more than they can say.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 3-4 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Baby may be walking (AAP, CDC).',
            'Sleep: 1-2 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Walking: May be walking well (AAP, CDC).',
            'Vocalizing: May say 2-5 words (AAP, CDC).',
            'Social: Shows preferences, understands simple commands (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Family foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not standing with support (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 43,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 43: Eleven Months Approaching',
        summary: 'Approaching the 11-month milestone. Your baby is becoming a toddler in personality and mobility.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 3-4 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Baby may be walking (AAP, CDC).',
            'Sleep: 1-2 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Walking: May be walking well (AAP, CDC).',
            'Vocalizing: May say 2-5 words (AAP, CDC).',
            'Social: Understands simple commands, shows preferences (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Family foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not standing with support (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 44,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 44: Eleven Months Postpartum',
        summary: 'Eleven months postpartum. Your baby is almost a toddler. The first birthday is just around the corner.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 3 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Baby may be walking (AAP, CDC).',
            'Sleep: 1-2 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Walking: May be walking well (AAP, CDC).',
            'Vocalizing: May say 3-5 words (AAP, CDC).',
            'Social: Understands simple commands, shows preferences (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Family foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not standing with support (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 45,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 45: Preparing for the First Birthday',
        summary: 'Your baby is approaching their first birthday. This is a time of celebration and reflection on an incredible year.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 3 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Baby may be walking (AAP, CDC).',
            'Sleep: 1-2 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Walking: May be walking well (AAP, CDC).',
            'Vocalizing: May say 3-5 words (AAP, CDC).',
            'Social: Understands simple commands, shows preferences (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Family foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not standing with support (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 46,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 46: Almost a Toddler',
        summary: 'Your baby is almost a toddler. The transition from baby to toddler is a beautiful journey.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 3 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Baby may be walking (AAP, CDC).',
            'Sleep: 1-2 naps per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Walking: May be walking well (AAP, CDC).',
            'Vocalizing: May say 3-5 words (AAP, CDC).',
            'Social: Understands simple commands, shows preferences (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Family foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not standing with support (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 47,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 47: Countdown to One Year',
        summary: 'The first birthday is just weeks away. Reflect on the incredible journey of the past year.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 3 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Baby may be walking (AAP, CDC).',
            'Sleep: 1 nap per day (transitioning from 2 naps) (AAP, CDC).',
        ],
        babyDevelopment: [
            'Walking: May be walking well (AAP, CDC).',
            'Vocalizing: May say 3-5 words (AAP, CDC).',
            'Social: Understands simple commands, shows preferences (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Family foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not standing with support (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Baby-proof your home (AAP, CDC). Continue introducing foods (WHO, AAP, IAP). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 48,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 48: Twelve Months Approaching',
        summary: 'Approaching the 12-month milestone. Your baby is almost a toddler, and you have completed nearly a year of motherhood.',
        recoveryNotes: [
            'Body is strong and healthy. Nearly one year of recovery (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE, WHO).',
            'Breastfeeding: Continue as long as mutually desired. WHO recommends breastfeeding to 2 years and beyond (WHO, AAP, IAP, UNICEF).',
            'Fitness: You should feel strong and capable (WHO, ACOG, NICE).',
        ],
        bodyChanges: [
            'Body is well-recovered (WHO, ACOG).',
            'Fitness is good — you may be stronger than pre-pregnancy (WHO, ACOG, NICE).',
            'Overall: You should feel like yourself (WHO, NICE).',
        ],
        babyCareNotes: [
            '12-month well-baby checkup approaching: Weight, length, head circumference, development (IAP, WHO, MOHFW).',
            'Vaccinations: MMR, varicella, hepatitis A (IAP schedule, WHO, MOHFW).',
            'Feeding: Breastfeed 3 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Baby may be walking (AAP, CDC).',
            'Sleep: 1 nap per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Walking: May be walking well (AAP, CDC).',
            'Vocalizing: May say 3-5 words (AAP, CDC).',
            'Social: Understands simple commands, shows preferences (CDC, AAP).',
            'May use spoon, drink from cup (CDC, AAP).',
        ],
        mentalHealthNotes: [
            'One year of motherhood is a significant milestone — celebrate (WHO, NICE).',
            'If you\'re feeling overwhelmed, talk to your doctor (WHO, NICE, ACOG).',
            'Connect with other mothers for support (WHO, NICE).',
            'Practice self-compassion — you are doing an incredible job (WHO, NICE).',
        ],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: [
            'Continue balanced diet (WHO, NIN).',
            'Baby: Family foods. Can start cow\'s milk after 12 months (WHO, AAP, IAP, NIN).',
            'Continue breastfeeding as long as mutually desired (WHO, AAP, IAP, UNICEF).',
        ],
        warningSigns: ['Baby not standing with support (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Prepare for 12-month checkup (IAP, WHO, MOHFW). Baby-proof your home (AAP, CDC). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 49,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 49: Almost One Year',
        summary: 'The first birthday is just around the corner. Your baby is becoming a toddler with a unique personality.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 3 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Baby may be walking (AAP, CDC).',
            'Sleep: 1 nap per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Walking: May be walking well (AAP, CDC).',
            'Vocalizing: May say 3-5 words (AAP, CDC).',
            'Social: Understands simple commands, shows preferences (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Family foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not standing with support (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Prepare for 12-month checkup (IAP, WHO, MOHFW). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 50,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 50: The Final Weeks of the First Year',
        summary: 'The final weeks of the first year. Your baby is almost a toddler, and you have nearly completed your postpartum journey.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 3 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Baby may be walking (AAP, CDC).',
            'Sleep: 1 nap per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Walking: May be walking well (AAP, CDC).',
            'Vocalizing: May say 3-5 words (AAP, CDC).',
            'Social: Understands simple commands, shows preferences (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Family foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not standing with support (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Prepare for 12-month checkup (IAP, WHO, MOHFW). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 51,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 51: One Week to One Year',
        summary: 'One week until the first birthday. This is a time of celebration and reflection on an incredible year of motherhood.',
        recoveryNotes: ['Body is strong and healthy. Maintain fitness routines (WHO, ACOG, NICE).'],
        bodyChanges: ['Body is well-recovered. Maintain regular exercise (WHO, ACOG, NICE).'],
        babyCareNotes: [
            'Feeding: Breastfeed 3 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Baby may be walking (AAP, CDC).',
            'Sleep: 1 nap per day (AAP, CDC).',
        ],
        babyDevelopment: [
            'Walking: May be walking well (AAP, CDC).',
            'Vocalizing: May say 3-5 words (AAP, CDC).',
            'Social: Understands simple commands, shows preferences (CDC, AAP).',
        ],
        mentalHealthNotes: ['Continue to monitor mood. Connect with other mothers (WHO, ACOG, NICE).'],
        activityNotes: ['All exercises are safe. Maintain regular exercise routine (ACOG, NICE, WHO).'],
        nutritionalFocus: ['Continue balanced diet. Baby: Family foods (WHO, AAP, IAP, NIN).'],
        warningSigns: ['Baby not standing with support (CDC, AAP, WHO). Baby not responding to sounds (CDC, AAP, WHO).'],
        weeklyGuidance: ['Prepare for 12-month checkup (IAP, WHO, MOHFW). Monitor milestones (IAP, WHO, CDC).'],
    },
    {
        week: 52,
        recoveryPhase: 'extended',
        phaseLabel: 'Extended Postpartum',
        title: 'Week 52: One Year Postpartum — Congratulations!',
        summary: 'One year postpartum. You have completed an incredible journey of recovery, growth, and motherhood. Your baby is now a toddler!',
        recoveryNotes: [
            'Body is strong and healthy. One full year of recovery (WHO, ACOG, NICE).',
            'Pelvic floor: Continue maintenance exercises as a lifelong habit (ACOG, NICE, WHO).',
            'Breastfeeding: Continue as long as mutually desired. WHO recommends breastfeeding to 2 years and beyond (WHO, AAP, IAP, UNICEF).',
            'Fitness: You should feel strong, capable, and confident in your body (WHO, ACOG, NICE).',
            'Celebrate your incredible journey — you have done an amazing job (WHO, NICE).',
        ],
        bodyChanges: [
            'Body has fully recovered from pregnancy and childbirth (WHO, ACOG).',
            'Fitness: You may be stronger and healthier than before pregnancy (WHO, ACOG, NICE).',
            'Hair: Fully normalized (ACOG, AAD).',
            'Skin: Stretch marks are silvery-white and fading (ACOG, AAD).',
            'Overall: You have transformed physically and emotionally through motherhood (WHO, NICE).',
        ],
        babyCareNotes: [
            '12-month well-baby checkup: Weight, length, head circumference, development (IAP, WHO, MOHFW).',
            'Vaccinations: MMR, varicella, hepatitis A (IAP schedule, WHO, MOHFW).',
            'Feeding: Breastfeed 2-3 times per day + solids 3 times daily + snacks (WHO, AAP, IAP).',
            'Can start cow\'s milk after 12 months (WHO, AAP, IAP, NIN).',
            'Baby is now a toddler — walking, talking, exploring (AAP, CDC).',
            'Sleep: 1 nap per day. Night sleep 11-12 hours (AAP, CDC).',
            'Continue breastfeeding as long as mutually desired (WHO, AAP, IAP, UNICEF).',
        ],
        babyDevelopment: [
            'Walking: May be walking independently (AAP, CDC).',
            'Vocalizing: May say 3-10 words (AAP, CDC).',
            'Social: Understands simple commands, shows preferences, waves bye-bye (CDC, AAP).',
            'Self-feeding: May use spoon, drink from cup (CDC, AAP).',
            'Play: Imitates actions, enjoys interactive games (CDC, AAP).',
            'Shows affection to familiar people (CDC, AAP).',
        ],
        mentalHealthNotes: [
            'One year of motherhood is a monumental achievement — celebrate yourself (WHO, NICE).',
            'The postpartum period officially ends, but motherhood continues (WHO, ACOG).',
            'If you have any lingering emotional concerns, talk to your doctor (WHO, NICE, ACOG).',
            'Connect with other mothers — your experience can help others (WHO, NICE).',
            'Practice self-compassion — you have grown and transformed in incredible ways (WHO, NICE).',
            'Indian context: The first birthday (annaprashan/annaprasana) is a significant cultural celebration (MOHFW, ICMR).',
        ],
        activityNotes: [
            'All exercises are safe and encouraged (ACOG, NICE, WHO).',
            'Maintain regular exercise routine: 150 minutes moderate activity weekly (WHO, ACOG).',
            'Strength training: 2-3 times per week (ACOG, NICE, WHO).',
            'Pelvic floor: Continue maintenance exercises (ACOG, NICE).',
            'Running, sports, yoga, Pilates — all are excellent (ACOG, NICE, WHO).',
            'You have earned your pre-pregnancy fitness level and beyond (WHO, ACOG).',
        ],
        nutritionalFocus: [
            'Continue balanced, nutritious diet (WHO, NIN).',
            'If breastfeeding, continue 500 extra calories daily (WHO, NIN).',
            'Baby: Family foods, cow\'s milk, variety of textures and flavors (WHO, AAP, IAP, NIN).',
            'Continue calcium and iron-rich foods (NIN, ICMR, WHO).',
            'Stay hydrated: 3+ liters daily if breastfeeding (WHO, NIN).',
        ],
        warningSigns: [
            'Persistent pelvic pain or incontinence (ACOG, NICE, WHO).',
            'PPD symptoms: persistent sadness, anxiety, intrusive thoughts (WHO, ACOG, NICE).',
            'Baby not standing with support (CDC, AAP, IAP, WHO).',
            'Baby not responding to name or sounds (CDC, AAP, IAP, WHO).',
            'Baby not saying any words (CDC, AAP, IAP, WHO).',
            'Baby not making eye contact or showing social engagement (CDC, AAP, IAP, WHO).',
        ],
        weeklyGuidance: [
            'Attend baby\'s 12-month checkup and vaccinations (IAP, WHO, MOHFW).',
            'Celebrate one year of motherhood — you have done an incredible job (WHO, NICE).',
            'Continue breastfeeding as long as mutually desired (WHO, AAP, IAP, UNICEF).',
            'Monitor baby\'s developmental milestones (IAP, WHO, CDC).',
            'Celebrate your baby\'s first birthday — this is a momentous occasion (WHO, NICE).',
            'Reflect on your journey and be proud of all you have accomplished (WHO, NICE).',
        ],
    },
];

// ─── Helper Functions ───

/**
 * Get postpartum knowledge data for a specific week (1–52).
 * Returns null if week is out of range.
 */
export function getPostpartumWeekKnowledge(week: number): PostpartumWeekKnowledge | null {
    if (week < 1 || week > 52) return null;
    return postpartumKnowledgeBase[week - 1] ?? null;
}

/**
 * Format postpartum week knowledge for the Weekly Journey page.
 * Returns structured data suitable for rendering in the weekly journey UI.
 */
export function formatPostpartumWeekKnowledgeForJourney(week: number): {
    weekNumber: number;
    title: string;
    summary: string;
    recoveryPhase: string;
    phaseLabel: string;
    recoveryNotes: string;
    babyCareNotes: string;
    mentalHealthNotes: string;
    activityNotes: string;
    warningSigns: string;
    bodyChanges: string[];
    babyDevelopment: string[];
    nutritionalFocus: string[];
    weeklyGuidance: string[];
    /** Bilingual legend explaining all source abbreviations (WHO, MOHFW, etc.) */
    sourceLegend: string;
    /** Bilingual legend in Hindi */
    sourceLegendHindi: string;
} | null {
    const knowledge = getPostpartumWeekKnowledge(week);
    if (!knowledge) return null;

    return {
        weekNumber: knowledge.week,
        title: knowledge.title,
        summary: knowledge.summary,
        recoveryPhase: knowledge.recoveryPhase,
        phaseLabel: knowledge.phaseLabel,
        recoveryNotes: knowledge.recoveryNotes.map(i => `- ${i}`).join('\n'),
        babyCareNotes: knowledge.babyCareNotes.map(i => `- ${i}`).join('\n'),
        mentalHealthNotes: knowledge.mentalHealthNotes.map(i => `- ${i}`).join('\n'),
        activityNotes: knowledge.activityNotes.map(i => `- ${i}`).join('\n'),
        warningSigns: knowledge.warningSigns.map(i => `- ${i}`).join('\n'),
        bodyChanges: knowledge.bodyChanges,
        babyDevelopment: knowledge.babyDevelopment,
        nutritionalFocus: knowledge.nutritionalFocus,
        weeklyGuidance: knowledge.weeklyGuidance,
        sourceLegend: formatSourceLegend('en'),
        sourceLegendHindi: formatSourceLegend('hi'),
    };
}

/**
 * Format postpartum week knowledge for chat responses.
 * Returns formatted markdown string for the given topic.
 */
export function formatPostpartumWeekKnowledgeForChat(
    week: number,
    topic: 'recovery' | 'baby_care' | 'mental_health' | 'activity' | 'nutrition' | 'warning_signs' | 'baby_development' | 'body_changes' | 'overview',
): string | null {
    const knowledge = getPostpartumWeekKnowledge(week);
    if (!knowledge) return null;

    switch (topic) {
        case 'recovery':
            return `**Recovery guidance for Week ${week}:**\n\n${knowledge.recoveryNotes.map(i => `• ${i}`).join('\n')}`;
        case 'baby_care':
            return `**Baby care for Week ${week}:**\n\n${knowledge.babyCareNotes.map(i => `• ${i}`).join('\n')}`;
        case 'mental_health':
            return `**Mental health for Week ${week}:**\n\n${knowledge.mentalHealthNotes.map(i => `• ${i}`).join('\n')}`;
        case 'activity':
            return `**Activity guidance for Week ${week}:**\n\n${knowledge.activityNotes.map(i => `• ${i}`).join('\n')}`;
        case 'nutrition':
            return `**Nutrition focus for Week ${week}:**\n\n${knowledge.nutritionalFocus.map(i => `• ${i}`).join('\n')}`;
        case 'warning_signs':
            return `**⚠️ Warning signs for Week ${week}:**\n\n${knowledge.warningSigns.map(i => `• ${i}`).join('\n')}\n\nIf you experience any of these, contact your healthcare provider immediately.`;
        case 'baby_development':
            return `**Baby development at Week ${week}:**\n\n${knowledge.babyDevelopment.map(i => `• ${i}`).join('\n')}`;
        case 'body_changes':
            return `**Your body at Week ${week}:**\n\n${knowledge.bodyChanges.map(i => `• ${i}`).join('\n')}`;
        case 'overview':
            return `**Week ${week} Overview (${knowledge.phaseLabel}):**\n\n${knowledge.weeklyGuidance.map(i => `• ${i}`).join('\n')}\n\n**Recovery:** ${knowledge.recoveryNotes[0] || 'Healing continues'}\n\n**Baby:** ${knowledge.babyDevelopment[0] || 'Developing well'}\n\n**Mental health:** ${knowledge.mentalHealthNotes[0] || 'Monitor your mood'}\n\n**Activity:** ${knowledge.activityNotes[0] || 'Gentle activity'}`;
        default:
            return null;
    }
}

// ─── Postpartum Personalization ─────────────────────────────────────

/**
 * Personalize postpartum week knowledge based on the mother's medical profile.
 * Prepends condition-specific recovery, nutrition, and warning tips to the
 * base postpartum knowledge, tailored for the postpartum recovery context.
 */
export function personalizePostpartumWeekKnowledge(
    week: number,
    factors: PersonalizationFactors,
): PostpartumWeekKnowledge | null {
    const base = getPostpartumWeekKnowledge(week);
    if (!base) return null;

    const personalized: PostpartumWeekKnowledge = { ...base };

    const extraNutrition: string[] = [];
    const extraWarning: string[] = [];
    const extraActivity: string[] = [];
    const extraRecovery: string[] = [];
    const extraMentalHealth: string[] = [];

    if (factors.medicalConditions?.anemia) {
        extraNutrition.push(
            'Postpartum anemia recovery: Continue iron-rich foods — spinach, lentils, jaggery, lean meat',
            'Take iron supplements as prescribed; pair with vitamin C for absorption',
            'Avoid tea/coffee within 1 hour of iron-rich meals',
        );
        extraRecovery.push('Monitor for extreme fatigue, pale skin, dizziness — signs of ongoing anemia');
        extraWarning.push('If you feel unusually weak, dizzy, or short of breath, contact your doctor');
    }

    if (factors.medicalConditions?.diabetes || factors.medicalConditions?.highRiskPregnancy) {
        extraNutrition.push(
            'Continue blood sugar monitoring — postpartum hormones can affect glucose levels',
            'Choose complex carbohydrates and maintain small, frequent meals',
            'Stay hydrated — breastfeeding increases fluid needs',
        );
        extraRecovery.push('Schedule postpartum glucose screening if you had gestational diabetes');
        extraWarning.push('Watch for excessive thirst, frequent urination, or slow wound healing');
    }

    if (factors.medicalConditions?.hypertension || factors.medicalConditions?.highBP) {
        extraNutrition.push(
            'Continue low-sodium diet — avoid processed foods, pickles, and salty snacks',
            'Include potassium-rich foods: bananas, sweet potatoes, coconut water',
        );
        extraRecovery.push('Monitor blood pressure regularly — postpartum preeclampsia can occur up to 6 weeks after delivery');
        extraWarning.push('Seek immediate care for severe headache, vision changes, or upper abdominal pain — signs of postpartum preeclampsia');
    }

    if (factors.medicalConditions?.lowBP) {
        extraNutrition.push(
            'Stay well-hydrated to help maintain blood pressure',
            'Eat small, frequent meals to prevent dizziness',
            'Rise slowly from sitting or lying positions',
        );
        extraRecovery.push('Monitor for dizziness especially when standing up after feeding');
    }

    if (factors.medicalConditions?.thyroidDisorder) {
        extraNutrition.push(
            'Continue thyroid medication as prescribed — postpartum thyroid shifts are common',
            'Monitor for symptoms of postpartum thyroiditis: fatigue, mood swings, hair loss',
        );
        extraRecovery.push('Get thyroid levels checked at 6-week postpartum visit');
        extraMentalHealth.push('Thyroid imbalance can mimic postpartum depression — discuss any mood changes with your doctor');
    }

    if (factors.medicalConditions?.pcos) {
        extraNutrition.push(
            'Focus on anti-inflammatory foods: turmeric, berries, leafy greens',
            'Maintain balanced blood sugar with complex carbs and protein',
        );
        extraRecovery.push('PCOS may affect milk supply — monitor baby\'s feeding and weight gain');
    }

    if (factors.medicalConditions?.asthma) {
        extraActivity.push('Avoid exercise in cold or dusty environments');
        extraRecovery.push('Keep asthma medication accessible — hormonal changes can affect asthma control');
        extraWarning.push('Watch for wheezing, chest tightness, or difficulty breathing');
    }

    if (factors.medicalConditions?.heartDisease) {
        extraActivity.push('Only exercise as approved by your cardiologist');
        extraRecovery.push('Coordinate postpartum care between cardiologist and OB-GYN');
        extraWarning.push('Watch for chest pain, palpitations, or unusual shortness of breath');
    }

    if (factors.medicalConditions?.kidneyIssues) {
        extraNutrition.push('Monitor protein and fluid intake as advised by your doctor');
        extraRecovery.push('Attend all scheduled kidney function follow-ups');
        extraWarning.push('Watch for reduced urine output, swelling, or unusual fatigue');
    }

    if (factors.medicalConditions?.epilepsy) {
        extraRecovery.push('Continue anti-epileptic medication as prescribed — sleep deprivation can trigger seizures');
        extraMentalHealth.push('Ensure you have support for night feedings to minimize sleep disruption');
        extraWarning.push('Report any seizure activity immediately to your doctor');
    }

    // ─── BMI overlays ───

    if (factors.bmi !== undefined) {
        if (factors.bmi < 18.5) {
            extraNutrition.push(
                'Focus on nutrient-dense, calorie-rich foods to support recovery and breastfeeding',
                'Include healthy fats: nuts, ghee in moderation, avocado',
                'Aim for gradual, healthy weight gain with adequate protein',
            );
        } else if (factors.bmi >= 30) {
            extraNutrition.push(
                'Focus on nutrient quality over quantity for healthy postpartum weight management',
                'Choose whole foods over processed options',
                'Breastfeeding can support healthy postpartum weight loss',
            );
            extraRecovery.push('Discuss appropriate postpartum weight management with your doctor');
        }
    }

    // ─── Diet preference overlays ───

    if (factors.diet === 'veg') {
        extraNutrition.push(
            'Ensure adequate protein for recovery and breastfeeding: dal, paneer, tofu, chickpeas',
            'Include plant-based iron: spinach, lentils, jaggery, sesame seeds',
            'Consider B12 and DHA supplementation as advised by your doctor',
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
        extraActivity.push('Even a short 10-minute walk with baby in a stroller can help lift your mood');
        extraMentalHealth.push('You\'re not alone — postpartum blues affect up to 80% of mothers. If feelings persist beyond 2 weeks, speak with your doctor about postpartum depression.');
        extraRecovery.push('Prioritize rest and accept help from family and friends');
    }

    // ─── Merge overlays ───

    if (extraNutrition.length > 0) {
        personalized.nutritionalFocus = [...extraNutrition, ...base.nutritionalFocus];
    }
    if (extraWarning.length > 0) {
        personalized.warningSigns = [...extraWarning, ...base.warningSigns];
    }
    if (extraActivity.length > 0) {
        personalized.activityNotes = [...extraActivity, ...base.activityNotes];
    }
    if (extraRecovery.length > 0) {
        personalized.recoveryNotes = [...extraRecovery, ...base.recoveryNotes];
    }
    if (extraMentalHealth.length > 0) {
        personalized.mentalHealthNotes = [...extraMentalHealth, ...base.mentalHealthNotes];
    }

    return personalized;
}