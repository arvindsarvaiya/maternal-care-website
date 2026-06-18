import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PostpartumWeekSeed {
        weekNumber: number;
        title: string;
        summary: string;
        bodyMarkdown: string;
        recoveryNotes: string;
        babyCareNotes: string;
        mentalHealthNotes: string;
        activityNotes: string;
        warningSigns: string;
}

// ─── RECOVERY PHASES ───
// Immediate (weeks 1-2): Hospital recovery, bleeding, perineal/C-section care, breastfeeding initiation
// Early (weeks 3-6): Healing, baby blues, establishing routines, pelvic rest
// Late (weeks 7-12): Pelvic floor, returning to activity, PPD screening, sleep patterns
// Extended (weeks 13-52): Long-term recovery, returning to work, family dynamics, weaning

// ─── SOURCE ABBREVIATIONS ───
// WHO: World Health Organization
// ACOG: American College of Obstetricians and Gynecologists
// AAP: American Academy of Pediatrics
// CDC: Centers for Disease Control and Prevention
// NICE: National Institute for Health and Care Excellence (UK)
// MOHFW: Ministry of Health and Family Welfare, Government of India
// IAP: Indian Academy of Pediatrics
// FOGSI: Federation of Obstetric and Gynaecological Societies of India
// ICMR: Indian Council of Medical Research
// NIN: National Institute of Nutrition, India
// La Leche: La Leche League International
// UNICEF: United Nations Children's Fund

const postpartumWeeks: PostpartumWeekSeed[] = [
        // ═══════════════════════════════════════════════
        // IMMEDIATE RECOVERY PHASE — Week 1-2
        // ═══════════════════════════════════════════════
        {
                weekNumber: 1,
                title: "Welcome to Postpartum: The First Week",
                summary: "Your body begins its remarkable healing journey. Focus on rest, bonding with your baby, and accepting help from family.",
                bodyMarkdown: `# The First Week After Birth

Congratulations on your new arrival! This first week is all about rest, recovery, and bonding. Your body has just accomplished something incredible and now needs time to heal.

## What's Happening in Your Body
- **Lochia (postpartum bleeding)**: Heavy red bleeding is normal for the first 3-4 days, similar to a heavy period. It will gradually lighten to pink, then brown, then yellowish-white over the next few weeks. According to ACOG, lochia should never have a foul odor (which may indicate infection).
- **Uterine contractions (afterpains)**: Your uterus is shrinking back to its pre-pregnancy size. These cramps may be more noticeable during breastfeeding due to oxytocin release.
- **Perineal soreness**: If you had a vaginal delivery, you may have swelling, bruising, or stitches. Perineal tears are graded 1-4; most women experience grade 1-2 tears.
- **Breast changes**: Your milk will "come in" around day 3-5. Before that, your body produces colostrum — a nutrient-rich first milk packed with antibodies.

## Indian Cultural Context
In India, the postpartum period is traditionally called "jaapa" (Hindi), "sutak" or "saava mahina" (the 40-day confinement period). Traditional practices include:
- **Massage (malish)**: Daily oil massage for both mother and baby by a trained dai or family member. This is recommended by MOHFW's Home-Based Newborn Care guidelines.
- **Warm foods**: Ghee, dry fruits, panjiri, and gond ke laddoo are traditionally given to support healing and lactation.
- **Belly binding**: Traditional belly wrapping is practiced in many Indian communities — if done correctly, it may provide comfort and support.
- **Rest and confinement**: The 40-day rest period is culturally supported — accept this wisdom and prioritize rest.

## Your Recovery Priorities
1. **Rest as much as possible**. Sleep when your baby sleeps.
2. **Accept help** from family and friends with meals, chores, and errands.
3. **Stay hydrated** — drink plenty of water, especially if breastfeeding.
4. **Eat nutritious meals** to support healing and milk production. Traditional Indian postpartum foods like moong dal khichdi, ajwain water, and methi ladoos are excellent choices.
5. **Practice perineal care** — use a peri bottle, witch hazel pads, and sitz baths.

## Bonding With Your Baby
- Skin-to-skin contact helps regulate your baby's temperature, heart rate, and breathing. This is called Kangaroo Mother Care (KMC), endorsed by WHO and MOHFW India.
- Your baby recognizes your voice and smell — talk, sing, and cuddle often.
- Feeding on demand (every 2-3 hours) establishes your milk supply.

## Sources & References
- **WHO**: "Postnatal Care for Mothers and Newborns" (2013) — recommends at least 4 postnatal checkups in the first 6 weeks.
- **MOHFW India**: "Home-Based Newborn Care" (HBNC) guidelines — recommend kangaroo mother care and exclusive breastfeeding.
- **ACOG**: Committee Opinion No. 736 — "Optimizing Postpartum Care" recommends comprehensive postpartum care.
- **FOGSI**: "Postpartum Care Guidelines" — endorse the 40-day rest period and traditional practices where safe and beneficial.
- **IAP**: "Newborn Care Guidelines" — recommend skin-to-skin contact and early initiation of breastfeeding within 1 hour of birth.`,
                recoveryNotes: `- Lochia: Heavy red bleeding days 1-4, then pinkish days 5-7. Change pads every 2-4 hours to prevent infection.
- Perineal care: Use peri bottle with warm water after bathroom, pat dry front to back. Sitz baths 2-3 times daily for 10-15 minutes help reduce swelling and promote healing.
- C-section care: Keep incision clean and dry, avoid lifting anything heavier than your baby, use a pillow to brace when coughing/laughing. Incision should be checked daily for signs of infection.
- Take prescribed pain medication as needed — ibuprofen is generally safe during breastfeeding (per AAP).
- Start gentle Kegel exercises only if comfortable — contract pelvic floor for 3-5 seconds, relax, 5-10 reps.
- Indian traditional: Warm compress with ajwain (carom seeds) on the abdomen may help with uterine contractions and pain relief.`,
                babyCareNotes: `- Feeding: Every 2-3 hours (8-12 times per day), watch for hunger cues (rooting, hand to mouth, lip smacking).
- Colostrum: The first milk is thick, yellowish, and packed with antibodies — "liquid gold" for your baby.
- Diapers: 6+ wet diapers per day indicates good milk intake. Urine should be pale and odorless.
- Sleep: Newborns sleep 16-17 hours per day in 2-4 hour stretches.
- Umbilical cord care: Keep clean and dry, sponge baths only until cord falls off (typically 1-2 weeks). Do NOT apply any traditional substances (haldi, ash, cow dung) to the cord stump — this increases infection risk per IAP guidelines.
- First pediatrician visit is typically within 3-5 days after hospital discharge.
- Kangaroo Mother Care: Hold baby skin-to-skin on your chest for at least 1 hour daily — endorsed by WHO and MOHFW India.`,
                mentalHealthNotes: `- Baby blues: Mild mood swings, crying, anxiety, and irritability are common in the first 2 weeks due to hormonal shifts. These affect 50-80% of new mothers (ACOG, 2021).
- These feelings should not last all day and should improve by week 2.
- Talk to your partner, family, or friends about your feelings. In Indian families, your mother or mother-in-law may be your primary support — communicate openly.
- If you feel persistently sad, hopeless, or unable to care for yourself or baby, contact your healthcare provider immediately.
- Postpartum depression affects 1 in 7 mothers globally (WHO) and approximately 10-20% of Indian mothers (ICMR studies). It is NOT a sign of weakness — it is a medical condition that needs treatment.`,
                activityNotes: `- REST is your primary activity this week. Your body needs time to heal.
- Gentle walking around the house only — to the bathroom and back.
- No heavy lifting (nothing heavier than your baby).
- Avoid stairs when possible. If you must use stairs, take them slowly, one step at a time.
- No driving until cleared by your doctor (usually 1-2 weeks for vaginal delivery, 2-4 weeks for C-section per ACOG).
- The WHO recommends avoiding strenuous activity during the first 6 weeks postpartum.`,
                warningSigns: `🚨 Call your doctor or go to the nearest hospital IMMEDIATELY if you experience:
- Soaking through a pad in less than an hour (postpartum hemorrhage — a leading cause of maternal mortality in India per MOHFW)
- Fever above 100.4°F (38°C) — may indicate puerperal sepsis
- Severe headache that doesn't improve with medication — may indicate preeclampsia
- Chest pain or difficulty breathing — may indicate pulmonary embolism
- Red, swollen, painful area on leg (possible deep vein thrombosis)
- Incision that becomes red, warm, draining pus, or separating
- Thoughts of harming yourself or your baby
- Foul-smelling lochia (may indicate infection)
- Severe pain in the lower abdomen not relieved by medication`,
        },
        {
                weekNumber: 2,
                title: "Week 2: Settling Into Recovery",
                summary: "Your body continues healing. Lochia lightens, and you may start feeling more like yourself — but rest remains essential.",
                bodyMarkdown: `# Week 2 Postpartum

You're settling into life with your newborn. Your body is healing, and you may be starting to feel more mobile — but don't rush recovery. The internal healing process is still very active.

## Physical Recovery
- **Lochia**: Should be transitioning from red to pinkish-brown. You may notice increased flow with activity — this is your body's signal to rest.
- **Perineal healing**: Swelling should be decreasing. Stitches (if any) will begin dissolving.
- **C-section recovery**: The initial sharp pain should be subsiding. Continue to avoid heavy lifting.
- **Breastfeeding**: Your milk supply is establishing. Engorgement may occur between feedings.

## Breastfeeding Challenges
This week, many mothers face common breastfeeding challenges:
- **Engorgement**: Breasts become hard, swollen, and painful. Apply warm compresses before feeding and cold compresses after. Feed frequently to empty breasts.
- **Sore nipples**: Common in the first weeks. Ensure proper latch — baby's mouth should cover most of the areola, not just the nipple. Apply expressed breastmilk to nipples after feeding and let air dry.
- **Low milk supply concern**: Most mothers worry about supply, but true low supply is rare. Frequent feeding is the best way to increase supply.

## Indian Postpartum Nutrition
Traditional Indian postpartum diet (jaapa ka khana) is scientifically sound:
- **Methi (fenugreek) ladoos**: Rich in iron, calcium, and galactagogues (milk-boosting substances).
- **Gond (edible gum) ladoos**: Provide energy, calcium, and support joint recovery.
- **Panjiri**: Wheat flour, ghee, nuts, and seeds provide energy, protein, and healthy fats.
- **Moong dal khichdi**: Easy to digest, high in protein, and gentle on the digestive system.
- **Ajwain (carom seeds) water**: Helps with digestion, relieves gas, and may support uterine contraction.
- **Haldi doodh (turmeric milk)**: Anti-inflammatory properties of turmeric (curcumin) aid healing.

The National Institute of Nutrition (NIN), India recommends 600 additional calories and increased protein intake for breastfeeding mothers.

## This Week's Focus
- Continue prioritizing rest. Your body is still healing internally.
- Begin short, gentle walks around the house or neighborhood (5-10 minutes).
- Accept help with household tasks without guilt.
- Stay on top of pain management — don't wait until pain is severe.
- Keep taking your prenatal vitamins (or switch to postnatal vitamins).

## Sources & References
- **MOHFW India**: "Maternal and Child Health Program" — postnatal visits at 24-48 hours, day 7, and week 6.
- **NIN India**: "Dietary Guidelines for Indians" — breastfeeding mothers need 600 kcal extra and 74g protein daily.
- **La Leche League International**: "Breastfeeding Basics" — proper latch technique and management of common breastfeeding challenges.
- **WHO**: "Infant and Young Child Feeding" — exclusive breastfeeding recommended for the first 6 months.
- **FOGSI**: "Postpartum Care in India" — traditional practices like massage and warm foods are beneficial when done safely.
- **AAP**: "Breastfeeding and the Use of Human Milk" — exclusive breastfeeding recommended for approximately 6 months.`,
                recoveryNotes: `- Lochia: Should be pinkish-brown, not bright red. If it suddenly becomes bright red and heavy, you may be overdoing activity — rest more.
- Perineal care: Continue sitz baths 2-3 times daily. Stitches should be dissolving — some itching is normal.
- C-section: Incision should be healing — check daily for signs of infection. Continue wearing loose, comfortable clothing.
- Breastfeeding: If engorgement is severe, use warm compresses before feeding and cold compresses after. Hand express a small amount if baby cannot latch.
- Indian traditional: Continue oil massage if comfortable — focus on back, legs, and abdomen (avoid C-section incision area). Use warm sesame oil or coconut oil as recommended by Ayurvedic postpartum practices.
- Begin gentle postnatal yoga asanas if comfortable: deep breathing (pranayama) in a comfortable seated position.`,
                babyCareNotes: `- Feeding: 8-12 times per day. Watch for hunger cues — crying is a late sign of hunger.
- Breastmilk intake: By day 7-10, baby should be taking 60-90 ml per feed (IAP guidelines).
- Wet diapers: 6-8+ per day indicates adequate milk intake.
- Bowel movements: 3-4+ per day for breastfed newborns (may decrease after 3-4 weeks).
- Weight: Baby should regain birth weight by 10-14 days. Weight loss of up to 7% in the first week is normal.
- Umbilical cord: Should be drying and may fall off this week. Do NOT apply any traditional substances — keep clean and dry.
- Jaundice: If baby's skin or eyes appear yellow, contact your pediatrician. Physiological jaundice peaks around day 3-5 and should resolve by day 10-14.`,
                mentalHealthNotes: `- Baby blues should be improving by the end of this week. If feelings of sadness, anxiety, or irritability are getting worse, not better, talk to your doctor.
- The Edinburgh Postnatal Depression Scale (EPDS) is a validated screening tool used in India by MOHFW's Rashtriya Bal Swasthya Karyakram (RBSK).
- Indian family dynamics: You may feel pressure from elders about feeding, baby care, or traditions. Communicate respectfully but confidently — you are the mother.
- Your partner's role: In Indian context, fathers may feel excluded from the mother-baby dyad. Encourage skin-to-skin contact and caregiving involvement.
- Sleep deprivation is a major risk factor for postpartum depression — prioritize sleep whenever possible.`,
                activityNotes: `- REST remains the primary activity. Your body is still healing internally.
- Gentle walking: 5-10 minutes around the house or in a safe area.
- Gentle stretching: Neck rolls, shoulder shrugs, and ankle circles while seated or lying down.
- Deep breathing: Practice diaphragmatic breathing (belly breathing) — inhale deeply through nose, exhale slowly through mouth. 5-10 breaths, 2-3 times daily.
- Begin gentle Kegels: 5-10 repetitions, holding for 3-5 seconds each. Only if comfortable.
- No: Heavy lifting, stairs, prolonged standing, driving, or any exercise beyond gentle walking.
- The WHO recommends avoiding strenuous activity for 6 weeks postpartum.`,
                warningSigns: `🚨 Call your doctor immediately if you experience:
- Soaking through a pad in less than an hour (postpartum hemorrhage)
- Passing clots larger than a golf ball (lemon-sized or larger)
- Foul-smelling lochia or vaginal discharge
- Fever above 100.4°F (38°C)
- Severe headache, vision changes, or upper abdominal pain (preeclampsia warning)
- Calf pain, redness, or swelling (possible DVT)
- C-section incision that is red, warm, draining, or separating
- Severe breast pain with redness and fever (possible mastitis)
- Persistent sadness, hopelessness, or thoughts of harming yourself or baby
- Baby: Lethargy, poor feeding, fewer than 6 wet diapers/day, or jaundice below the knees`,
        },
        {
                weekNumber: 3,
                title: "Week 3: Finding Your Rhythm",
                summary: "Your body is healing steadily. You may be settling into a feeding routine, but remember — every baby is different and flexibility is key.",
                bodyMarkdown: `# Week 3 Postpartum

You're entering your third week postpartum. The initial shock of new motherhood is settling, and you may be finding your rhythm — but remember, every day is different with a newborn.

## Physical Recovery
- **Lochia**: Should be pinkish-brown to yellowish-white. If it suddenly becomes bright red again, you may be overdoing activity.
- **Uterine involution**: Your uterus should be nearly back to its pre-pregnancy size by now (fundus no longer palpable above the pubic bone).
- **Perineal healing**: Most stitches should be dissolved or dissolving. Continue sitz baths for comfort.
- **C-section recovery**: Incision should be healing well. You may feel some itching around the scar — this is a sign of healing.

## Breastfeeding: Supply and Demand
- Your milk supply is now established and regulated by demand.
- Frequent feeding = more milk production. This is the principle of supply and demand.
- Growth spurts commonly occur around 3 weeks — your baby may want to feed more frequently (cluster feeding). This is NORMAL and helps increase your supply.
- If you're exclusively breastfeeding, your baby does not need water even in hot Indian summers — breastmilk is 88% water and provides complete hydration (WHO, AAP, IAP).

## Indian Postpartum Traditions
- Many Indian families observe the "sutak" period of 10-40 days. During this time, the mother is traditionally confined to rest and is cared for by female relatives.
- **Belly binding (pet bandhna)**: If you choose to practice this, ensure it is not too tight. It should provide gentle support, not restriction.
- **Warm oil massage**: Continue if comfortable. Traditionally done with mustard oil (sarson ka tel) or sesame oil (til ka tel) warmed with garlic and ajwain.
- **Diet**: Continue with easily digestible, warm, nutritious foods. Avoid cold foods and drinks as per traditional wisdom — this aligns with Ayurvedic principles of postpartum care.

## This Week's Focus
- Recognize your baby's feeding cues and patterns.
- Accept that your routine will be unpredictable — and that's okay.
- Continue prioritizing rest and nutrition.
- Begin very short outdoor walks if you feel ready (5-10 minutes).
- Connect with other new mothers — shared experience is invaluable.

## Sources & References
- **WHO**: "Infant and Young Child Feeding" — exclusive breastfeeding provides all necessary nutrition and hydration for the first 6 months.
- **IAP**: "Infant and Young Child Feeding Guidelines" — endorse exclusive breastfeeding for 6 months.
- **MOHFW India**: "MAA" (Mothers' Absolute Affection) Programme — promotes exclusive breastfeeding across India.
- **NIN India**: "Dietary Guidelines for Indians" — emphasizes iron and calcium-rich foods for postpartum women.
- **Ayurveda**: Charaka Samhita recommends "Sutika Paricharya" (postpartum care) including warm oil massage, warm nourishing foods, and adequate rest for 42 days.
- **ACOG**: "Breastfeeding Challenges" — cluster feeding is a normal behavior that supports milk supply establishment.`,
                recoveryNotes: `- Lochia: Should be light pink to yellowish-white. If it returns to bright red, reduce activity and rest more.
- Perineal care: Continue sitz baths if you have discomfort. Most stitches should be dissolved or dissolving.
- C-section: Incision should be healing well. Gentle scar massage (if cleared by your doctor) can help prevent adhesions.
- Breastfeeding: If you're experiencing nipple pain that persists beyond the first 30 seconds of feeding, the latch may need adjustment. Seek help from a lactation consultant.
- Indian traditional: Continue oil massage. For C-section mothers, avoid the incision area and focus on back, neck, shoulders, and legs.
- Begin gentle postnatal exercises: pelvic tilts while lying on your back, gentle Kegels.`,
                babyCareNotes: `- Feeding: 8-12 times per day. Growth spurt at 3 weeks may cause cluster feeding — this is normal and temporary.
- Breastmilk intake: 60-90 ml per feed (approximately 500-750 ml per day).
- Wet diapers: 6-8+ per day.
- Bowel movements: May decrease in frequency — breastfed babies may go from multiple stools/day to 1 stool every few days (this is normal for breastfed babies).
- Wake windows: Baby may have short periods of alertness (30-60 minutes). Use this time for gentle interaction.
- Tummy time: Begin supervised tummy time for 1-2 minutes, 2-3 times daily (only when baby is awake and supervised).
- Traditional Indian baby massage: Gentle massage with warm oil (coconut or mustard oil) followed by a warm bath is traditional practice. Ensure oil is not too hot and avoid the fontanelle (soft spot on head).`,
                mentalHealthNotes: `- Baby blues should have resolved by now. If you're still experiencing persistent sadness, anxiety, or mood swings, this may be postpartum depression — not baby blues.
- Postpartum depression affects approximately 10-20% of Indian mothers (ICMR community-based studies). It is TREATABLE with counseling and/or medication.
- The stigma around mental health in India is real, but it is changing. MOHFW's District Mental Health Programme (DMHP) now includes maternal mental health.
- You may feel overwhelmed by visitors (Indian families often have many visitors after a birth). Set boundaries — it's okay to limit visiting hours or ask for privacy.
- Your partner's involvement: Indian fathers are increasingly involved in newborn care. Encourage this — it benefits the baby, the mother, and the father-child bond.`,
                activityNotes: `- Continue gentle walking: 5-10 minutes, 1-2 times daily if you feel ready.
- Begin gentle Kegel exercises: 10-15 repetitions, 2-3 times daily. Hold for 3-5 seconds each.
- Start pelvic tilts: Lie on your back with knees bent, gently tilt your pelvis upward, flattening your lower back against the floor. 5-10 repetitions.
- Gentle stretching: Neck rolls, shoulder shrugs, arm circles, ankle pumps.
- Deep breathing: 5-10 deep breaths, 3-4 times daily. This helps reconnect with your core muscles.
- Avoid: Any exercise that causes pain, heavy lifting, prolonged standing, or high-impact activity.
- According to ACOG, a gradual return to physical activity is safe, but always listen to your body.`,
                warningSigns: `🚨 Call your doctor immediately if you experience:
- Bright red bleeding that returns after it had lightened (possible secondary postpartum hemorrhage)
- Foul-smelling vaginal discharge
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (possible mastitis)
- Persistent pain at C-section or perineal incision site
- Persistent sadness, anxiety, or hopelessness that is not improving
- Negative thoughts about your baby or difficulty bonding
- Baby: Poor feeding, lethargy, fever (above 100.4°F rectally), or fewer than 6 wet diapers/day
- Baby: Yellow skin/eyes (jaundice) that is worsening or not improving`,
        },
        {
                weekNumber: 4,
                title: "Week 4: One Month — A Milestone",
                summary: "One month postpartum! You and your baby have come so far. Your body continues to heal, and your baby is becoming more alert and responsive.",
                bodyMarkdown: `# Week 4: One Month Postpartum

Congratulations on reaching the one-month milestone! You've survived the first month of motherhood — one of the most challenging periods. Your baby is becoming more alert, and you're becoming more confident.

## Physical Recovery at One Month
- **Lochia**: Should be minimal, yellowish-white, or may have stopped completely for some women.
- **Uterus**: Should be fully involuted back to pre-pregnancy size (approximately 50-60 grams from the pregnancy weight of 1000 grams).
- **Perineum**: Should be largely healed, though some tenderness may persist.
- **C-section**: Incision should be well-healed externally. Internal healing continues for months.
- **Breastfeeding**: Your supply is well-established. Engorgement should be less frequent.

## Your Baby's First Month Development
- Baby can lift head briefly when on tummy.
- They may fix their gaze on faces and follow objects briefly.
- They respond to loud sounds and may startle (Moro reflex).
- Crying peaks around 6 weeks — you may be approaching peak crying period.
- Baby may start to make cooing sounds.

## The "Fourth Trimester" Concept
The first 3 months after birth are often called the "fourth trimester" — a concept popularized by Dr. Harvey Karp. Your baby is essentially a "fetus outside the womb" who needs:
- Constant physical contact
- Frequent feeding
- Gentle movement and rocking
- White noise (similar to womb sounds)
- Swaddling (when sleeping)

## Indian One-Month Traditions
- Many Indian families celebrate the end of the 40-day confinement period with a small ceremony (chhatthi in North India, barse in some regions).
- This is traditionally when the mother resumes normal household activities and may venture outside the home.
- The baby's first head shaving (mundan) is traditionally done later (typically 1-3 years), not at one month.

## Sources & References
- **WHO**: "Postnatal Care Guidelines" — recommends a postnatal checkup at 4-6 weeks for both mother and baby.
- **MOHFW India**: "Home-Based Newborn Care" — community health workers (ASHA) should visit at least 6 times in the first 42 days.
- **IAP**: "Growth Monitoring" — babies should gain approximately 20-30 grams per day in the first 3 months.
- **CDC**: "Milestone Moments" — 1-month milestones include head lifting, responding to sounds, and fixing gaze on faces.
- **AAP**: "The Fourth Trimester" — newborns need constant care and attention in the first 3 months.
- **FOGSI**: "Postpartum Care Guidelines" — recommend a comprehensive postpartum checkup at 4-6 weeks including blood pressure, weight, abdominal exam, and mental health screening.`,
                recoveryNotes: `- Lochia: Should be minimal, yellowish-white, or may have stopped. If you're still having bright red bleeding, consult your doctor.
- Your 4-6 week postpartum checkup is approaching — schedule it now if you haven't already.
- Pelvic floor: Continue Kegels daily — 15-20 repetitions, holding for 5-8 seconds.
- Perineal healing: Should be largely complete. If you're still experiencing pain, mention it at your checkup.
- C-section: External incision should be well-healed. Internal healing continues for 6-12 months.
- Breastfeeding: Your supply is established. If you're pumping, you can begin building a small freezer stash.
- Discuss contraception with your doctor at your postpartum checkup. It is possible to ovulate and become pregnant even while breastfeeding.`,
                babyCareNotes: `- Feeding: 8-10 times per day (may decrease slightly as baby becomes more efficient).
- Breastmilk intake: 90-120 ml per feed (approximately 750-900 ml per day).
- Wet diapers: 6-8+ per day.
- Bowel movements: May be less frequent — some breastfed babies go 5-7 days between stools (this is normal if stool is soft).
- Tummy time: 2-3 minutes, 3-4 times daily.
- Baby may begin to make cooing sounds.
- Baby may follow objects with eyes for short distances.
- 1-month vaccinations: BCG (if not given at birth), Hepatitis B (second dose), OPV (oral polio vaccine) — as per India's Universal Immunization Programme (UIP).`,
                mentalHealthNotes: `- The one-month mark is a good time to check in with your mental health. If you've been consistently feeling sad, anxious, irritable, or "not yourself," talk to your doctor.
- The EPDS (Edinburgh Postnatal Depression Scale) is a 10-question screening tool used globally and in India. A score of 10 or above warrants further evaluation.
- In India, MOHFW's Rashtriya Bal Swasthya Karyakram (RBSK) includes screening for postpartum depression at district early intervention centers.
- Your relationship with your partner: The first month of parenthood is one of the most challenging periods for relationships. Communication is key. Share your feelings, acknowledge each other's efforts, and be patient.
- Mother-in-law dynamics: In Indian joint families, managing the mother-in-law relationship can be challenging postpartum. Set gentle boundaries while appreciating her support. Your partner can help mediate.`,
                activityNotes: `- Walking: 10-15 minutes, 1-2 times daily at a comfortable pace.
- Continue Kegels: 15-20 repetitions, 2-3 times daily, holding 5-8 seconds.
- Pelvic tilts: 10-15 repetitions, 2-3 times daily.
- Gentle stretching: Continue with gentle neck, shoulder, and back stretches.
- Breathing exercises: 10 deep breaths, 3-4 times daily. Focus on diaphragmatic breathing.
- If you had an uncomplicated vaginal delivery, you may begin very gentle postnatal yoga with guidance.
- Avoid: Heavy lifting, running, jumping, sit-ups, crunches, or any exercise that causes pain or discomfort.
- According to ACOG, gradual return to exercise is recommended, with clearance from your healthcare provider at the 4-6 week checkup.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bright red bleeding that has not decreased or has returned after stopping
- Foul-smelling vaginal discharge or lochia
- Fever above 100.4°F (38°C)
- Severe or persistent perineal or C-section pain
- Redness, warmth, or drainage from C-section incision
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or difficulty bonding with baby
- Baby: Poor weight gain, lethargy, fever, fewer than 6 wet diapers/day, or projectile vomiting
- Baby: Not responding to sounds, not fixing gaze on faces, or extreme floppiness/stiffness`,
        },
        {
                weekNumber: 5,
                title: "Week 5: Growing Stronger Together",
                summary: "You and your baby are growing stronger every day. Your postpartum checkup is approaching — use this time to prepare your questions.",
                bodyMarkdown: `# Week 5 Postpartum

You're approaching the 6-week milestone, which marks the traditional end of the postpartum recovery period. Your body has done significant healing, and your baby is becoming more alert and interactive.

## Physical Recovery
- Most women feel significantly better by week 5.
- Your body has largely healed from the immediate effects of childbirth.
- You may be feeling more like yourself physically and emotionally.
- Your 6-week postpartum checkup is next week — prepare your questions now.

## Preparing for Your Postpartum Checkup
Your 6-week checkup is an important milestone. Be prepared to discuss:
- **Physical recovery**: Any pain, bleeding, or discomfort that persists.
- **Breastfeeding**: Any challenges, concerns about supply, or plans for returning to work.
- **Mental health**: Your mood, anxiety levels, and overall emotional wellbeing.
- **Contraception**: Family planning and birth spacing. WHO recommends at least 24 months between pregnancies for optimal maternal and child health outcomes.
- **Exercise**: Clearance for returning to normal physical activity.
- **Sexual health**: When you can resume intercourse and any concerns about pain or discomfort.
- **Pelvic floor**: Any concerns about incontinence, prolapse, or pelvic pressure.

## Indian Postpartum Checkup Context
- In India, the postpartum checkup is often done by the doctor who delivered your baby, or at a government health facility (PHC/CHC) under the Janani Suraksha Yojana (JSY).
- ASHA workers typically make home visits during the first 42 days. They can help arrange your postpartum checkup.
- Don't skip this appointment — it's crucial for your long-term health. MOHFW guidelines recommend at least one postpartum visit at 4-6 weeks.

## Your Baby at 5 Weeks
- Baby may begin to smile socially (not just reflexively).
- They may follow objects with their eyes more smoothly.
- Head control is improving — they can lift their head briefly during tummy time.
- Cooing sounds may become more frequent.
- Crying may peak around this age (6 weeks is the typical peak of crying in infants).

## Sources & References
- **WHO**: "Birth Spacing" — recommends at least 24 months between pregnancies for optimal maternal and child health.
- **MOHFW India**: "Janani Suraksha Yojana" — provides cash benefits for institutional delivery and postpartum care.
- **FOGSI**: "Postpartum Care" — recommends comprehensive assessment at 6 weeks including physical exam, mental health screening, and family planning counseling.
- **ACOG**: "Optimizing Postpartum Care" — the postpartum visit should be an ongoing process, not a single encounter.
- **IAP**: "Growth and Development" — social smile typically emerges at 6-8 weeks.
- **CDC**: "Milestones at 2 Months" — baby should begin to smile at people, coo, and follow objects with eyes.`,
                recoveryNotes: `- Your 6-week checkup is next week. Write down your questions beforehand — it's easy to forget during the appointment.
- Pelvic floor: Increase Kegels to 20-25 repetitions, 2-3 times daily. Hold for 5-8 seconds.
- If you're still experiencing significant perineal pain, pelvic pressure, or incontinence, discuss these with your doctor at your checkup.
- C-section: You may feel well enough to resume most activities, but wait for clearance from your doctor.
- Breastfeeding: If you're returning to work, start planning your pumping schedule now. Indian law mandates 6 months of maternity leave with crèche facilities (Maternity Benefit Act, 2017).
- Contraception: Discuss options with your doctor. Lactational amenorrhea method (LAM) is only effective if: 1) you haven't resumed menstruation, 2) you're exclusively breastfeeding, and 3) your baby is less than 6 months old.`,
                babyCareNotes: `- Feeding: 8-10 times per day. Breastmilk intake: 90-120 ml per feed.
- Wet diapers: 6-8+ per day.
- Tummy time: 3-5 minutes, 3-4 times daily. This is crucial for developing neck and shoulder strength.
- Baby may begin to smile socially — one of the most rewarding milestones!
- Baby may follow objects with eyes for longer distances.
- Crying may peak around 6 weeks. This is normal (the "period of PURPLE crying" concept). It will get better.
- Continue exclusive breastfeeding — no water, honey, ghutti, or any other liquids/foods until 6 months (IAP, WHO, AAP recommendation).
- 6-week vaccinations are approaching: DPT (Diphtheria, Pertussis, Tetanus), Hib, IPV, PCV, Rotavirus, and OPV as per India's UIP schedule.`,
                mentalHealthNotes: `- The 6-week mark is an important time for mental health screening. Postpartum depression is most commonly diagnosed between 4-6 weeks postpartum.
- If you're feeling persistently sad, anxious, irritable, or overwhelmed, you're not alone — and it's not your fault. Postpartum depression is a medical condition, not a character flaw.
- In India, the National Mental Health Programme (NMHP) now includes maternal mental health. District hospitals have mental health services available.
- "Mom guilt" is real — you may feel guilty about not being "perfect," about returning to work, or about taking time for yourself. Challenge these thoughts. A happy mother is the best gift you can give your baby.
- Your identity: You may feel like you've lost your pre-baby self. This is a major life transition. Give yourself time to discover your new identity as a mother while maintaining your own interests and needs.`,
                activityNotes: `- Walking: 15-20 minutes, 1-2 times daily. Increase pace gradually if comfortable.
- Continue Kegels: 20-25 repetitions, 2-3 times daily. Hold 5-8 seconds.
- Pelvic tilts: 15-20 repetitions, 2-3 times daily.
- Begin gentle bridges: Lie on your back, knees bent, lift hips slowly. 5-8 repetitions. ONLY if comfortable and no diastasis recti.
- Gentle stretching: Continue with daily stretches.
- Breathing exercises: 10 deep breaths, 3-4 times daily.
- Avoid: Heavy lifting, running, jumping, sit-ups, crunches, or any high-impact exercise until cleared by your doctor.
- Wait for your 6-week checkup before starting any new exercise program. Your doctor will assess your individual recovery.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Persistent bright red bleeding or bleeding that has returned after stopping
- Foul-smelling vaginal discharge
- Pelvic pain or pressure that is worsening
- Pain during urination or bowel movements
- Urine or stool leakage
- Persistent sadness, anxiety, or feelings of hopelessness
- Difficulty bonding with your baby or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain (preeclampsia can occur postpartum)
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: High-pitched crying, extreme irritability, or projectile vomiting`,
        },
        // ═══════════════════════════════════════════════
        // EARLY RECOVERY PHASE — Week 6 (transition to Late)
        // ═══════════════════════════════════════════════
        {
                weekNumber: 6,
                title: "Week 6: Your Postpartum Checkup Milestone",
                summary: "The 6-week checkup is your gateway back to full activity. Your baby is starting to smile socially — one of the most rewarding milestones of early parenthood.",
                bodyMarkdown: `# Week 6 Postpartum

This is a landmark week — the traditional end of the postpartum recovery period. Your 6-week checkup is the gateway to resuming normal activities, and your baby's first social smiles are beginning to appear.

## Your 6-Week Postpartum Checkup
This appointment is one of the most important health visits you'll have. It covers:
- **Physical exam**: Uterus involution, perineal/C-section healing, pelvic floor assessment, blood pressure check.
- **Mental health screening**: Your doctor should screen for postpartum depression and anxiety using validated tools like the Edinburgh Postnatal Depression Scale (EPDS).
- **Contraception counseling**: Family planning and birth spacing. WHO recommends at least 24 months between pregnancies.
- **Exercise clearance**: Discussion about returning to physical activity, including abdominal exercises.
- **Sexual health**: When to resume intercourse and addressing any concerns about pain.
- **Breastfeeding support**: Addressing any ongoing challenges or planning for return to work.
- **Nutrition**: Iron and calcium supplementation may continue if needed.

## Indian Postpartum Checkup Context
- Under the Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA), free antenatal and postnatal checkups are available on the 9th of every month at government health facilities.
- ASHA workers should have completed their 6th home visit by now. They can assist with referral to higher facilities if needed.
- The MOHFW's "MAA" (Mothers' Absolute Affection) Programme supports breastfeeding through this period.
- If you delivered at a government facility under Janani Suraksha Yojana (JSY), your cash incentive should be processed by now.

## Your Baby at 6 Weeks
- **Social smile**: Baby begins to smile in response to your face and voice (not just reflexively). This is a major social milestone.
- **Head control**: Baby can lift head briefly during tummy time and may turn head toward sounds.
- **Vision**: Baby can track objects moving across their field of vision more smoothly.
- **Cooing**: More vocalizations — coos, gurgles, and experimental sounds.
- **Crying peak**: 6 weeks is the typical peak of infant crying (the "Period of PURPLE Crying"). This is temporary and normal.
- **Growth**: Baby should have regained birth weight and gained an additional 500-800g since birth.

## Sources & References
- **WHO**: "Recommendations on Postnatal Care of the Mother and Newborn" (2013) — recommends postnatal contacts at 48-72 hours, 7-14 days, and 6 weeks.
- **MOHFW India**: "Pradhan Mantri Surakshit Matritva Abhiyan" — free quality checkups on the 9th of every month.
- **MOHFW India**: "MAA Programme" — Mothers' Absolute Affection for breastfeeding promotion.
- **FOGSI**: "Postpartum Care Guidelines" — comprehensive 6-week assessment including EPDS screening.
- **ACOG**: Committee Opinion #736 — "Optimizing Postpartum Care" — postpartum care should be an ongoing process.
- **IAP**: "Immunization Schedule" — 6-week vaccines include DPT, Hib, IPV, PCV, Rotavirus, and OPV.
- **CDC**: "Important Milestones: Your Baby By Two Months" — social smile, cooing, and head lifting.
- **NICE**: "Postnatal Care" (NG194) — full clinical assessment at 6-8 weeks postpartum.`,
                recoveryNotes: `- Attend your 6-week postpartum checkup. Write down all your questions beforehand — it's easy to forget during the appointment.
- Pelvic floor: Discuss with your doctor. If you have diastasis recti, your doctor can assess the gap and recommend appropriate exercises.
- C-section: Your incision should be well-healed. Discuss any numbness, itching, or discomfort with your doctor.
- Perineal healing: If you had a tear or episiotomy, your doctor will check healing. Discuss any pain during intercourse.
- Contraception: Discuss options with your doctor. Progesterone-only methods (mini-pill, implant, injection) are safe during breastfeeding. Lactational amenorrhea method (LAM) is only effective if all 3 criteria are met.
- Iron and calcium: Continue supplementation if recommended by your doctor. Your hemoglobin should be checked.
- If you experienced gestational diabetes, get your blood sugar tested again. 50% of women with GDM develop type 2 diabetes within 5-10 years (ICMR data).`,
                babyCareNotes: `- Feeding: 8-10 times per day. Breastmilk intake: 90-120 ml per feed. Continue exclusive breastfeeding — no water, honey, ghutti, or any other foods/liquids until 6 months.
- 6-week vaccinations: DPT (Diphtheria, Pertussis, Tetanus), Hib, IPV, PCV, Rotavirus, and OPV as per India's Universal Immunization Programme (UIP). Discuss with your pediatrician.
- Post-vaccination care: Baby may have mild fever, irritability, or swelling at injection site. Paracetamol drops may be prescribed. Give extra feeds for comfort.
- Wet diapers: 6-8+ per day.
- Tummy time: 3-5 minutes, 3-4 times daily. This is crucial for developing neck, shoulder, and core strength.
- Baby's crying may peak this week. The "Period of PURPLE Crying" concept explains this is normal developmental behavior. It will improve.
- Skin-to-skin contact: Continue daily. It regulates baby's temperature, heart rate, and breathing, and promotes bonding.
- Sleep: Baby sleeps 14-17 hours per day but in short stretches. Most babies this age wake every 2-4 hours to feed.`,
                mentalHealthNotes: `- Your doctor should screen for postpartum depression at your 6-week checkup. Be honest about your feelings — there is no shame in seeking help.
- The "baby blues" should have resolved by now. If you're still experiencing persistent sadness, anxiety, irritability, or difficulty sleeping (even when baby sleeps), tell your doctor. This may be postpartum depression.
- Postpartum depression affects 1 in 7 women globally. In India, studies suggest prevalence rates of 11-23% (ICMR, NIMHANS data). You are not alone.
- Postpartum anxiety: Excessive worry about baby's health, intrusive thoughts, or panic attacks are also treatable. Tell your doctor.
- In India, the National Mental Health Programme (NMHP) includes maternal mental health. District hospitals have mental health services. The DMHP (District Mental Health Programme) operates in 700+ districts.
- "Mom guilt" may intensify as you approach return to work. Remember: A happy, healthy mother is the best thing for your baby.`,
                activityNotes: `- After your 6-week checkup and doctor's clearance, you can gradually resume most physical activities.
- Walking: 20-30 minutes daily. You can increase pace and duration.
- Kegels: 20-25 repetitions, 3 times daily. Hold 5-8 seconds.
- Pelvic tilts: 15-20 repetitions, 2-3 times daily.
- Gentle bridges: 8-10 repetitions, 2 times daily.
- Begin gentle core exercises: Pelvic tilts, heel slides, and gentle abdominal bracing ONLY if you don't have diastasis recti.
- Avoid: Running, jumping, sit-ups, crunches, heavy lifting (>5 kg) until your doctor clears you specifically for these activities.
- Yoga: Gentle postpartum yoga (pranayama, gentle stretches) can begin after doctor's clearance. Avoid intense asanas.
- Swimming: Wait until lochia has stopped and your doctor clears you (usually after 6-8 weeks).
- Sexual activity: Discuss with your doctor at your checkup. Use lubrication — postpartum hormonal changes can cause vaginal dryness.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Heavy bleeding (soaking more than 1 pad per hour) or bleeding that returns after stopping
- Foul-smelling vaginal discharge or lochia
- Fever above 100.4°F (38°C)
- Severe pain, redness, warmth, or drainage from C-section incision or episiotomy
- Severe breast pain, redness, and fever (mastitis — requires antibiotics)
- Chest pain, difficulty breathing, or coughing up blood (pulmonary embolism risk)
- Severe headache, vision changes, or upper abdominal pain (postpartum preeclampsia)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Baby: Fever, lethargy, poor feeding, fewer than 6 wet diapers/day
- Baby: Prolonged inconsolable crying, projectile vomiting, or seizure-like movements`,
        },
        // ═══════════════════════════════════════════════
        // LATE RECOVERY PHASE — Week 7-12
        // ═══════════════════════════════════════════════
        {
                weekNumber: 7,
                title: "Week 7: Finding Your New Rhythm",
                summary: "Your body is regaining strength and you're finding your rhythm as a mother. If you're returning to work, start planning your pumping routine now.",
                bodyMarkdown: `# Week 7 Postpartum

You're now transitioning from early recovery into the late recovery phase (weeks 7-12). Your body is healing well, and you're likely feeling more confident in your mothering abilities.

## Physical Recovery
- Your uterus has fully returned to its pre-pregnancy size (involution complete by 6-8 weeks).
- Lochia (postpartum bleeding) should have stopped or be very minimal by now.
- If you had a C-section, the external scar is well-healed, but internal healing continues for months.
- Breastfeeding is likely well-established, though challenges can still arise.
- You may notice increased hair shedding (postpartum telogen effluvium) starting around this time. This is hormonal and temporary — it peaks at 3-4 months and resolves by 6-12 months.

## Return to Work Planning
If you're returning to work soon:
- **Indian law**: The Maternity Benefit (Amendment) Act, 2017 provides 26 weeks of paid maternity leave for women in establishments with 10+ employees (for first 2 children; 12 weeks for third child).
- **Creche facilities**: Employers with 50+ employees must provide creche facilities within a prescribed distance.
- **Work from home**: The Act allows work-from-home options after maternity leave if the nature of work permits.
- **Pumping at work**: Plan your pumping schedule. You'll need to pump every 3-4 hours during work hours. Discuss a private lactation room with your employer.
- **Breastmilk storage**: Fresh expressed milk at room temperature (19-26 deg C): 4-6 hours. Refrigerator: 3-5 days. Freezer: 3-6 months.

## Indian Context
- Many Indian mothers live in joint families, which provides invaluable support. Grandmothers often take on significant childcare responsibilities.
- For working mothers in urban India, daycare centers (anganwadis for older children, private creches for infants) are increasingly available.
- The "jaapa" (traditional confinement) period may be ending in many communities. Traditional massage (malish) may continue or reduce in frequency.

## Your Baby at 7 Weeks
- Social smile is more frequent and responsive.
- Baby may begin to recognize familiar faces and voices.
- Head control is improving — baby can hold head up for longer during tummy time.
- Cooing and vocalizations increase.
- Baby may begin to follow moving objects with their eyes more smoothly.
- Sleep patterns: Still irregular but may begin to show slightly longer stretches at night (3-4 hours).

## Sources & References
- **WHO**: "Breastfeeding and Maternal Health" — exclusive breastfeeding for first 6 months, continued breastfeeding up to 2 years and beyond.
- **MOHFW India**: "Maternity Benefit (Amendment) Act, 2017" — 26 weeks paid maternity leave, creche facility mandate.
- **La Leche League International**: "Breastmilk Storage Guidelines" — evidence-based storage recommendations.
- **ACOG**: "Postpartum Hair Loss" — telogen effluvium is common, peaks at 3-4 months, resolves by 6-12 months postpartum.
- **IAP**: "Infant and Young Child Feeding" — exclusive breastfeeding for 6 months, no water or other fluids.
- **AAP**: "Caring for Your Baby and Young Child" — 7-week developmental milestones.`,
                recoveryNotes: `- Lochia should have stopped or be very minimal. If you're still bleeding or the bleeding has returned, mention this at your follow-up.
- Hair loss: Postpartum hair shedding (telogen effluvium) is normal and temporary. It will resolve. Continue taking your iron and multivitamin supplements.
- Pelvic floor: Continue Kegels — 25 repetitions, 3 times daily. Hold 5-8 seconds.
- C-section: Internal healing continues. Avoid heavy lifting. You may feel occasional twinges or numbness around the scar — this is normal.
- Breastfeeding: If you're returning to work, begin practicing with the breast pump. Pump once daily after a morning feed to build a freezer stash.
- Breastmilk storage: Use clean, sterilized containers or breastmilk storage bags. Label with date. Thaw frozen milk in the refrigerator overnight, never in the microwave.
- Nutrition: Continue high-protein, iron-rich diet. Indian foods: dal, paneer, eggs, green leafy vegetables, nuts, and milk. Gond ke laddoo and panjiri can still be enjoyed.`,
                babyCareNotes: `- Feeding: 8-10 times per day. Breastmilk intake: 90-120 ml per feed. Continue exclusive breastfeeding.
- If baby is bottle-fed expressed milk, use paced bottle feeding to avoid nipple preference.
- Growth spurt: Babies often have a growth spurt around 6-8 weeks. Baby may feed more frequently (cluster feeding) — this is normal and helps increase your milk supply.
- Wet diapers: 6-8+ per day. Stools may become less frequent (once every few days is normal for breastfed babies after 6 weeks).
- Tummy time: 4-5 minutes, 3-4 times daily. Baby should be able to lift head to 45 degrees.
- Sleep: Baby may start showing slightly longer nighttime stretches. Follow safe sleep guidelines: back to sleep, firm surface, no loose bedding, no pillows, no co-sleeping on soft surfaces.
- Social interaction: Talk, sing, and make faces at your baby. They love your face and voice!`,
                mentalHealthNotes: `- The transition from "new mother" to "mother" identity continues. You may feel like you're losing your pre-baby self. This is a major life transition — give yourself grace.
- If you're returning to work, you may feel conflicted: guilt about leaving baby, excitement about returning to work, anxiety about both. All these feelings are normal.
- In Indian joint families, the grandmother or other relatives may take on significant caregiving. This is a blessing but can also create tension about parenting decisions. Communicate openly and respectfully.
- Postpartum depression can still develop or worsen. If you're feeling persistently sad, anxious, or overwhelmed, seek help. The DMHP (District Mental Health Programme) operates in 700+ districts across India.
- Self-care is not selfish: A short walk, a cup of tea in peace, a phone call with a friend — these small moments matter.
- Partner support: Your partner may also be adjusting. Encourage open communication about feelings, expectations, and division of responsibilities.`,
                activityNotes: `- Walking: 25-30 minutes, 1-2 times daily. You can increase pace.
- Kegels: 25 repetitions, 3 times daily. Hold 5-8 seconds.
- Pelvic tilts: 15-20 repetitions, 2-3 times daily.
- Bridges: 8-10 repetitions, 2 times daily.
- Gentle core: Heel slides, abdominal bracing (transverse abdominis activation). 10 repetitions each.
- Yoga: Gentle pranayama (breathing exercises) and restorative poses. Avoid intense twists or abdominal work.
- Begin gentle stretching routine: Neck, shoulders, back, hips. Baby-carrying and breastfeeding can cause tension.
- Swimming: If lochia has stopped and doctor has cleared you, swimming is excellent low-impact exercise.
- Avoid: Running, jumping, high-impact aerobics, heavy weightlifting, or intense abdominal exercises until 12 weeks minimum.
- Listen to your body: If you experience pain, increased bleeding, or pelvic pressure, reduce activity and consult your doctor.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned after stopping (a sign of retained placental tissue or infection)
- Foul-smelling vaginal discharge
- Fever above 100.4°F (38°C)
- Redness, warmth, or pus from C-section incision or episiotomy
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg swelling (thrombosis risk)
- Baby: Fever, lethargy, poor feeding, fewer than 6 wet diapers/day
- Baby: Not smiling by 8 weeks — discuss with pediatrician if no social smile emerges`,
        },
        {
                weekNumber: 8,
                title: "Week 8: Two Months of Motherhood",
                summary: "Two months of motherhood! Your baby is becoming more interactive, and your body continues to heal. You're stronger than you think.",
                bodyMarkdown: `# Week 8 Postpartum

Congratulations on completing two months of motherhood! Your baby is now 2 months old and becoming much more interactive. This is a time of growing confidence and deepening bonds.

## Physical Recovery at 8 Weeks
- Your body has largely healed from childbirth. Most of the visible changes (swelling, lochia, incision healing) have resolved.
- Hormones are stabilizing, though breastfeeding continues to influence your hormonal state.
- **Hair loss**: Postpartum hair shedding (telogen effluvium) may be noticeable now. This is due to the drop in estrogen after delivery. It peaks around 3-4 months and resolves by 6-12 months. Continue iron and biotin-rich foods.
- **Skin changes**: Melasma (pregnancy mask) may be fading but can persist, especially with sun exposure. Linea nigra (dark line on abdomen) is fading.
- **Weight**: Most women have lost about half their pregnancy weight by 8 weeks. The remaining weight loss is gradual and should not be rushed.
- **Breastfeeding**: Your milk supply is well-established and regulated. Breasts may feel softer (this is normal, not a sign of low supply).

## Traditional Indian Postpartum Diet
- **Gond ke laddoo**: Made with edible gum (gond), wheat flour, ghee, nuts, and jaggery. Gond is believed to strengthen joints and bones.
- **Panjiri**: A traditional Punjabi postpartum food made with whole wheat flour, ghee, nuts, seeds, and jaggery. Rich in iron, calcium, and energy.
- **Methi ladoo**: Fenugreek (methi) is a galactagogue — it supports breastmilk production.
- **Ajwain (carom seeds)**: Often used in postpartum foods to aid digestion and reduce gas (for both mother and baby).
- **Dry fruits and nuts**: Almonds, cashews, and dates are nutrient-dense and traditionally given to new mothers.
- **Haldi doodh (turmeric milk)**: Turmeric has anti-inflammatory properties and is believed to aid healing.
- **Note**: These traditional foods are beneficial but should be part of a balanced diet. If you have gestational diabetes or thyroid issues, consult your doctor about portion sizes.

## Your Baby at 8 Weeks (2 Months)
- **Social smile**: Now well-established. Baby smiles in response to your face and voice.
- **Cooing and vocalizing**: Baby makes more sounds — coos, gurgles, and may experiment with vowel sounds.
- **Vision**: Baby can track objects across 180 degrees and may show interest in high-contrast patterns.
- **Head control**: Baby can lift head to 45-90 degrees during tummy time and hold it steady when supported.
- **Hands**: Baby may begin to notice their own hands and may bring them to mouth.
- **Recognition**: Baby recognizes familiar faces and may quiet when they hear familiar voices.
- **2-month vaccinations**: If not given at 6 weeks, the 2-month vaccines are due: DPT, Hib, IPV, PCV, Rotavirus, and OPV (UIP schedule).

## Sources & References
- **WHO**: "Postnatal Care for Mothers and Newborns" — highlights from the WHO 2013 Guidelines.
- **MOHFW India**: "National Health Mission — Reproductive and Child Health" — comprehensive postpartum care guidelines.
- **NIN (National Institute of Nutrition)**: "Dietary Guidelines for Indians" — postpartum nutritional requirements: additional 600 kcal and 520 mg calcium during lactation.
- **ICMR**: "Nutrient Requirements for Indians" — RDA for lactating women.
- **ACOG**: "Postpartum Care" — what to expect in the weeks after delivery.
- **AAP**: "Ages & Stages — 2 Months" — developmental milestones.
- **CDC**: "Milestone Checklist — 2 Months" — social/emotional, language/communication, cognitive, and movement milestones.
- **IAP**: "Immunization Schedule" — 6/10/14 week vaccination schedule.`,
                recoveryNotes: `- Pelvic floor: Continue Kegels — 25-30 repetitions, 3 times daily. Hold 5-8 seconds. You should notice improved bladder control.
- Diastasis recti: If you still have a gap >2 finger-widths, continue with gentle core exercises. Avoid crunches, sit-ups, planks, and any exercise that causes doming of the abdomen.
- C-section: The scar may be itchy or numb. This is normal as nerves regenerate. Massage the scar gently with oil (coconut or vitamin E) once fully healed to improve tissue mobility.
- Perineum: If you had a tear, the area should be healed. If intercourse is painful, discuss with your doctor. Vaginal estrogen cream may be prescribed if breastfeeding-related dryness is severe.
- Hair loss: Continue protein-rich diet. Include eggs, dal, paneer, nuts, and seeds. Biotin-rich foods: nuts, eggs, sweet potatoes.
- Breastfeeding: If returning to work, continue building your freezer stash. Rotate stored milk — use oldest first (FIFO: first in, first out).
- Iron: Continue supplementation if recommended. Postpartum anemia is common in India (50-80% prevalence according to ICMR studies).`,
                babyCareNotes: `- Feeding: 8-10 times per day. Breastmilk intake: 90-120 ml per feed. Continue exclusive breastfeeding.
- Cluster feeding may occur during growth spurts. This is normal and helps increase your milk supply.
- 2-month vaccinations: DPT, Hib, IPV, PCV, Rotavirus, and OPV. Prepare for post-vaccination care: mild fever, irritability, and swelling at injection site are common.
- Wet diapers: 6-8+ per day. Stools: 1-2 per day or once every few days (both are normal for breastfed babies).
- Tummy time: 4-5 minutes, 3-4 times daily. Baby should lift head to 45-90 degrees.
- Sleep: Baby may sleep 4-5 hour stretches at night. Continue safe sleep: back to sleep, firm surface, no loose bedding.
- Play: High-contrast toys, rattles, and your face are the best playthings. Talk, sing, and read to your baby.
- Baby may begin to grasp objects placed in their hand.`,
                mentalHealthNotes: `- The 2-month mark is a time when many mothers feel more confident, but it's also when postpartum depression can peak. The Edinburgh Postnatal Depression Scale (EPDS) is validated for use up to 12 months postpartum.
- In India, maternal mental health is increasingly recognized. The MOHFW's "MAA" programme and the National Mental Health Programme both include maternal mental health components.
- Body image: You may feel frustrated if your body hasn't "bounced back." Remember: It took 9 months to grow your baby — give yourself at least that long to recover. Social media images of "postpartum bodies" are often unrealistic.
- Relationship with partner: The postpartum period can strain relationships. Sleep deprivation, new responsibilities, and changing roles all contribute. Open communication is essential.
- If you're in a joint family, the presence of in-laws can be both supportive and stressful. Set boundaries kindly but clearly. Discuss your parenting preferences with your partner first, then communicate as a team.
- "Me time": Even 15 minutes alone — a shower, a walk, reading — can help you recharge. Ask your partner or family member to watch the baby.`,
                activityNotes: `- Walking: 30 minutes, 1-2 times daily. You can now walk at a brisk pace.
- Kegels: 25-30 repetitions, 3 times daily. Hold 5-8 seconds.
- Pelvic tilts: 15-20 repetitions, 2-3 times daily.
- Bridges: 10-12 repetitions, 2 times daily.
- Gentle core: Heel slides, abdominal bracing, and gentle leg slides. 10-12 repetitions each.
- Yoga: Gentle hatha yoga, pranayama, and restorative poses. Avoid intense abdominal work, deep twists, and inversions.
- Swimming: Excellent low-impact exercise if cleared by your doctor.
- Postnatal exercise classes: Many physiotherapists offer postnatal exercise programs. These are safe and designed for postpartum recovery.
- Listen to your body: If you experience pain, leaking urine, or pelvic heaviness during exercise, stop and consult a pelvic floor physiotherapist.
- Avoid: Running, jumping, high-impact aerobics, heavy weightlifting, or intense abdominal exercises.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned after stopping or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Redness, warmth, or pus from C-section incision or episiotomy
- Pain, burning, or difficulty during urination
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Baby: No social smile by 8-10 weeks — discuss with pediatrician
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not responding to loud sounds or not tracking objects with eyes`,
        },
        {
                weekNumber: 9,
                title: "Week 9: Building Strength and Confidence",
                summary: "As you approach the end of early recovery, your body is stronger and your confidence is growing. Your baby is discovering their voice.",
                bodyMarkdown: `# Week 9 Postpartum

You're in the late recovery phase (weeks 7-12). Your body is significantly stronger, and your baby is becoming more socially engaged.

## Physical Recovery
- Your body has largely recovered from the acute effects of childbirth.
- Pelvic floor strength is improving with consistent Kegel exercises.
- Abdominal muscles are healing, though diastasis recti may still be present.
- Breastfeeding is well-established and efficient.
- Energy levels are improving as you get more sleep (hopefully!).

## Diastasis Recti — What You Need to Know
- Diastasis recti (DR) is the separation of the abdominal muscles along the linea alba. It affects 60-70% of women during pregnancy and can persist postpartum.
- **How to check**: Lie on your back, knees bent, lift your head slightly. Feel above and below your belly button for a gap. A gap >2 finger-widths is considered diastasis recti.
- **What to avoid**: Crunches, sit-ups, planks, Russian twists, and any exercise that causes doming or bulging of the abdomen.
- **What helps**: Deep core activation (transverse abdominis), pelvic tilts, heel slides, and side-lying exercises.
- **When to seek help**: If the gap is >3 finger-widths or you have back pain, pelvic pain, or urinary incontinence, consult a pelvic floor physiotherapist.
- **Indian context**: Awareness of diastasis recti is growing in India. Many physiotherapy centers in major cities now offer specialized postpartum rehabilitation.

## Indian Postpartum Practices — The "Jaapa" Tradition
- In many Indian communities, the "jaapa" (confinement) period traditionally lasts 40 days, but practices may extend to 2-3 months.
- **Diet**: Warm, easily digestible foods are emphasized. Cold foods and drinks are avoided in many traditions.
- **Massage**: Daily oil massage (malish) for both mother and baby continues in many households. This promotes circulation, relaxation, and bonding.
- **Belly binding**: Traditional belly wrapping with a cotton cloth is practiced in many Indian communities. While evidence is limited, some women report improved comfort and posture. Modern abdominal binders are also available.
- **Rest**: Traditional practices emphasize rest for the mother, with family members taking on household responsibilities.
- **Note**: These practices have cultural significance and can be comforting. However, always prioritize evidence-based medical advice alongside traditional practices.

## Your Baby at 9 Weeks
- **Vocalizing**: Baby is discovering their voice — coos, gurgles, squeals, and vowel sounds increase.
- **Social interaction**: Baby responds to your voice with smiles and vocalizations. They may "take turns" in a proto-conversation.
- **Vision**: Baby can track objects smoothly and may show interest in faces and high-contrast patterns.
- **Head control**: Baby can hold head steady when supported in sitting position. Head lag is decreasing.
- **Hands**: Baby may bring hands together at midline and may begin to bat at objects.
- **Sleep**: Some babies begin to sleep for longer stretches (4-5 hours) at night, though this varies widely.

## Sources & References
- **ACOG**: "Diastasis Recti" — affects 60-70% of pregnant women; management includes physical therapy and targeted exercises.
- **NICE**: "Postnatal Care" (NG194) — pelvic floor muscle exercises should be offered to all women after childbirth.
- **WHO**: "Recommendations on Postnatal Care" — comprehensive assessment and support through 6 weeks and beyond.
- **IAP**: "Infant and Young Child Feeding" — exclusive breastfeeding for 6 months continued up to 2 years.
- **CDC**: "Important Milestones: Your Baby By Two Months" — social/emotional and language milestones.
- **FOGSI**: "Postpartum Care" — comprehensive postpartum assessment including pelvic floor evaluation.
- **MOHFW India**: "Reproductive and Child Health Programme" — postpartum care and family planning services.`,
                recoveryNotes: `- Pelvic floor: Continue Kegels — 30 repetitions, 3 times daily. Hold 5-8 seconds. Add quick flicks (10 quick contractions) for fast-twitch muscle fibers.
- Diastasis recti: Check your abdominal gap. If >2 finger-widths, continue with gentle core exercises and avoid crunches/sit-ups/planks.
- C-section: The scar should be well-healed. Gentle scar massage with oil can improve tissue mobility and reduce numbness.
- Breastfeeding: Continue pumping if returning to work. Your milk supply is regulated — breasts feeling softer is normal.
- Nutrition: Continue high-protein, iron-rich diet. Include calcium-rich foods: milk, yogurt, paneer, ragi (finger millet), and sesame seeds.
- Traditional Indian foods: Gond ke laddoo, panjiri, and methi ladoo are nutritious and culturally significant. Enjoy in moderation as part of a balanced diet.
- Hydration: Drink 3-4 liters of water daily. Include coconut water, buttermilk (chaas), and soups for hydration and electrolytes.`,
                babyCareNotes: `- Feeding: 8-10 times per day. Breastmilk intake: 90-120 ml per feed. Continue exclusive breastfeeding.
- Growth spurt: Another growth spurt may occur around 9-10 weeks. Baby may feed more frequently.
- Wet diapers: 6-8+ per day. Stools: May become less frequent.
- Tummy time: 5-8 minutes, 3-4 times daily. Baby should lift head to 45-90 degrees and may begin to push up on forearms.
- Play: Talk to your baby — narrate your day, sing songs, read board books. High-contrast toys and rattles are engaging.
- Baby may begin to bat at objects with hands. Hang a simple mobile or toy within reach during supervised play.
- Sleep: Continue safe sleep practices. Swaddling can still be used but stop once baby shows signs of rolling (usually 3-4 months).
- Baby massage: Continue oil massage with coconut oil or almond oil. This is a cherished Indian tradition that promotes bonding and relaxation.`,
                mentalHealthNotes: `- The "fourth trimester" (first 3 months) is nearly over. This is a significant transition. You may feel relief, sadness, or a mix of both.
- Your identity as a mother is solidifying. You may also miss your pre-baby life. This is normal and not a sign that you don't love your baby.
- In Indian culture, motherhood is highly valued but can also feel all-consuming. Remember that you are still YOU — a person with interests, needs, and dreams beyond motherhood.
- Relationship with partner: The postpartum period can strain even strong relationships. Schedule "couple time" — even 15 minutes of undistracted conversation can help.
- If you're in a joint family, communication is key. Discuss parenting decisions with your partner first, then present a united front. Respectfully acknowledge elders' wisdom while also asserting your own parenting choices.
- Postpartum depression screening: If you haven't been screened, ask your doctor. The EPDS is a simple 10-question tool.`,
                activityNotes: `- Walking: 30-35 minutes, 1-2 times daily. Brisk walking is appropriate if comfortable.
- Kegels: 30 repetitions, 3 times daily. Hold 5-8 seconds. Add quick flicks: 10 quick contractions, 3 times daily.
- Pelvic tilts: 15-20 repetitions, 2-3 times daily.
- Bridges: 10-15 repetitions, 2 times daily.
- Gentle core: Heel slides, abdominal bracing, leg slides. 10-15 repetitions each.
- Yoga: Gentle hatha yoga. Cat-cow stretches, child's pose, and gentle spinal twists (not deep).
- Swimming: Continue if cleared by your doctor. Excellent for overall fitness and pelvic floor-friendly.
- Postnatal Pilates: If available, mat-based postnatal Pilates can be beneficial for core and pelvic floor.
- Avoid: Running, jumping, heavy lifting (>5-8 kg), and intense abdominal exercises.
- Listen to your body: Pain, leaking, or pelvic pressure during exercise means you should stop and consult a pelvic floor physiotherapist.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge
- Fever above 100.4°F (38°C)
- Pain, redness, or swelling in C-section incision or perineal area
- Severe breast pain, redness, and fever (mastitis)
- Pain during urination or bowel movements
- Urine or stool leakage (may indicate pelvic floor dysfunction)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Baby: No social smile, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Extreme floppiness or stiffness, or not bringing hands to mouth`,
        },
        {
                weekNumber: 10,
                title: "Week 10: Your Baby's Growing Personality",
                summary: "Your baby's personality is emerging with more smiles, coos, and interactions. You're in the late recovery phase — your body is getting stronger every day.",
                bodyMarkdown: `# Week 10 Postpartum

You're in the late recovery phase (weeks 7-12). Your body has made remarkable progress, and your baby's personality is beginning to shine through.

## Physical Recovery at 10 Weeks
- Your body is significantly recovered. Most women feel physically well by this stage.
- Pelvic floor strength continues to improve with consistent exercise.
- Abdominal muscles are healing. Diastasis recti may be narrowing.
- Energy levels are improving as sleep patterns (hopefully) become more predictable.
- Hair loss may be noticeable now — this is temporary and will resolve.

## Sexual Health After Childbirth
- Most doctors clear women for sexual activity at the 6-week checkup, but many women don't feel ready until later.
- **Common concerns**: Vaginal dryness (due to low estrogen during breastfeeding), pain, decreased libido, and body image concerns.
- **Vaginal dryness**: Use water-based or silicone-based lubricants. Vaginal estrogen cream may be prescribed if severe.
- **Pain during intercourse**: This can be due to scar tissue, pelvic floor tension, or vaginal atrophy. Discuss with your doctor. Pelvic floor physiotherapy can help.
- **Decreased libido**: Hormonal changes, sleep deprivation, and the demands of caring for a newborn all affect libido. This is normal and temporary.
- **Contraception**: Even if you haven't had your first postpartum period, you can ovulate. Use contraception if you don't want to become pregnant. WHO recommends at least 24 months between pregnancies.
- **Communication**: Talk openly with your partner about your feelings, concerns, and readiness.

## Indian Context — Family Planning
- India's family planning program provides free contraceptives at government health facilities. Options include:
  - **Copper-T (IUCD)**: Can be inserted immediately after delivery (post-placental) or at 6 weeks. Effective for 5-10 years.
  - **Injectable contraceptives (Antara)**: Medroxyprogesterone acetate, given every 3 months. Available free at government facilities.
  - **Oral contraceptive pills**: Progesterone-only pills (Mala-N) are safe during breastfeeding.
  - **Condoms**: Available free at government health facilities.
  - **Sterilization**: Female sterilization (tubectomy) is available at government facilities, often with cash incentives.
- ASHA workers can provide information about family planning services and accompany you to health facilities.

## Your Baby at 10 Weeks
- **Social interaction**: Baby smiles, coos, and may "talk" back when you speak to them. Proto-conversations are emerging.
- **Vocalizing**: Baby experiments with sounds — coos, gurgles, squeals, and vowel-like sounds ("ah," "oo").
- **Vision**: Baby tracks objects across 180 degrees and may show interest in faces and high-contrast patterns.
- **Head control**: Baby can hold head steady when supported. Head lag is minimal.
- **Hands**: Baby brings hands to midline, may grasp objects, and brings hands to mouth.
- **Tummy time**: Baby can lift head to 90 degrees and may push up on forearms.
- **Sleep**: Some babies sleep 5-6 hour stretches at night. Others still wake frequently. Both are normal.

## Sources & References
- **WHO**: "Medical Eligibility Criteria for Contraceptive Use" — comprehensive guide for postpartum contraception.
- **WHO**: "Birth Spacing" — at least 24 months between pregnancies for optimal maternal and child outcomes.
- **MOHFW India**: "National Family Planning Programme" — free contraceptives, ASHA worker involvement, and cash incentives.
- **FOGSI**: "Postpartum Contraception" — guidelines for family planning after childbirth.
- **ACOG**: "Postpartum Sexual Health" — addressing common concerns and providing patient-centered care.
- **AAP**: "Ages & Stages — 2 Months" — developmental milestones.
- **CDC**: "Milestone Checklist — 2 Months" — movement/physical development milestones.
- **IAP**: "Growth and Development" — developmental monitoring guidelines.`,
                recoveryNotes: `- Pelvic floor: Continue Kegels — 30 repetitions, 3 times daily. Hold 5-8 seconds. Quick flicks: 10-15 quick contractions, 3 times daily.
- Diastasis recti: Continue monitoring. Gentle core exercises are safe. Avoid crunches, sit-ups, and planks.
- C-section: The scar is well-healed. Continue gentle scar massage to improve tissue mobility.
- Sexual health: If you haven't resumed intercourse, that's okay. When you're ready, use lubrication and go slowly. Communicate with your partner.
- Contraception: If you haven't discussed family planning, do so now. Even if you're exclusively breastfeeding, you can ovulate.
- Hair loss: Continue protein-rich diet and biotin-rich foods. This is temporary.
- Breastfeeding: If you're pumping at work, ensure you have a private, clean space. Pumping every 3-4 hours maintains supply.
- Nutrition: Continue high-protein, iron-rich, and calcium-rich diet. Indian foods: ragi, dal, paneer, eggs, and green leafy vegetables.`,
                babyCareNotes: `- Feeding: 8-10 times per day. Breastmilk intake: 90-120 ml per feed. Continue exclusive breastfeeding.
- Vaccinations: 10-week vaccines are due if following the 6-10-14 week schedule: DPT, Hib, IPV, PCV, Rotavirus, and OPV (second doses).
- Wet diapers: 6-8+ per day. Stools: 1-2 per day or once every few days.
- Tummy time: 5-8 minutes, 3-4 times daily. Baby should lift head to 90 degrees and push up on forearms.
- Play: Talk, sing, read, and make faces. High-contrast toys, mirrors, and rattles are engaging.
- Baby may begin to bat at objects and grasp them. Provide safe, lightweight toys.
- Sleep: Continue safe sleep. If baby is rolling, stop swaddling. Use a sleep sack instead.
- Baby massage: Continue daily oil massage. Use coconut oil or almond oil. This is a cherished Indian tradition.
- Social interaction: Narrate your day, respond to baby's coos, and maintain eye contact. This builds language and social skills.`,
                mentalHealthNotes: `- The transition to motherhood is a major life event. It's normal to feel a range of emotions — joy, exhaustion, frustration, and love — sometimes all at once.
- Postpartum depression can develop at any time in the first year. If you're feeling persistently sad, anxious, or overwhelmed, seek help. The EPDS is validated for use up to 12 months postpartum.
- In India, maternal mental health is supported through the National Mental Health Programme (NMHP) and the District Mental Health Programme (DMHP).
- Body image: Your body has done an incredible thing — it grew and nourished a human being. Treat it with kindness and respect, not criticism.
- Partnership: If you're feeling disconnected from your partner, this is common. Sleep deprivation and new responsibilities leave little energy for romance. Communicate openly and find small moments of connection.
- Support network: Connect with other new mothers. In India, mothers' groups are increasingly available through hospitals, community centers, and online platforms.
- "Me time": Even 15-20 minutes of alone time can help you recharge. Ask your partner or family member to watch the baby.`,
                activityNotes: `- Walking: 30-40 minutes, 1-2 times daily. Brisk walking is appropriate.
- Kegels: 30 repetitions, 3 times daily. Hold 5-8 seconds. Quick flicks: 10-15 quick contractions, 3 times daily.
- Pelvic tilts: 15-20 repetitions, 2-3 times daily.
- Bridges: 10-15 repetitions, 2-3 times daily.
- Gentle core: Heel slides, abdominal bracing, leg slides, and side-lying leg lifts. 10-15 repetitions each.
- Yoga: Gentle hatha yoga. Include cat-cow, child's pose, gentle spinal twists, and restorative poses.
- Swimming: Continue if comfortable. Excellent for overall fitness.
- Postnatal Pilates: Mat-based postnatal Pilates is beneficial for core and pelvic floor.
- Begin gentle stretching routine: Focus on neck, shoulders, back, and hips.
- Avoid: Running, jumping, high-impact aerobics, heavy weightlifting, and intense abdominal exercises.
- Listen to your body: If you experience pain, leaking, or pelvic pressure during exercise, stop and consult a pelvic floor physiotherapist.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Redness, warmth, or pus from C-section incision
- Severe breast pain, redness, and fever (mastitis)
- Pain or burning during urination
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Baby: No social smile, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not bringing hands to mouth, extreme floppiness or stiffness`,
        },
        // ═══════════════════════════════════════════════
        // LATE RECOVERY PHASE — Week 11-12 (continued)
        // ═══════════════════════════════════════════════
        {
                weekNumber: 11,
                title: "Week 11: Preparing for the Return to Work",
                summary: "If you're planning to return to work, this week focuses on establishing pumping routines, building a milk stash, and preparing for childcare transitions.",
                bodyMarkdown: `# Week 11 Postpartum

You're approaching the end of the late recovery phase (weeks 7-12). Your body is healing well, and you may be thinking about returning to work or resuming your pre-pregnancy activities.

## Physical Recovery at 11 Weeks
- Your pelvic floor should be significantly stronger with consistent exercise. Some women may still experience mild stress incontinence with coughing or jumping.
- Diastasis recti: The gap between abdominal muscles should be narrowing. If it's still wider than 2 finger-widths, continue avoiding crunches and consult a pelvic floor physiotherapist.
- Energy levels are generally improving. Sleep patterns may be more predictable.
- Hair loss may be at its peak — this is telogen effluvium, a temporary condition caused by hormonal changes. It peaks around 3-4 months postpartum.
- Your menstrual cycle may return, especially if you've reduced breastfeeding frequency. First postpartum periods can be heavier and more irregular.

## Returning to Work — Indian Context
- **The Maternity Benefit Act, 2017**: In India, eligible women are entitled to 26 weeks of paid maternity leave. For women with two or more children, the entitlement is 12 weeks.
- **Crèche facility**: The Act mandates that establishments with 50+ employees must provide a crèche facility within a prescribed distance.
- **Work from home**: The Act allows nursing mothers to work from home beyond the 26-week leave period if the nature of work permits.
- **Pumping at work**: Plan ahead — identify a private, clean space for pumping. The Maternity Benefit Act entitles you to nursing breaks (2 breaks per day until the child is 15 months old).
- **Building a milk stash**: Start pumping once daily after the first morning feed. Store milk in 60-120 ml portions. Frozen breastmilk is safe for 6 months in a deep freezer (AAP).
- **Childcare**: Discuss childcare arrangements with your family. In India, grandparents often play a significant role in childcare. If using a daycare or nanny, start transitions gradually.

## Your Baby at 11 Weeks
- **Smiling**: Baby smiles responsively and may laugh or chuckle. Social smiling is well-established.
- **Vocalizing**: Baby coos, gurgles, and makes vowel sounds. May "talk" back when you speak.
- **Head control**: Baby can hold head steady when sitting with support. Head lag is minimal.
- **Tummy time**: Baby can lift head to 90 degrees, push up on forearms, and may roll from tummy to back.
- **Hands**: Baby brings hands together, bats at objects, and may grasp and shake toys.
- **Vision**: Baby tracks objects smoothly across 180 degrees and recognizes familiar faces at a distance.
- **Sleep**: Some babies sleep 6-8 hour stretches. Others still wake 2-3 times. Both are normal.

## Sources & References
- **MOHFW India**: "The Maternity Benefit Act, 2017" — provisions for paid leave, crèche facilities, and nursing breaks.
- **WHO**: "Breastfeeding in the Workplace" — recommendations for supporting breastfeeding mothers returning to work.
- **AAP**: "Breast Milk Storage Guidelines" — proper storage and handling of expressed breastmilk.
- **La Leche League International**: "Returning to Work While Breastfeeding" — guide for pumping, milk storage, and maintaining supply.
- **ACOG**: "Postpartum Return to Work" — guidance on physical and emotional readiness for returning to work.
- **IAP**: "Growth and Development — 2-3 Months" — developmental monitoring guidelines.
- **CDC**: "Milestone Checklist — 2 Months" — movement and social/emotional milestones.`,
                recoveryNotes: `- Pelvic floor: Continue Kegels — 30 repetitions, 3 times daily. Hold 8-10 seconds. Quick flicks: 15-20 quick contractions, 3 times daily.
- Diastasis recti: Continue monitoring. Gentle core exercises are safe. Avoid crunches, sit-ups, and planks if gap is still >2 finger-widths.
- C-section: Scar is well-healed. Continue gentle scar massage. Some numbness around the scar is normal and may persist for months.
- Hair loss: This is telogen effluvium — temporary and self-limiting. Continue protein-rich diet and biotin-rich foods (eggs, nuts, seeds, spinach).
- Menstruation: If your period has returned, it may be heavier and more irregular than before pregnancy. This is normal.
- Contraception: Continue using contraception if you don't want to become pregnant. WHO recommends at least 24 months between pregnancies.
- Nutrition: Continue high-protein, iron-rich, and calcium-rich diet. Indian foods: ragi, dal, paneer, eggs, green leafy vegetables, and dry fruits.`,
                babyCareNotes: `- Feeding: 8-10 times per day. Breastmilk intake: 90-120 ml per feed. Continue exclusive breastfeeding.
- Vaccinations: 10-week or 14-week vaccines according to the 6-10-14 week schedule: DPT, Hib, IPV, PCV, Rotavirus, and OPV.
- Wet diapers: 6-8+ per day. Stools: 1-2 per day or once every few days.
- Tummy time: 8-10 minutes, 3-4 times daily. Baby should lift head to 90 degrees and push up on forearms.
- Baby may begin to roll from tummy to back. Never leave baby unattended on elevated surfaces.
- Reading: Read simple board books with bright pictures. This builds language and bonding.
- Baby massage: Continue daily oil massage. This is a cherished Indian tradition with documented benefits for weight gain and sleep.
- If returning to work, introduce the bottle (if using expressed milk) 1-2 weeks before starting work. Let someone else offer the bottle — baby may refuse it from you.`,
                mentalHealthNotes: `- Returning to work can trigger complex emotions: guilt, anxiety, relief, sadness. All of these are normal and valid.
- "Working mother guilt" is common but unfounded. Research shows that children of working mothers have similar developmental outcomes and may benefit from the model of female independence and work ethic.
- In India, family support can be both a blessing and a source of stress. If elders offer childcare, accept the help while maintaining your role as the primary decision-maker.
- Separation anxiety: Both you and your baby may experience separation anxiety. Gradual transitions help — leave baby for short periods initially.
- Postpartum depression can develop at any time in the first year. If you're feeling persistently sad, anxious, or overwhelmed, seek help. The EPDS is validated for use up to 12 months postpartum.
- The National Mental Health Programme (NMHP) and District Mental Health Programme (DMHP) in India provide mental health support at primary health centres.
- Self-care: Even 15-20 minutes of alone time can help you recharge. Prioritize it.`,
                activityNotes: `- Walking: 30-40 minutes, 1-2 times daily. Brisk walking is appropriate.
- Kegels: 30 repetitions, 3 times daily. Hold 8-10 seconds. Quick flicks: 15-20 quick contractions, 3 times daily.
- Pelvic tilts: 20 repetitions, 3 times daily.
- Bridges: 15-20 repetitions, 3 times daily.
- Gentle core: Heel slides, abdominal bracing, leg slides, side-lying leg lifts. 15-20 repetitions each.
- Yoga: Gentle hatha yoga. Include cat-cow, child's pose, gentle spinal twists, and restorative poses.
- Swimming: Continue if comfortable. Excellent for overall fitness.
- Postnatal Pilates: Mat-based postnatal Pilates is beneficial for core and pelvic floor.
- Light resistance training: Bodyweight exercises like squats, lunges, and modified push-ups (on knees). Start with low repetitions.
- Avoid: Running, jumping, high-impact aerobics, heavy weightlifting, and intense abdominal exercises.
- Listen to your body: If you experience pain, leaking, or pelvic pressure during exercise, stop and consult a pelvic floor physiotherapist.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Redness, warmth, or pus from C-section incision
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not bringing hands to mouth, extreme floppiness or stiffness`,
        },
        {
                weekNumber: 12,
                title: "Week 12: The 3-Month Milestone",
                summary: "Three months postpartum! You're completing the late recovery phase. Your baby is becoming more interactive, and you may feel more like yourself.",
                bodyMarkdown: `# Week 12 Postpartum — The 3-Month Mark

Congratulations — you've reached 3 months postpartum! This is a significant milestone. Your body has made tremendous progress in healing, and your baby is becoming more interactive and engaging every day.

## Physical Recovery at 12 Weeks
- By 12 weeks, most women feel physically recovered. The uterus has returned to its pre-pregnancy size. Lochia has long since stopped.
- Pelvic floor strength should be significantly improved with consistent exercise. Some women may still experience mild symptoms.
- Diastasis recti: The gap should be narrowing. Most women see significant improvement by 12 weeks with proper exercise.
- Hair loss (telogen effluvium) may be at its peak or starting to subside. New hair growth ("baby hairs") may appear around the hairline.
- If you haven't had your period yet, it may return soon — especially if you're reducing breastfeeding frequency.
- Hormonal changes: Estrogen levels are gradually returning to pre-pregnancy levels, especially if you're not exclusively breastfeeding.

## End of Late Recovery — What's Next
- You're transitioning from the late recovery phase (weeks 7-12) to the extended recovery phase (weeks 13-52).
- The extended recovery phase focuses on: long-term recovery, returning to work, family dynamics, weaning, and maintaining your health.
- You may now gradually increase your exercise intensity — but listen to your body.
- If you had a C-section, the internal healing continues for several more months, even though the external scar looks well-healed.

## 3-Month Developmental Milestones
- Your baby's 3-month pediatrician visit is due. This typically includes:
  - Growth measurements (weight, length, head circumference)
  - Developmental screening
  - Vaccinations: The 14-week vaccines are due if following the 6-10-14 week schedule: DPT, Hib, IPV, PCV, Rotavirus, and OPV (third doses).
  - Discussion of feeding, sleep, and any concerns

## Indian Cultural Context — 3-Month Traditions
- In many Indian communities, the 3-month mark is celebrated with small rituals or family gatherings.
- The "jaapa" period (40-day confinement) is long over, and you're likely fully integrated back into family life.
- Some families observe the "annaprashan" (first rice ceremony) around 5-6 months for girls and 6-7 months for boys. This is a good time to start planning if you wish to observe this tradition.
- Traditional massage for both mother and baby may continue — many Indian families continue oil massage for babies well beyond the newborn period.

## Sources & References
- **WHO**: "Postnatal Care for Mothers and Newborns" — comprehensive postnatal care through the first year.
- **ACOG**: "Optimizing Postpartum Care" — ongoing care recommendations for the extended postpartum period.
- **AAP**: "Ages & Stages — 3 Months" — developmental milestones and anticipatory guidance.
- **CDC**: "Milestone Checklist — 4 Months" — social/emotional, language/communication, and movement milestones.
- **IAP**: "Immunization Schedule" — 14-week vaccines (DPT, Hib, IPV, PCV, Rotavirus, OPV).
- **MOHFW India**: "Rashtriya Bal Swasthya Karyakram (RBSK)" — child health screening and early intervention services.
- **FOGSI**: "Postpartum Care Guidelines" — long-term maternal health monitoring.`,
                recoveryNotes: `- Pelvic floor: Continue Kegels — 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Diastasis recti: Check the gap. If it's still >2 finger-widths, continue avoiding crunches and planks. Consult a pelvic floor physiotherapist if concerned.
- C-section: Scar is well-healed. Continue gentle scar massage. Some numbness is normal.
- Hair loss: Should begin to subside. New hair growth ("baby hairs") may appear around the hairline.
- Menstruation: If your period has returned, it may be heavier and more irregular. This is normal for the first few cycles.
- Contraception: Continue using contraception. Discuss long-term options with your doctor.
- Nutrition: Continue high-protein, iron-rich, and calcium-rich diet. Indian foods: ragi, bajra, dal, paneer, eggs, green leafy vegetables.
- If you're planning to return to work, begin establishing a pumping routine.`,
                babyCareNotes: `- Feeding: 8-10 times per day. Breastmilk intake: 90-120 ml per feed. Continue exclusive breastfeeding.
- Vaccinations: 14-week vaccines: DPT, Hib, IPV, PCV, Rotavirus, and OPV (third doses in the 6-10-14 week schedule).
- Wet diapers: 6-8+ per day. Stools: 1-2 per day or once every few days.
- Tummy time: 10-15 minutes, 3-4 times daily. Baby should lift head to 90 degrees and push up on forearms.
- Rolling: Baby may roll from tummy to back. Some babies roll from back to tummy. Never leave baby unattended on elevated surfaces.
- Grasping: Baby can grasp and shake toys. Provide safe, lightweight toys with different textures.
- Sleep: Some babies sleep 6-8 hour stretches. If baby is still waking frequently, this is normal.
- Reading: Read simple board books daily. This builds language, bonding, and a love of reading.
- Baby massage: Continue daily oil massage with coconut oil or almond oil.`,
                mentalHealthNotes: `- At 3 months, most women feel more emotionally stable. The intense hormonal fluctuations of the early postpartum period have settled.
- If you're still feeling persistently sad, anxious, or overwhelmed, this is NOT normal "baby blues" — it may be postpartum depression. Seek help.
- In India, maternal mental health screening is part of the National Mental Health Programme (NMHP). ASHA workers can connect you to services.
- Body image: Many women struggle with body image at 3 months. Be kind to yourself. Your body has done an incredible thing.
- Relationship with partner: The first 3 months are challenging for relationships. Sleep deprivation, new responsibilities, and hormonal changes affect intimacy. Communicate openly.
- Social connections: Connect with other new mothers. In India, mothers' groups are increasingly available through hospitals, community centers, and online platforms.
- Return to work: If you're planning to return to work, acknowledge your feelings — both positive and negative. It's okay to feel conflicted.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking is appropriate.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Pelvic tilts: 20 repetitions, 3 times daily.
- Bridges: 15-20 repetitions, 3 times daily.
- Gentle core: Heel slides, abdominal bracing, leg slides, side-lying leg lifts. 15-20 repetitions each.
- Bodyweight exercises: Squats, lunges, modified push-ups (on knees). 10-15 repetitions, 2-3 times daily.
- Yoga: Gentle hatha yoga. Include cat-cow, child's pose, gentle spinal twists, and restorative poses.
- Swimming: Continue if comfortable. Excellent for overall fitness.
- Postnatal Pilates: Mat-based postnatal Pilates is beneficial for core and pelvic floor.
- Light resistance training: Light dumbbells (1-3 kg) for upper body exercises. Start with low repetitions.
- Cycling: Stationary cycling is safe. Outdoor cycling should wait until pelvic floor strength is good and balance is stable.
- Avoid: Running, jumping, high-impact aerobics, heavy weightlifting, and intense abdominal exercises.
- Listen to your body: If you experience pain, leaking, or pelvic pressure during exercise, stop and consult a pelvic floor physiotherapist.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Redness, warmth, or pus from C-section incision
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not bringing hands to mouth, extreme floppiness or stiffness
- Baby: Not rolling or attempting to roll in either direction`,
        },
        {
                weekNumber: 13,
                title: "Week 13: Entering the Extended Recovery Phase",
                summary: "You're now in the extended recovery phase (weeks 13-52). Your body is largely healed, and the focus shifts to long-term wellness, family dynamics, and your baby's development.",
                bodyMarkdown: `# Week 13 Postpartum

Welcome to the extended recovery phase! You've made it through the most intensive healing period. From now until the one-year mark, the focus is on long-term recovery, maintaining your health, supporting your baby's development, and adapting to your new family dynamics.

## Physical Recovery at 13 Weeks
- Your body is largely healed. The uterus is back to its pre-pregnancy size. Pelvic floor strength should be good with consistent exercise.
- Diastasis recti: Most women see significant improvement by 13 weeks. If the gap is still >2 finger-widths, consult a pelvic floor physiotherapist.
- Hair loss: Should be subsiding. New hair growth may be visible around the hairline.
- Your menstrual cycle may have returned or may return soon. First postpartum periods can be heavier and more irregular.
- Some women may notice changes in their menstrual cycle patterns — periods may be heavier, lighter, more or less painful, or irregular. This is generally normal.
- Weight: Many women are still carrying some pregnancy weight at 13 weeks. Healthy weight loss is 0.5-1 kg per week. Crash dieting is not recommended, especially if breastfeeding.

## Returning to Work — Practical Tips
- If you're returning to work this week or soon:
  - **Pumping schedule**: Pump every 3-4 hours to maintain supply. Aim for 2-3 pumping sessions during an 8-hour workday.
  - **Milk storage**: Breastmilk can be stored at room temperature for 4 hours, in a refrigerator for 4 days, and in a freezer for 6 months (AAP guidelines).
  - **Introduce the bottle**: If baby hasn't taken a bottle yet, introduce it 1-2 weeks before starting work. Let someone else offer it.
  - **Clothing**: Wear comfortable, nursing-friendly clothing. Layers and button-down tops make pumping easier.
  - **Childcare**: If using daycare or a nanny, do a gradual transition. Start with half-days and build up to full days.
  - **The Maternity Benefit Act, 2017** (India): You are entitled to nursing breaks (2 breaks per day) until your child is 15 months old.

## Your Baby at 13 Weeks
- **Social interaction**: Baby smiles, laughs, and may "talk" back when you speak. Proto-conversations are well-established.
- **Vocalizing**: Baby experiments with sounds — coos, gurgles, squeals, and vowel-like sounds. Some babies may begin consonant sounds ("b," "m").
- **Hand-eye coordination**: Baby reaches for objects, brings hands together, and may transfer objects from one hand to another.
- **Tummy time**: Baby can lift head to 90 degrees, push up on forearms, and may roll from tummy to back.
- **Vision**: Baby tracks objects smoothly and recognizes familiar faces at a distance.
- **Sleep**: Some babies sleep 6-8 hour stretches. If your baby is still waking frequently, this is normal.
- **Teething**: Some babies may begin teething around 3-4 months. Signs include drooling, gum rubbing, and irritability. Teething does NOT cause fever — if your baby has a fever, see a doctor.

## Sources & References
- **WHO**: "Postnatal Care for Mothers and Newborns" — comprehensive postnatal care through the first year.
- **ACOG**: "Optimizing Postpartum Care" — ongoing care recommendations for the extended postpartum period.
- **MOHFW India**: "The Maternity Benefit Act, 2017" — provisions for nursing breaks and crèche facilities.
- **AAP**: "Breast Milk Storage Guidelines" — proper storage and handling of expressed breastmilk.
- **La Leche League International**: "Returning to Work While Breastfeeding" — guide for pumping, milk storage, and maintaining supply.
- **IAP**: "Growth and Development — 3-4 Months" — developmental monitoring guidelines.
- **CDC**: "Milestone Checklist — 4 Months" — social/emotional, language/communication, and movement milestones.
- **NIN India**: "Dietary Guidelines for Indians" — breastfeeding mothers need 600 kcal extra and 74g protein daily.`,
                recoveryNotes: `- Pelvic floor: Continue Kegels — 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Diastasis recti: Continue monitoring. Most women see significant improvement by 13 weeks.
- C-section: Scar is well-healed. Continue gentle scar massage. Numbness may persist.
- Hair loss: Should be subsiding. New hair growth may appear.
- Menstruation: If your period has returned, it may be heavier and more irregular. This is normal for the first few cycles.
- Contraception: Continue using contraception. Discuss long-term options with your doctor.
- Nutrition: Continue high-protein, iron-rich, and calcium-rich diet. Indian foods: ragi, dal, paneer, eggs, green leafy vegetables.
- If returning to work: Plan your pumping schedule. Identify a private, clean space for pumping.`,
                babyCareNotes: `- Feeding: 8-10 times per day. Breastmilk intake: 90-120 ml per feed. Continue exclusive breastfeeding.
- If introducing a bottle (for expressed milk), use a slow-flow nipple and paced bottle feeding technique.
- Vaccinations: 14-week vaccines: DPT, Hib, IPV, PCV, Rotavirus, and OPV (third doses in the 6-10-14 week schedule).
- Wet diapers: 6-8+ per day. Stools: 1-2 per day or once every few days.
- Tummy time: 10-15 minutes, 3-4 times daily. Baby should lift head to 90 degrees and push up on forearms.
- Rolling: Baby may roll from tummy to back. Ensure safe sleep — place baby on back to sleep, on a firm mattress with no loose bedding.
- Teething: May begin. Provide safe teething toys (chilled, not frozen). Clean baby's gums with a soft, damp cloth.
- Reading: Read simple board books daily. This builds language and bonding.
- Baby massage: Continue daily oil massage with coconut oil or almond oil.`,
                mentalHealthNotes: `- The extended recovery phase is a time of adjustment. You may be returning to work, navigating changed relationships, and redefining your identity.
- Postpartum depression can develop at any time in the first year. Continue to monitor your emotional well-being. The EPDS is validated for use up to 12 months postpartum.
- In India, maternal mental health is supported through the National Mental Health Programme (NMHP) and District Mental Health Programme (DMHP).
- Working mother guilt: Research shows that children of working mothers have similar developmental outcomes. Quality of time matters more than quantity.
- Relationship with partner: The postpartum period is challenging for relationships. Prioritize communication, even if it's just 10 minutes of uninterrupted conversation daily.
- Body image: Your body may look different than before pregnancy. This is normal. Focus on what your body has accomplished, not just how it looks.
- Social support: Stay connected with other mothers. In India, community support is strong — lean on your family and friends.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking is appropriate.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Pelvic tilts: 20 repetitions, 3 times daily.
- Bridges: 15-20 repetitions, 3 times daily.
- Gentle core: Heel slides, abdominal bracing, leg slides, side-lying leg lifts. 15-20 repetitions each.
- Bodyweight exercises: Squats, lunges, modified push-ups (on knees). 10-15 repetitions, 2-3 times daily.
- Yoga: Gentle hatha yoga. Include cat-cow, child's pose, gentle spinal twists, and restorative poses.
- Swimming: Continue if comfortable. Excellent for overall fitness.
- Postnatal Pilates: Mat-based postnatal Pilates is beneficial for core and pelvic floor.
- Light resistance training: Light dumbbells (1-3 kg) for upper body exercises. Start with low repetitions.
- Cycling: Stationary cycling is safe. Outdoor cycling should wait until pelvic floor strength is good.
- Avoid: Running, jumping, high-impact aerobics, heavy weightlifting, and intense abdominal exercises (especially crunches and planks if diastasis recti is still present).`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Redness, warmth, or pus from C-section incision
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not bringing hands to mouth, extreme floppiness or stiffness
- Baby: Not rolling or attempting to roll in either direction`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 14-15
        // ═══════════════════════════════════════════════
        {
                weekNumber: 14,
                title: "Week 14: Embracing Your Postpartum Body",
                summary: "At 14 weeks, your body continues to adapt. This week focuses on body image, healthy weight management, and strengthening your core and pelvic floor.",
                bodyMarkdown: `# Week 14 Postpartum

You're in the extended recovery phase. At 14 weeks, your body has come a long way, but full recovery is an ongoing journey. This week is about embracing your body, managing weight healthily, and continuing to strengthen your core.

## Physical Recovery at 14 Weeks
- Your body is largely healed. The uterus is back to its pre-pregnancy size. Most physical symptoms of early postpartum have resolved.
- Pelvic floor strength should be good with consistent exercise. Continue Kegels for maintenance.
- Diastasis recti: Most women see significant improvement. If the gap is still >2 finger-widths, continue avoiding crunches and planks.
- Hair loss should be subsiding. New hair growth may be visible around the hairline.
- Your menstrual cycle may have returned. First postpartum periods can be heavier and more irregular.
- Weight: Many women are still carrying some pregnancy weight. Healthy weight loss is 0.5-1 kg per week.

## Body Image After Childbirth
- It's normal to have complex feelings about your postpartum body. You may feel proud of what your body accomplished, but also frustrated with changes.
- **Realistic expectations**: It took 9 months to grow your baby. Give yourself at least 9-12 months to recover. Some body changes are permanent — stretch marks, wider hips, and changes in breast shape are common.
- **Stretch marks**: These are genetic and fade over time from red/purple to silvery-white. While no cream can eliminate them completely, keeping skin moisturized with coconut oil, almond oil, or cocoa butter may help with itching and appearance.
- **Breast changes**: Breasts may be larger during breastfeeding and may change in size and shape after weaning. This is normal.
- **C-section scar**: The scar will continue to fade over the next year. Massage with vitamin E oil or silicone gel sheets may help with healing and appearance.
- **Weight loss**: If breastfeeding, you burn approximately 300-500 extra calories per day. However, breastfeeding is NOT a guarantee of weight loss — some women hold onto weight while breastfeeding.
- **Healthy weight loss**: Focus on nutritious foods, portion control, and regular physical activity. Crash dieting is not recommended, especially if breastfeeding. NIN India recommends a balanced diet for postpartum women.

## Indian Traditional Body Care
- **Postpartum massage (malish)**: Many Indian communities continue massage beyond the 40-day confinement period. Massage with warm sesame oil or coconut oil can improve circulation, reduce muscle tension, and promote relaxation.
- **Herbal baths**: Neem and turmeric baths are traditionally used for their antimicrobial and anti-inflammatory properties.
- **Dietary traditions**: Continue eating nutrient-dense traditional foods — gond ke laddoo, panjiri, methi ladoos, and dry fruits provide energy and support lactation.

## Your Baby at 14 Weeks
- **Social interaction**: Baby smiles, laughs, and engages in proto-conversations.
- **Vocalizing**: Baby experiments with sounds — coos, gurgles, squeals, and may begin consonant sounds.
- **Movement**: Baby may roll from tummy to back and back to tummy. Tummy time is essential.
- **Hand-eye coordination**: Baby reaches for objects, brings hands together, and may transfer objects.
- **Vision**: Baby tracks objects smoothly and recognizes familiar faces.
- **Sleep**: Baby may sleep 6-8 hour stretches. If baby is still waking frequently, this is normal.

## Sources & References
- **WHO**: "Postnatal Care for Mothers and Newborns" — comprehensive postnatal care through the first year.
- **ACOG**: "Optimizing Postpartum Care" — recommendations for long-term maternal health monitoring.
- **NIN India**: "Dietary Guidelines for Indians" — balanced diet recommendations for postpartum and breastfeeding women.
- **FOGSI**: "Postpartum Care Guidelines" — traditional practices and body care recommendations.
- **IAP**: "Growth and Development — 3-4 Months" — developmental monitoring guidelines.
- **CDC**: "Milestone Checklist — 4 Months" — social/emotional, language/communication, and movement milestones.`,
                recoveryNotes: `- Pelvic floor: Continue Kegels — 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Diastasis recti: Continue monitoring. If the gap is resolved (≤2 finger-widths), you may gradually resume core exercises.
- C-section: Scar is well-healed. Continue gentle scar massage. Numbness is normal.
- Hair loss: Should be subsiding. New hair growth may appear.
- Menstruation: If your period has returned, it may be heavier and more irregular. This is normal for the first few cycles.
- Weight management: Aim for gradual weight loss (0.5-1 kg/week). Focus on nutritious foods, not calorie restriction.
- Body care: Continue oil massage if comfortable. Use warm coconut oil or sesame oil.
- Stretch marks: Keep skin moisturized. They will fade over time.`,
                babyCareNotes: `- Feeding: 8-10 times per day. Breastmilk intake: 120-180 ml per feed. Continue exclusive breastfeeding.
- If using expressed milk in a bottle, use paced bottle feeding and a slow-flow nipple.
- Wet diapers: 6-8+ per day. Stools: 1-2 per day or once every few days.
- Tummy time: 15-20 minutes, 3-4 times daily. Baby should push up on hands with straight arms.
- Rolling: Baby may roll both ways. Never leave baby unattended on elevated surfaces.
- Teething: May begin. Provide safe teething toys. Clean baby's gums with a soft, damp cloth.
- Reading: Read simple board books daily. This builds language and bonding.
- Baby massage: Continue daily oil massage with coconut oil or almond oil.`,
                mentalHealthNotes: `- Body image is a significant concern for many postpartum women. Be kind to yourself. Your body has done an incredible thing.
- Social media and celebrity culture often present unrealistic postpartum body standards. Remember that most images are edited, and recovery takes time.
- If you're struggling with body image, talk to your partner, a trusted friend, or a mental health professional.
- Postpartum depression can develop at any time in the first year. Continue to monitor your emotional well-being. The EPDS is validated for use up to 12 months postpartum.
- In India, the National Mental Health Programme (NMHP) and District Mental Health Programme (DMHP) provide mental health support.
- Social support: Stay connected with other mothers. In India, family support is strong — lean on your loved ones.
- "Me time": Even 15-20 minutes of alone time can help you recharge. Prioritize it.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking is appropriate.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Pelvic tilts: 20 repetitions, 3 times daily.
- Bridges: 20 repetitions, 3 times daily.
- Core exercises: If diastasis recti is resolved, gradually resume core exercises. Start with gentle exercises and progress slowly.
- Bodyweight exercises: Squats, lunges, push-ups (may progress from knees to toes). 10-15 repetitions, 2-3 times daily.
- Yoga: Gentle hatha yoga. Include cat-cow, child's pose, gentle spinal twists, and restorative poses.
- Swimming: Continue if comfortable. Excellent for overall fitness.
- Postnatal Pilates: Mat-based postnatal Pilates is beneficial for core and pelvic floor.
- Light resistance training: Light dumbbells (2-3 kg) for upper body exercises. Start with low repetitions.
- Cycling: Stationary cycling is safe. Outdoor cycling may be appropriate if pelvic floor strength is good.
- Avoid: Running, jumping, high-impact aerobics, heavy weightlifting, and intense abdominal exercises (especially crunches and planks if diastasis recti is still present).`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Redness, warmth, or pus from C-section incision
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile or laugh, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in either direction, not bringing hands to mouth`,
        },
        {
                weekNumber: 15,
                title: "Week 15: Strengthening Your Relationship",
                summary: "As your baby becomes more interactive, it's time to nurture your relationship with your partner and build a strong family foundation.",
                bodyMarkdown: `# Week 15 Postpartum

At 15 weeks postpartum, your baby is becoming more interactive and engaging. As you settle into your new normal, it's important to also nurture your relationship with your partner.

## Physical Recovery at 15 Weeks
- Your body is well into the extended recovery phase. Most physical symptoms of early postpartum have resolved.
- Pelvic floor strength should be good with consistent exercise.
- Diastasis recti: Should be significantly improved. Most women can resume normal core exercises by 15 weeks.
- Your menstrual cycle may have returned or may still be absent if exclusively breastfeeding.
- Energy levels are generally good. Sleep patterns may be more predictable.

## Nurturing Your Relationship After Baby
- The transition to parenthood is one of the most challenging periods for a relationship. Research shows that relationship satisfaction often declines in the first year after having a baby (ACOG, 2021).
- **Common challenges**:
  - Sleep deprivation leaves little energy for emotional connection
  - Division of household and childcare responsibilities can cause resentment
  - Changes in intimacy and sexual relationship
  - Less time for each other as individuals and as a couple
  - Different parenting styles and expectations
- **Strategies for staying connected**:
  - **Communicate openly**: Share your feelings, concerns, and needs. Don't expect your partner to read your mind.
  - **Schedule "couple time"**: Even 15-20 minutes of uninterrupted conversation daily can make a difference.
  - **Share the load**: Discuss division of responsibilities openly. In Indian households, the mother often bears the majority of childcare — have an explicit conversation about sharing responsibilities.
  - **Express appreciation**: Acknowledge what your partner is doing well. Small gestures of gratitude go a long way.
  - **Physical intimacy**: Rebuild physical intimacy gradually. This doesn't have to mean intercourse — holding hands, hugging, and cuddling are important too.
  - **Date nights**: If possible, arrange for a family member to watch the baby for a few hours so you can spend time together as a couple.

## Indian Context — Relationship Dynamics
- In Indian families, the postpartum period often involves extended family (parents, in-laws) living with or near the couple. While this provides valuable support, it can also create challenges:
  - **Privacy**: Couples may have limited privacy. If possible, create a space that is just for you and your partner.
  - **Differing opinions**: Elders may have strong opinions about baby care, feeding, and traditions. It's important to present a united front as a couple.
  - **Role of the father**: In traditional Indian families, fathers may be expected to be providers rather than caregivers. However, research shows that involved fathers have positive effects on child development. Encourage your partner's involvement.
  - **Joint decision-making**: Make decisions about your baby together. This strengthens your partnership and ensures both parents feel valued.

## Sexual Health and Intimacy
- Many couples have not resumed intercourse by 15 weeks postpartum. This is completely normal.
- **Physical factors**: Vaginal dryness (due to low estrogen during breastfeeding), perineal pain, C-section scar sensitivity, and pelvic floor dysfunction can all affect sexual comfort.
- **Emotional factors**: Fatigue, body image concerns, and the mental load of caring for a baby can reduce libido.
- **Communication**: Talk openly with your partner about your readiness, concerns, and desires.
- **Contraception**: Use effective contraception if you don't want to become pregnant. WHO recommends at least 24 months between pregnancies.

## Your Baby at 15 Weeks
- **Social interaction**: Baby laughs, smiles responsively, and may show preferences for familiar people.
- **Vocalizing**: Baby babbles, makes consonant sounds ("b," "m," "p"), and may blow raspberries.
- **Movement**: Baby may roll both ways. Some babies can push up on hands with straight arms.
- **Grasping**: Baby reaches for objects with one hand, grasps and shakes toys, and brings everything to mouth.
- **Vision**: Baby tracks objects smoothly and recognizes familiar people at a distance.
- **Sleep**: Baby may sleep 6-8 hour stretches. The 4-month sleep changes may be approaching.

## Sources & References
- **ACOG**: "Optimizing Postpartum Care" — relationship and sexual health guidance.
- **WHO**: "Postnatal Care for Mothers and Newborns" — comprehensive postnatal care.
- **FOGSI**: "Postpartum Care Guidelines" — sexual health and family planning recommendations.
- **MOHFW India**: "National Family Planning Programme" — free contraceptives and family planning services.
- **IAP**: "Growth and Development — 3-4 Months" — developmental monitoring guidelines.
- **CDC**: "Milestone Checklist — 4 Months" — social/emotional, language/communication, and movement milestones.`,
                recoveryNotes: `- Pelvic floor: Continue Kegels — 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Diastasis recti: Should be significantly improved. If the gap is resolved, gradually resume core exercises.
- C-section: Scar is well-healed. Numbness is normal and may persist for months.
- Sexual health: If you haven't resumed intercourse, that's okay. When you're ready, use lubrication and go slowly. Communicate with your partner.
- Contraception: Continue using contraception. Discuss long-term options with your doctor.
- Nutrition: Continue high-protein, iron-rich, and calcium-rich diet. Indian foods: ragi, dal, paneer, eggs, green leafy vegetables.
- If you've returned to work, continue to prioritize pumping breaks and self-care.`,
                babyCareNotes: `- Feeding: 8-10 times per day. Breastmilk intake: 120-180 ml per feed. Continue exclusive breastfeeding.
- If using expressed milk in a bottle, use paced bottle feeding and a slow-flow nipple.
- Wet diapers: 6-8+ per day. Stools: 1-2 per day or once every few days.
- Tummy time: 15-20 minutes, 3-4 times daily. Baby should push up on hands with straight arms.
- Rolling: Baby may roll both ways. Never leave baby unattended on elevated surfaces.
- Teething: May continue. Provide safe teething toys. Clean baby's gums with a soft, damp cloth.
- Reading: Read simple board books daily. This builds language and bonding.
- Baby massage: Continue daily oil massage with coconut oil or almond oil.
- Social interaction: Talk, sing, and play with your baby. Respond to their coos and babbles.`,
                mentalHealthNotes: `- The transition to parenthood is challenging for relationships. It's normal to feel disconnected from your partner at times.
- Communicate openly about your feelings, needs, and concerns. Don't let resentment build up.
- If you're struggling with your relationship, consider couples counseling. Many couples benefit from professional support during this transition.
- Postpartum depression can affect both mothers and fathers. Partners can also experience depression — be aware of each other's emotional well-being.
- In India, the National Mental Health Programme (NMHP) and District Mental Health Programme (DMHP) provide mental health support.
- Social support: Stay connected with other mothers. In India, family support is strong — lean on your loved ones.
- "Me time" and "we time": Both are important. Prioritize time for yourself and time as a couple.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking is appropriate. Consider walking together as a couple.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Pelvic tilts: 20 repetitions, 3 times daily.
- Bridges: 20 repetitions, 3 times daily.
- Core exercises: If diastasis recti is resolved, gradually resume core exercises.
- Bodyweight exercises: Squats, lunges, push-ups (may progress from knees to toes). 10-15 repetitions, 2-3 times daily.
- Yoga: Gentle hatha yoga. Include partner yoga poses if interested.
- Swimming: Continue if comfortable. Excellent for overall fitness.
- Postnatal Pilates: Mat-based postnatal Pilates is beneficial for core and pelvic floor.
- Light resistance training: Light dumbbells (2-3 kg) for upper and lower body exercises.
- Cycling: Stationary cycling is safe. Outdoor cycling may be appropriate if pelvic floor strength is good.
- Consider exercising together as a couple — it's a healthy way to spend time together.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Redness, warmth, or pus from C-section incision
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile or laugh, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in either direction, not bringing hands to mouth
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 16
        // ═══════════════════════════════════════════════
        {
                weekNumber: 16,
                title: "Week 16: 4-Month Sleep Changes and Starting Solids Discussion",
                summary: "At 4 months postpartum, your baby's sleep patterns may change dramatically. It's also time to start learning about introducing solid foods.",
                bodyMarkdown: `# Week 16 Postpartum — 4 Months

You're 4 months postpartum! This is a period of significant developmental changes for your baby, including the famous "4-month sleep regression" and the beginning of discussions about introducing solid foods.

## Physical Recovery at 16 Weeks
- Your body is well into the extended recovery phase. Most physical symptoms of early postpartum have resolved.
- Pelvic floor strength should be good with consistent exercise. If you're still experiencing symptoms, consult a pelvic floor physiotherapist.
- Diastasis recti: Should be significantly improved. If the gap is still >2 finger-widths, continue avoiding crunches and planks.
- Hair loss should have subsided. New hair growth is visible.
- Your menstrual cycle may have returned. If you're exclusively breastfeeding, it may still be absent — this is normal.
- Weight: If you're breastfeeding, you may notice gradual weight loss. If you're not breastfeeding, weight loss may be slower.

## The 4-Month Sleep Regression
- Around 4 months, many babies experience a significant change in sleep patterns. This is NOT a "regression" in the negative sense — it's a developmental progression.
- **What's happening**: Your baby's sleep cycles are maturing from newborn sleep (only active and quiet sleep) to adult-like sleep cycles with distinct stages (light sleep, deep sleep, REM). This means:
  - Baby wakes more fully between sleep cycles
  - Baby may have difficulty settling back to sleep independently
  - Nap patterns may become irregular
  - Night wakings may increase
- **How to cope**:
  - Maintain consistent bedtime routines
  - Put baby down drowsy but awake (when possible)
  - Create a sleep-conducive environment: dark, quiet, cool room
  - Be patient — this is a temporary phase that typically lasts 2-6 weeks
  - Safe sleep: Continue placing baby on back to sleep, on a firm mattress with no loose bedding (AAP, IAP)

## Introducing Solid Foods — The Discussion Begins
- **WHO and IAP recommend exclusive breastfeeding for the first 6 months (180 days).** Solid foods should NOT be introduced before 6 months.
- However, around 4 months, you can start LEARNING about introducing solids:
  - **Signs of readiness** (typically appear around 6 months): Baby can sit with support, has good head and neck control, shows interest in food, opens mouth when food is offered, and can move food from the front of the tongue to the back.
  - **First foods in Indian context**: Traditional first foods include rice kanji (rice water), moong dal water, ragi porridge, mashed banana, and well-cooked and pureed vegetables.
  - **Iron-rich foods**: By 6 months, baby's iron stores from birth are depleting. Iron-rich first foods are important: pureed meat, poultry, fish, iron-fortified cereals, and pureed legumes.
  - **Allergenic foods**: Current evidence (per AAP, IAP) suggests introducing allergenic foods (peanuts, eggs, dairy, wheat, fish) early (around 6 months, not before 4 months) may reduce the risk of food allergies. Discuss with your pediatrician.

## Indian Complementary Feeding Guidelines
- **MOHFW India**: "Home-Based Young Child Care" guidelines recommend starting complementary feeding at 6 months while continuing breastfeeding.
- **NIN India**: "Dietary Guidelines for Indians" recommends:
  - Start with 2-3 teaspoons of semi-solid food, gradually increasing to a full meal
  - Feed 2-3 times per day at 6-8 months, increasing to 3-4 times by 12 months
  - Include foods from all food groups: cereals, pulses, vegetables, fruits, milk/curd, and non-vegetarian foods if consumed
  - Use ghee or oil for energy density
  - Continue breastfeeding on demand

## Your Baby at 16 Weeks
- **Social interaction**: Baby laughs, smiles responsively, and may show preferences for familiar people.
- **Vocalizing**: Baby babbles, makes consonant sounds ("b," "m," "p"), and may blow raspberries.
- **Movement**: Baby may roll from tummy to back AND back to tummy. Some babies can push up on hands with straight arms.
- **Grasping**: Baby reaches for objects with one hand, grasps and shakes toys, and brings everything to mouth.
- **Vision**: Baby tracks objects smoothly and recognizes familiar people at a distance.
- **Sleep**: The 4-month sleep changes are in full effect. Be patient and consistent.

## Sources & References
- **WHO**: "Infant and Young Child Feeding" — exclusive breastfeeding for 6 months, complementary feeding from 6 months.
- **WHO**: "Guiding Principles for Complementary Feeding of the Breastfed Child" — evidence-based recommendations.
- **IAP**: "Complementary Feeding Guidelines" — recommendations for introducing solid foods in the Indian context.
- **MOHFW India**: "Home-Based Young Child Care" — guidelines for complementary feeding and nutrition.
- **NIN India**: "Dietary Guidelines for Indians" — comprehensive dietary recommendations for infants and young children.
- **AAP**: "Starting Solid Foods" — guidance on introducing solid foods and allergenic foods.
- **AAP**: "Safe Sleep" — recommendations for reducing SIDS risk.
- **CDC**: "Milestone Checklist — 4 Months" — social/emotional, language/communication, and movement milestones.`,
                recoveryNotes: `- Pelvic floor: Continue Kegels — 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Diastasis recti: Continue monitoring. If the gap is resolved (≤2 finger-widths), you may gradually resume core exercises.
- C-section: Scar is well-healed. Numbness is normal and may persist for months.
- Hair loss: Should have subsided. New hair growth is visible.
- Menstruation: If your period has returned, it may be regulating. If it's absent and you're breastfeeding, this is normal.
- Contraception: Continue using contraception. Discuss long-term options with your doctor.
- Nutrition: If breastfeeding, continue high-protein, iron-rich, and calcium-rich diet. If you've weaned, adjust your caloric intake accordingly.
- Vitamin D: Continue vitamin D supplementation for both you and baby. IAP recommends 400 IU/day for infants.`,
                babyCareNotes: `- Feeding: Continue exclusive breastfeeding. Breastmilk intake: 120-180 ml per feed. Do NOT introduce solid foods yet — wait until 6 months.
- Vaccinations: If following the 6-10-14 week schedule, all primary vaccines should be complete. Next vaccines: Measles and Vitamin A at 9 months (IAP schedule).
- Wet diapers: 6-8+ per day. Stools: 1-2 per day or once every few days.
- Tummy time: 15-20 minutes, 3-4 times daily. Baby should push up on hands with straight arms.
- Rolling: Baby may roll both ways. Never leave baby unattended on elevated surfaces.
- Teething: May continue. Provide safe teething toys. Clean baby's gums with a soft, damp cloth.
- Sleep: The 4-month sleep changes are happening. Maintain consistent bedtime routines. Safe sleep: back to sleep, firm mattress, no loose bedding.
- Reading: Read simple board books daily. This builds language and bonding.
- Baby massage: Continue daily oil massage with coconut oil or almond oil.`,
                mentalHealthNotes: `- At 4 months, some women experience a resurgence of emotional challenges. The initial excitement of the newborn period has faded, and the reality of long-term parenting sets in.
- Postpartum depression can develop at any time in the first year. Continue to monitor your emotional well-being.
- The 4-month sleep changes can be exhausting. Sleep deprivation is a major risk factor for postpartum depression. Prioritize sleep whenever possible.
- If you've returned to work, you may be experiencing "working mother guilt" or stress from balancing work and family responsibilities. These feelings are normal.
- In India, family support is invaluable. If you're feeling overwhelmed, ask for help from your partner, parents, or in-laws.
- Body image: At 4 months, many women are more accepting of their postpartum bodies. Remember that your body has done an incredible thing.
- Social connections: Stay connected with other mothers. Mothers' groups, both in-person and online, can provide valuable support.
- The National Mental Health Programme (NMHP) and District Mental Health Programme (DMHP) in India provide mental health support at primary health centres.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking is appropriate.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Pelvic tilts: 20 repetitions, 3 times daily.
- Bridges: 20 repetitions, 3 times daily.
- Core exercises: If diastasis recti is resolved, gradually resume core exercises. Start with gentle exercises and progress slowly.
- Bodyweight exercises: Squats, lunges, push-ups (may progress from knees to toes). 10-15 repetitions, 2-3 times daily.
- Yoga: Gentle hatha yoga. Include cat-cow, child's pose, gentle spinal twists, and restorative poses.
- Swimming: Continue if comfortable. Excellent for overall fitness.
- Postnatal Pilates: Mat-based postnatal Pilates is beneficial for core and pelvic floor.
- Light resistance training: Light dumbbells (2-5 kg) for upper and lower body exercises.
- Cycling: Stationary cycling is safe. Outdoor cycling may be appropriate if pelvic floor strength is good.
- You may gradually increase exercise intensity. Listen to your body — if you experience pain, leaking, or pelvic pressure, modify or stop.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Redness, warmth, or pus from C-section incision
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile or laugh, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in either direction, not bringing hands to mouth
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 17-19
        // ═══════════════════════════════════════════════
        {
                weekNumber: 17,
                title: "Week 17: Your Baby's Social and Emotional Development",
                summary: "At 17 weeks, your baby is becoming more social and emotionally expressive. Learn about your baby's social development and how to support it.",
                bodyMarkdown: `# Week 17 Postpartum

At 17 weeks (approximately 4 months), your baby is becoming increasingly social and interactive. This week focuses on your baby's social and emotional development.

## Physical Recovery at 17 Weeks
- Your body is well into the extended recovery phase. Most physical symptoms of early postpartum have resolved.
- Pelvic floor strength should be good with consistent exercise. Continue maintenance Kegels.
- Diastasis recti: Should be significantly improved. Most women can resume normal core exercises.
- Your menstrual cycle may have returned or may still be absent if exclusively breastfeeding.
- If you've returned to work, you may be settling into a routine. Continue to prioritize pumping breaks and self-care.

## Your Baby's Social and Emotional Development
- **Social smiling**: Your baby now smiles freely at familiar people and may smile at strangers. This is a sign of healthy social development.
- **Laughing**: Your baby laughs out loud, especially in response to playful interactions like peek-a-boo, tickling, and funny faces.
- **Recognizing familiar people**: Your baby clearly recognizes parents and primary caregivers. May show preference for familiar people over strangers.
- **Stranger awareness**: Some babies begin to show wariness of strangers around 4-5 months. This is a normal developmental stage.
- **Emotional expression**: Your baby expresses a range of emotions — joy, frustration, excitement, and contentment — through facial expressions, vocalizations, and body movements.
- **Imitation**: Your baby may imitate facial expressions and simple sounds. This is how babies learn social communication.
- **Joint attention**: Your baby follows your gaze and may look at what you're looking at. This is an important precursor to language development.

## How to Support Your Baby's Social Development
- **Respond to your baby's cues**: When your baby smiles, smile back. When they coo, respond with words. This "serve and return" interaction builds neural connections.
- **Read together**: Reading simple board books daily builds language, bonding, and a love of reading.
- **Sing and talk**: Narrate your day, sing songs, and talk to your baby. This builds language skills.
- **Play peek-a-boo**: This classic game teaches object permanence and social interaction.
- **Mirror play**: Babies love looking at faces, including their own. Play with a baby-safe mirror.
- **Social outings**: Take your baby to safe, low-stimulation environments. Short visits to the park, a friend's house, or a family gathering provide social exposure.

## Indian Context — Social Development
- In Indian joint families, babies are exposed to multiple caregivers and social interactions from an early age. This can be beneficial for social development.
- However, overstimulation can also occur. If your baby seems overwhelmed (crying, turning away, arching back), reduce stimulation.
- Traditional Indian practices like baby massage, singing lullabies, and storytelling are excellent for social and emotional development.
- The "annaprashan" (first rice ceremony) is traditionally celebrated around 5-7 months. This is a good time to start planning if you wish to observe this tradition.

## Sources & References
- **AAP**: "Ages & Stages — 4 Months" — social/emotional development milestones.
- **CDC**: "Milestone Checklist — 4 Months" — social/emotional, language/communication, and movement milestones.
- **WHO**: "Nurturing Care for Early Childhood Development" — framework for supporting early child development.
- **IAP**: "Growth and Development" — developmental monitoring guidelines for Indian children.
- **MOHFW India**: "Rashtriya Bal Swasthya Karyakram (RBSK)" — child health screening and early intervention services.
- **UNICEF**: "Early Childhood Development" — the importance of nurturing care and responsive parenting.`,
                recoveryNotes: `- Pelvic floor: Continue Kegels — 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Diastasis recti: Should be significantly improved. If resolved, gradually resume core exercises.
- C-section: Scar is well-healed. Numbness is normal.
- Hair loss: Should have subsided. New hair growth is visible.
- Menstruation: If your period has returned, it may be regulating. If absent and breastfeeding, this is normal.
- Contraception: Continue using contraception. Discuss long-term options with your doctor.
- Nutrition: Continue high-protein, iron-rich, and calcium-rich diet. If you've weaned, adjust caloric intake accordingly.`,
                babyCareNotes: `- Feeding: 8-10 times per day. Breastmilk intake: 120-180 ml per feed. Continue exclusive breastfeeding until 6 months.
- Do NOT introduce solid foods yet — wait until 6 months as recommended by WHO and IAP.
- Wet diapers: 6-8+ per day. Stools: 1-2 per day or once every few days.
- Tummy time: 15-20 minutes, 3-4 times daily. Baby should push up on hands with straight arms.
- Rolling: Baby should roll both ways. Never leave baby unattended on elevated surfaces.
- Play: Peek-a-boo, mirror play, reading, singing, and talking. Respond to your baby's coos and babbles.
- Teething: May continue. Provide safe teething toys. Clean baby's gums with a soft, damp cloth.
- Sleep: Safe sleep — back to sleep, firm mattress, no loose bedding. Sleep patterns may be changing.
- Baby massage: Continue daily oil massage with coconut oil or almond oil.`,
                mentalHealthNotes: `- At 17 weeks, many women are settling into a routine. However, the ongoing demands of parenting can still be challenging.
- Postpartum depression can develop at any time in the first year. Continue to monitor your emotional well-being.
- If you've returned to work, you may be experiencing "working mother guilt." These feelings are normal but often unfounded. Research shows that quality of time with your child matters more than quantity.
- In India, the National Mental Health Programme (NMHP) and District Mental Health Programme (DMHP) provide mental health support.
- Social support: Stay connected with other mothers. In India, family support is strong — lean on your loved ones.
- Relationship with partner: Continue to prioritize communication and connection. Even small gestures of appreciation can strengthen your relationship.
- Self-care: Even 15-20 minutes of alone time can help you recharge. Prioritize it.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking is appropriate.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Pelvic tilts: 20 repetitions, 3 times daily.
- Bridges: 20 repetitions, 3 times daily.
- Core exercises: If diastasis recti is resolved, gradually resume core exercises including planks and crunches (start gently).
- Bodyweight exercises: Squats, lunges, push-ups (may progress to full push-ups). 10-15 repetitions, 2-3 times daily.
- Yoga: Gentle hatha yoga. Include cat-cow, child's pose, gentle spinal twists, and restorative poses.
- Swimming: Continue if comfortable. Excellent for overall fitness.
- Postnatal Pilates: Mat-based postnatal Pilates is beneficial for core and pelvic floor.
- Resistance training: Light dumbbells (2-5 kg) for upper and lower body exercises. Gradually increase weight.
- Cycling: Stationary cycling is safe. Outdoor cycling may be appropriate if pelvic floor strength is good.
- You may gradually increase exercise intensity. Listen to your body.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Redness, warmth, or pus from C-section incision
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile or laugh, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in either direction, not bringing hands to mouth
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface`,
        },
        {
                weekNumber: 18,
                title: "Week 18: Preparing for Solid Foods — The Countdown Begins",
                summary: "With the 6-month mark approaching, it's time to prepare for introducing solid foods. Learn about traditional Indian first foods, modern weaning approaches, and safety.",
                bodyMarkdown: `# Week 18 Postpartum

You're approaching the 6-month milestone — when your baby will be ready to start solid foods! This week is about preparing for this exciting transition.

## Physical Recovery at 18 Weeks
- Your body is well into the extended recovery phase. Most physical symptoms of early postpartum have resolved.
- Pelvic floor strength should be good with consistent exercise.
- Diastasis recti: Should be significantly improved. Continue core exercises.
- If you've been exercising consistently, you may notice improved strength and endurance.
- Your menstrual cycle may have returned. If you're exclusively breastfeeding, it may still be absent.

## Preparing for Solid Foods — What You Need to Know
- **WHO and IAP recommend exclusive breastfeeding for the first 6 months (180 days).** Do NOT introduce solid foods before 6 months.
- However, you can start preparing NOW:
  1. **Learn the signs of readiness**: Baby can sit with support, has good head and neck control, shows interest in food, opens mouth when food is offered, and can move food from the front of the tongue to the back (loss of tongue-thrust reflex).
  2. **Choose a feeding approach**: Traditional spoon-feeding (purees) or baby-led weaning (finger foods). Both are valid — many Indian families use a combination.
  3. **Gather supplies**: Baby spoons (soft, small), bowls, bibs, a high chair or feeding seat, and silicone feeding sets.
  4. **Plan first foods**: Discuss with your pediatrician. Traditional Indian first foods are nutritious and culturally appropriate.

## Traditional Indian First Foods
- **Rice kanji (rice water/porridge)**: Easily digestible, gentle on the stomach. Made by cooking rice in extra water and straining or pureeing.
- **Moong dal water/porridge**: Rich in protein, easy to digest. Cook moong dal until very soft, strain or puree.
- **Ragi (finger millet) porridge**: Rich in calcium and iron. A traditional weaning food in South India. Cook ragi flour with water or milk to a thin consistency.
- **Suji (semolina) porridge**: Made with suji, ghee, and water or milk. Easy to digest.
- **Mashed banana**: Soft, sweet, and nutrient-rich. No cooking required.
- **Mashed papaya**: Rich in vitamins and enzymes that aid digestion.
- **Steamed and pureed vegetables**: Carrots, pumpkin, sweet potato, and bottle gourd (lauki) are good choices.
- **Khichdi**: A mixture of rice and moong dal, well-cooked and mashed. This is the ultimate Indian weaning food — complete protein, easy to digest, and culturally appropriate.

## Important Safety Guidelines
- **One food at a time**: Introduce one new food every 3-5 days. This helps identify any food allergies or intolerances.
- **No salt, sugar, or honey**: Babies under 1 year should NOT have added salt, sugar, or honey. Honey can cause infant botulism.
- **No cow's milk as a drink**: Cow's milk can be used in cooking (khichdi, porridge) but should NOT replace breastmilk as a drink until after 1 year.
- **Iron-rich foods**: By 6 months, baby's iron stores from birth are depleting. Prioritize iron-rich foods: pureed meats, pureed legumes, iron-fortified cereals, and green leafy vegetables.
- **Allergenic foods**: Current evidence (AAP, IAP) suggests introducing allergenic foods (peanuts, eggs, dairy, wheat, fish) early (around 6 months, not before 4 months) may reduce the risk of food allergies. Discuss with your pediatrician.
- **Texture progression**: Start with smooth purees and gradually progress to thicker, lumpier textures as baby develops.
- **Continue breastfeeding**: Breastmilk remains the primary source of nutrition. Solid foods are complementary — "complementary feeding."

## Sources & References
- **WHO**: "Guiding Principles for Complementary Feeding of the Breastfed Child" — evidence-based recommendations for introducing solid foods.
- **IAP**: "Complementary Feeding Guidelines" — recommendations for introducing solid foods in the Indian context.
- **MOHFW India**: "Home-Based Young Child Care" — guidelines for complementary feeding and nutrition.
- **NIN India**: "Dietary Guidelines for Indians" — comprehensive dietary recommendations for infants and young children.
- **AAP**: "Starting Solid Foods" — guidance on introducing solid foods and allergenic foods.
- **UNICEF**: "Improving Young Children's Diets" — the importance of diverse, nutritious complementary foods.`,
                recoveryNotes: `- Pelvic floor: Continue Kegels — 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Diastasis recti: Should be resolved or significantly improved. Continue core exercises.
- C-section: Scar is well-healed. Numbness is normal.
- Menstruation: If your period has returned, it may be regulating. If absent and breastfeeding, this is normal.
- Contraception: Continue using contraception. Discuss long-term options with your doctor.
- Nutrition: Continue high-protein, iron-rich, and calcium-rich diet. If you've weaned, adjust caloric intake accordingly.
- Vitamin D: Continue vitamin D supplementation for both you and baby. IAP recommends 400 IU/day for infants.`,
                babyCareNotes: `- Feeding: Continue exclusive breastfeeding until 6 months. Breastmilk intake: 120-180 ml per feed.
- Do NOT introduce solid foods yet — wait until exactly 6 months (180 days) as recommended by WHO and IAP.
- Wet diapers: 6-8+ per day. Stools: 1-2 per day or once every few days.
- Tummy time: 20-25 minutes, 3-4 times daily. Baby should push up on hands with straight arms.
- Rolling: Baby should roll both ways. Some babies may begin to sit with support.
- Teething: May continue. Provide safe teething toys. Clean baby's gums with a soft, damp cloth.
- Prepare for solids: Gather supplies (spoons, bowls, bibs, high chair). Discuss first foods with your pediatrician.
- Reading: Read simple board books daily. This builds language and bonding.
- Baby massage: Continue daily oil massage with coconut oil or almond oil.`,
                mentalHealthNotes: `- The approaching 6-month milestone can bring mixed emotions. You may feel excited about your baby's development, but also nostalgic about the newborn phase.
- Preparing for solid foods is a significant transition. It's normal to feel anxious about making the right choices. Trust your instincts and your pediatrician's guidance.
- Postpartum depression can develop at any time in the first year. Continue to monitor your emotional well-being.
- If you've returned to work, you may be settling into a routine. It's okay if things don't feel perfectly balanced.
- In India, the National Mental Health Programme (NMHP) and District Mental Health Programme (DMHP) provide mental health support.
- Social support: Stay connected with other mothers. Share experiences and tips about introducing solids.
- Self-care: Even 15-20 minutes of alone time can help you recharge. Prioritize it.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking is appropriate.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Pelvic tilts: 20 repetitions, 3 times daily.
- Bridges: 20 repetitions, 3 times daily.
- Core exercises: If diastasis recti is resolved, resume normal core exercises including planks and crunches. Start gently and progress slowly.
- Bodyweight exercises: Squats, lunges, push-ups (full push-ups if comfortable). 10-15 repetitions, 2-3 times daily.
- Yoga: Gentle hatha yoga. Include cat-cow, child's pose, gentle spinal twists, and restorative poses.
- Swimming: Continue if comfortable. Excellent for overall fitness.
- Postnatal Pilates: Mat-based postnatal Pilates is beneficial for core and pelvic floor.
- Resistance training: Dumbbells (2-5 kg) for upper and lower body exercises. Gradually increase weight.
- Cycling: Stationary cycling is safe. Outdoor cycling may be appropriate if pelvic floor strength is good.
- You may gradually increase exercise intensity. Listen to your body.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Redness, warmth, or pus from C-section incision
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile or laugh, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in either direction, not bringing hands to mouth
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface`,
        },
        {
                weekNumber: 19,
                title: "Week 19: Your Baby's Sleep and Establishing Healthy Routines",
                summary: "At 19 weeks, your baby's sleep patterns are maturing. Learn about establishing healthy sleep routines, managing sleep challenges, and ensuring safe sleep.",
                bodyMarkdown: `# Week 19 Postpartum

At 19 weeks (approximately 4.5 months), your baby's sleep patterns are becoming more adult-like. This week focuses on understanding your baby's sleep, establishing healthy routines, and ensuring safe sleep.

## Physical Recovery at 19 Weeks
- Your body is well into the extended recovery phase. Most physical symptoms of early postpartum have resolved.
- Pelvic floor strength should be good with consistent exercise.
- Diastasis recti: Should be resolved or significantly improved.
- If you've been exercising consistently, you may notice improved strength, endurance, and overall fitness.
- Your menstrual cycle may have returned or may still be absent if exclusively breastfeeding.

## Understanding Your Baby's Sleep
- Around 4-5 months, your baby's sleep cycles mature from newborn sleep (only active and quiet sleep) to adult-like sleep cycles with distinct stages:
  - **Light sleep (NREM Stage 1-2)**: Baby is easily woken. This is when most night wakings occur.
  - **Deep sleep (NREM Stage 3)**: Baby is difficult to wake. This is restorative sleep.
  - **REM sleep**: Dreaming sleep. Important for brain development.
- Each sleep cycle lasts approximately 50-60 minutes (compared to 90 minutes for adults). Between cycles, babies partially wake up.
- **The "4-month sleep regression"**: This is actually a developmental progression. Babies who previously slept well may start waking more frequently. This is normal and temporary.

## Establishing Healthy Sleep Routines
- **Bedtime routine**: Establish a consistent, calming bedtime routine. This helps signal to your baby that it's time to sleep. A typical routine: bath, massage, feeding, lullaby, bed.
- **Consistent bedtime**: Aim for a consistent bedtime between 7:00-8:30 PM. An overtired baby has more difficulty settling.
- **Drowsy but awake**: When possible, put your baby down drowsy but awake. This helps them learn to self-soothe and fall asleep independently.
- **Sleep environment**: Dark, quiet, cool room (20-22°C / 68-72°F). Use blackout curtains if needed. White noise can help mask household sounds.
- **Daytime naps**: At 4-5 months, babies typically take 3-4 naps per day, totaling 3-5 hours of daytime sleep.
- **Nighttime sleep**: Total nighttime sleep is typically 10-12 hours, with 1-3 wakings for feeding.

## Indian Sleep Practices
- **Co-sleeping**: Co-sleeping (baby sleeping in the same bed as parents) is common in Indian families. If you choose to co-sleep, follow safety guidelines:
  - Place baby on a firm mattress
  - Keep pillows, blankets, and loose bedding away from baby
  - Never co-sleep if you or your partner smoke, drink alcohol, or take medications that cause drowsiness
  - The safest option is room-sharing (baby in a separate crib/bassinet in the same room) for the first 6-12 months (AAP recommendation)
- **Traditional baby massage before bed**: Daily oil massage before the evening bath is a cherished Indian tradition that can be incorporated into the bedtime routine.
- **Lullabies**: Traditional Indian lullabies (lori) are a beautiful way to soothe your baby to sleep.

## Safe Sleep Guidelines
- **Back to sleep**: Always place your baby on their back to sleep, for naps and at night. This is the single most important action to reduce SIDS risk (AAP, IAP).
- **Firm sleep surface**: Use a firm mattress with a fitted sheet. No pillows, blankets, bumpers, or soft toys.
- **Room-sharing**: The AAP recommends room-sharing (baby in the same room, but on a separate sleep surface) for at least the first 6 months, ideally the first year.
- **Avoid overheating**: Dress your baby in one more layer than you would wear. In India's warm climate, a light cotton onesie may be sufficient.
- **No smoking**: Exposure to smoke increases SIDS risk. Ensure a smoke-free environment.
- **Pacifier use**: Offering a pacifier at nap time and bedtime may reduce SIDS risk. If breastfeeding, wait until breastfeeding is well-established (usually 3-4 weeks).

## Sources & References
- **AAP**: "Safe Sleep" — recommendations for reducing SIDS risk and creating a safe sleep environment.
- **IAP**: "Safe Sleep Guidelines" — recommendations for safe infant sleep practices in the Indian context.
- **CDC**: "Sudden Unexpected Infant Death (SUID)" — data and prevention recommendations.
- **WHO**: "Guidelines on Maternal, Newborn and Child Health" — safe sleep recommendations.
- **NICE**: "Postnatal Care" — guidance on safe sleep practices.
- **UNICEF**: "Safe Sleep for Babies" — evidence-based safe sleep recommendations.`,
                recoveryNotes: `- Pelvic floor: Continue Kegels — 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Diastasis recti: Should be resolved or significantly improved. Continue core exercises.
- C-section: Scar is well-healed. Numbness is normal.
- Menstruation: If your period has returned, it may be regulating. If absent and breastfeeding, this is normal.
- Contraception: Continue using contraception. Discuss long-term options with your doctor.
- Sleep: Your sleep may still be interrupted. Prioritize rest when possible. Sleep deprivation is a health risk.
- Nutrition: Continue high-protein, iron-rich, and calcium-rich diet. If you've weaned, adjust caloric intake accordingly.`,
                babyCareNotes: `- Feeding: Continue exclusive breastfeeding until 6 months. Breastmilk intake: 120-180 ml per feed.
- Do NOT introduce solid foods yet — wait until exactly 6 months (180 days).
- Wet diapers: 6-8+ per day. Stools: 1-2 per day or once every few days.
- Tummy time: 20-25 minutes, 3-4 times daily. Baby should push up on hands with straight arms.
- Rolling: Baby should roll both ways. Some babies may begin to sit with support.
- Sleep: Establish consistent bedtime routine. Safe sleep: back to sleep, firm mattress, no loose bedding.
- Teething: May continue. Provide safe teething toys. Clean baby's gums with a soft, damp cloth.
- Reading: Read simple board books daily. This builds language and bonding.
- Baby massage: Continue daily oil massage. Incorporate into bedtime routine.
- Prepare for solids: Gather supplies and discuss first foods with your pediatrician.`,
                mentalHealthNotes: `- Sleep deprivation is a major challenge for parents. It can affect your mood, cognitive function, and overall well-being.
- If you're struggling with sleep deprivation, ask for help. Your partner, family member, or a trusted caregiver can watch the baby while you nap.
- Postpartum depression can develop at any time in the first year. Sleep deprivation is a significant risk factor. Continue to monitor your emotional well-being.
- In India, family support is invaluable. If you have family members who can help with nighttime care, accept the help.
- The National Mental Health Programme (NMHP) and District Mental Health Programme (DMHP) in India provide mental health support.
- Social support: Stay connected with other mothers. Share experiences and tips about sleep.
- Self-care: Even 15-20 minutes of alone time can help you recharge. Prioritize it.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking is appropriate.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Pelvic tilts: 20 repetitions, 3 times daily.
- Bridges: 20 repetitions, 3 times daily.
- Core exercises: If diastasis recti is resolved, resume normal core exercises including planks and crunches.
- Bodyweight exercises: Squats, lunges, push-ups (full push-ups if comfortable). 10-15 repetitions, 2-3 times daily.
- Yoga: Gentle hatha yoga. Include cat-cow, child's pose, gentle spinal twists, and restorative poses.
- Swimming: Continue if comfortable. Excellent for overall fitness.
- Postnatal Pilates: Mat-based postnatal Pilates is beneficial for core and pelvic floor.
- Resistance training: Dumbbells (2-5 kg) for upper and lower body exercises. Gradually increase weight.
- Cycling: Stationary cycling is safe. Outdoor cycling may be appropriate if pelvic floor strength is good.
- You may gradually increase exercise intensity. Listen to your body.
- If you're sleep-deprived, prioritize gentle movement over intense exercise.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Redness, warmth, or pus from C-section incision
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile or laugh, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in either direction, not bringing hands to mouth
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface
- Baby: Breathing pauses, choking, or color change during sleep`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 20
        // ═══════════════════════════════════════════════
        {
                weekNumber: 20,
                title: "Five Months Postpartum: Returning to Work",
                summary: "You may be preparing to return to work or have already done so. Focus on maintaining your milk supply, managing work-life balance, and enjoying your baby's growing personality.",
                bodyMarkdown: `# Five Months After Birth

You've reached the 5-month mark. Many Indian mothers return to work around this time, as the Maternity Benefit Act 2017 provides 26 weeks of paid leave. This transition can be both exciting and challenging.

## Returning to Work
- **Emotional preparation**: It's normal to feel anxious, guilty, or sad about leaving your baby. According to WHO, maternal mental health support during the return-to-work transition is crucial for both mother and baby wellbeing.
- **Practical planning**: If you're breastfeeding, India's MAA (Mothers' Absolute Affection) Programme encourages continued breastfeeding after returning to work. Plan your pumping schedule and storage.
- **Childcare arrangements**: Whether it's family (grandparents are common caregivers in India), a nanny, or daycare, ensure your caregiver understands safe sleep practices, feeding schedules, and emergency protocols.
- **The Maternity Benefit Act 2017 (India)** mandates crèche facilities in establishments with 50+ employees, and allows nursing breaks.

## Your Body at 5 Months
- **Energy levels**: You should feel significantly more energetic. However, combined work and childcare demands can cause fatigue.
- **Hair loss**: Postpartum hair shedding peaks around 4-5 months and should start slowing down. This is due to hormonal shifts (ACOG). It's temporary and your hair will regrow.
- **Weight**: If you haven't returned to pre-pregnancy weight, focus on gradual, sustainable weight loss. NIN (India) recommends a balanced diet with adequate protein (additional 13g/day during lactation) and calcium (1200mg/day).
- **Menstruation**: If you're exclusively breastfeeding, your period may still be absent (lactational amenorrhea). If you've introduced formula or your baby is sleeping longer stretches, your period may return.

## Baby's Development at 5 Months
- **Motor skills**: Your baby may roll from tummy to back and back to tummy. They may push up on elbows during tummy time. IAP developmental surveillance guidelines note that rolling both ways is expected by 6 months.
- **Social development**: Your baby recognizes familiar faces and may show stranger anxiety. They laugh, squeal, and may blow "raspberries."
- **Communication**: Babbling increases, with consonant sounds like "ba-ba," "da-da," and "ma-ma" (though not yet with meaning).
- **Teething**: The first tooth may appear around 5-7 months. Signs include drooling, gum rubbing, irritability, and disrupted sleep. IAP recommends cleaning gums with a soft, damp cloth even before teeth erupt.
- **Sleep**: Some babies experience a 4-month sleep regression that may persist. Total sleep: 12-15 hours in 24 hours (AAP).

## Indian Context: Returning to Work
- **Expressing milk at work**: Indian law mandates nursing breaks. Store expressed milk in a clean container — it stays fresh at room temperature for 4 hours, in a refrigerator for 4 days, and in a freezer for 6 months (WHO/UNICEF guidelines).
- **Traditional practices**: Many Indian families support working mothers by having grandparents provide childcare. This can be wonderful but also requires clear communication about parenting approaches.
- **Diet at work**: Pack nutritious meals. FOGSI recommends lactating mothers eat small, frequent meals. Include protein (dal, paneer, eggs, sprouts), whole grains (jowar, bajra, ragi), and calcium-rich foods (milk, curd, ragi, sesame seeds).

## Source References
- Maternity Benefit Act, 2017 (Government of India)
- MAA Programme Guidelines, MOHFW
- WHO Guideline: Counselling of Women to Improve Breastfeeding Practices, 2018
- ACOG Committee Opinion No. 736: Postpartum Care, Obstetrics & Gynecology, 2018
- IAP Growth Charts and Developmental Surveillance Guidelines
- NIN Dietary Guidelines for Indians, 2024
- AAP: Sleep-Related Infant Deaths, Pediatrics, 2022
- FOGSI: Postpartum Care Guidelines, 2019`,
                recoveryNotes: `- Hair loss: Postpartum hair shedding peaks at 4-5 months. It's temporary (telogen effluvium). Continue prenatal vitamins if recommended by your doctor. Ensure adequate protein intake (at least 60g/day for lactating mothers, per NIN).
- Weight: Gradual weight loss of 0.5 kg per week is safe during lactation. Crash dieting can affect milk supply and quality.
- Menstruation: If your period returns, it may be heavier or lighter than pre-pregnancy. Irregular cycles are common initially.
- Pelvic floor: Continue Kegel exercises (30 reps, 3 times daily). If you have any urinary leakage when coughing, sneezing, or exercising, consult a pelvic floor physiotherapist.
- Energy: Prioritize sleep and nutrition. Iron-rich foods (green leafy vegetables like palak, dates, jaggery) help combat fatigue.`,
                babyCareNotes: `- Feeding: Breast milk or formula remains the primary source of nutrition. 5-6 feedings per day (24-36 oz/700-1000 ml). IAP and WHO recommend exclusive breastfeeding for 6 months — you're almost there!
- Teething care: If teething has begun, offer a clean, cool teething ring. Avoid teething gels with benzocaine. IAP recommends against using honey on pacifiers (risk of infant botulism).
- Play: Encourage rolling, reaching for toys, and supported sitting. Read colorful board books. Sing rhymes and lullabies.
- Safety: Your baby is becoming mobile. Never leave them unattended on a bed or changing table. Ensure the home is baby-proofed.
- Tummy time: Continue 20-30 minutes total per day, broken into short sessions.
- Solid foods: Do NOT start solids before 6 months (WHO/UNICEF/IAP). Your baby's digestive system and oral motor skills are not ready.`,
                mentalHealthNotes: `- Returning to work can trigger a range of emotions: guilt, anxiety, sadness, relief, excitement. All are normal.
- "Separation anxiety" is experienced by mothers too, not just babies. It typically improves with time and routine.
- Communication: Discuss your feelings with your partner. Share parenting responsibilities and household work.
- Workplace stress: Be realistic about what you can accomplish. You're balancing two full-time roles (motherhood and work). Set boundaries.
- If you feel persistently sad, anxious, or overwhelmed, speak to a mental health professional. The District Mental Health Programme (DMHP) under India's National Mental Health Programme provides services at district hospitals.
- Self-care: Even 15 minutes of alone time daily can help. A walk, a cup of chai, reading — prioritize it.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking is appropriate.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds. Quick flicks: 20 quick contractions, 3 times daily.
- Core exercises: Continue with bridges, pelvic tilts, and modified planks. If diastasis recti is resolved, you may resume normal core exercises.
- Bodyweight exercises: Squats (20 reps, 3 times daily), lunges (10 each leg, 3 times daily), push-ups (full push-ups if comfortable).
- Yoga: Continue hatha yoga. Include cat-cow, downward dog, warrior poses, and restorative poses.
- Swimming: Excellent for overall fitness and gentle on joints.
- Postnatal Pilates: Mat-based Pilates is beneficial for core and pelvic floor.
- Resistance training: Dumbbells (2-5 kg) for upper and lower body exercises.
- If you're back at work and time-constrained, even 15-20 minutes of exercise is beneficial. Short, intense workouts can be effective.
- Listen to your body. If you're juggling work and childcare, rest is equally important.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Redness, warmth, or pus from C-section incision
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile or laugh, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in either direction, not bringing hands to mouth
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface
- Baby: Breathing pauses, choking, or color change during sleep`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 21
        // ═══════════════════════════════════════════════
        {
                weekNumber: 21,
                title: "Week 21: Baby's Communication & Your Fitness",
                summary: "Your baby is becoming more communicative with babbling and laughter. Focus on your physical fitness progression and maintaining a healthy work-life integration.",
                bodyMarkdown: `# Week 21 After Birth

Your baby's personality is shining through more each day. This week focuses on your baby's communication development and your continued physical recovery.

## Your Baby's Communication
- **Babbling**: Your baby is experimenting with sounds — consonant-vowel combinations like "ba-ba," "da-da," "ma-ma." According to AAP, this is a critical precursor to language development. Respond to your baby's babbling as if having a conversation — this encourages language development.
- **Laughter and social engagement**: Your baby laughs out loud, especially in response to playful interactions. They enjoy peek-a-boo and other interactive games.
- **Emotional expression**: Your baby expresses joy, frustration, curiosity, and discomfort through different sounds and facial expressions.

## Your Body at Week 21
- **Fitness progression**: By 5 months, most women can engage in moderate to vigorous exercise, provided there are no complications. ACOG states that postpartum exercise does not affect breast milk composition or infant growth.
- **Core strength**: Continue rebuilding core strength. If diastasis recti (abdominal separation) has resolved, you can gradually resume normal abdominal exercises including crunches. If unsure, check with your doctor.
- **Joint health**: Pregnancy hormones can affect joints for up to 5-6 months postpartum. Continue with low-impact exercise if you experience joint pain.

## Indian Context: Traditional Postpartum Fitness
- **Postnatal yoga**: Indian traditions include specific postnatal yoga practices. The Ministry of AYUSH (India) recommends gentle yoga for postpartum recovery, including: Supta Baddha Konasana (Reclining Bound Angle Pose), Setu Bandhasana (Bridge Pose), and gentle pranayama (breathing exercises).
- **Traditional massage**: If you're continuing with postpartum massage (malish), ensure the therapist uses gentle pressure. Avoid deep tissue massage on the abdomen if you had a C-section.
- **Diet for fitness**: NIN (India) recommends a balanced diet with adequate protein (74g/day for lactating mothers), calcium (1200mg/day), iron (21mg/day), and vitamin C (80mg/day) to support tissue repair and energy.

## Baby Care at Week 21
- **Feeding**: Continue breastfeeding or formula feeding. 5-6 feedings per day. Your baby may show interest in your food — this is a readiness sign for solids, but wait until 6 months (WHO/IAP).
- **Sleep**: Total sleep: 12-15 hours including 2-3 naps. Establish a consistent bedtime routine: bath, massage, feeding, lullaby, bed.
- **Play**: Your baby enjoys cause-and-effect toys (rattles, activity gyms). Read colorful board books. Sing nursery rhymes and regional lullabies.

## Source References
- AAP: Developmental Milestones at 4-6 Months, healthychildren.org
- WHO: Infant and Young Child Feeding Guidelines, 2021
- ACOG: Physical Activity and Exercise During Pregnancy and the Postpartum Period, Committee Opinion No. 804, 2020
- IAP: Developmental Surveillance Guidelines
- Ministry of AYUSH: Yoga for Postpartum Health
- NIN Dietary Guidelines for Indians, 2024
- FOGSI: Postpartum Care Guidelines, 2019`,
                recoveryNotes: `- Core: Continue daily core-strengthening exercises. Gentle transverse abdominis activation (drawing belly button toward spine) is the foundation.
- Joints: If you experience wrist, knee, or back pain, consider that relaxin (pregnancy hormone) may still be affecting your joints. Gentle stretching and low-impact exercise are best.
- Scar massage: If you had a C-section or episiotomy, gentle scar massage with vitamin E oil or coconut oil can help reduce scar tissue and improve sensation. FOGSI recommends this after the scar is fully healed.
- Nutrition: Continue iron-rich foods (green leafy vegetables, dates, jaggery, lean meats) to prevent anemia, which is prevalent among Indian postpartum women (NFHS-5 data).`,
                babyCareNotes: `- Communication development: Talk, sing, and read to your baby throughout the day. Name objects, describe actions, and respond to babbling.
- Play: Peek-a-boo, pat-a-cake, and gentle tickling games. Provide toys that make noise when shaken or squeezed.
- Safety: Your baby may be attempting to roll and scoot. Never leave them unattended on elevated surfaces.
- Teething: If teething, offer a clean, cool teething ring. IAP advises against teething gels with benzocaine. Massage gums with a clean finger.
- Feeding: Continue exclusive breastfeeding or formula feeding. Wait until 6 months for solids.`,
                mentalHealthNotes: `- Work-life balance: If you've returned to work, be kind to yourself. You're navigating a major transition. It's okay if everything isn't perfect.
- Partner support: Discuss division of household responsibilities and childcare. Research shows that equal sharing of domestic work is associated with better maternal mental health (WHO).
- Social connection: Stay connected with other mothers. In India, informal support networks of family, neighbors, and friends are invaluable. Also consider online mother communities.
- Identity: It's normal to feel like you've lost parts of your pre-baby identity. You're integrating motherhood into your identity — it takes time.
- If you feel persistently overwhelmed, seek help from a mental health professional. The DMHP provides services at district hospitals across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Consider walking with your baby in a stroller or carrier.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds.
- Core exercises: Transverse abdominis activation, pelvic tilts, bridges, dead bug (if DR is resolved). 20 repetitions, 3 times daily.
- Bodyweight exercises: Squats (20 reps, 3 times daily), lunges (15 each leg, 3 times daily), push-ups (full if comfortable).
- Yoga: Continue hatha yoga. Surya Namaskar (Sun Salutation) at a gentle pace is excellent for overall fitness.
- Swimming: Continue if comfortable. Excellent cardiovascular exercise.
- Resistance training: Gradually increase weight. Dumbbells (3-5 kg). Focus on compound movements: squats, deadlifts (light), rows, chest press.
- If time is limited, try 15-minute HIIT-style workouts (bodyweight only). Short bursts of exercise are effective.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Redness, warmth, or pus from C-section incision
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile or laugh, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in either direction, not bringing hands to mouth
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface
- Baby: Breathing pauses, choking, or color change during sleep`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 22
        // ═══════════════════════════════════════════════
        {
                weekNumber: 22,
                title: "Week 22: Work-Life Balance & Self-Care",
                summary: "As you navigate work and motherhood, prioritize self-care and your relationship with your partner. Your baby is developing new social skills every day.",
                bodyMarkdown: `# Week 22 After Birth

This week is about finding balance. You're now several weeks into the return-to-work transition (or managing life as a full-time mother), and establishing sustainable routines is key.

## Work-Life Integration
- **Realistic expectations**: According to WHO, maternal mental health is a critical determinant of child health and development. You cannot pour from an empty cup. Prioritize your wellbeing.
- **Quality over quantity**: Research shows that the quality of time spent with your baby matters more than the quantity. Focused, undistracted playtime, even for 30 minutes, is highly beneficial.
- **Setting boundaries**: Learn to say no to non-essential commitments. Your energy is finite and precious.

## Your Baby's Social Development
- **Stranger anxiety**: Your baby may show preference for familiar people and fear of strangers. This is a normal developmental stage (AAP) that indicates healthy attachment.
- **Social smiling**: Your baby now smiles spontaneously, not just in response to your smile. They smile at familiar people and may show wariness of strangers.
- **Emotional development**: Your baby expresses a range of emotions — joy, frustration, excitement, curiosity. They are learning emotional regulation from you.

## Your Body at Week 22
- **Pelvic floor**: By now, pelvic floor strength should be significantly improved. If you still experience urinary leakage, pelvic pain, or a feeling of heaviness, consult a pelvic floor physiotherapist. FOGSI emphasizes that pelvic organ prolapse is underdiagnosed in Indian women.
- **Back pain**: If you're experiencing back pain, it may be related to weakened core muscles, poor posture during feeding, or carrying your baby. Strengthen your core, practice good posture, and use proper lifting techniques.

## Indian Context: Self-Care
- **Traditional self-care**: In Indian culture, postpartum self-care (jaapa) traditionally lasts 40 days, but your body continues to heal beyond this. Continue with nourishing foods: panjiri, gond ke laddoo, dry fruit milk, and methi preparations.
- **Ayurvedic perspective**: Ayurveda recommends abhyanga (self-massage with warm oil) for postpartum recovery. Use sesame or coconut oil warmed gently. This is believed to improve circulation, reduce stress, and nourish tissues.
- **Spiritual well-being**: Many Indian women find comfort in spiritual practices — prayer, meditation, visiting temples, or listening to bhajans. These can be powerful tools for mental wellbeing.

## Source References
- WHO: Maternal Mental Health and Child Health and Development, 2019
- AAP: Developmental Milestones at 4-6 Months, healthychildren.org
- FOGSI: Postpartum Care Guidelines, 2019
- ACOG: Postpartum Care, Committee Opinion No. 736, 2018
- Ministry of AYUSH: Ayurvedic Postpartum Care Practices
- NIN Dietary Guidelines for Indians, 2024
- IAP: Developmental Surveillance Guidelines`,
                recoveryNotes: `- Pelvic floor: Continue daily Kegel exercises. If you experience any urinary leakage, pelvic heaviness, or pain during intercourse, consult a pelvic floor physiotherapist. These issues are common but not normal — they can be treated.
- Back pain: Strengthen your core muscles. Practice good posture during feeding (bring baby to breast, don't hunch). Use a supportive chair. When lifting your baby, bend your knees and keep your back straight.
- Nutrition: Continue a balanced diet. Include iron-rich foods (green leafy vegetables, dates, jaggery), calcium-rich foods (milk, curd, ragi, sesame seeds), and protein (dal, paneer, eggs, sprouts, lean meats).
- Rest: Sleep deprivation is cumulative. Nap when your baby naps. If you're working, prioritize sleep over household chores in the evenings.`,
                babyCareNotes: `- Social development: Encourage social interaction with family members. In Indian joint families, this happens naturally. Your baby benefits from interacting with multiple caregivers.
- Stranger anxiety: This is normal and healthy. Don't force your baby to go to unfamiliar people. Let them warm up at their own pace.
- Play: Your baby enjoys looking at faces, especially yours. Make funny faces, play peek-a-boo, and sing songs. Mirror play is fascinating for babies at this age.
- Reading: Read colorful board books. Point to and name pictures. Your baby may not understand the words, but they are absorbing language patterns.
- Safety: Your baby is becoming more mobile. Ensure the floor is clear of small objects. Install safety gates at the top and bottom of stairs.`,
                mentalHealthNotes: `- Self-care is not selfish: Taking care of yourself is essential for taking care of your baby. Schedule at least 15-30 minutes of "me time" daily.
- Partner relationship: The postpartum period can strain relationships. Make time for your partner, even if it's just 15 minutes of uninterrupted conversation after the baby sleeps. Research shows that strong partner relationships are protective for maternal mental health (WHO).
- Social support: Stay connected with friends and family. In Indian culture, family support is a major protective factor. Don't isolate yourself.
- Mindfulness: Even 5 minutes of deep breathing or meditation can reduce stress. Apps like Headspace or Calm, or simply sitting quietly with a cup of chai, can help.
- If you feel persistently sad, anxious, or overwhelmed, seek professional help. The DMHP provides mental health services across India.`,
                activityNotes: `- Walking: 30-45 minutes daily. Walking with your baby in a stroller or carrier is a great way to combine exercise and bonding.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds.
- Core exercises: Continue daily core strengthening. Include transverse abdominis activation, pelvic tilts, bridges, and modified planks.
- Bodyweight exercises: Squats (20 reps, 3 times daily), lunges (15 each leg, 3 times daily), push-ups.
- Yoga: Continue hatha yoga. Include poses that strengthen the back and core: cat-cow, bridge pose, locust pose.
- Swimming: Excellent for overall fitness and gentle on joints.
- Dancing: Put on music and dance with your baby. It's fun, great exercise, and your baby loves the movement and rhythm.
- If you're at work, take short walking breaks. Use stairs instead of elevator. Every bit of movement counts.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Redness, warmth, or pus from C-section incision
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile or laugh, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in either direction, not bringing hands to mouth
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface
- Baby: Breathing pauses, choking, or color change during sleep`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 23
        // ═══════════════════════════════════════════════
        {
                weekNumber: 23,
                title: "Week 23: Family Dynamics & Baby's Sitting Skills",
                summary: "Your baby is developing the strength to sit with support. Navigate evolving family dynamics and continue strengthening your body and mind.",
                bodyMarkdown: `# Week 23 After Birth

As your baby approaches the 6-month milestone, they're developing new physical skills. This week focuses on family dynamics and your baby's journey toward independent sitting.

## Your Baby's Physical Development
- **Sitting**: Your baby may be able to sit with support (tripod sitting — leaning forward on hands). Some babies sit briefly without support. According to IAP developmental milestones, sitting without support is typically achieved between 6-8 months.
- **Rolling**: Your baby should be rolling both ways (tummy to back and back to tummy). This is an important gross motor milestone.
- **Reaching and grasping**: Your baby reaches for objects with one hand and transfers objects from hand to hand. They bring everything to their mouth — this is how they explore the world.
- **Leg strength**: When held in a standing position, your baby bears weight on their legs and may bounce. This is building the strength needed for crawling and walking.

## Family Dynamics
- **Joint family considerations**: In Indian joint families, multiple caregivers (grandparents, aunts, uncles) can be a blessing and a challenge. Different generations may have different approaches to childcare. Communicate openly about your preferences while respecting elders' experience.
- **Sibling adjustment**: If you have older children, they may need extra attention. Involve them in baby care: fetching diapers, singing to the baby, or "helping" during tummy time. This fosters bonding and reduces jealousy.
- **Partner relationship**: With the demands of work and baby care, your relationship with your partner may take a backseat. Schedule regular "check-ins" — even 15 minutes of focused conversation daily can make a difference.

## Your Body at Week 23
- **Abdominal muscles**: By 5.5 months, most women with diastasis recti see significant improvement. If your abdominal gap is still wider than 2 finger-widths, consult a women's health physiotherapist. FOGSI recommends assessment before resuming intense abdominal exercises.
- **Skin changes**: The linea nigra (dark line on your abdomen) is fading for most women. Stretch marks are becoming less red and more silvery. These are permanent but fade significantly over time.
- **Breast changes**: If you're breastfeeding, your breasts may feel softer and less full as your supply regulates. This is normal and does not indicate low supply.

## Indian Context: Family Support
- **The role of grandparents**: In Indian culture, grandparents often play a central role in childcare. This intergenerational care has many benefits: grandparents provide wisdom and experience, and babies benefit from multiple loving caregivers. However, discuss modern safety practices: safe sleep (back to sleep, per AAP), no honey for babies under 1 year (risk of botulism), and no water for exclusively breastfed babies under 6 months.
- **Festivals and celebrations**: Your baby may be experiencing their first festivals. Enjoy these moments but be mindful of: loud noises (firecrackers during Diwali can frighten babies), crowded gatherings (protect from infections), and rich foods (don't give to baby before 6 months).

## Source References
- IAP: Developmental Milestones Guidelines
- AAP: Developmental Milestones at 4-6 Months, healthychildren.org
- WHO: Infant and Young Child Feeding Guidelines, 2021
- FOGSI: Postpartum Care Guidelines, 2019
- ACOG: Postpartum Care, Committee Opinion No. 736, 2018
- NIN Dietary Guidelines for Indians, 2024
- CDC: Milestone Checklist for 6 Months`,
                recoveryNotes: `- Diastasis recti: Check your abdominal separation. Lie on your back, knees bent, lift your head slightly, and feel the midline of your abdomen. If the gap is wider than 2 finger-widths, continue modified exercises (no crunches, no planks on hands). Consult a women's health physiotherapist.
- Skin: Stretch marks and linea nigra continue to fade. Keep skin moisturized. Coconut oil and almond oil are traditional Indian remedies for skin health.
- Nutrition: Continue a balanced diet. If you're breastfeeding, your caloric needs are approximately 500 extra calories per day (NIN). Quality matters as much as quantity.
- Breast health: Wear a supportive, well-fitting bra. If you experience blocked ducts, apply warm compresses, massage gently, and feed frequently from the affected side.`,
                babyCareNotes: `- Sitting practice: Support your baby in a sitting position. Use pillows around them for safety. Encourage reaching for toys while sitting — this builds core strength and balance.
- Tummy time: Continue daily tummy time (20-30 minutes total). Place toys just out of reach to encourage scooting and eventually crawling.
- Feeding: Continue exclusive breastfeeding or formula feeding. Your baby may show intense interest in your food — this is a readiness sign for solids, but wait until 6 months (WHO/IAP/UNICEF).
- Sleep: Total sleep: 12-15 hours. 2-3 naps. Establish a consistent bedtime routine.
- Teething: If teething, offer a clean, cool teething ring. Clean gums with a soft, damp cloth.
- Safety: Your baby is increasingly mobile. Never leave them unattended on elevated surfaces. Use safety straps on high chairs and changing tables.`,
                mentalHealthNotes: `- Family dynamics: It's okay to set boundaries with family members. Your parenting decisions deserve respect. Communicate clearly and kindly.
- "Mom guilt": Many mothers feel guilty about working, not working, or not being "perfect." Recognize that these feelings are common but not based in reality. You are the best mother for your baby.
- Relationship with partner: Schedule regular time together, even if it's just drinking chai together after the baby sleeps. Discuss your feelings, challenges, and joys.
- Self-identity: You are more than a mother. Nurture other aspects of your identity: your career, hobbies, friendships, and interests. This makes you a happier, more fulfilled mother.
- If you feel persistently sad, anxious, or overwhelmed, seek help. Postpartum depression can onset anytime in the first year. The DMHP provides services at district hospitals across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking is appropriate.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds.
- Core exercises: If diastasis recti is resolved, you may resume normal core exercises. Continue transverse abdominis activation, pelvic tilts, bridges, and dead bugs.
- Bodyweight exercises: Squats (20 reps, 3 times daily), lunges (15 each leg, 3 times daily), push-ups, tricep dips.
- Yoga: Continue hatha yoga. Include poses that strengthen the back and core.
- Swimming: Continue if comfortable. Excellent for overall fitness.
- Resistance training: Dumbbells (3-5 kg). Gradually increase weight and intensity.
- Dancing: Put on music and dance with your baby. Fun and great exercise!
- If you're working, incorporate movement into your day: take stairs, walk during lunch breaks, do stretches at your desk.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Redness, warmth, or pus from C-section incision
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile or laugh, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in either direction, not bringing hands to mouth
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface
- Baby: Breathing pauses, choking, or color change during sleep`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 24
        // ═══════════════════════════════════════════════
        {
                weekNumber: 24,
                title: "Six Months Postpartum: Starting Solid Foods!",
                summary: "Congratulations on reaching the 6-month milestone! This is a major transition: your baby is ready for complementary foods. Celebrate how far you've both come.",
                bodyMarkdown: `# Six Months After Birth — Half a Year! 🎉

You've reached the 6-month milestone — a significant achievement for both you and your baby. This week marks the exciting transition to complementary feeding.

## Starting Complementary Foods
- **Why 6 months?**: WHO, UNICEF, IAP, and AAP all recommend exclusive breastfeeding for the first 6 months. At 6 months, your baby's digestive system, oral motor skills, and nutritional needs are ready for complementary foods. Breast milk alone no longer meets all nutritional requirements, particularly iron and zinc.
- **Signs of readiness**: Your baby can sit with support, has good head and neck control, shows interest in your food (reaching, opening mouth), and has lost the tongue-thrust reflex (pushing food out with tongue).
- **First foods**: IAP and NIN (India) recommend starting with single-ingredient, soft, mashed foods. Traditional Indian first foods include:
  - **Rice cereal (rice kanji/pej)**: Well-cooked rice mashed with breast milk or formula to a thin consistency
  - **Dal ka pani (lentil soup)**: Thin, strained moong dal water — rich in protein and easy to digest
  - **Ragi (finger millet) porridge**: Rich in calcium and iron — a traditional South Indian first food
  - **Mashed banana**: Soft, easily digestible, and naturally sweet
  - **Mashed boiled potato or sweet potato**: Soft and energy-rich
  - **Stewed apple or pear puree**: Gentle on the stomach
- **How to start**: Begin with 1-2 teaspoons of a single food once a day, after a breast milk or formula feeding. Gradually increase quantity and variety. Introduce one new food at a time, waiting 3-5 days before introducing another, to watch for allergic reactions.
- **Important**: Do NOT add salt, sugar, or honey to baby's food. Honey can cause infant botulism (AAP/IAP). Your baby's kidneys are not ready for added salt.

## Your Baby's Development at 6 Months
- **Motor skills**: Your baby may sit without support (or with minimal support), roll both ways, and may start rocking on hands and knees (pre-crawling). IAP guidelines note that sitting without support is a 6-8 month milestone.
- **Communication**: Babbling with consonant sounds ("ba-ba," "da-da," "ma-ma"). Responds to their name. Expresses pleasure and displeasure.
- **Social**: Recognizes familiar people, may show stranger anxiety, enjoys playing with others, and laughs.
- **Cognitive**: Explores objects by mouthing and shaking. Looks for partially hidden objects (object permanence is developing).

## 6-Month Vaccinations (India)
- As per the Universal Immunization Programme (UIP, India), your baby is due for vaccines at 6 months:
  - **OPV (Oral Polio Vaccine)** — 3rd dose
  - **Hepatitis B** — 3rd dose (if not given earlier)
  - **Influenza** — annual vaccine (recommended by IAP, not in UIP)
  - **Typhoid conjugate vaccine** — recommended by IAP at 6-9 months
- Check with your pediatrician about the specific schedule. IAP recommends additional vaccines beyond UIP.

## Your Body at 6 Months
- **Physical recovery**: Most women feel physically recovered by 6 months. However, complete recovery of pelvic floor, abdominal muscles, and hormonal balance can take up to a year or more (ACOG).
- **Weight**: If you haven't returned to pre-pregnancy weight, you're not alone. Research shows that 50% of women retain some weight at 6 months postpartum. Focus on health, not just weight.
- **Hair**: Postpartum hair shedding should be significantly reduced. New hair growth (baby hairs around the hairline) is a good sign.
- **Sexual health**: If you haven't resumed sexual activity, or if it's painful, discuss with your doctor. FOGSI emphasizes that painful intercourse (dyspareunia) postpartum is common but treatable. Vaginal estrogen cream (if not breastfeeding) or pelvic floor physiotherapy can help.

## Source References
- WHO: Guiding Principles for Complementary Feeding of the Breastfed Child, 2003
- WHO: Infant and Young Child Feeding Guidelines, 2021
- UNICEF: Improving Young Children's Diets, 2020
- IAP: Complementary Feeding Guidelines, 2022
- IAP: Immunization Schedule, 2024
- NIN Dietary Guidelines for Indians, 2024
- Ministry of Health & Family Welfare (India): Universal Immunization Programme (UIP)
- AAP: Starting Solid Foods, healthychildren.org
- ACOG: Postpartum Care, Committee Opinion No. 736, 2018
- FOGSI: Postpartum Care Guidelines, 2019`,
                recoveryNotes: `- Physical recovery: At 6 months, most women feel physically recovered, but complete healing can take longer. Continue pelvic floor exercises, core strengthening, and a balanced diet.
- Weight: If you're concerned about weight, focus on sustainable habits: balanced nutrition, regular physical activity, adequate sleep, and stress management. Avoid crash diets, especially if breastfeeding.
- Hair: New hair growth is a positive sign. Continue a nutritious diet with adequate protein, iron, and biotin. NIN recommends foods like eggs, nuts, seeds, green leafy vegetables, and amla (Indian gooseberry, rich in vitamin C).
- Sexual health: If intercourse is painful, talk to your doctor. Use lubricant. Communicate with your partner. Pelvic floor physiotherapy can be very effective.
- Menstruation: If you haven't had a period yet, it may return as you introduce solids and breastfeeding frequency decreases. Your first period may be heavier than pre-pregnancy.`,
                babyCareNotes: `- Starting solids: Start with 1-2 teaspoons once daily. Gradually increase to 2-3 tablespoons, 2-3 times daily by 7-8 months. Continue breastfeeding or formula feeding — breast milk remains the primary source of nutrition until 12 months.
- First foods: Rice cereal, dal ka pani, ragi porridge, mashed banana, mashed potato, stewed apple/pear puree. Introduce one food at a time, waiting 3-5 days before introducing another.
- Food safety: Wash hands before preparing food. Use clean utensils. Freshly prepared food is best. If storing, refrigerate immediately and use within 24 hours. Do not leave food at room temperature for more than 2 hours. WHO emphasizes hygiene in complementary feeding.
- Allergies: Watch for signs of allergic reaction: rash, hives, vomiting, diarrhea, difficulty breathing. If you notice any, stop the food and consult your pediatrician immediately. Common allergens in India include cow's milk, eggs, peanuts, tree nuts, wheat, soy, and fish.
- Water: You can now offer small amounts of boiled and cooled water in a cup or spoon (not a bottle). Continue breastfeeding or formula as the main source of hydration.
- Sleep: Total sleep: 12-15 hours. 2-3 naps. The bedtime routine is increasingly important.
- Play: Provide a variety of safe objects to explore. Blocks, stacking cups, textured balls, and board books are excellent.`,
                mentalHealthNotes: `- Celebrating 6 months: Take a moment to acknowledge how far you've come. The first 6 months postpartum are incredibly demanding. You've navigated physical recovery, sleep deprivation, breastfeeding challenges, and the emotional roller-coaster of new motherhood. You're doing an amazing job.
- Body image: It takes time to feel comfortable in your postpartum body. Focus on what your body has accomplished: growing and nourishing a human being. Be kind to yourself.
- Identity: By 6 months, many mothers feel more like themselves again. You're integrating motherhood into your identity. Continue nurturing your interests, career, and relationships.
- Partner relationship: Make time for your relationship. Even a simple date night at home after the baby sleeps can strengthen your bond.
- If you experience persistent sadness, anxiety, loss of interest, or thoughts of harming yourself or your baby, seek professional help immediately. Postpartum depression affects 1 in 7 women (ACOG) and can onset anytime in the first year. The DMHP provides services across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or light jogging is appropriate.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds.
- Core exercises: If diastasis recti is resolved, you can resume normal core exercises. Include crunches, planks, and Russian twists.
- Bodyweight exercises: Squats (20 reps, 3 times daily), lunges (15 each leg, 3 times daily), push-ups, burpees (if comfortable).
- Yoga: Continue hatha yoga. You may now include more challenging poses: chaturanga, warrior sequences, and gentle backbends.
- Swimming: Continue if comfortable. Excellent for overall fitness.
- Running: If you've been gradually building up, you may now try running. Start with walk-run intervals (e.g., 1 minute run, 2 minutes walk). Ensure good pelvic floor strength and a supportive sports bra.
- Resistance training: Dumbbells (3-5 kg). Gradually increase weight. Include compound exercises: squats, deadlifts, rows, chest press, overhead press.
- Listen to your body. If you experience pain, leaking, or pelvic heaviness, modify your exercise.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile or laugh, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in either direction, not bringing hands to mouth
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface
- Baby: Signs of allergic reaction to new foods: rash, hives, vomiting, diarrhea, difficulty breathing
- Baby: Breathing pauses, choking, or color change during sleep`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 25
        // ═══════════════════════════════════════════════
        {
                weekNumber: 25,
                title: "Week 25: Sibling Relationships & Baby's Growing Independence",
                summary: "Your baby is exploring food, developing new skills, and becoming more independent. If you have older children, nurture their relationship with the baby.",
                bodyMarkdown: `# Week 25 After Birth

With complementary feeding underway, your baby is entering a new phase of development. This week focuses on sibling relationships and your baby's growing independence.

## Sibling Relationships
- **If you have older children**: A new baby changes family dynamics. Older siblings may feel jealous, left out, or regress in behavior (toilet accidents, baby talk, clinginess). This is normal and temporary.
- **Involve siblings**: Give older children age-appropriate "jobs": fetching wipes, singing to the baby, helping with bath time, or "reading" to the baby. This fosters a sense of importance and connection.
- **One-on-one time**: Try to spend at least 10-15 minutes of undivided attention with each older child daily. This reduces jealousy and reinforces your bond.
- **In Indian joint families**: Grandparents and other relatives can help by giving older children attention while you care for the baby. This can be a tremendous support.

## Your Baby's Development
- **Motor skills**: Your baby may sit without support for short periods. They reach for objects with one hand, transfer objects hand-to-hand, and may start rocking on hands and knees (pre-crawling). Some babies start crawling between 6-9 months (IAP).
- **Complementary feeding**: By now, you've introduced a few foods. Continue with single-ingredient purees and gradually increase variety. Include iron-rich foods: pureed green leafy vegetables (palak), mashed dal, and iron-fortified infant cereal.
- **Communication**: Your baby babbles with consonant sounds, responds to their name, and uses their voice to express pleasure and displeasure. They may understand "no" by your tone of voice.
- **Object permanence**: Your baby is developing object permanence — the understanding that objects continue to exist even when out of sight. They may look for a partially hidden toy. This is a significant cognitive milestone (AAP).

## Your Body at Week 25
- **Exercise**: You can now engage in most forms of exercise, including running, high-intensity interval training, and weight training, provided you have no complications and your pelvic floor is strong. ACOG recommends gradually increasing intensity.
- **Nutrition**: If you're breastfeeding, your caloric needs remain elevated (approximately 500 extra calories per day, NIN). As your baby eats more solids, your milk supply may gradually adjust. This is normal.
- **Sleep**: Your baby may be sleeping for longer stretches, especially if solids are filling. However, teething, growth spurts, and developmental milestones can disrupt sleep.

## Indian Context: Traditional Weaning Foods
- **Regional first foods across India**:
  - **North India**: Dalia (broken wheat porridge), khichdi (rice and moong dal), mashed roti in milk
  - **South India**: Ragi porridge, idli (soft, mashed), rice kanji, mashed banana with ghee
  - **East India**: Rice and dal khichdi, mashed fish (after 8 months), chhena (fresh paneer) mashed
  - **West India**: Ragi or jowar porridge, mashed rotla (bajra roti) in milk, mashed potato with ghee
- **Traditional wisdom**: Indian grandmothers often recommend starting with easily digestible foods. NIN endorses traditional weaning foods that are culturally appropriate, nutritious, and affordable.
- **Avoid**: Commercial "health drinks" and malted beverages marketed for babies — they often contain added sugar. IAP recommends homemade foods over packaged baby foods.

## Source References
- IAP: Complementary Feeding Guidelines, 2022
- NIN Dietary Guidelines for Indians, 2024
- WHO: Guiding Principles for Complementary Feeding, 2003
- AAP: Developmental Milestones at 6 Months, healthychildren.org
- ACOG: Physical Activity and Exercise During Pregnancy and the Postpartum Period, 2020
- FOGSI: Postpartum Care Guidelines, 2019
- UNICEF: Improving Young Children's Diets, 2020`,
                recoveryNotes: `- Exercise: Gradually increase intensity. If you experience urinary leakage, pelvic heaviness, or pain, reduce intensity and consult a pelvic floor physiotherapist.
- Nutrition: Continue a balanced diet. If breastfeeding, your diet directly affects your baby's nutrition through breast milk. Include protein, calcium, iron, and vitamins.
- Sleep: Prioritize sleep. If your baby is sleeping longer, go to bed early to maximize your rest. Sleep deprivation affects mood, cognitive function, and physical recovery.
- Breast health: As your baby eats more solids, your milk supply may adjust. Continue breastfeeding on demand. If you feel engorged, express a small amount for comfort.`,
                babyCareNotes: `- Complementary feeding: Continue introducing new foods, one at a time. Aim for 2-3 tablespoons, 2 times daily. Include iron-rich foods: pureed green leafy vegetables, mashed dal, iron-fortified cereal.
- Sibling interactions: Supervise all interactions between your baby and older siblings. Teach gentle touch. Praise older children when they're kind to the baby.
- Play: Your baby enjoys cause-and-effect toys (pop-up toys, activity centers). Continue reading board books, singing, and talking throughout the day.
- Safety: Your baby is becoming more mobile. Ensure the home is baby-proofed: cover electrical outlets, secure furniture that could tip, keep small objects out of reach, and install safety gates.
- Sleep: Total sleep: 12-15 hours. 2-3 naps. Maintain a consistent bedtime routine.
- Teething: If teething, offer a clean, cool teething ring. IAP advises against teething gels with benzocaine.`,
                mentalHealthNotes: `- Sibling dynamics: Managing multiple children is demanding. It's okay if things aren't perfect. Give yourself grace. The sibling bond develops over years, not days.
- "Mom guilt": If you feel guilty about divided attention between your baby and older children, remember that siblings are a gift to each other. The sibling relationship is one of the most important relationships in life.
- Partner support: Discuss parenting strategies for managing siblings. A united approach is important.
- Self-care: Even with multiple children, prioritize 15 minutes of alone time daily. This is not selfish — it's essential for your mental health.
- If you feel persistently overwhelmed, sad, or anxious, seek help. The DMHP provides services across India. Postpartum depression can onset anytime in the first year.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or light jogging.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds.
- Core exercises: If diastasis recti is resolved, continue normal core exercises. Include crunches, planks, and rotational exercises.
- Bodyweight exercises: Squats (20 reps, 3 times daily), lunges (15 each leg, 3 times daily), push-ups, burpees.
- Yoga: Continue hatha yoga. Include sun salutations, warrior sequences, and gentle backbends.
- Swimming: Continue if comfortable. Excellent for overall fitness.
- Running: If comfortable, continue with gradual progression. Good pelvic floor strength and supportive footwear are essential.
- Resistance training: Dumbbells (3-5 kg). Focus on compound exercises.
- If you have older children, involve them in your exercise: family walks, dancing together, or yoga for kids.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile or laugh, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in both directions, not sitting with support
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface
- Baby: Signs of allergic reaction to new foods: rash, hives, vomiting, diarrhea, difficulty breathing
- Baby: Breathing pauses, choking, or color change during sleep`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 26
        // ═══════════════════════════════════════════════
        {
                weekNumber: 26,
                title: "Week 26: Crawling Readiness & Baby-Led Approaches",
                summary: "Your baby is preparing to crawl and exploring more foods. Continue advancing your fitness and nurturing your baby's growing independence.",
                bodyMarkdown: `# Week 26 After Birth — 6.5 Months

Your baby is becoming more mobile and independent. This week covers crawling readiness, expanding your baby's diet, and your continued fitness journey.

## Crawling Readiness
- **Pre-crawling signs**: Your baby may rock back and forth on hands and knees, push up on arms, and may scoot backward or in circles. According to IAP, crawling typically emerges between 6-10 months. Some babies skip crawling altogether and go straight to pulling up and walking — this is also normal.
- **Encouraging movement**: Place toys just out of reach during tummy time. Create a safe, open floor space for exploration. Avoid prolonged use of baby walkers — IAP and AAP advise against them due to safety risks (falls, stairs) and because they don't help babies learn to walk.
- **Baby-proofing**: If you haven't already, now is the time. Cover electrical outlets, secure furniture, install safety gates, keep small objects off the floor, and lock cabinets containing hazardous items.

## Expanding Your Baby's Diet
- **Food variety**: By now, you've introduced several single-ingredient foods. You can now combine foods: rice and dal khichdi, ragi with mashed banana, or potato and spinach puree.
- **Texture progression**: Gradually move from thin purees to thicker, mashed textures. Your baby needs to learn to manage different textures for oral motor development. IAP guidelines recommend progressing textures by 7-8 months.
- **Iron-rich foods**: Iron stores from birth begin to deplete around 6 months. Prioritize iron-rich foods: pureed green leafy vegetables (palak, methi), mashed dal, iron-fortified infant cereal, and mashed egg yolk (well-cooked, after checking for allergies).
- **Feeding schedule**: Aim for 2-3 meals per day (2-3 tablespoons each) plus 4-5 breast milk/formula feedings. Breast milk remains the primary source of nutrition until 12 months (WHO/UNICEF).

## Your Body at Week 26
- **Fitness**: You can now engage in most forms of exercise. ACOG states that regular postpartum exercise improves cardiovascular fitness, helps with weight management, reduces stress, and improves mood without affecting breast milk composition or infant growth.
- **Menstruation**: If you haven't resumed menstruation, it may return as breastfeeding frequency decreases. Your first period may be heavier or lighter than pre-pregnancy. Irregular cycles are common initially.
- **Skin and hair**: Hair loss should be significantly reduced. New hair growth (baby hairs) is visible. Stretch marks continue to fade.

## Indian Context: Baby-Led Weaning (Indian Style)
- Traditional Indian weaning is typically parent-led (spoon-feeding purees). However, you can incorporate elements of baby-led weaning: offer soft, graspable foods like steamed carrot sticks, soft idli pieces, or well-cooked roti strips. Always supervise closely.
- IAP recommends responsive feeding: watch for your baby's hunger and fullness cues. Don't force-feed. Mealtime should be positive and stress-free.
- In Indian families, babies often eat with the family. Sit your baby in a high chair at the family table. This social aspect of eating is valuable for development.

## Source References
- IAP: Complementary Feeding Guidelines, 2022
- WHO: Guiding Principles for Complementary Feeding, 2003
- UNICEF: Improving Young Children's Diets, 2020
- AAP: Developmental Milestones, healthychildren.org
- AAP: Baby Walkers — A Dangerous Choice, 2018
- ACOG: Physical Activity and Exercise During Pregnancy and the Postpartum Period, 2020
- NIN Dietary Guidelines for Indians, 2024
- FOGSI: Postpartum Care Guidelines, 2019`,
                recoveryNotes: `- Fitness: Continue with regular exercise — 150 minutes of moderate-intensity activity per week is recommended by WHO and ACOG. Include both cardiovascular and strength training.
- Core: If diastasis recti is resolved, you can do full core exercises. If not, continue modified exercises.
- Pelvic floor: Continue daily Kegels. If you experience any leaking, heaviness, or pain, consult a pelvic floor physiotherapist.
- Nutrition: Continue a balanced diet. If breastfeeding, maintain adequate caloric intake (approximately 500 extra calories/day, NIN). Stay hydrated — aim for 3-4 liters of water daily.
- Menstruation: If your period returns, it may be irregular. Use sanitary pads (not tampons initially if you had a vaginal delivery with stitches). Track your cycle.`,
                babyCareNotes: `- Feeding: 2-3 meals per day (2-3 tablespoons each) + 4-5 breast milk/formula feedings. Include iron-rich foods. Progress textures gradually.
- Motor development: Encourage crawling by placing toys just out of reach. Provide plenty of supervised floor time. Avoid baby walkers.
- Safety: Baby-proof your home thoroughly. Your baby will be mobile soon if not already.
- Sleep: Total sleep: 12-15 hours. 2-3 naps. Consistent bedtime routine.
- Play: Cause-and-effect toys, stacking cups, board books, and interactive games. Your baby loves peek-a-boo and pat-a-cake.
- Teething: Continue gum care. If teeth have erupted, clean them with a soft infant toothbrush and water (no toothpaste until 2 years, per IAP).`,
                mentalHealthNotes: `- Body image: By 6.5 months, many women feel more comfortable in their postpartum body. However, it's normal to still have complex feelings. Focus on what your body has accomplished, not just how it looks.
- Identity: You're integrating motherhood into your identity. Continue nurturing your interests, career, and relationships.
- Social connection: Stay connected with other mothers. Sharing experiences, challenges, and joys is therapeutic.
- Partner relationship: Schedule regular time together. Even small gestures — a cup of chai together, a walk, a conversation — strengthen your bond.
- If you feel persistently sad, anxious, or overwhelmed, seek help. Postpartum depression can onset anytime in the first year. The DMHP provides services across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or light jogging.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds.
- Core exercises: If DR is resolved, full core exercises: crunches, planks, Russian twists, leg raises.
- Bodyweight exercises: Squats (20 reps, 3 times daily), lunges (15 each leg, 3 times daily), push-ups, burpees.
- Yoga: Surya Namaskar (Sun Salutation) at a moderate pace. Include warrior sequences and gentle backbends.
- Running: If comfortable, continue. Ensure good pelvic floor strength and supportive footwear.
- Swimming: Continue if comfortable. Excellent for overall fitness.
- Resistance training: Dumbbells (3-5 kg). Compound exercises: squats, deadlifts, rows, chest press.
- Listen to your body. If you experience pain, leaking, or pelvic heaviness, modify or reduce intensity.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile or laugh, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in both directions, not sitting with support
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface
- Baby: Signs of allergic reaction to new foods: rash, hives, vomiting, diarrhea, difficulty breathing
- Baby: Breathing pauses, choking, or color change during sleep`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 27
        // ═══════════════════════════════════════════════
        {
                weekNumber: 27,
                title: "Week 27: Separation Anxiety & Baby's Communication",
                summary: "Your baby may show separation anxiety — a sign of healthy attachment. Their communication skills are blossoming with babbling and gestures.",
                bodyMarkdown: `# Week 27 After Birth

Separation anxiety often emerges around 6-8 months. While challenging, it's actually a positive sign of your baby's cognitive and emotional development.

## Understanding Separation Anxiety
- **What it is**: Your baby becomes distressed when you leave the room or when approached by unfamiliar people. According to AAP, this is a normal developmental phase indicating healthy attachment. It typically peaks between 8-10 months and resolves by 18-24 months.
- **Why it happens**: Your baby has developed object permanence (understanding that objects and people exist even when out of sight) and has formed a strong attachment to you. They don't yet understand that you'll return.
- **How to handle it**:
  - Practice short separations: Leave the room for a few seconds and return, gradually increasing the time.
  - Say goodbye: Don't sneak away — this can increase anxiety. A brief, loving goodbye is better.
  - Consistency: When you say you'll return, do so. This builds trust.
  - Comfort objects: A soft toy, blanket, or piece of your clothing can provide comfort.
  - In Indian joint families: Multiple familiar caregivers (grandparents, aunts) can help ease separation anxiety. Your baby may be comfortable with these familiar people even when you're not present.

## Your Baby's Communication
- **Babbling**: Your baby is babbling with consonant sounds ("ba-ba," "da-da," "ma-ma"). These sounds don't yet have meaning but are precursors to speech. Respond to babbling as if having a conversation — this encourages language development (AAP).
- **Gestures**: Your baby may raise arms to be picked up, wave (though not yet consistently), and reach for desired objects.
- **Understanding**: Your baby may understand simple words like "no" (by your tone), their name, and "bye-bye." They respond to familiar voices and sounds.
- **Indian multilingual environment**: If your family speaks multiple languages, your baby is absorbing all of them. Research shows that bilingual/multilingual exposure is beneficial for cognitive development. Continue speaking to your baby in all languages used in your home.

## Your Body at Week 27
- **Menstruation**: For many women, menstruation returns around 6-8 months postpartum, especially if breastfeeding frequency has decreased. The first few cycles may be irregular and heavier or lighter than pre-pregnancy. FOGSI notes that lactational amenorrhea is a natural contraceptive only if: baby is under 6 months, you are exclusively breastfeeding on demand day and night, and your period has not returned. After 6 months, or if any of these conditions change, use another contraceptive method.
- **Contraception**: Discuss contraception with your doctor. Options suitable for breastfeeding mothers include: progesterone-only pills (POP), copper IUD (Cu-T), hormonal IUD, condoms, and injectable contraceptives. FOGSI provides detailed guidance on postpartum contraception.

## Source References
- AAP: Separation Anxiety, healthychildren.org
- AAP: Developmental Milestones at 6-9 Months
- WHO: Infant and Young Child Feeding Guidelines, 2021
- IAP: Complementary Feeding Guidelines, 2022
- FOGSI: Postpartum Contraception Guidelines, 2019
- NIN Dietary Guidelines for Indians, 2024
- ACOG: Postpartum Care, Committee Opinion No. 736, 2018`,
                recoveryNotes: `- Menstruation: If your period returns, it may be irregular for the first few cycles. Track your cycle. Use sanitary pads (not tampons initially if you had a vaginal delivery with stitches). If bleeding is very heavy (soaking a pad every hour), contact your doctor.
- Contraception: Discuss options with your doctor. Even if your period hasn't returned, you can ovulate and become pregnant. Breastfeeding is not a reliable contraceptive after 6 months.
- Nutrition: If menstruation has returned, your iron needs increase. Include iron-rich foods: green leafy vegetables, dates, jaggery, lean meats, and iron-fortified cereals. Pair with vitamin C (lemon, amla, guava) for better absorption (NIN).
- Pelvic floor: Continue daily Kegels. If you experience any pelvic floor symptoms, consult a physiotherapist.`,
                babyCareNotes: `- Feeding: 2-3 meals per day (3-4 tablespoons each) + 4-5 breast milk/formula feedings. Continue introducing new foods and textures.
- Separation anxiety: Practice short separations. Say a loving goodbye and reassure your baby you'll return. Consistency builds trust.
- Communication: Talk, sing, and read to your baby throughout the day. Respond to babbling. Name objects and describe actions. Use multiple languages if your family is multilingual.
- Play: Interactive games (peek-a-boo, pat-a-cake), cause-and-effect toys, board books, and songs with gestures.
- Safety: Continue baby-proofing. Your baby is increasingly mobile.
- Sleep: Total sleep: 12-15 hours. 2-3 naps. Separation anxiety may cause sleep disruptions. A consistent bedtime routine and a comfort object can help.`,
                mentalHealthNotes: `- Separation anxiety affects mothers too: It's normal to feel anxious about leaving your baby, even for short periods. This reflects your strong bond. Trust that short separations are healthy for both of you.
- Returning to work or increasing work hours: If you're transitioning to more work hours, give yourself and your baby time to adjust. It typically takes 2-4 weeks for a new routine to feel comfortable.
- "Mom guilt": If you feel guilty about leaving your baby, remind yourself that quality time matters more than quantity. Your baby benefits from having a fulfilled, balanced mother.
- Self-care: Continue prioritizing your wellbeing. Schedule time for activities you enjoy.
- If you feel persistently sad, anxious, or overwhelmed, seek help. The DMHP provides services across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or light jogging.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds.
- Core exercises: Full core exercises if DR is resolved. Continue daily strengthening.
- Bodyweight exercises: Squats (20 reps, 3 times daily), lunges (15 each leg, 3 times daily), push-ups, burpees.
- Yoga: Surya Namaskar, warrior sequences, balance poses, and gentle backbends.
- Running: If comfortable, continue. Gradually increase distance and pace.
- Swimming: Continue if comfortable.
- Resistance training: Dumbbells (3-5 kg). Compound exercises.
- Dance: Put on music and dance with your baby. Fun and great exercise!`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding (soaking a pad every hour)
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile or laugh, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in both directions, not sitting with support
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface
- Baby: Signs of allergic reaction to new foods: rash, hives, vomiting, diarrhea, difficulty breathing
- Baby: Breathing pauses, choking, or color change during sleep`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 28
        // ═══════════════════════════════════════════════
        {
                weekNumber: 28,
                title: "Seven Months Postpartum: Crawling & Fine Motor Skills",
                summary: "Your baby may be crawling now! Fine motor skills are developing rapidly. Celebrate 7 months of motherhood and your continued recovery.",
                bodyMarkdown: `# Seven Months After Birth 🎉

Seven months! Your baby is likely becoming much more mobile, and their personality continues to shine.

## Crawling and Movement
- **Crawling milestones**: Many babies crawl between 6-10 months. Common styles include: classic hands-and-knees crawling, army crawling (pulling forward on belly), scooting on bottom, and rolling to reach destinations. IAP notes that all these are normal variations.
- **If your baby isn't crawling yet**: This is completely normal. Some babies skip crawling and go straight to pulling up and walking. Continue encouraging tummy time and floor play. If your baby isn't showing any mobility by 9-10 months, discuss with your pediatrician.
- **Creating a safe exploration space**: Your baby needs a safe area to practice movement. Clear a room or section of a room with a soft surface (play mat, durrie, or folded quilt — traditional Indian setup). Remove hazards and provide interesting toys at varying distances.

## Fine Motor Skills
- **Pincer grasp development**: Your baby is developing the ability to pick up small objects between thumb and forefinger. This typically emerges around 8-10 months. You can encourage it by offering safe finger foods like soft cooked vegetable pieces, small pieces of soft idli, or well-cooked pasta.
- **Hand skills**: Your baby transfers objects from hand to hand, bangs objects together, and may clap hands. They explore objects by shaking, banging, throwing, and mouthing.
- **Self-feeding**: Your baby may try to hold the spoon or grab food from your plate. Encourage this independence — it's messy but important for development.

## Your Baby's Diet at 7 Months
- **Meal frequency**: 2-3 meals per day (3-4 tablespoons each) + 4-5 breast milk/formula feedings. IAP recommends gradually increasing meal frequency and quantity.
- **Texture progression**: Move from thin purees to thicker, mashed foods with soft lumps. This helps develop chewing skills, even before teeth have erupted.
- **Indian meal ideas for 7 months**:
  - Breakfast: Ragi porridge with mashed banana, or soft idli mashed with a little ghee
  - Lunch: Rice and moong dal khichdi with pureed vegetables (carrot, pumpkin, spinach)
  - Dinner: Mashed roti in milk with a little jaggery (after 1 year, use jaggery sparingly), or vegetable dalia
- **Foods to avoid**: Honey (risk of botulism — AAP/IAP), cow's milk as a main drink (until 1 year), added salt (immature kidneys), added sugar, choking hazards (whole grapes, nuts, popcorn, raw hard vegetables), and caffeinated drinks.

## Source References
- IAP: Developmental Milestones Guidelines
- IAP: Complementary Feeding Guidelines, 2022
- AAP: Developmental Milestones at 6-9 Months, healthychildren.org
- WHO: Guiding Principles for Complementary Feeding, 2003
- UNICEF: Improving Young Children's Diets, 2020
- NIN Dietary Guidelines for Indians, 2024
- FOGSI: Postpartum Care Guidelines, 2019
- ACOG: Postpartum Care, Committee Opinion No. 736, 2018`,
                recoveryNotes: `- Physical recovery: At 7 months, most women feel physically recovered. However, continue pelvic floor exercises and core strengthening. Complete healing of all tissues can take up to a year.
- Weight: If you're working on weight loss, aim for gradual, sustainable loss (0.5 kg/week). Crash dieting can affect energy levels and milk supply if breastfeeding.
- Skin: Stretch marks continue to fade. Keep skin moisturized. Time and genetics determine the final appearance.
- Exercise: You can now engage in all forms of exercise, including high-intensity workouts, provided you have no complications.
- Contraception: If you haven't discussed contraception with your doctor, now is a good time. FOGSI recommends postpartum contraception counseling as part of routine postpartum care.`,
                babyCareNotes: `- Feeding: 2-3 meals per day (3-4 tablespoons each) + 4-5 breast milk/formula feedings. Progress textures. Introduce new foods, one at a time.
- Motor development: Encourage crawling and movement. Provide a safe exploration space. Avoid baby walkers.
- Fine motor skills: Offer safe finger foods for self-feeding. Provide toys that encourage grasping, transferring, and banging.
- Play: Stacking cups, blocks, textured balls, board books, and musical toys. Your baby loves interactive games.
- Sleep: Total sleep: 12-15 hours. 2-3 naps. Separation anxiety may cause sleep disruptions. Be consistent with routines.
- Dental care: If teeth have erupted, clean them twice daily with a soft infant toothbrush and water. Schedule the first dental visit by 1 year (IAP).
- Safety: Baby-proof thoroughly. Your baby is mobile and curious.`,
                mentalHealthNotes: `- Celebrating 7 months: Take a moment to acknowledge how far you've come. Seven months of motherhood is a significant achievement.
- Work-life balance: If you're working, continue to find your rhythm. It's okay if everything isn't perfect. Prioritize what matters most.
- Social support: Stay connected with other mothers, friends, and family. In Indian culture, community support is a major protective factor for maternal mental health.
- Body image: Your body has done something incredible. Treat it with kindness and respect. Focus on health, strength, and wellbeing, not just appearance.
- If you feel persistently sad, anxious, or overwhelmed, seek help. Postpartum depression can onset anytime in the first year. The DMHP provides services across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or jogging.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds.
- Core exercises: Full core exercises if DR is resolved. Include crunches, planks, Russian twists, leg raises.
- Bodyweight exercises: Squats (20 reps, 3 times daily), lunges (15 each leg, 3 times daily), push-ups, burpees, mountain climbers.
- Yoga: Surya Namaskar, warrior sequences, balance poses, backbends, and inversions (if comfortable).
- Running: Continue building distance and pace. Ensure good pelvic floor strength.
- Swimming: Continue if comfortable.
- Resistance training: Dumbbells (3-5 kg). Compound exercises. Gradually increase weight.
- High-intensity interval training (HIIT): If comfortable, you can incorporate HIIT workouts. Start with 15-20 minutes.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile or laugh, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in both directions, not sitting with support
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface
- Baby: Signs of allergic reaction to new foods: rash, hives, vomiting, diarrhea, difficulty breathing
- Baby: Choking on food or breathing pauses during sleep`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 29
        // ═══════════════════════════════════════════════
        {
                weekNumber: 29,
                title: "Week 29: Baby's Understanding & Self-Feeding",
                summary: "Your baby understands more words and gestures each day. Encourage self-feeding and continue expanding their diet with nutritious Indian foods.",
                bodyMarkdown: `# Week 29 After Birth

Your baby's cognitive development is accelerating. They understand more than they can express, and their desire for independence is growing.

## Your Baby's Understanding
- **Receptive language**: Your baby understands more words than they can say. They may respond to their name, understand "no" (though they may not obey!), and recognize familiar words like "milk," "papa," "mumma," or "didi." According to AAP, receptive language (understanding) develops before expressive language (speaking).
- **Gestures and communication**: Your baby may wave "bye-bye," raise arms to be picked up, and shake head for "no." They point at objects of interest — this is a major communication milestone.
- **Following simple instructions**: Your baby may respond to simple requests like "come here" or "give me the toy" (with gestures). This shows developing comprehension.

## Self-Feeding and Independence
- **Finger foods**: Offer soft, graspable foods that your baby can pick up and eat independently. This develops fine motor skills, hand-eye coordination, and independence. IAP recommends responsive feeding — let your baby decide how much to eat.
- **Safe finger foods (Indian)**: Soft idli pieces, well-cooked roti strips, soft cooked carrot sticks, steamed apple slices, soft paneer cubes, well-cooked pasta, and small pieces of soft fruit (banana, chikoo, papaya).
- **The mess is worth it**: Self-feeding is messy. Your baby will drop food, smear it, and wear it. This is normal and important for sensory development. Use a bib, place a mat under the high chair, and embrace the mess.
- **Family meals**: In Indian culture, meals are social occasions. Include your baby at the family table. They learn by watching others eat. This is valuable for social and emotional development.

## Your Body at Week 29
- **Fitness**: You can now engage in all forms of exercise. If you haven't started a regular exercise routine, it's never too late. Even 20-30 minutes, 3-4 times per week, provides significant health benefits (WHO).
- **Breastfeeding**: Your baby is eating more solids, but breast milk or formula remains the primary source of nutrition until 12 months. Continue breastfeeding on demand. Your milk supply adjusts to your baby's needs.
- **Sleep**: Your baby may be sleeping longer stretches, especially if they're eating well and moving a lot during the day. However, teething, growth spurts, and developmental milestones can disrupt sleep.

## Indian Context: Festivals and Celebrations
- If your baby is experiencing their first festival season, enjoy the celebrations while keeping these precautions in mind:
  - Loud noises (firecrackers, loud music) can frighten babies. Keep your baby in a quiet room if needed.
  - Crowded gatherings increase infection risk. Limit close contact with strangers. Ensure visitors wash hands before holding the baby.
  - Festival foods are often rich, spicy, and sugary — not suitable for babies under 1 year. Your baby can enjoy simple versions: plain kheer (without sugar), soft puran poli filling, or mashed festival fruits.
  - Maintain your baby's routine as much as possible. Overstimulation and disrupted sleep can lead to a cranky baby.

## Source References
- AAP: Developmental Milestones at 6-9 Months, healthychildren.org
- IAP: Complementary Feeding Guidelines, 2022
- WHO: Infant and Young Child Feeding Guidelines, 2021
- NIN Dietary Guidelines for Indians, 2024
- ACOG: Physical Activity and Exercise During Pregnancy and the Postpartum Period, 2020
- FOGSI: Postpartum Care Guidelines, 2019
- UNICEF: Improving Young Children's Diets, 2020`,
                recoveryNotes: `- Exercise: 150 minutes of moderate-intensity activity per week (WHO/ACOG). Include cardiovascular, strength, and flexibility training.
- Breastfeeding: Continue breastfeeding on demand. Your milk composition changes to meet your baby's evolving needs. If you have concerns about milk supply, consult a lactation consultant or your doctor.
- Nutrition: Continue a balanced diet. If breastfeeding, maintain adequate caloric and nutrient intake. Iron, calcium, protein, and vitamins are essential.
- Sleep: Prioritize sleep. If your baby is sleeping longer, go to bed early. Sleep deprivation is cumulative and affects physical and mental health.
- Contraception: If you haven't discussed contraception, do so. FOGSI recommends postpartum contraception counseling.`,
                babyCareNotes: `- Feeding: 2-3 meals per day (3-4 tablespoons each) + 4-5 breast milk/formula feedings. Offer soft finger foods for self-feeding. Continue introducing new foods.
- Communication: Talk to your baby throughout the day. Describe what you're doing, name objects, and respond to their babbling. Use multiple languages if your family is multilingual.
- Play: Interactive games, stacking toys, board books, and musical toys. Your baby loves cause-and-effect play.
- Safety: Your baby is mobile and curious. Baby-proof thoroughly. Keep small objects, sharp items, and hazardous substances out of reach.
- Sleep: Total sleep: 12-15 hours. 2 naps (morning and afternoon). Consistent bedtime routine.
- Dental care: Clean teeth twice daily with a soft infant toothbrush and water. Avoid sugary drinks and foods.`,
                mentalHealthNotes: `- Independence: As your baby becomes more independent (self-feeding, moving, communicating), you may feel a mix of pride and sadness. It's bittersweet to see your baby grow — this is normal and healthy.
- Self-identity: Continue nurturing your identity beyond motherhood. Your career, hobbies, friendships, and interests make you a happier, more fulfilled mother.
- Partner relationship: Make time for your relationship. Even small gestures — a cup of chai together, a walk, a conversation after the baby sleeps — strengthen your bond.
- Social support: Stay connected with other mothers. Sharing experiences normalizes the challenges of motherhood.
- If you feel persistently sad, anxious, or overwhelmed, seek help. The DMHP provides services across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or jogging.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds.
- Core exercises: Full core exercises. Include crunches, planks, Russian twists, leg raises, and dead bugs.
- Bodyweight exercises: Squats (20 reps, 3 times daily), lunges (15 each leg, 3 times daily), push-ups, burpees, mountain climbers.
- Yoga: Surya Namaskar, warrior sequences, balance poses, backbends.
- Running: Continue building distance and pace. Ensure good pelvic floor strength and supportive footwear.
- Swimming: Continue if comfortable.
- Resistance training: Dumbbells (3-5 kg). Compound exercises. Gradually increase weight.
- HIIT: If comfortable, incorporate 15-20 minute HIIT workouts 2-3 times per week.
- Dance: Put on music and dance with your baby. Fun, bonding, and great exercise!`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No social smile or laugh, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in both directions, not sitting with support
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface
- Baby: Signs of allergic reaction to new foods: rash, hives, vomiting, diarrhea, difficulty breathing
- Baby: Choking on food or breathing pauses during sleep`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 30
        // ═══════════════════════════════════════════════
        {
                weekNumber: 30,
                title: "Week 30: Language Development & Family Mealtime",
                summary: "Your baby's language skills are blossoming with babbling, gestures, and understanding. Family mealtimes are important social and learning experiences.",
                bodyMarkdown: `# Week 30 After Birth — 7.5 Months

Your baby is becoming a real communicator. This week focuses on language development, family mealtime, and your continued wellbeing.

## Language Development at 7.5 Months
- **Babbling with intent**: Your baby's babbling is becoming more sophisticated. They use different tones and volumes and may "talk" to get your attention. According to AAP, this is an important precursor to first words, which typically emerge around 10-14 months.
- **Understanding words**: Your baby may understand several words: their name, "mumma," "papa," "no," "bye-bye," "milk," and names of familiar objects or people. They understand more than they can express.
- **Gestures**: Waving bye-bye, raising arms to be picked up, shaking head "no," and pointing at objects of interest. Gestures are an important part of communication development.
- **Multilingual environment**: In Indian homes, babies are often exposed to 2-3 languages. Research shows that multilingual exposure supports cognitive flexibility and does not cause language delay. Continue speaking to your baby in all the languages of your home. The key is consistent, rich language exposure in each language.

## Family Mealtimes
- **The importance of family meals**: Eating together as a family has numerous benefits: babies learn by watching others eat, mealtimes become social and enjoyable, and it establishes healthy eating habits. IAP recommends responsive feeding in a positive, stress-free environment.
- **Your baby's role at the table**: Sit your baby in a high chair at the family table. Offer age-appropriate foods. Let them self-feed finger foods while you also spoon-feed purees or mashed foods. This combination approach works well for many Indian families.
- **Modeling healthy eating**: Your baby watches everything you do. Eat a variety of healthy foods, and your baby is more likely to accept them. Avoid forcing, bribing, or using food as a reward or punishment.

## Your Baby's Diet at 7.5 Months
- **Expanding the menu**: By now, your baby should be eating a variety of foods from different food groups: cereals (rice, ragi, wheat, jowar, bajra), pulses (moong dal, masoor dal, chana dal), vegetables (carrot, pumpkin, spinach, potato, sweet potato), fruits (banana, apple, pear, papaya, chikoo), and dairy (curd, paneer, ghee in small amounts).
- **Non-vegetarian foods**: If your family eats non-vegetarian food, you can introduce: well-cooked and pureed egg yolk (after checking for allergies), pureed chicken or fish (boneless, well-cooked), and meat broth. IAP recommends introducing non-vegetarian foods after 6 months, ensuring they are well-cooked and pureed or minced.
- **Meal frequency**: 3 meals per day (3-4 tablespoons each) + 4-5 breast milk/formula feedings.

## Your Body at Week 30
- **Physical recovery**: You should feel physically recovered by now. However, some women experience lingering issues: pelvic floor weakness, diastasis recti, back pain, or painful intercourse. These are common but treatable — don't suffer in silence.
- **Weight**: If you're working on weight loss, stay consistent with healthy habits. Sustainable weight loss takes time. Focus on how you feel, not just the number on the scale.
- **Breastfeeding**: As your baby eats more solids, your milk supply may gradually decrease. This is normal. Continue breastfeeding on demand. WHO recommends continued breastfeeding up to 2 years or beyond.

## Source References
- AAP: Developmental Milestones at 6-9 Months, healthychildren.org
- AAP: Language Development, healthychildren.org
- IAP: Complementary Feeding Guidelines, 2022
- WHO: Infant and Young Child Feeding Guidelines, 2021
- WHO: Continued Breastfeeding Recommendation, 2021
- NIN Dietary Guidelines for Indians, 2024
- ACOG: Postpartum Care, Committee Opinion No. 736, 2018
- FOGSI: Postpartum Care Guidelines, 2019
- UNICEF: Improving Young Children's Diets, 2020`,
                recoveryNotes: `- Physical recovery: If you have lingering issues (pelvic floor weakness, back pain, painful intercourse), consult your doctor or a women's health physiotherapist. These are common and treatable.
- Weight: Focus on sustainable habits: balanced nutrition, regular physical activity, adequate sleep, and stress management. Avoid fad diets, especially if breastfeeding.
- Breastfeeding: Continue breastfeeding on demand. Your milk continues to provide valuable nutrition and antibodies. WHO recommends continued breastfeeding for up to 2 years or beyond.
- Contraception: If you haven't discussed contraception, do so. FOGSI recommends postpartum contraception counseling.
- Nutrition: Continue a balanced diet. If menstruation has returned, ensure adequate iron intake (green leafy vegetables, dates, jaggery, lean meats).`,
                babyCareNotes: `- Feeding: 3 meals per day (3-4 tablespoons each) + 4-5 breast milk/formula feedings. Continue expanding the variety of foods. Offer soft finger foods for self-feeding.
- Language development: Talk, sing, and read to your baby throughout the day. Respond to babbling. Name objects and describe actions. Use multiple languages if your family is multilingual.
- Family meals: Include your baby at the family table. Model healthy eating. Make mealtimes positive and stress-free.
- Play: Interactive games, stacking toys, blocks, board books, musical toys, and cause-and-effect toys.
- Safety: Baby-proof thoroughly. Your baby is mobile and curious. Keep small objects, sharp items, and hazardous substances out of reach.
- Sleep: Total sleep: 12-15 hours. 2 naps (morning and afternoon). Consistent bedtime routine.
- Dental care: Clean teeth twice daily with a soft infant toothbrush and water. Schedule first dental visit by 1 year (IAP).`,
                mentalHealthNotes: `- Mealtime stress: If mealtimes are stressful (baby refusing food, throwing food, making a mess), take a deep breath. This is normal. Keep mealtimes positive. Your baby will eat when hungry. Avoid force-feeding, which can create negative associations with food.
- Comparison: Avoid comparing your baby's development or eating habits to other babies. Every baby develops at their own pace. IAP emphasizes that developmental milestones have a range, not a fixed date.
- Self-compassion: You're doing an amazing job. Motherhood is demanding, and you're navigating it with love and dedication. Be kind to yourself.
- Partner support: Continue nurturing your relationship. Share parenting responsibilities and household work.
- If you feel persistently sad, anxious, or overwhelmed, seek help. The DMHP provides services across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or jogging.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds.
- Core exercises: Full core exercises. Include crunches, planks, Russian twists, leg raises, and dead bugs.
- Bodyweight exercises: Squats (20 reps, 3 times daily), lunges (15 each leg, 3 times daily), push-ups, burpees, mountain climbers.
- Yoga: Surya Namaskar, warrior sequences, balance poses, backbends, and inversions (if comfortable).
- Running: Continue building distance and pace. Ensure good pelvic floor strength.
- Swimming: Continue if comfortable.
- Resistance training: Dumbbells (3-5 kg). Compound exercises. Gradually increase weight.
- HIIT: 15-20 minute HIIT workouts 2-3 times per week.
- Dance: Put on music and dance with your baby. It's joyful and great exercise!`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No babbling, not responding to sounds, or not tracking objects
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in both directions, not sitting with support
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface
- Baby: Signs of allergic reaction to new foods: rash, hives, vomiting, diarrhea, difficulty breathing
- Baby: Choking on food, gagging excessively, or breathing pauses during sleep`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 31
        // ═══════════════════════════════════════════════
        {
                weekNumber: 31,
                title: "Week 31: Pulling Up & Baby's Mobility",
                summary: "Your baby may be pulling up to stand and cruising along furniture. This is a major motor milestone. Your home needs to be thoroughly baby-proofed.",
                bodyMarkdown: `# Week 31 After Birth — 8 Months

Your baby is becoming a vertical explorer! Pulling up to stand is a major milestone that opens up a whole new world of exploration.

## Pulling Up to Stand
- **When it happens**: Pulling up to stand typically emerges between 8-10 months. According to IAP developmental milestones, standing with support is expected by 9-12 months.
- **How it happens**: Your baby pulls themselves up using furniture, your legs, or anything within reach. At first, they may not know how to get back down and may cry for help. This is normal — they'll learn to lower themselves with practice.
- **Cruising**: Once standing, your baby may start "cruising" — walking while holding onto furniture. This is a precursor to independent walking.
- **How to help**: Provide sturdy furniture at the right height. A low, stable coffee table or sofa is ideal. Avoid unstable objects that could tip. Encourage your baby to pull up by placing toys on slightly elevated surfaces.

## Baby-Proofing Level 2
- **Your baby is now vertical**: The baby-proofing you did for a crawling baby is no longer sufficient. Your baby can now reach higher surfaces — coffee tables, low shelves, window sills.
- **Critical safety measures**:
  - Secure all furniture to the wall (bookshelves, dressers, TV stands) — tip-over accidents are a leading cause of injury (AAP).
  - Remove tablecloths and runners — your baby will pull them down.
  - Keep hot drinks, sharp objects, and breakables far from edges.
  - Install safety gates at the top AND bottom of stairs.
  - Cover sharp corners on furniture (corner guards).
  - Lock cabinets containing cleaning supplies, medicines, and sharp objects.
  - Keep electrical cords out of reach.
  - Ensure windows have secure locks or guards.

## Your Baby's Diet at 8 Months
- **Meal frequency**: 3 meals per day (4-5 tablespoons each) + 4-5 breast milk/formula feedings. IAP recommends gradually increasing meal quantity and frequency.
- **Texture progression**: Move to mashed foods with soft lumps and soft finger foods. Your baby can manage thicker textures now.
- **Indian meal ideas for 8 months**:
  - Breakfast: Ragi or wheat porridge with fruit puree, or soft idli with a little ghee
  - Lunch: Rice and dal khichdi with vegetables, soft roti pieces in dal
  - Dinner: Vegetable dalia, or mashed rice with curd and vegetable puree
  - Snacks: Soft fruit pieces (banana, papaya, chikoo), steamed vegetable sticks
- **Self-feeding**: Encourage self-feeding with soft finger foods. It's messy but essential for development.

## Source References
- IAP: Developmental Milestones Guidelines
- AAP: Baby-Proofing and Safety, healthychildren.org
- AAP: Developmental Milestones at 6-9 Months
- IAP: Complementary Feeding Guidelines, 2022
- WHO: Infant and Young Child Feeding Guidelines, 2021
- NIN Dietary Guidelines for Indians, 2024
- CDC: Milestone Checklist for 9 Months`,
                recoveryNotes: `- Physical recovery: At 8 months, you should feel physically recovered. Continue pelvic floor exercises and core strengthening. If you have any lingering issues, consult your doctor or a women's health physiotherapist.
- Exercise: You can engage in all forms of exercise. WHO recommends 150 minutes of moderate-intensity activity per week.
- Nutrition: Continue a balanced diet. If breastfeeding, maintain adequate caloric and nutrient intake.
- Contraception: If you haven't discussed contraception, do so. FOGSI recommends postpartum contraception counseling.
- Sleep: Your baby's increased mobility may disrupt sleep temporarily. Be consistent with routines.`,
                babyCareNotes: `- Feeding: 3 meals per day (4-5 tablespoons each) + 4-5 breast milk/formula feedings. Progress textures. Offer soft finger foods.
- Motor development: Encourage pulling up and cruising by providing safe, sturdy furniture. Place toys on slightly elevated surfaces. Teach your baby how to lower themselves back down by gently guiding them.
- Safety: Baby-proofing Level 2 — secure furniture, remove tablecloths, cover corners, lock cabinets. Your baby is vertical and reaching higher surfaces.
- Play: Stacking toys, blocks, board books, musical toys, and push toys (stable, weighted). Your baby loves cause-and-effect play.
- Sleep: Total sleep: 12-15 hours. 2 naps. Consistent bedtime routine. New motor skills may cause temporary sleep disruption.
- Dental care: Clean teeth twice daily. Schedule first dental visit by 1 year (IAP).`,
                mentalHealthNotes: `- Baby's mobility: As your baby becomes more mobile, you may feel a mix of pride and anxiety. It's exciting to see them explore, but also exhausting and nerve-wracking. This is normal.
- Constant vigilance: The increased need for supervision can be draining. If possible, create a fully baby-proofed "yes space" where your baby can explore safely without constant "no."
- Sharing the load: If you have a partner or family support, share supervision duties. You can't be on high alert 24/7 without burning out.
- Self-care: Continue prioritizing your wellbeing. Even 15 minutes of alone time daily can recharge you.
- If you feel persistently sad, anxious, or overwhelmed, seek help. The DMHP provides services across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or jogging.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds.
- Core exercises: Full core exercises. Include crunches, planks, Russian twists, leg raises.
- Bodyweight exercises: Squats (20 reps, 3 times daily), lunges (15 each leg, 3 times daily), push-ups, burpees, mountain climbers.
- Yoga: Surya Namaskar, warrior sequences, balance poses, backbends.
- Running: Continue building distance and pace. Ensure good pelvic floor strength.
- Swimming: Continue if comfortable.
- Resistance training: Dumbbells (3-5 kg). Compound exercises. Gradually increase weight.
- HIIT: 15-20 minute HIIT workouts 2-3 times per week.
- Chasing your mobile baby is exercise in itself! Stay active together.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No babbling, not responding to sounds, or not sitting without support
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in both directions, not bearing weight on legs
- Baby: Extreme floppiness or stiffness, not pushing down on legs when feet are on a hard surface
- Baby: Signs of allergic reaction to foods: rash, hives, vomiting, diarrhea, difficulty breathing
- Baby: Choking on food or breathing pauses during sleep`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 32
        // ═══════════════════════════════════════════════
        {
                weekNumber: 32,
                title: "Eight Months Postpartum: Sleep & Teething",
                summary: "Eight months of motherhood! Your baby may experience sleep disruptions due to teething, separation anxiety, and developmental milestones. Stay consistent with routines.",
                bodyMarkdown: `# Eight Months After Birth 🎉

Eight months! Your baby is a mobile, communicative, curious little person. This week focuses on sleep, teething, and navigating the 8-month sleep regression.

## The 8-Month Sleep Regression
- **What it is**: Many babies experience a sleep regression around 8-10 months. This is linked to major developmental milestones: crawling, pulling up, separation anxiety, and object permanence. According to AAP, sleep regressions are temporary and typically resolve within 2-6 weeks.
- **Why it happens**: Your baby's brain is working overtime to process new skills. They may practice crawling or pulling up in their crib instead of sleeping. Separation anxiety peaks around this age, making bedtime and night wakings more challenging.
- **How to handle it**:
  - Maintain consistent bedtime routines. Consistency is key during regressions.
  - Ensure your baby gets enough daytime sleep. An overtired baby sleeps worse, not better.
  - Reinforce that nighttime is for sleeping — keep night interactions calm, quiet, and brief.
  - Avoid introducing new sleep associations you don't want to maintain (e.g., driving around, feeding to sleep every time).
  - This too shall pass. Sleep regressions are temporary.

## Teething at 8 Months
- **What to expect**: Your baby may have 2-4 teeth by now (typically lower central incisors first, then upper central incisors). Teething continues with upper lateral incisors and first molars emerging over the coming months.
- **Signs of teething**: Drooling, gum rubbing, irritability, disrupted sleep, decreased appetite, and mild temperature elevation (not true fever). IAP notes that teething does NOT cause high fever, diarrhea, or severe illness — if your baby has these symptoms, see a doctor.
- **Teething relief**:
  - Clean, cool teething rings (refrigerated, not frozen).
  - Gently massage gums with a clean finger.
  - Cold, soft foods (chilled fruit puree, cold curd).
  - If your baby is very uncomfortable, consult your doctor about appropriate pain relief. IAP advises against teething gels containing benzocaine.
  - Avoid amber teething necklaces (choking and strangulation risk — AAP).

## Your Baby's Development at 8 Months
- **Motor**: Sits without support, pulls up to stand, may cruise along furniture, may crawl efficiently.
- **Communication**: Babbling with consonant sounds, responds to name, may understand "no," waves bye-bye (may not be consistent).
- **Social**: Stranger anxiety may peak, shows clear preference for familiar people, separation anxiety may intensify.
- **Cognitive**: Object permanence is well developed, looks for hidden objects, enjoys peek-a-boo, explores objects by shaking, banging, throwing, and mouthing.

## Source References
- AAP: Sleep Regression, healthychildren.org
- AAP: Teething, healthychildren.org
- IAP: Teething and Dental Care Guidelines
- IAP: Developmental Milestones Guidelines
- WHO: Infant and Young Child Feeding Guidelines, 2021
- NIN Dietary Guidelines for Indians, 2024
- CDC: Milestone Checklist for 9 Months`,
                recoveryNotes: `- Physical recovery: At 8 months, you should feel physically recovered. Continue pelvic floor exercises and core strengthening. If you have any lingering issues (pelvic floor weakness, back pain, painful intercourse), seek help — these are common and treatable.
- Sleep deprivation: If your baby's sleep regression is affecting your sleep, prioritize rest. Nap when possible. Share night duties with your partner if feasible.
- Nutrition: Continue a balanced diet. Adequate nutrition supports your energy levels, mood, and milk supply if breastfeeding.
- Exercise: Regular exercise helps manage stress, improves sleep quality, and boosts energy. Even 20-30 minutes makes a difference.`,
                babyCareNotes: `- Feeding: 3 meals per day (4-5 tablespoons each) + 4-5 breast milk/formula feedings. Continue expanding food variety. Offer soft finger foods.
- Sleep: 8-month sleep regression is temporary. Maintain consistent routines. Ensure adequate daytime sleep. Keep night interactions calm and brief.
- Teething: Offer cool teething rings, massage gums, and provide cold, soft foods. Consult your doctor for pain relief if needed. Avoid benzocaine gels and amber necklaces.
- Motor development: Encourage pulling up, cruising, and crawling. Provide safe exploration spaces.
- Play: Stacking toys, blocks, board books, musical toys, push toys, and cause-and-effect toys.
- Safety: Baby-proofing Level 2. Your baby is vertical and reaching higher surfaces.
- Dental care: Clean teeth twice daily with a soft infant toothbrush and water.`,
                mentalHealthNotes: `- Sleep deprivation: Lack of sleep significantly affects mood, cognitive function, and emotional resilience. Be kind to yourself. If you're exhausted, lower your expectations for other areas of life — a messy house is fine.
- The 8-month regression is temporary: Remind yourself that this phase will pass. Your baby isn't trying to manipulate you — they're going through a developmental leap and need your comfort.
- Partner support: Share night duties if possible. Even one uninterrupted night of sleep per week can make a significant difference.
- Self-care: Prioritize rest. If you can't get more sleep, at least get rest — sit down, put your feet up, close your eyes for 10 minutes.
- If you feel persistently sad, anxious, or overwhelmed, seek help. The DMHP provides services across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or jogging.
- Kegels: 30 repetitions, 3 times daily. Hold 10 seconds.
- Core exercises: Full core exercises. Daily strengthening.
- Bodyweight exercises: Squats, lunges, push-ups, burpees, mountain climbers.
- Yoga: Surya Namaskar, warrior sequences, balance poses, backbends.
- Running: Continue building distance and pace.
- Swimming: Continue if comfortable.
- Resistance training: Dumbbells (3-5 kg). Compound exercises.
- HIIT: 15-20 minute HIIT workouts 2-3 times per week.
- If you're sleep-deprived, prioritize gentle movement over intense exercise. Rest is equally important.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No babbling, not responding to sounds, or not sitting without support
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in both directions, not bearing weight on legs
- Baby: Extreme floppiness or stiffness
- Baby: High fever with teething (teething does not cause high fever — seek medical evaluation)
- Baby: Signs of allergic reaction to foods or choking on food`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 33
        // ═══════════════════════════════════════════════
        {
                weekNumber: 33,
                title: "Week 33: Baby's Personality & Problem-Solving",
                summary: "Your baby's unique personality is emerging clearly. They're learning to solve simple problems and express preferences. Nurture their curiosity and independence.",
                bodyMarkdown: `# Week 33 After Birth

Your baby's personality is blossoming. They're no longer a passive infant but an active, curious little explorer with distinct preferences and a growing will.

## Your Baby's Emerging Personality
- **Temperament**: By 8 months, your baby's temperament is becoming evident. Some babies are calm and easygoing, others are intense and sensitive, and many are somewhere in between. According to AAP, temperament is largely innate and not a reflection of your parenting.
- **Preferences**: Your baby shows clear preferences for certain foods, toys, activities, and people. They may reject a food they loved yesterday. This is normal — food preferences can change day to day.
- **Asserting independence**: Your baby may resist being put in a car seat, having their diaper changed, or being fed. They want to do things themselves. This is healthy development, not defiance.

## Problem-Solving Skills
- **Cause and effect**: Your baby understands that their actions produce results: pressing a button makes a sound, dropping a toy makes you pick it up, shaking a rattle produces noise. This is a fundamental cognitive skill.
- **Simple problem-solving**: Your baby may figure out how to reach a toy that's behind a barrier, pull a cloth to bring a toy closer, or open a container to get what's inside. These are early problem-solving skills (AAP).
- **Object permanence**: Your baby now understands that objects exist even when hidden. They'll search for a toy they saw you hide. This is a major cognitive milestone (Piaget's sensorimotor stage).

## Your Baby's Diet at 8.5 Months
- **Expanding the menu**: Your baby can now eat a wide variety of foods from all food groups. Continue introducing new foods, one at a time.
- **Non-vegetarian foods**: If your family eats non-vegetarian food, you can now offer: well-cooked and minced chicken, fish (boneless, well-cooked), and egg yolk (well-cooked). IAP recommends ensuring non-vegetarian foods are thoroughly cooked and minced or pureed.
- **Indian meal ideas**:
  - Breakfast: Suji (semolina) upma with vegetables, or ragi dosa (soft, no salt)
  - Lunch: Rice and dal with pureed vegetables, or soft chapati with dal
  - Dinner: Khichdi with vegetables and a little ghee, or mashed rice with curd
  - Snacks: Soft fruit, steamed vegetable sticks, paneer cubes

## Your Body at Week 33
- **Fitness**: You can now engage in all forms of exercise. If you've been consistent, you may be approaching or exceeding pre-pregnancy fitness levels. Celebrate your progress!
- **Breastfeeding**: Continue breastfeeding on demand. Your baby is eating more solids, but breast milk remains valuable nutrition. WHO recommends continued breastfeeding for up to 2 years or beyond.
- **Weight**: If you're working on weight loss, stay consistent. Sustainable weight loss is 0.5 kg per week. Focus on health, strength, and wellbeing.

## Source References
- AAP: Developmental Milestones at 6-9 Months, healthychildren.org
- AAP: Temperament, healthychildren.org
- IAP: Complementary Feeding Guidelines, 2022
- WHO: Infant and Young Child Feeding Guidelines, 2021
- WHO: Continued Breastfeeding Recommendation, 2021
- NIN Dietary Guidelines for Indians, 2024
- CDC: Milestone Checklist for 9 Months`,
                recoveryNotes: `- Fitness: Celebrate your progress. You've made it through 8 months of postpartum recovery. If you're not where you want to be, that's okay — progress, not perfection.
- Breastfeeding: Continue breastfeeding on demand. Your milk continues to provide valuable nutrition and antibodies. If you're considering weaning, do it gradually to avoid engorgement and emotional distress.
- Weight: Focus on sustainable habits. Your body has done something incredible. Treat it with kindness and respect.
- Contraception: If you haven't discussed contraception, do so. FOGSI recommends postpartum contraception counseling.
- Sleep: If your baby's sleep is still disrupted by the 8-month regression, hang in there. It will pass.`,
                babyCareNotes: `- Feeding: 3 meals per day (4-5 tablespoons each) + 4-5 breast milk/formula feedings. Continue expanding food variety. Offer soft finger foods. Encourage self-feeding.
- Personality: Accept and celebrate your baby's unique temperament. Don't compare to other babies. Your baby is exactly who they're meant to be.
- Problem-solving: Provide simple puzzles, stacking toys, containers with lids, and cause-and-effect toys. Let your baby figure things out — resist the urge to solve everything for them.
- Independence: Allow safe independence. Let your baby try to feed themselves, explore safely, and make choices (which toy, which food). This builds confidence.
- Play: Interactive games, board books, musical toys, push toys, and simple puzzles.
- Safety: Baby-proofing Level 2. Your baby is mobile, curious, and reaching higher.
- Sleep: Total sleep: 12-15 hours. 2 naps. Consistent bedtime routine.`,
                mentalHealthNotes: `- Your baby's temperament: If your baby is intense, sensitive, or challenging, you may feel exhausted or wonder if you're doing something wrong. You're not. Temperament is innate. Adapt your parenting to your baby's temperament.
- Comparison: Avoid comparing your baby to others. Every baby develops at their own pace. The range of normal is wide.
- Identity: By 8 months, you may feel more like yourself again. Continue nurturing your interests, career, and relationships.
- Partner support: Discuss parenting approaches. A united, consistent approach is important as your baby becomes more independent and tests boundaries.
- If you feel persistently sad, anxious, or overwhelmed, seek help. The DMHP provides services across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or jogging.
- Kegels: 30 repetitions, 3 times daily.
- Core exercises: Full core exercises. Daily strengthening.
- Bodyweight exercises: Squats, lunges, push-ups, burpees, mountain climbers.
- Yoga: Surya Namaskar, warrior sequences, balance poses, backbends.
- Running: Continue building distance and pace.
- Swimming: Continue if comfortable.
- Resistance training: Dumbbells (3-5 kg). Compound exercises.
- HIIT: 15-20 minute HIIT workouts 2-3 times per week.
- Dance: Put on music and dance with your baby. Joyful movement!`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No babbling, not responding to sounds, or not sitting without support
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not rolling in both directions, not bearing weight on legs
- Baby: Extreme floppiness or stiffness
- Baby: No interest in interactive games (peek-a-boo), not looking for hidden objects
- Baby: Signs of allergic reaction to foods or choking on food`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 34
        // ═══════════════════════════════════════════════
        {
                weekNumber: 34,
                title: "Week 34: First Words & Responsive Parenting",
                summary: "Your baby may be approaching their first meaningful words. Responsive parenting — responding sensitively to your baby's cues — supports healthy development and secure attachment.",
                bodyMarkdown: `# Week 34 After Birth

Your baby's communication skills are advancing rapidly. First words may be just around the corner, and your parenting approach significantly influences your baby's development.

## First Words
- **When first words emerge**: According to AAP, most babies say their first meaningful word between 10-14 months. However, some babies say words earlier (8-10 months), and some later (14-16 months). The range is wide.
- **What counts as a first word**: A consistent sound used to refer to a specific thing/person ("mama" for mother, "dada" for father, "baba" for bottle). It doesn't need to be perfectly pronounced.
- **Precursors to words**: Before first words, your baby communicates through babbling, gestures (pointing, waving, reaching), facial expressions, and vocalizations. These are all important communication skills.
- **How to encourage language**:
  - Talk to your baby throughout the day. Describe what you're doing, name objects, and respond to their babbling as if having a conversation.
  - Read books together daily. Board books with simple pictures are ideal.
  - Sing songs and nursery rhymes. The rhythm and repetition support language development.
  - In multilingual homes, speak to your baby in all languages. Consistent, rich exposure in each language is key.

## Responsive Parenting
- **What it is**: Responsive parenting means observing your baby's cues and responding promptly, warmly, and appropriately. According to WHO and UNICEF, responsive parenting is a key component of nurturing care and supports healthy brain development, secure attachment, and social-emotional wellbeing.
- **Key principles**:
  - Observe your baby's cues: hunger, tiredness, overstimulation, need for comfort, desire to play.
  - Respond promptly and warmly: Your baby learns that their communication is effective and that they can trust you.
  - Follow your baby's lead: Let them choose toys, activities, and the pace of interaction.
  - Provide a safe, stimulating environment: Allow exploration while ensuring safety.
  - Avoid harsh discipline: Your baby is too young to understand rules or consequences. Redirection is more effective than "no."

## Your Baby's Diet at 8.5 Months
- **Meal frequency**: 3 meals per day (4-5 tablespoons each) + 4-5 breast milk/formula feedings. Some babies may be ready for a small snack (soft fruit, steamed vegetable) between meals.
- **Self-feeding**: Encourage self-feeding. Provide a spoon for your baby to hold while you spoon-feed. Offer soft finger foods at every meal.
- **Drinking from a cup**: Introduce a sippy cup or open cup (with help) for water. This is an important developmental skill. IAP recommends transitioning from bottle to cup by 12-15 months.

## Source References
- AAP: Language Development, healthychildren.org
- AAP: Developmental Milestones at 9-12 Months
- WHO/UNICEF: Nurturing Care Framework, 2018
- IAP: Complementary Feeding Guidelines, 2022
- NIN Dietary Guidelines for Indians, 2024
- CDC: Milestone Checklist for 9 Months
- FOGSI: Postpartum Care Guidelines, 2019`,
                recoveryNotes: `- Physical recovery: At 8.5 months, physical recovery should be complete for most women. If you have lingering issues, seek help — they are treatable.
- Exercise: Continue regular exercise. 150 minutes of moderate-intensity activity per week (WHO). Include cardiovascular, strength, and flexibility training.
- Breastfeeding: Continue breastfeeding on demand. If you're considering weaning, discuss with your doctor or a lactation consultant. Gradual weaning is recommended.
- Nutrition: Continue a balanced diet. Your body has been through a lot — nourish it well.
- Sleep: If your baby's sleep is disrupted, prioritize your own rest. Trade off night duties with your partner if possible.`,
                babyCareNotes: `- Feeding: 3 meals per day (4-5 tablespoons each) + 4-5 breast milk/formula feedings. May add a small snack. Encourage self-feeding. Introduce a sippy cup.
- Language development: Talk, sing, and read to your baby daily. Respond to babbling. Name objects and describe actions. Use multiple languages if your family is multilingual.
- Responsive parenting: Observe your baby's cues. Respond promptly and warmly. Follow their lead. Provide a safe, stimulating environment.
- Play: Interactive games, board books, stacking toys, simple puzzles, musical toys, and push toys.
- Safety: Baby-proofing Level 2. Your baby is mobile, vertical, and curious.
- Sleep: Total sleep: 12-15 hours. 2 naps. Consistent bedtime routine.
- Dental care: Clean teeth twice daily. Schedule first dental visit by 1 year (IAP).`,
                mentalHealthNotes: `- Responsive parenting and self-care: Responsive parenting requires emotional energy. You can't pour from an empty cup. Prioritize your own wellbeing so you can be present and responsive for your baby.
- "Am I doing enough?": Many mothers worry about whether they're doing enough to support their baby's development. Rest assured: your love, attention, and responsive care are the most important things. You don't need expensive toys or elaborate activities.
- Screen time: AAP recommends no screen time for babies under 18 months (except video calls). Your baby learns best from real human interaction, not screens.
- Partner support: Discuss parenting approaches. A united, consistent approach is important.
- If you feel persistently sad, anxious, or overwhelmed, seek help. The DMHP provides services across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or jogging.
- Kegels: 30 repetitions, 3 times daily.
- Core exercises: Full core exercises. Daily strengthening.
- Bodyweight exercises: Squats, lunges, push-ups, burpees, mountain climbers.
- Yoga: Surya Namaskar, warrior sequences, balance poses, backbends.
- Running: Continue building distance and pace.
- Swimming: Continue if comfortable.
- Resistance training: Dumbbells (3-5 kg). Compound exercises.
- HIIT: 15-20 minute HIIT workouts 2-3 times per week.
- Family walks: Walking with your baby in a stroller or carrier is a great way to combine exercise and family time.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No babbling, not responding to sounds, or not sitting without support
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not using gestures (pointing, waving, reaching), not showing interest in interactive games
- Baby: Extreme floppiness or stiffness
- Baby: Loss of previously acquired skills (e.g., stopped babbling, stopped sitting)
- Baby: Signs of allergic reaction to foods or choking on food`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 35
        // ═══════════════════════════════════════════════
        {
                weekNumber: 35,
                title: "Week 35: Climbing & Advanced Problem-Solving",
                summary: "Your baby is becoming a skilled climber and problem-solver. Their curiosity knows no bounds. Continue baby-proofing and provide stimulating activities.",
                bodyMarkdown: `# Week 35 After Birth — 9 Months Approaching

Your baby is approaching the 9-month milestone. They're likely becoming a confident cruiser and may even attempt climbing stairs. This is an exciting but demanding phase.

## Climbing and Advanced Mobility
- **Climbing**: Your baby may attempt to climb stairs, furniture, or anything within reach. According to AAP, climbing is a normal developmental drive — babies are biologically programmed to explore their environment. Your job is to make exploration safe, not to prevent it.
- **Stair safety**: Install safety gates at the top AND bottom of stairs. Teach your baby to come down stairs backward (feet first, on their belly) — this is safer than going head-first. Always supervise.
- **Cruising**: Your baby is likely cruising confidently along furniture. They may let go briefly and stand independently for a few seconds. This is a precursor to walking.
- **Furniture safety**: Ensure all furniture is secured to the wall. Remove unstable items your baby could pull over. Keep drawers closed (your baby may use them as steps).

## Advanced Problem-Solving
- **Tool use**: Your baby may use objects as tools — using a stick to reach a toy, pulling a cloth to bring an object closer, or using a container to carry things. This is early tool use, a significant cognitive milestone.
- **Imitation**: Your baby imitates actions they've observed: talking on a toy phone, stirring with a spoon, brushing hair. Imitation is a powerful learning mechanism (AAP).
- **Memory**: Your baby's memory is improving. They remember where toys are kept, recognize familiar people and places, and may anticipate routines (e.g., getting excited when they see the bathtub).

## Your Baby's Diet at 9 Months
- **Meal frequency**: 3 meals + 1-2 snacks per day (4-5 tablespoons each meal) + 4-5 breast milk/formula feedings. IAP recommends gradually increasing meal frequency and quantity.
- **Texture progression**: Your baby can now manage soft, lumpy foods and small, soft finger foods. They may have a pincer grasp (picking up small objects between thumb and forefinger), which enables self-feeding of small pieces.
- **9-month vaccination reminder (India)**:
  - As per UIP: Measles and Rubella (MR) vaccine — 1st dose at 9-12 months
  - IAP recommended: Influenza (annual), Typhoid conjugate vaccine
  - Check with your pediatrician for the specific schedule.

## 9-Month Milestones (CDC/IAP)
- **Motor**: Sits without support, pulls to stand, cruises along furniture, may stand alone briefly
- **Communication**: Babbling with consonant sounds, may say "mama" or "dada" (may not be specific), copies sounds and gestures
- **Social**: May be afraid of strangers, may be clingy with familiar adults, has favorite toys
- **Cognitive**: Looks for hidden objects, bangs objects together, uses pincer grasp, may use objects as tools

## Source References
- AAP: Developmental Milestones at 9 Months, healthychildren.org
- CDC: Milestone Checklist for 9 Months
- IAP: Developmental Milestones Guidelines
- IAP: Immunization Schedule, 2024
- MOHFW: Universal Immunization Programme (UIP)
- IAP: Complementary Feeding Guidelines, 2022
- WHO: Infant and Young Child Feeding Guidelines, 2021
- NIN Dietary Guidelines for Indians, 2024`,
                recoveryNotes: `- Physical recovery: At 9 months, physical recovery should be complete. If you have any lingering issues, seek help. Pelvic floor physiotherapy, scar massage, and targeted exercises can address many postpartum issues.
- Fitness: You can engage in all forms of exercise. Celebrate your progress. Your body has done something incredible.
- Breastfeeding: Continue breastfeeding on demand. Your milk continues to provide nutrition and antibodies. WHO recommends continued breastfeeding for up to 2 years or beyond.
- Weight: Focus on sustainable habits. If you're not at your pre-pregnancy weight, that's okay. Your body has grown and nourished a human being.
- Contraception: If you haven't discussed contraception, do so. FOGSI recommends postpartum contraception counseling.`,
                babyCareNotes: `- Feeding: 3 meals + 1-2 snacks per day (4-5 tablespoons each meal) + 4-5 breast milk/formula feedings. Continue expanding food variety. Offer soft finger foods. Encourage self-feeding with a spoon.
- Motor development: Encourage climbing and cruising in safe environments. Teach stair safety (come down backward). Provide push toys for walking practice.
- Problem-solving: Provide simple puzzles, stacking toys, containers with lids, and cause-and-effect toys. Let your baby figure things out.
- Play: Imitative play (toy phone, toy kitchen items), board books, blocks, stacking toys, musical toys, and push toys.
- Safety: Baby-proofing Level 3 — secure furniture, safety gates, lock cabinets, cover outlets, remove climbing hazards. Your baby is a curious explorer.
- Sleep: Total sleep: 12-14 hours. 2 naps. Consistent bedtime routine.
- Vaccinations: 9-month vaccinations as per UIP and IAP schedule. Check with your pediatrician.
- Dental care: Clean teeth twice daily. Schedule first dental visit by 1 year (IAP).`,
                mentalHealthNotes: `- Constant supervision: Your baby's climbing and exploration require constant vigilance. This can be exhausting. Create a fully baby-proofed space where your baby can explore safely without constant intervention.
- Sharing the load: If you have a partner or family support, share supervision duties. Tag-team parenting allows each parent to rest and recharge.
- "Mom guilt" about not doing enough: Your baby doesn't need elaborate activities or expensive toys. They need your love, attention, and a safe environment to explore. You are enough.
- Comparison: Avoid comparing your baby's development to others. Every baby is unique. The range of normal is wide.
- If you feel persistently sad, anxious, or overwhelmed, seek help. The DMHP provides services across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or jogging.
- Kegels: 30 repetitions, 3 times daily.
- Core exercises: Full core exercises. Daily strengthening.
- Bodyweight exercises: Squats, lunges, push-ups, burpees, mountain climbers, jumping jacks.
- Yoga: Surya Namaskar, warrior sequences, balance poses, backbends, inversions.
- Running: Continue building distance and pace. You may now run at pre-pregnancy levels.
- Swimming: Continue if comfortable.
- Resistance training: Dumbbells (3-5 kg). Compound exercises. Gradually increase weight.
- HIIT: 20-30 minute HIIT workouts 2-3 times per week.
- Sports: You may resume recreational sports if you feel ready. Ensure good pelvic floor strength and listen to your body.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No babbling, not responding to sounds, or not sitting without support
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not using gestures, not showing interest in interactive games
- Baby: Extreme floppiness or stiffness, not bearing weight on legs
- Baby: Loss of previously acquired skills
- Baby: Signs of allergic reaction to foods or choking on food`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 36 (9 Months)
        // ═══════════════════════════════════════════════
        {
                weekNumber: 36,
                title: "Nine Months Postpartum: You've Been a Mother as Long as You Were Pregnant 🎉",
                summary: "Nine months in, nine months out — a beautiful milestone! Your baby is approaching toddlerhood. Celebrate your journey and look forward to the exciting months ahead.",
                bodyMarkdown: `# Nine Months After Birth — A Beautiful Milestone 🎉

You've been a mother for as long as you were pregnant. This is a significant milestone that deserves celebration. Your baby is transforming from an infant into a toddler, and you've navigated nearly a year of postpartum recovery.

## Reflecting on Nine Months
- **Your journey**: Think about where you were 9 months ago — recovering from birth, learning to breastfeed, navigating sleep deprivation, and getting to know your baby. Look at how far you've come. You've grown, learned, and become the mother your baby needs.
- **Your baby's journey**: From a tiny newborn who could barely lift their head to a mobile, babbling, curious explorer. Your baby has grown and developed immensely, and you've been there for every moment.
- **Your body's journey**: Your body has healed, strengthened, and adapted. It may not look exactly like it did before pregnancy, and that's okay. It has done something incredible.

## 9-Month Milestones (CDC/IAP)
- **Motor**: Sits without support, pulls to stand, cruises along furniture, may stand alone briefly, may crawl up stairs
- **Communication**: Babbling with consonant sounds, may say "mama" or "dada" (may not be specific), copies sounds and gestures, understands "no"
- **Social**: Stranger anxiety may peak, shows preference for familiar people, has favorite toys, may be clingy
- **Cognitive**: Looks for hidden objects, uses pincer grasp, bangs objects together, uses objects as tools, remembers routines

## 9-Month Health Check (India)
- **Well-baby visit**: Schedule a 9-month check-up with your pediatrician. This includes: growth assessment (weight, length, head circumference plotted on IAP growth charts), developmental screening, and review of feeding and nutrition.
- **Vaccinations**: As per UIP (India), your baby is due for the MR (Measles and Rubella) vaccine at 9-12 months. IAP also recommends influenza (annual) and typhoid conjugate vaccine. Check with your pediatrician.
- **Anemia screening**: IAP recommends screening for iron deficiency anemia at 9-12 months, especially for exclusively breastfed babies who may not be getting enough iron from complementary foods.

## Your Body at 9 Months
- **Physical recovery**: Most women feel completely recovered by 9 months. However, some issues can persist: pelvic floor weakness, diastasis recti, back pain, painful intercourse, or hormonal imbalances. These are treatable — don't suffer in silence.
- **Postpartum thyroiditis**: A small percentage of women develop thyroid dysfunction in the first year postpartum (ACOG). Symptoms include fatigue, weight changes, mood swings, and hair loss. If you're experiencing these symptoms, ask your doctor about thyroid testing.
- **Menstruation**: For most women, menstruation has returned by 9 months. Cycles may still be irregular, especially if breastfeeding. If you're concerned about your cycle, discuss with your doctor.

## Source References
- CDC: Milestone Checklist for 9 Months
- IAP: Developmental Milestones Guidelines
- IAP: Immunization Schedule, 2024
- MOHFW: Universal Immunization Programme (UIP)
- IAP: Complementary Feeding Guidelines, 2022
- ACOG: Postpartum Care, Committee Opinion No. 736, 2018
- ACOG: Postpartum Thyroiditis, 2020
- FOGSI: Postpartum Care Guidelines, 2019
- WHO: Infant and Young Child Feeding Guidelines, 2021`,
                recoveryNotes: `- Physical recovery: At 9 months, most women feel fully recovered. If you have lingering issues, seek help. Pelvic floor physiotherapy, scar massage, and targeted exercises can address many postpartum concerns.
- Postpartum thyroiditis: If you're experiencing persistent fatigue, weight changes, mood swings, or hair loss, ask your doctor about thyroid testing. Postpartum thyroiditis affects 5-10% of women (ACOG).
- Menstruation: Cycles may be irregular. If you're concerned, discuss with your doctor. Track your cycle.
- Contraception: If you haven't discussed contraception, do so. FOGSI recommends postpartum contraception counseling.
- Exercise: You can engage in all forms of exercise. Celebrate your physical recovery and strength.`,
                babyCareNotes: `- Feeding: 3 meals + 1-2 snacks per day (4-5 tablespoons each meal) + 4-5 breast milk/formula feedings. Continue expanding food variety. Encourage self-feeding.
- 9-month check-up: Schedule well-baby visit. Growth assessment, developmental screening, anemia screening, and vaccinations.
- Motor development: Encourage cruising, standing, and climbing in safe environments. Provide push toys for walking practice.
- Play: Stacking toys, blocks, simple puzzles, board books, musical toys, push toys, and imitative play (toy phone, kitchen items).
- Safety: Baby-proofing Level 3. Your baby is mobile, vertical, and climbing. Secure furniture, use safety gates, and supervise closely.
- Sleep: Total sleep: 12-14 hours. 2 naps. Consistent bedtime routine.
- Dental care: Clean teeth twice daily. Schedule first dental visit by 1 year (IAP).`,
                mentalHealthNotes: `- Celebrating the milestone: Nine months in, nine months out. Take a moment to acknowledge your strength, resilience, and love. You've navigated one of the most challenging and rewarding periods of life.
- Body image: By 9 months, many women feel more comfortable in their postpartum body. If you're still struggling, be patient and kind to yourself. Your body has done something incredible.
- Identity: You may feel more like yourself again. Continue nurturing your interests, career, and relationships.
- "The new normal": You've likely settled into a new rhythm of life. This is your new normal — different from before, but rich and meaningful.
- If you feel persistently sad, anxious, or overwhelmed, seek help. The DMHP provides services across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or jogging.
- Kegels: 30 repetitions, 3 times daily.
- Core exercises: Full core exercises. Daily strengthening.
- Bodyweight exercises: Squats, lunges, push-ups, burpees, mountain climbers, jumping jacks.
- Yoga: Surya Namaskar, warrior sequences, balance poses, backbends, inversions.
- Running: Continue building distance and pace. You may now run at pre-pregnancy levels.
- Swimming: Continue if comfortable.
- Resistance training: Dumbbells (3-5 kg). Compound exercises. Gradually increase weight.
- HIIT: 20-30 minute HIIT workouts 2-3 times per week.
- Sports: You may resume recreational sports. Ensure good pelvic floor strength.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No babbling, not responding to name, or not sitting without support
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not using gestures, not showing interest in interactive games
- Baby: Extreme floppiness or stiffness, not bearing weight on legs
- Baby: Loss of previously acquired skills
- Baby: Signs of allergic reaction to foods or choking on food`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 37
        // ═══════════════════════════════════════════════
        {
                weekNumber: 37,
                title: "Week 37: Standing Independently & First Steps",
                summary: "Your baby may stand independently and take their first steps soon. First steps typically happen between 9-15 months. Every baby's timeline is unique.",
                bodyMarkdown: `# Week 37 After Birth

Your baby may be on the verge of independent standing and first steps. This is one of the most exciting developmental milestones.

## Standing Independently
- **When it happens**: Standing independently (without support) typically emerges between 9-12 months. According to IAP, standing alone is expected by 12-14 months. Some babies achieve this earlier, some later.
- **How it develops**: Your baby first stands while holding onto furniture. They may let go for a few seconds, then gradually increase the duration. They may stand with their legs wide apart and arms out for balance.
- **How to encourage**: Provide a safe, open space for practice. Place interesting toys on low surfaces that require standing to reach. Celebrate your baby's efforts — your encouragement motivates them.

## First Steps
- **When first steps happen**: According to AAP, first independent steps typically occur between 9-15 months. The average is around 12 months. Some babies walk at 9 months, some at 15 months — both are normal.
- **Pre-walking skills**: Before walking, your baby needs to master: sitting without support, pulling to stand, cruising along furniture, standing independently, and walking with support (holding hands or pushing a push toy).
- **Walking styles**: Early walking looks different from mature walking. Your baby may walk with feet wide apart, arms up for balance, and a waddling gait. This is normal and will refine over the coming months.
- **Shoes**: Babies learning to walk should be barefoot indoors. Barefoot walking helps develop foot muscles, balance, and proprioception (body awareness). IAP and AAP recommend soft-soled shoes only for outdoor protection.

## Your Baby's Diet at 9.5 Months
- **Meal frequency**: 3 meals + 1-2 snacks per day. Gradually increase portion sizes. Continue breastfeeding or formula feeding.
- **Self-feeding**: Your baby's pincer grasp is improving. Offer small, soft finger foods. Encourage self-feeding with a spoon (pre-load the spoon and let your baby bring it to their mouth).
- **Family foods**: Your baby can now eat many of the same foods as the family, modified for safety and nutrition. Indian family meals like khichdi, dal-rice, soft roti with dal, and vegetable curries (mild, no added salt or chili) are appropriate.

## Source References
- AAP: Developmental Milestones at 9-12 Months, healthychildren.org
- CDC: Milestone Checklist for 1 Year
- IAP: Developmental Milestones Guidelines
- IAP: Complementary Feeding Guidelines, 2022
- NIN Dietary Guidelines for Indians, 2024
- WHO: Infant and Young Child Feeding Guidelines, 2021
- ACOG: Postpartum Care, Committee Opinion No. 736, 2018`,
                recoveryNotes: `- Physical recovery: At 9.5 months, you should feel physically recovered. Continue pelvic floor exercises and core strengthening as part of your routine.
- Exercise: Regular exercise is now a lifestyle habit, not just recovery. Continue 150 minutes of moderate-intensity activity per week (WHO).
- Breastfeeding: Continue breastfeeding on demand. Your baby is eating more solids, but breast milk remains valuable nutrition. WHO recommends continued breastfeeding for up to 2 years or beyond.
- Weight: If you're at your goal weight, focus on maintenance. If not, continue with sustainable habits.
- Contraception: Ensure you have a reliable contraceptive method if you're not planning another pregnancy.`,
                babyCareNotes: `- Feeding: 3 meals + 1-2 snacks per day. Continue expanding food variety. Offer small, soft finger foods. Encourage self-feeding with a spoon.
- Motor development: Encourage standing and walking practice. Provide a safe, open space. Let your baby be barefoot indoors. Avoid baby walkers.
- Shoes: Soft-soled shoes for outdoor use only. Barefoot indoors is best for developing foot muscles and balance.
- Play: Push toys (stable, weighted), stacking toys, blocks, simple puzzles, board books, musical toys, and imitative play.
- Safety: Baby-proofing Level 3. Your baby is mobile, standing, and may walk soon. Secure furniture, use safety gates, cover sharp corners, and supervise closely.
- Sleep: Total sleep: 12-14 hours. 2 naps. Consistent bedtime routine.
- Dental care: Clean teeth twice daily. Schedule first dental visit by 1 year (IAP).`,
                mentalHealthNotes: `- Developmental timeline: If your baby isn't standing or walking yet, and other babies are, try not to worry. The range of normal is wide (9-15 months for walking). Every baby develops at their own pace.
- Comparison: Social media and mother groups can fuel comparison. Remember that you're seeing highlights, not the full picture. Your baby is unique and will develop on their own timeline.
- Celebrating milestones: First steps are a huge milestone for your baby and for you. It's okay to feel emotional — pride, excitement, and a touch of sadness that your baby is growing up.
- Self-care: Continue prioritizing your wellbeing. A happy, healthy mother is the best gift you can give your baby.
- If you feel persistently sad, anxious, or overwhelmed, seek help. The DMHP provides services across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or jogging.
- Kegels: 30 repetitions, 3 times daily. Maintain this habit for lifelong pelvic floor health.
- Core exercises: Full core exercises. Daily strengthening.
- Bodyweight exercises: Squats, lunges, push-ups, burpees, mountain climbers, jumping jacks.
- Yoga: Surya Namaskar, warrior sequences, balance poses, backbends, inversions.
- Running: Continue building distance and pace. You may now run at pre-pregnancy levels.
- Swimming: Continue if comfortable.
- Resistance training: Dumbbells (3-5 kg). Compound exercises. Gradually increase weight.
- HIIT: 20-30 minute HIIT workouts 2-3 times per week.
- Sports: Recreational sports are appropriate. Listen to your body.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No babbling, not responding to name, or not sitting without support
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not using gestures, not showing interest in interactive games
- Baby: Extreme floppiness or stiffness, not bearing weight on legs
- Baby: Loss of previously acquired skills
- Baby: Signs of allergic reaction to foods or choking on food`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 38
        // ═══════════════════════════════════════════════
        {
                weekNumber: 38,
                title: "Week 38: Baby's First Words & Your Evolving Role",
                summary: "Your baby may be saying their first meaningful words. As your baby becomes more independent, your role is evolving from caregiver to guide and teacher.",
                bodyMarkdown: `# Week 38 After Birth

First words are a magical milestone. Your baby is transitioning from pre-verbal communication to actual speech, and your role as a mother is evolving alongside them.

## First Words
- **What counts as a first word?**: A consistent sound used to refer to a specific person, object, or action. Common first words include "mama," "dada," "baba" (for bottle or father in Indian languages), "bye-bye," and animal sounds. According to AAP, first meaningful words typically emerge between 10-14 months.
- **Indian multilingual context**: In Indian multilingual homes, your baby may mix words from different languages. This is normal and healthy — it's called code-mixing. Your baby may say "mumma" + "pani" (water in Hindi), or "dada" + "bye-bye." This demonstrates cognitive flexibility.
- **How to encourage first words**:
  - Respond enthusiastically when your baby attempts words.
  - Expand on their utterances: if your baby says "ba" for ball, respond with "Yes, that's a red ball!"
  - Name objects, actions, and people throughout the day.
  - Read books together daily. Point to and name pictures.
  - Sing songs and nursery rhymes in all your home languages.
  - Avoid "baby talk" — use real words with clear pronunciation.

## Your Evolving Role as a Mother
- **From caregiver to guide**: As your baby becomes more independent, your role is shifting. You're still the primary source of comfort, nutrition, and security, but you're also becoming a guide, teacher, and cheerleader.
- **Encouraging independence**: Allow your baby to try things themselves, even if it's messy or takes longer. This builds confidence, problem-solving skills, and resilience.
- **Setting gentle boundaries**: Your baby is starting to understand "no" and may test limits. Use redirection rather than punishment. Your baby is too young to understand rules or consequences — they're exploring, not defying.

## Your Baby's Diet at 10 Months
- **Meal frequency**: 3 meals + 1-2 snacks per day. Your baby is eating more solids and may naturally reduce breastfeeding/formula frequency.
- **Choking prevention**: Continue to avoid choking hazards: whole grapes, nuts, popcorn, raw hard vegetables, large chunks of meat, and hard candy. Always supervise eating. Learn infant CPR and choking first aid — IAP and AAP recommend all parents learn these skills.
- **Iron-rich foods**: Continue prioritizing iron-rich foods: green leafy vegetables, dal, iron-fortified cereal, egg yolk, and minced meat/fish (if your family eats non-vegetarian).

## Source References
- AAP: Language Development, healthychildren.org
- AAP: Developmental Milestones at 9-12 Months
- IAP: Complementary Feeding Guidelines, 2022
- WHO: Infant and Young Child Feeding Guidelines, 2021
- NIN Dietary Guidelines for Indians, 2024
- UNICEF: Improving Young Children's Diets, 2020
- CDC: Milestone Checklist for 1 Year`,
                recoveryNotes: `- Physical recovery: At 10 months, physical recovery should be complete. Continue pelvic floor exercises as a lifelong habit. If you have any lingering issues, seek help.
- Exercise: Exercise is now a lifestyle habit. Continue regular physical activity for lifelong health.
- Breastfeeding: Continue breastfeeding on demand. Your baby may naturally reduce frequency as solid intake increases. If you're considering weaning, gradual weaning is recommended.
- Weight: Focus on maintaining a healthy weight through balanced nutrition and regular physical activity.
- Health check: Consider scheduling your own health check-up. Check iron levels, thyroid function, and overall health. You've been through a lot — make sure you're taking care of yourself too.`,
                babyCareNotes: `- Feeding: 3 meals + 1-2 snacks per day. Continue expanding food variety. Avoid choking hazards. Learn infant CPR and choking first aid.
- Language development: Respond enthusiastically to word attempts. Expand on utterances. Read books daily. Sing songs. Use real words with clear pronunciation. Use all home languages.
- Independence: Allow your baby to try things themselves. Provide safe opportunities for exploration, self-feeding, and problem-solving.
- Play: Imitative play, board books, stacking toys, blocks, simple puzzles, musical toys, push toys, and interactive games.
- Safety: Baby-proofing Level 3. Your baby is standing, cruising, and may walk soon. Supervise closely.
- Sleep: Total sleep: 12-14 hours. 2 naps. Consistent bedtime routine.
- Dental care: Clean teeth twice daily. Schedule first dental visit by 1 year (IAP).`,
                mentalHealthNotes: `- Your evolving role: As your baby becomes more independent, you may feel a mix of pride and loss. It's bittersweet to see your baby need you less. This is normal and healthy — your baby's independence is a sign of your good parenting.
- Finding balance: By 10 months, you may feel more like yourself. Continue nurturing your identity beyond motherhood: your career, hobbies, friendships, and interests.
- Parenting approaches: Discuss parenting approaches with your partner. As your baby becomes more independent, a united, consistent approach is important.
- "Am I doing enough?" You are. Your love, attention, and responsive care are the most important things. You don't need to be perfect.
- If you feel persistently sad, anxious, or overwhelmed, seek help. The DMHP provides services across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or jogging.
- Kegels: 30 repetitions, 3 times daily. Lifelong habit for pelvic floor health.
- Core exercises: Full core exercises. Daily strengthening.
- Bodyweight exercises: Squats, lunges, push-ups, burpees, mountain climbers, jumping jacks.
- Yoga: Surya Namaskar, warrior sequences, balance poses, backbends, inversions.
- Running: Continue building distance and pace.
- Swimming: Continue if comfortable.
- Resistance training: Dumbbells (3-5 kg). Compound exercises.
- HIIT: 20-30 minute HIIT workouts 2-3 times per week.
- Sports: Recreational sports are appropriate.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No babbling, not responding to name, or not sitting without support
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not using gestures, not showing interest in interactive games
- Baby: Extreme floppiness or stiffness, not bearing weight on legs
- Baby: Loss of previously acquired skills
- Baby: Signs of allergic reaction to foods or choking on food`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 39
        // ═══════════════════════════════════════════════
        {
                weekNumber: 39,
                title: "Week 39: Approaching the First Birthday",
                summary: "Your baby's first birthday is approaching! Start planning this special celebration while continuing to support your baby's development and your own wellbeing.",
                bodyMarkdown: `# Week 39 After Birth — Almost 10 Months

Your baby's first birthday is just a few months away. This is a time of rapid development, increasing independence, and joyful milestones.

## Approaching the First Birthday
- **Planning celebrations**: In Indian culture, a baby's first birthday is often celebrated with traditions like the annaprashan (first rice-eating ceremony) or mundan (head-shaving ceremony). These rituals vary by region, community, and family tradition. There's no medical requirement for these ceremonies — they're cultural and personal choices.
- **Annaprashan (first rice ceremony)**: In Hindu tradition, this ceremony marks the baby's transition to solid foods. If you haven't already introduced solids, you'd do so at this ceremony. However, since your baby started solids at 6 months (per WHO/IAP), the annaprashan is now a symbolic celebration rather than a literal first feeding.
- **Birthday precautions**: If you're planning a party, keep these in mind: avoid crowded, noisy environments that can overstimulate your baby; ensure guests wash hands before holding the baby; don't give cake, sweets, or rich foods to your baby (added sugar is not recommended before 2 years, per IAP); and maintain your baby's routine as much as possible.

## Your Baby's Development at 10 Months
- **Motor**: Crawls efficiently, pulls to stand, cruises along furniture, may stand alone, may take first steps
- **Communication**: May say 1-2 meaningful words, babbles with inflection, uses gestures (waving, pointing, reaching), understands simple instructions
- **Social**: Shows stranger anxiety, has favorite people and toys, plays interactive games (peek-a-boo, pat-a-cake), may show fear in some situations
- **Cognitive**: Object permanence is well established, explores objects thoroughly, imitates actions, uses objects as tools, solves simple problems

## Your Baby's Diet at 10 Months
- **Transition to family foods**: Your baby can now eat most of what the family eats, modified for safety. Soft, well-cooked versions of dal, rice, roti, vegetables, and fruits are appropriate.
- **Self-feeding**: Encourage self-feeding. Provide a spoon for your baby to practice with. It's messy but essential for development.
- **Weaning from bottle**: IAP recommends transitioning from bottle to cup by 12-15 months. Start offering water and milk in a sippy cup or open cup (with help).

## Source References
- AAP: Developmental Milestones at 9-12 Months, healthychildren.org
- CDC: Milestone Checklist for 1 Year
- IAP: Complementary Feeding Guidelines, 2022
- IAP: Dental Care Guidelines
- WHO: Infant and Young Child Feeding Guidelines, 2021
- NIN Dietary Guidelines for Indians, 2024
- FOGSI: Postpartum Care Guidelines, 2019`,
                recoveryNotes: `- Physical recovery: At 10 months, physical recovery should be complete. Continue pelvic floor exercises as a lifelong habit. If you have any lingering issues, seek help — they are treatable.
- Breastfeeding: Continue breastfeeding on demand. Your baby may naturally reduce frequency. If you're considering weaning, gradual weaning is recommended. WHO recommends continued breastfeeding for up to 2 years or beyond.
- Weight: Focus on maintaining a healthy weight. Your body has done something incredible. Treat it with kindness and respect.
- Health check: Schedule your own health check-up. Check iron levels, thyroid function, and overall health. You deserve care too.
- Exercise: Exercise is now a lifestyle habit. Continue regular physical activity for lifelong health.`,
                babyCareNotes: `- Feeding: 3 meals + 1-2 snacks per day. Transition to family foods (modified for safety). Encourage self-feeding. Start transitioning from bottle to cup.
- Motor development: Encourage standing, cruising, and walking. Provide safe spaces for exploration. Let your baby be barefoot indoors.
- Language development: Talk, sing, and read daily. Respond to word attempts. Use real words with clear pronunciation. Use all home languages.
- Play: Imitative play, board books, stacking toys, blocks, simple puzzles, musical toys, push toys, and interactive games.
- Safety: Baby-proofing Level 3. Your baby is mobile, standing, and may walk soon. Supervise closely.
- Sleep: Total sleep: 12-14 hours. 2 naps. Consistent bedtime routine.
- Dental care: Clean teeth twice daily. Schedule first dental visit by 1 year (IAP). Start transitioning from bottle to cup to prevent dental caries.
- First birthday: Plan celebrations that are safe and not overstimulating. No added sugar, no honey, no choking hazards.`,
                mentalHealthNotes: `- First birthday emotions: Your baby's first birthday is a milestone for you too. It's normal to feel emotional — joy, pride, nostalgia, and perhaps a touch of sadness that your baby is growing up so fast.
- Reflection: Take time to reflect on your journey. You've navigated pregnancy, birth, postpartum recovery, and nearly a year of motherhood. You've grown immensely. Celebrate yourself too.
- Social pressure: First birthday parties can become competitive. Remember that your baby won't remember the party — what matters is the love and celebration, not the scale or expense.
- Self-care: Continue prioritizing your wellbeing. Your baby needs a happy, healthy mother more than a perfect party.
- If you feel persistently sad, anxious, or overwhelmed, seek help. The DMHP provides services across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or jogging.
- Kegels: 30 repetitions, 3 times daily. Lifelong habit for pelvic floor health.
- Core exercises: Full core exercises. Daily strengthening.
- Bodyweight exercises: Squats, lunges, push-ups, burpees, mountain climbers, jumping jacks.
- Yoga: Surya Namaskar, warrior sequences, balance poses, backbends, inversions.
- Running: Continue building distance and pace.
- Swimming: Continue if comfortable.
- Resistance training: Dumbbells (3-5 kg). Compound exercises.
- HIIT: 20-30 minute HIIT workouts 2-3 times per week.
- Sports: Recreational sports are appropriate.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No babbling, not responding to name, or not sitting without support
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not using gestures, not showing interest in interactive games
- Baby: Extreme floppiness or stiffness, not bearing weight on legs
- Baby: Loss of previously acquired skills
- Baby: Signs of allergic reaction to foods or choking on food`,
        },
        // ═══════════════════════════════════════════════
        // EXTENDED RECOVERY PHASE — Week 40
        // ═══════════════════════════════════════════════
        {
                weekNumber: 40,
                title: "Ten Months Postpartum: Weaning & Toddler-Proofing",
                summary: "At 10 months, you may be considering weaning from breastfeeding. Your baby is becoming more toddler-like every day. Prepare for the toddler transition.",
                bodyMarkdown: `# Ten Months After Birth

Double digits! Your baby is 10 months old. This is a time of transition — from infant to toddler, from breastfeeding to family foods, from baby-proofing to toddler-proofing.

## Weaning from Breastfeeding
- **When to wean**: The decision to wean is personal. WHO recommends continued breastfeeding for up to 2 years or beyond. In India, MOHFW's MAA Programme promotes continued breastfeeding alongside complementary foods. However, the right time to wean is when it's right for YOU and your baby.
- **Gradual weaning**: If you decide to wean, do it gradually over several weeks. This reduces the risk of engorgement, mastitis, and emotional distress for both you and your baby. Drop one feeding at a time, starting with the feeding your baby seems least interested in.
- **Emotional aspects of weaning**: Weaning can be emotional. You may feel sadness, relief, freedom, or all of these. This is normal. Breastfeeding is a relationship, and ending it is a transition.
- **Nutrition after weaning**: If your baby is under 12 months, replace breast milk with iron-fortified formula (not cow's milk as a main drink). After 12 months, you can introduce whole cow's milk (IAP). Continue a balanced diet of solids.

## Toddler-Proofing
- **From baby-proofing to toddler-proofing**: Your baby is becoming a toddler. Baby-proofing focused on safety for a non-mobile or crawling baby. Toddler-proofing must account for a walking, climbing, problem-solving explorer.
- **Additional safety measures**:
  - Secure furniture to the wall (bookshelves, dressers, TV stands).
  - Lock cabinets containing cleaning supplies, medicines, sharp objects, and breakables.
  - Cover electrical outlets.
  - Install safety gates at the top and bottom of stairs.
  - Keep curtain/blind cords out of reach (strangulation risk).
  - Secure windows with locks or guards.
  - Keep hot drinks, sharp objects, and breakables far from table/counter edges.
  - Store plastic bags out of reach (suffocation risk).
  - Keep small objects (coins, buttons, batteries) off the floor — choking hazards.
  - Learn infant CPR and choking first aid.

## Your Baby's Development at 10 Months
- **Motor**: Crawls efficiently, cruises along furniture, may stand alone, may take first steps
- **Communication**: May say 1-2 meaningful words, understands simple instructions, uses gestures, babbles with inflection
- **Social**: Shows preferences for people and toys, plays interactive games, may show fear or anxiety in new situations
- **Cognitive**: Problem-solves, imitates actions, uses objects as tools, remembers routines

## Source References
- WHO: Continued Breastfeeding Recommendation, 2021
- MOHFW: MAA (Mothers' Absolute Affection) Programme Guidelines
- IAP: Infant and Young Child Feeding Guidelines, 2022
- AAP: Weaning, healthychildren.org
- AAP: Toddler-Proofing and Safety, healthychildren.org
- CDC: Milestone Checklist for 1 Year
- NIN Dietary Guidelines for Indians, 2024
- La Leche League International: Weaning Guidelines`,
                recoveryNotes: `- Physical recovery: At 10 months, physical recovery should be complete. Continue pelvic floor exercises as a lifelong habit.
- Weaning: If you're weaning, do it gradually. Drop one feeding at a time. Watch for signs of engorgement or blocked ducts. If you experience breast pain, redness, or fever, contact your doctor (mastitis).
- Nutrition after weaning: Ensure adequate nutrition for yourself. Your caloric needs decrease after weaning. Adjust your diet accordingly to maintain a healthy weight.
- Menstruation: If you haven't had a period yet, it may return after weaning. Cycles may be irregular initially.
- Contraception: If you were relying on lactational amenorrhea for contraception, this is no longer reliable after weaning. Discuss contraception with your doctor.`,
                babyCareNotes: `- Feeding: 3 meals + 1-2 snacks per day. If weaning from breastfeeding, replace with iron-fortified formula (if under 12 months) or whole cow's milk (after 12 months). Transition from bottle to cup.
- Motor development: Encourage standing, cruising, and walking. Provide safe spaces. Let your baby be barefoot indoors.
- Toddler-proofing: Upgrade from baby-proofing to toddler-proofing. Your baby is a walking, climbing, problem-solving explorer.
- Play: Imitative play, board books, stacking toys, blocks, simple puzzles, musical toys, push toys, and interactive games.
- Safety: Toddler-proofing is essential. Learn infant CPR and choking first aid.
- Sleep: Total sleep: 12-14 hours. 2 naps. Consistent bedtime routine.
- Dental care: Clean teeth twice daily. Schedule first dental visit by 1 year (IAP). Transition from bottle to cup.`,
                mentalHealthNotes: `- Weaning emotions: Weaning can bring mixed emotions. You may feel sad about ending this special bond, relieved to have your body back, or both. All these feelings are valid. Give yourself space to process them.
- Body changes after weaning: Your breasts may change in size and shape after weaning. Your hormones will shift. You may experience mood changes. This is normal and temporary.
- Identity: As your baby becomes more independent and you potentially wean, you may feel a shift in your identity. Continue nurturing your interests, career, and relationships.
- Partner support: Discuss weaning with your partner. Their support during this transition is valuable.
- If you feel persistently sad, anxious, or overwhelmed, seek help. The DMHP provides services across India.`,
                activityNotes: `- Walking: 30-45 minutes, 1-2 times daily. Brisk walking or jogging.
- Kegels: 30 repetitions, 3 times daily. Lifelong habit.
- Core exercises: Full core exercises. Daily strengthening.
- Bodyweight exercises: Squats, lunges, push-ups, burpees, mountain climbers, jumping jacks.
- Yoga: Surya Namaskar, warrior sequences, balance poses, backbends, inversions.
- Running: Continue building distance and pace. You may now run at pre-pregnancy levels.
- Swimming: Continue if comfortable.
- Resistance training: Dumbbells (3-5 kg). Compound exercises.
- HIIT: 20-30 minute HIIT workouts 2-3 times per week.
- Sports: Recreational sports are appropriate. Listen to your body.
- After weaning: Your energy may shift. Adjust your exercise routine as needed.`,
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Bleeding that has returned or heavy bleeding
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis — especially during weaning)
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Severe headache, vision changes, or upper abdominal pain
- Chest pain, difficulty breathing, or leg pain/swelling
- Pain or burning during urination
- Baby: No babbling, not responding to name, or not sitting without support
- Baby: Poor weight gain, lethargy, fever, or fewer than 6 wet diapers/day
- Baby: Not using gestures, not showing interest in interactive games
- Baby: Extreme floppiness or stiffness, not bearing weight on legs
- Baby: Loss of previously acquired skills
- Baby: Signs of allergic reaction to foods or choking on food`,
        },
        {
                weekNumber: 41,
                title: 'Preparing for the First Birthday & Walking Milestones',
                summary: 'Your baby is 10 months old — the first birthday is approaching! Many babies take their first steps around now. Focus on safe exploration, celebrating the journey, and your own health checkups.',
                bodyMarkdown: `## 🌸 Your Body at Week 41

You are now 10 months postpartum. By this stage, most mothers have returned to menstruation — though breastfeeding can still delay periods. Your body has largely recovered from pregnancy and childbirth, but some changes may persist.

### Physical Recovery Milestones
- **Pelvic floor**: Should be near pre-pregnancy strength if you have been consistent with Kegel exercises. If you still experience urinary leakage with jumping, coughing, or sneezing, consult a physiotherapist — this is common but treatable.
- **Diastasis recti**: If you had abdominal separation, it should now be less than 2 finger-widths. If wider, continue with specialized core rehabilitation exercises.
- **Weight**: Most women have returned to within 2-5 kg of pre-pregnancy weight by 10 months. Sustainable weight loss of 0.5 kg per week is safe during breastfeeding.
- **Hair**: Postpartum hair shedding should have largely stopped. New baby hairs may be visible along the hairline.

### Preparing for the First Birthday
- Plan a simple celebration. Indian traditions like *Annaprashan* (if not yet done) or a temple visit (*prasad* distribution) are meaningful ways to celebrate.
- Reflect on your journey — acknowledge how far you have come.
- Take a family photo to mark this milestone.

### Health Checkups
- **Thyroid check**: Postpartum thyroiditis can present even 6-12 months after delivery. If you have fatigue, weight changes, or mood swings, request TSH testing.
- **Iron/hemoglobin**: Check for anemia, especially if you had heavy postpartum bleeding or are vegetarian.
- **Vitamin D and B12**: Essential for both maternal and baby health — common deficiencies in Indian women.
- **Blood pressure**: Should be checked if you had gestational hypertension or preeclampsia.

### Family Planning
- If you are considering another pregnancy, discuss spacing with your doctor. WHO recommends at least 24 months between delivery and next conception for optimal maternal and child health outcomes.
- Contraception: IUDs (Copper T, hormonal IUD), implants, injections (DMPA), and oral contraceptives are all options. Progestin-only methods are safe during breastfeeding.

---

## 👶 Your Baby at Week 41 (10 Months)

### Growth & Development
- **Weight**: Most babies have tripled their birth weight and weigh between 8-10 kg.
- **Length**: Approximately 72-78 cm.
- **Teeth**: 4-8 teeth are typical.

### Motor Skills
- **Walking**: Many babies take their first independent steps between 10-14 months. Some walk earlier, others later — all within the normal range.
- **Cruising**: Walking while holding onto furniture is well-established.
- **Standing**: Can stand independently for a few seconds.
- **Squatting**: Can squat to pick up toys and stand back up.
- **Climbing**: May attempt to climb stairs — always supervise.

### Communication
- Says "mama" and "dada" with meaning (not just babbling).
- Understands simple commands like "come here," "give me," "no."
- Waves "bye-bye" and claps hands.
- Shakes head for "no."
- Points to objects of interest.
- Imitates sounds and gestures.

### Cognitive Development
- **Object permanence** is fully developed — knows objects exist even when hidden.
- Enjoys looking at picture books and turning pages.
- Understands cause and effect (pressing buttons, dropping toys).
- May show preference for specific toys or comfort objects.

### Feeding
- 3 main meals + 2-3 snacks per day.
- Breastfeeding 3-4 times per day (morning, nap time, bedtime, overnight if needed).
- Self-feeding: Uses fingers well, may attempt to use a spoon.
- Can drink from a sippy cup or open cup with assistance.
- Indian foods: Soft idli, dosa, khichdi, dal-rice, mashed vegetables, soft roti pieces, curd rice, paneer bhurji.

---

## 🥗 Nutrition: Traditional Indian Diet for 10 Months Postpartum

### For Mother
Continue with a balanced diet rich in:
- **Protein**: Dal, legumes, paneer, eggs, chicken, fish, soy products.
- **Calcium**: Milk, curd, buttermilk, ragi, sesame seeds (*til*), leafy greens.
- **Iron**: Beetroot, spinach, jaggery, dates, fortified cereals. Combine with vitamin C (lemon, amla) for better absorption.
- **Fiber**: Whole grains, vegetables, fruits, *isabgol* (psyllium husk) if needed.
- **Hydration**: 3-4 liters of water. Continue *jeera* water, *saunf* water, coconut water.
- **Healthy fats**: Ghee (in moderation), nuts, seeds, coconut.

### For Baby
- Continue introducing a wide variety of foods.
- Family foods mashed or cut into small pieces.
- Avoid: Honey (until 1 year), whole nuts (choking hazard), cow's milk as a drink (until 1 year — can be used in cooking), excessive salt, sugar, and processed foods.
- Introduce: Finger foods like soft-cooked vegetable sticks, paneer cubes, soft fruit pieces.

---

## 🧘‍♀️ Exercise & Activity

### For Mother
- **Walking**: 40-60 minutes daily. Brisk walking is excellent for cardiovascular health.
- **Yoga**: Full practice including Surya Namaskar, standing poses, backbends, and inversions (if previously practiced).
- **Strength training**: Continue with bodyweight exercises and resistance bands. Gradually increase weights.
- **Running**: Can run at pre-pregnancy levels. Ensure good supportive footwear.
- **Swimming**: Excellent full-body workout.
- **Dance**: Zumba, Bollywood dance — fun ways to exercise with friends.
- **Pelvic floor**: Continue daily Kegel exercises for maintenance.

### For Baby
- Encourage walking by holding hands or using push toys.
- Avoid baby walkers (sit-in type) — they are associated with delayed walking and increased injury risk (AAP, IAP guidelines).
- Provide safe spaces for exploration.
- Outdoor time: 30-60 minutes daily for vitamin D and sensory stimulation.

---

## 🧠 Mental Health & Emotional Wellbeing

### Postpartum Mood at 10 Months
- The acute postpartum period is long past, but mental health challenges can persist.
- **Persistent postpartum depression**: If you have been feeling sad, anxious, or disconnected for months, seek help. This is not your fault — it is a medical condition that responds well to treatment.
- **Postpartum anxiety**: Excessive worry about the baby's health, development, or safety. Common but treatable.
- **Identity**: You may be reflecting on how motherhood has changed you. It is normal to grieve aspects of your pre-baby life while also loving your child deeply.

### Coping Strategies
- Join a mother's group — in-person or online. Indian communities like *Mothers of India* or local *anganwadi* groups can provide support.
- Schedule "me time" — even 30 minutes daily for yourself.
- Practice mindfulness or meditation.
- Talk to your partner about your feelings.
- Seek professional help if needed — DMHP (District Mental Health Programme) and NMHP (National Mental Health Programme) provide mental health services in India.

### Body Image
- Accept that your body has done something extraordinary — created and nourished a human being.
- Focus on health and strength, not just appearance.
- Stretch marks, loose skin, and scars are normal and may fade over time.
- If body image concerns are affecting your daily life, consider speaking with a counselor.

---

## 📋 Sources

- **WHO**: Recommended birth spacing of at least 24 months (WHO, 2005, *Report of a WHO Technical Consultation on Birth Spacing*).
- **AAP**: Baby walkers are associated with significant injury risk and should be avoided (AAP, *Pediatrics*, 2018).
- **IAP**: IAP guidelines for infant nutrition and feeding (IAP, 2022).
- **ACOG**: Postpartum care recommendations including thyroid screening, contraception counseling (ACOG Committee Opinion No. 736, 2018).
- **MOHFW**: National Mental Health Programme (NMHP) and District Mental Health Programme (DMHP) for accessible mental health services in India.
- **NICE**: Postnatal care guidelines (NICE Guideline NG194, 2021).
- **ICMR**: Dietary guidelines for lactating women (ICMR-NIN, 2020).
- **NIN**: National Institute of Nutrition dietary guidelines for Indians.`,
                recoveryNotes: 'By 10 months, physical recovery is largely complete. Pelvic floor and abdominal muscles should be near pre-pregnancy strength. Continue maintenance exercises. If you experience urinary leakage, pelvic pain, or abdominal separation >2 finger-widths, consult a physiotherapist. Thyroid and iron levels should be checked. Return of menstruation is normal — cycles may be irregular initially. Contraception counseling is important for family planning. WHO recommends at least 24 months between delivery and next conception.',
                babyCareNotes: 'Baby is 10 months old. Many take first independent steps now. Cruising, standing, and squatting are well-established. Says "mama"/"dada" with meaning. Understands simple commands. Waves bye-bye and claps. 3 meals + 2-3 snacks + 3-4 breastfeeding sessions. Self-feeding with fingers. Avoid baby walkers (sit-in type) — AAP and IAP recommend against them. Continue iron-rich complementary foods. Ensure safe spaces for exploration. No honey or whole nuts until 1 year.',
                mentalHealthNotes: 'Persistent postpartum depression and anxiety can occur even 10 months after delivery. If you have been feeling sad, anxious, or disconnected for months, seek professional help — this is a medical condition, not a personal failure. Reflect on your identity as a mother and as an individual. Body image concerns are common — focus on health and strength. Join a mothers\' group for support. DMHP and NMHP provide accessible mental health services across India. Schedule "me time" daily, even if just 30 minutes.',
                activityNotes: 'Walking 40-60 minutes daily. Full yoga practice including Surya Namaskar. Strength training with bodyweight exercises and resistance bands. Running at pre-pregnancy levels if comfortable. Swimming, dance, and group fitness classes are excellent. Continue daily pelvic floor exercises. Baby: Encourage walking with push toys. Avoid sit-in baby walkers. Provide safe exploration spaces. 30-60 minutes outdoor time daily for vitamin D.',
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Fatigue, weight changes, or mood swings (possible thyroid disorder)
- Heavy bleeding or return of bleeding after it had stopped
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Chest pain, difficulty breathing, or leg pain/swelling
- Severe headache, vision changes, or upper abdominal pain
- Baby: Not sitting without support, not babbling
- Baby: Not responding to name or not using gestures (waving, pointing)
- Baby: Not bearing weight on legs, not attempting to stand
- Baby: Loss of previously acquired skills
- Baby: Poor weight gain, lethargy, fewer than 6 wet diapers/day
- Baby: Extreme floppiness or stiffness, not cruising or pulling to stand`,
        },
        {
                weekNumber: 42,
                title: 'Toddler Independence & Communication Leaps',
                summary: 'Your 10.5-month-old is becoming more independent and communicative. Baby understands simple instructions, uses gestures, and may say a few words. Focus on encouraging independence while maintaining safety.',
                bodyMarkdown: `## 🌸 Your Body at Week 42

### Returning to Pre-Pregnancy Weight
At 10.5 months postpartum, most women have returned to their pre-pregnancy weight or are close to it. Sustainable weight management is more important than rapid weight loss.

- **Healthy weight loss**: 0.5 kg per week maximum if still breastfeeding. Rapid weight loss can release toxins stored in body fat into breast milk.
- **Exercise**: Regular moderate-to-vigorous exercise does not affect milk supply or composition (ACOG, 2020).
- **Diet**: Focus on nutrient-dense foods rather than calorie restriction. Breastfeeding burns approximately 300-500 calories per day.

### Postpartum Body Changes
- **Breasts**: If still breastfeeding, breasts may remain larger. After weaning, they often return to pre-pregnancy size but may be less firm. This is normal.
- **Stretch marks**: Usually fade to silvery-white lines over 12-18 months. Keeping skin moisturized helps. There is limited evidence for creams that eliminate stretch marks entirely.
- **C-section scar**: Should be well-healed and may be fading. Massage the scar with vitamin E oil or coconut oil to improve appearance and reduce adhesions.
- **Diastasis recti**: If still present, continue with core rehabilitation. Avoid crunches and sit-ups until the gap is less than 2 finger-widths.

### Weaning Considerations
- WHO recommends continuing breastfeeding until 2 years and beyond.
- If you are considering weaning, do it gradually — drop one feed per week to avoid engorgement and mastitis.
- After weaning: Your menstrual cycle will regulate. Fertility returns — use contraception if you do not wish to conceive.
- Emotional aspects: Weaning can trigger hormonal changes that affect mood. Be gentle with yourself.

---

## 👶 Your Baby at Week 42 (10.5 Months)

### Communication Leaps
- **Words**: May say 1-3 words with meaning beyond "mama" and "dada" (e.g., "baba" for bottle, "dudu" for milk, "paani" for water).
- **Gestures**: Points to objects, waves bye-bye, claps, blows kisses, raises arms to be picked up.
- **Understanding**: Follows simple commands like "bring the ball," "give it to mummy," "sit down."
- **Imitation**: Copies sounds, actions, and facial expressions.

### Social-Emotional Development
- **Separation anxiety**: May peak around 10-12 months. Baby cries when you leave the room. This is a normal developmental phase indicating healthy attachment.
- **Stranger anxiety**: May be wary of unfamiliar people. Allow baby to warm up at their own pace.
- **Joint attention**: Looks at an object you point to, then looks back at you — a key social communication milestone.
- **Humor**: May laugh at silly faces, peek-a-boo, and unexpected sounds.

### Motor Skills
- Stands independently for several seconds.
- May take a few independent steps (or may not — wide normal range).
- Cruises confidently along furniture.
- Bends to pick up toys and returns to standing.
- Uses pincer grasp (thumb and forefinger) to pick up small objects.
- Can put objects into containers and take them out.

### Sleep
- 11-12 hours at night + 2 naps (1-2 hours each).
- Sleep regression may occur around 10-12 months due to developmental leaps, separation anxiety, teething, or learning to walk.
- Maintain consistent bedtime routines.
- If night waking is frequent, reassure baby briefly but encourage self-soothing.

---

## 🥗 Nutrition for 10.5 Months

### Complementary Feeding
- **Meal frequency**: 3 main meals + 2-3 snacks + breastfeeding 3-4 times/day.
- **Texture**: Mashed, chopped, and soft finger foods. Encourage self-feeding.
- **Variety**: By now, baby should have tried most food groups: cereals, pulses, vegetables, fruits, dairy, eggs/meat/fish (if not vegetarian).
- **Iron-rich foods**: Fortified cereals, mashed beans, spinach, beetroot, egg yolk, chicken liver (in small amounts).
- **Indian examples**: Mashed khichdi, soft idli with ghee, dal-rice, curd rice, mashed vegetables with roti, paneer cubes, mashed banana, stewed apple, ragi porridge.

### Foods to Continue Avoiding
- Honey (botulism risk until 1 year).
- Whole nuts, popcorn, whole grapes, raw carrot rounds (choking hazards).
- Cow's milk as a drink (can be used in cooking). After 1 year, whole cow's milk can be introduced.
- Added salt and sugar — baby's kidneys are still maturing.
- Processed foods, packaged snacks, and sugary drinks.

---

## 🧠 Mental Health & Relationships

### Your Relationship with Your Partner
- The postpartum period can strain relationships. Sleep deprivation, new responsibilities, and shifting roles all contribute.
- **Communication**: Schedule regular check-ins with your partner — discuss feelings, concerns, and needs openly.
- **Intimacy**: Physical intimacy may still be challenging. Discuss expectations, fears, and desires honestly. Non-sexual physical affection (hugging, holding hands, massage) is important.
- **Shared parenting**: Involve your partner in baby care — bath time, bedtime stories, feeding, playtime.
- **Date time**: Even 30 minutes of uninterrupted couple time after baby sleeps can strengthen your bond.

### Resuming Sexual Activity
- Libido may still be low due to breastfeeding hormones, fatigue, and body image concerns.
- Vaginal dryness is common during breastfeeding — use water-based lubricants.
- Pain during intercourse: If persistent, consult a gynecologist. Pelvic floor physiotherapy can help.
- Contraception: Discuss with your doctor. Options include IUDs, implants, progestin-only pills, and barrier methods.

---

## 📋 Sources

- **WHO**: Recommends continued breastfeeding up to 2 years and beyond (WHO, *Infant and Young Child Feeding*, 2021).
- **ACOG**: Exercise during lactation does not affect milk supply or infant growth (ACOG Committee Opinion No. 804, 2020).
- **AAP**: Developmental milestones for 10-month-olds (AAP, *Caring for Your Baby and Young Child*, 2020).
- **IAP**: IAP guidelines on complementary feeding and developmental surveillance (IAP, 2022).
- **NICE**: Postnatal care up to 8 weeks and beyond (NICE NG194, 2021).
- **UNICEF**: Infant and young child feeding recommendations (UNICEF, 2020).
- **MOHFW**: MAA (Mothers' Absolute Affection) Programme for breastfeeding support and promotion in India.
- **ICMR-NIN**: Dietary guidelines for infants and lactating mothers (ICMR-NIN, 2020).
- **La Leche League International**: Weaning guidance and breastfeeding support.`,
                recoveryNotes: 'At 10.5 months, physical recovery is largely complete. Focus on sustainable weight management — 0.5 kg/week maximum if breastfeeding. C-section scars should be well-healed — massage with vitamin E or coconut oil. Diastasis recti should be minimal (<2 finger-widths). If weaning, do it gradually to avoid engorgement. After weaning, menstruation will regulate and fertility returns. Breasts may change in size and firmness after weaning — this is normal.',
                babyCareNotes: 'Baby is 10.5 months. May say 1-3 words with meaning. Uses gestures: pointing, waving, clapping, blowing kisses. Follows simple commands. Separation anxiety may peak — this indicates healthy attachment. Stranger anxiety is normal. Joint attention develops (follows your gaze). May take first independent steps. Pincer grasp well-developed. 3 meals + 2-3 snacks + 3-4 breastfeeding sessions. Continue avoiding honey, whole nuts, and cow\'s milk as a drink until 1 year.',
                mentalHealthNotes: 'The postpartum period can strain relationships. Schedule regular check-ins with your partner. Physical intimacy may still be challenging — discuss openly. Non-sexual affection is important. Weaning can trigger hormonal mood changes — be gentle with yourself. If you have persistent sadness, anxiety, or mood swings, seek professional help. DMHP and NMHP provide accessible mental health services. Body image concerns are common — focus on health and strength.',
                activityNotes: 'Regular moderate-to-vigorous exercise does not affect breast milk quality or supply. Walking 45-60 minutes daily. Full yoga practice. Strength training with gradual weight progression. Running, swimming, dance, and group fitness are all appropriate. Continue pelvic floor exercises. Baby: Encourage walking with support. Avoid sit-in walkers. Provide safe exploration spaces. 30-60 minutes outdoor time daily.',
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Fatigue, weight changes, or mood swings (possible thyroid disorder)
- Heavy bleeding or return of bleeding after it had stopped
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis, especially during weaning)
- Pain during intercourse that persists
- Chest pain, difficulty breathing, or leg pain/swelling
- Baby: Not sitting without support, not babbling
- Baby: Not responding to name, not using gestures
- Baby: Not bearing weight on legs, not attempting to stand
- Baby: Loss of previously acquired skills
- Baby: Poor weight gain, lethargy, fewer than 6 wet diapers/day
- Baby: Extreme floppiness or stiffness, not cruising or pulling to stand`,
        },
        {
                weekNumber: 43,
                title: 'Self-Feeding & Family Meals',
                summary: 'Your baby is 11 months old — almost a toddler! Self-feeding skills are improving rapidly. Family meals are an important social activity. Focus on establishing healthy eating habits and encouraging independence.',
                bodyMarkdown: `## 🌸 Your Body at Week 43

### Nutrition for the Final Months of Breastfeeding
If you are continuing to breastfeed (as recommended by WHO until 2 years), your nutritional needs remain elevated. If you have weaned, you can transition to a standard healthy diet.

- **Calcium**: 1000 mg/day. Sources: Milk, curd, buttermilk, ragi, sesame seeds, leafy greens, fortified soy milk.
- **Iron**: Continue iron supplementation if you had anemia. Iron-rich foods: Beetroot, spinach, dates, jaggery, legumes, fortified cereals.
- **Protein**: 65-70 g/day for lactating women. Sources: Dal, paneer, eggs, chicken, fish, soy, legumes.
- **Hydration**: 3-4 liters/day. Continue with coconut water, buttermilk, *jeera* water, and *saunf* water.

### Postpartum Health Check at 11 Months
- **Thyroid function**: Postpartum thyroiditis can occur up to 12 months postpartum. If you have unexplained fatigue, weight changes, hair loss, or mood changes, get TSH, T3, and T4 tested.
- **Hemoglobin**: Check for anemia, especially if you are vegetarian or had heavy postpartum bleeding.
- **Vitamin D**: Continue supplementation (1000-2000 IU/day as recommended by ICMR for Indian women). Vitamin D deficiency is common in India despite adequate sunlight.
- **Vitamin B12**: Essential for vegetarians. Consider supplementation if levels are low.
- **Blood sugar**: If you had gestational diabetes, get HbA1c tested to screen for type 2 diabetes (ACOG recommends testing at 4-12 weeks postpartum and then annually).

### Menstrual Cycle
- If you have weaned, your cycles should be regularizing. It may take 2-3 months for cycles to normalize.
- If still breastfeeding, periods may be irregular or absent. This is normal.
- Ovulation can occur before the first period — use contraception if you do not wish to conceive.

---

## 👶 Your Baby at Week 43 (11 Months)

### Self-Feeding Skills
- Uses fingers skillfully to pick up small food pieces.
- May attempt to use a spoon (messy but important for development).
- Holds a cup with both hands and drinks with some spilling.
- Shows food preferences and may reject certain foods.
- Can chew soft foods with gums (even without many teeth).

### Family Meals
- Baby should be eating family foods (mashed or chopped appropriately).
- Include baby at the family table during meals — this encourages social eating and modeling of healthy behaviors.
- Indian family meals: Baby can eat mashed versions of dal-rice, khichdi, sabzi, curd, soft roti pieces, and idli.

### Communication
- Vocabulary: 1-5 words with meaning.
- Understands simple questions: "Where is the ball?" "Where is papa?"
- Follows one-step commands: "Give me the toy," "Come here."
- Uses gestures: Pointing, waving, nodding, shaking head.
- Jabbers with inflection — sounds like real speech.

### Motor Development
- May walk independently (or may not — wide normal range, 9-18 months).
- Stands confidently without support.
- Squats and stands back up.
- Climbs stairs with assistance.
- Stacks blocks (2-3 blocks).
- Puts objects into containers and takes them out.

### Sleep
- 11-12 hours at night + 1-2 naps (totaling 2-3 hours).
- Sleep regression at 11-12 months is common due to developmental milestones, separation anxiety, and teething.
- Tips: Consistent bedtime routine, dark room, white noise, comfort object.

---

## 🥗 Establishing Healthy Eating Habits

### For Baby
- **Family meals**: Eat together whenever possible. Babies learn by watching.
- **Variety**: Offer a wide range of foods. It may take 10-15 exposures before a baby accepts a new food — persistence is key.
- **No pressure**: Never force-feed. Offer food and let baby decide how much to eat.
- **Self-regulation**: Babies are good at regulating their intake. Trust their appetite.
- **Limit distractions**: No screens during meals. Focus on eating and family interaction.
- **Finger foods**: Soft-cooked vegetable sticks, paneer cubes, soft fruit pieces, small pieces of idli or dosa, well-cooked pasta.
- **Allergens**: Continue offering common allergens (egg, peanut, dairy, wheat, fish) if already introduced. Maintaining tolerance requires regular exposure.

### For Mother
- **Balanced diet**: Include all food groups — cereals, pulses, vegetables, fruits, dairy, fats.
- **Meal timing**: 3 main meals + 2-3 snacks. Do not skip meals even if busy with baby.
- **Meal prep**: Prepare simple meals in advance. Dal, rice, and sabzi can be made in bulk and stored.
- **Hydration**: Continue 3-4 liters of water daily.

---

## 🧘‍♀️ Exercise Progression

### For Mother
- **Walking**: 45-60 minutes daily at a brisk pace.
- **Yoga**: Full practice. Focus on core and pelvic floor.
- **Strength training**: 3-4 times per week. Include compound exercises: squats, lunges, push-ups, rows.
- **Cardio**: Running, cycling, swimming, dance, or group fitness classes.
- **Pelvic floor**: Continue maintenance exercises. If you have no symptoms, 3 sets of 10 Kegels, 3 times per week is sufficient.

### For Baby
- Encourage walking with push toys or holding hands.
- Provide safe spaces for crawling, cruising, and walking.
- Avoid sit-in baby walkers.
- Outdoor play: 30-60 minutes daily.

---

## 📋 Sources

- **WHO**: Continued breastfeeding up to 2 years and beyond; Infant and young child feeding recommendations (WHO, 2021).
- **ACOG**: Postpartum care including thyroid screening, diabetes screening after GDM (ACOG Committee Opinion No. 736, 2018).
- **AAP**: Developmental milestones at 11 months; Feeding guidelines for older infants (AAP, 2020).
- **IAP**: IAP guidelines for infant and young child feeding; Developmental surveillance (IAP, 2022).
- **ICMR-NIN**: Dietary guidelines for Indians — lactating women and infants (ICMR-NIN, 2020).
- **NICE**: Postnatal care guidelines (NICE NG194, 2021).
- **UNICEF**: Complementary feeding recommendations; Family meals and responsive feeding (UNICEF, 2020).
- **MOHFW**: MAA Programme for breastfeeding support; Anaemia Mukt Bharat for iron supplementation.
- **La Leche League International**: Breastfeeding and weaning guidance.`,
                recoveryNotes: 'At 11 months, physical recovery is complete for most women. Focus on maintaining health: thyroid function testing (postpartum thyroiditis can occur up to 12 months), hemoglobin check for anemia, vitamin D and B12 levels. If you had GDM, get HbA1c tested. Menstrual cycles should be regularizing if weaned. If breastfeeding, periods may be irregular or absent — this is normal. Ovulation can occur before the first period — use contraception if needed. Continue calcium, iron, and protein-rich diet.',
                babyCareNotes: 'Baby is 11 months. Self-feeds with fingers skillfully. May attempt spoon use. Drinks from cup with both hands. 1-5 words with meaning. Understands simple questions and one-step commands. May walk independently (wide normal range: 9-18 months). Stacks 2-3 blocks. 3 meals + 2-3 snacks + breastfeeding 3-4 times/day. Include baby at family table. Offer variety — it may take 10-15 exposures to accept new foods. Never force-feed. No screens during meals. Continue avoiding honey and whole nuts until 1 year.',
                mentalHealthNotes: 'As you approach the one-year mark, reflect on your postpartum journey. Acknowledge your strength and resilience. If you have experienced mental health challenges, know that seeking help is a sign of strength, not weakness. Relationship with partner: Continue regular communication and shared parenting. Schedule couple time. Body image continues to evolve — focus on health, strength, and gratitude for what your body has accomplished. DMHP and NMHP provide accessible mental health services across India.',
                activityNotes: 'Walking 45-60 minutes daily. Full yoga practice. Strength training 3-4 times/week. Cardio: running, cycling, swimming, dance. Continue pelvic floor maintenance exercises. Baby: Encourage walking with push toys. Avoid sit-in walkers. Provide safe exploration spaces. 30-60 minutes outdoor time daily. Family activities: walks, park visits, simple outings.',
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Unexplained fatigue, weight changes, or mood swings (possible thyroid disorder)
- Heavy bleeding or return of bleeding after it had stopped
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Chest pain, difficulty breathing, or leg pain/swelling
- Severe headache, vision changes, or upper abdominal pain
- Baby: Not sitting without support, not babbling
- Baby: Not responding to name, not using gestures (waving, pointing)
- Baby: Not bearing weight on legs, not attempting to stand
- Baby: Loss of previously acquired skills
- Baby: Poor weight gain, lethargy, fewer than 6 wet diapers/day
- Baby: Extreme floppiness or stiffness, not pulling to stand or cruising
- Baby: Not showing interest in interactive games (peek-a-boo, pat-a-cake)
- Baby: Choking on food — ensure appropriate textures and sizes`,
        },
        {
                weekNumber: 44,
                title: 'Social Development & Building Friendships',
                summary: 'Your baby is 11.5 months old. Social skills are blossoming — baby enjoys playing alongside other children, imitates actions, and shows affection. Focus on social development, language enrichment, and celebrating Indian cultural traditions.',
                bodyMarkdown: `## 🌸 Your Body at Week 44

### Postpartum Body Image at Nearly One Year
At 11.5 months postpartum, your body has undergone a remarkable transformation. Some changes may be permanent, and that is okay.

- **Acceptance**: Research shows that body image dissatisfaction is common in the postpartum period but tends to improve over time. Focus on what your body has achieved rather than how it looks.
- **Stretch marks**: May have faded to silvery-white. They are a normal part of skin stretching during pregnancy and affect 50-90% of pregnant women.
- **Loose skin**: May persist, especially if you had significant weight gain or a large baby. Core strengthening exercises can help improve abdominal tone.
- **C-section scar**: If well-healed, consider scar massage to improve appearance and reduce numbness. Silicone sheets or gels may help with scar appearance.
- **Breast changes**: After breastfeeding, breasts may be smaller or less firm. This is due to changes in fatty tissue and ligaments — completely normal.

### Return to Work Considerations
- The Maternity Benefit Act 2017 in India provides 26 weeks of paid maternity leave. If you are returning to work around this time:
- **Childcare arrangements**: Consider family support, crèche facilities (mandatory in establishments with 50+ employees under the Maternity Benefit Act), or professional childcare.
- **Breastfeeding**: If continuing, express milk and store it. Educate caregivers about proper storage and feeding.
- **Emotional preparation**: Returning to work can bring mixed emotions — guilt, relief, anxiety. All are normal.
- **Practical tips**: Prepare meals and baby items in advance. Share responsibilities with your partner.

---

## 👶 Your Baby at Week 44 (11.5 Months)

### Social Development
- **Parallel play**: Plays alongside other children but not yet with them. This is normal for this age.
- **Imitation**: Copies actions, sounds, and facial expressions of adults and other children.
- **Affection**: Shows affection to familiar people — hugs, kisses, pats.
- **Sharing**: May offer toys or food to others (though will take them back quickly — sharing is a developing skill).
- **Social referencing**: Looks at your face to gauge your reaction in unfamiliar situations.

### Language Development
- Vocabulary: 2-8 words with meaning.
- Understands many more words than they can say.
- Responds to their name consistently.
- Points to body parts when asked ("Where is your nose?").
- Follows simple commands: "Bring the ball," "Give it to mummy."
- Jabbers with conversational intonation.

### Play and Cognitive Development
- **Pretend play**: Begins to emerge — may pretend to drink from a toy cup or talk on a toy phone.
- **Problem-solving**: Figures out how to reach toys, open containers, and manipulate objects.
- **Cause and effect**: Enjoys pushing buttons, flipping switches, and dropping objects.
- **Books**: Enjoys looking at picture books, turning pages, and pointing to familiar objects.
- **Music**: Responds to music — bounces, sways, or claps.

### Indian Cultural Traditions
- **Temple visits**: Many families introduce babies to places of worship around this age. Follow safety precautions — avoid crowded times, keep baby close, and ensure hygiene.
- **Festivals**: Participating in family celebrations (Diwali, Eid, Christmas, Pongal, etc.) enriches baby's cultural experience. Be mindful of noise, crowds, and unfamiliar foods.
- **Traditional practices**: Some families perform *Mundan* (head-shaving ceremony) or *Vidyarambham* (initiation to learning) around this age. These are personal and cultural choices.

---

## 🥗 Nutrition at 11.5 Months

### Preparing for the Transition to Cow's Milk
- At 12 months, you can introduce whole cow's milk as a drink.
- Transition gradually: Mix breast milk/formula with cow's milk, increasing the ratio over 1-2 weeks.
- Use whole (full-fat) milk until age 2 — babies need the fat for brain development.
- Limit milk to 16-24 oz (500-700 ml) per day. Too much milk can displace iron-rich foods and cause anemia.
- Continue breastfeeding as long as mutually desired.

### Sample Daily Menu for an 11.5-Month-Old
- **Morning (7 AM)**: Breastfeed
- **Breakfast (8:30 AM)**: Ragi porridge with mashed banana, or soft idli with ghee and mashed dal
- **Mid-morning snack (10:30 AM)**: Breastfeed or small snack (mashed fruit, yogurt)
- **Lunch (12:30 PM)**: Khichdi with vegetables and ghee, or dal-rice with mashed vegetables, curd
- **Afternoon snack (3:30 PM)**: Breastfeed, or soft fruit, or paneer cubes
- **Dinner (6:30 PM)**: Family meal — mashed roti with dal/sabzi, or soft dosa with potato filling
- **Bedtime (8 PM)**: Breastfeed

---

## 🧠 Mental Health: The One-Year Reflection

### Acknowledging Your Journey
- The first year postpartum is one of the most transformative periods in a woman's life. Take time to reflect on:
- What you have learned about yourself.
- How your relationship with your partner has evolved.
- Your strengths and resilience.
- Challenges you have overcome.
- Consider journaling, talking to other mothers, or creating a memory book for your baby.

### Postpartum Mental Health Check
- If you have experienced depression, anxiety, or other mental health challenges, know that recovery is possible with proper treatment.
- Some women may experience ongoing mental health challenges even at 11+ months. This is not your fault, and help is available.
- Resources in India: DMHP (District Mental Health Programme), NMHP (National Mental Health Programme), iCall (TISS helpline: 022-25521111), AASRA (24x7 helpline: 91-22-27546669).

---

## 📋 Sources

- **WHO**: Infant and young child feeding — continued breastfeeding up to 2 years; Cow's milk introduction after 12 months (WHO, 2021).
- **AAP**: Developmental milestones at 11-12 months; Social development and parallel play (AAP, 2020).
- **IAP**: IAP guidelines for infant feeding and developmental surveillance (IAP, 2022).
- **ACOG**: Postpartum care and body image (ACOG Committee Opinion No. 736, 2018).
- **MOHFW**: Maternity Benefit Act 2017 — 26 weeks paid leave; Crèche facility mandate.
- **NICE**: Postnatal care guidelines (NICE NG194, 2021).
- **ICMR-NIN**: Dietary guidelines for Indians — infants and toddlers (ICMR-NIN, 2020).
- **UNICEF**: Early childhood development — social and emotional development in the first year.
- **La Leche League International**: Breastfeeding beyond one year — benefits and guidance.`,
                recoveryNotes: 'At 11.5 months, physical recovery is complete. Focus on body image acceptance — some changes may be permanent, and that is normal. Stretch marks fade to silvery-white over 12-18 months. C-section scars can be massaged to improve appearance. Breasts may change after weaning — smaller or less firm. If returning to work, the Maternity Benefit Act 2017 provides 26 weeks leave. Arrange childcare — family, crèche (mandatory in 50+ employee establishments), or professional care. Continue expressing milk if breastfeeding.',
                babyCareNotes: 'Baby is 11.5 months. Social development: parallel play, imitation, showing affection, social referencing. Vocabulary: 2-8 words. Understands many words, points to body parts, follows simple commands. Pretend play begins. Enjoys picture books and music. Prepare for cow\'s milk introduction at 12 months — transition gradually. Use whole milk until age 2. Limit to 500-700 ml/day. 3 meals + 2-3 snacks + breastfeeding. Continue avoiding honey and whole nuts. Indian festivals and temple visits enrich cultural experience.',
                mentalHealthNotes: 'The first year postpartum is transformative. Reflect on your journey — what you have learned, your strengths, challenges overcome. If you have experienced mental health challenges, recovery is possible with treatment. Some women have ongoing challenges at 11+ months — this is not your fault. Resources: DMHP, NMHP, iCall (TISS: 022-25521111), AASRA (24x7: 91-22-27546669). Body image acceptance improves over time. Focus on health and strength.',
                activityNotes: 'Walking 45-60 minutes daily. Full yoga practice. Strength training 3-4 times/week. Cardio as desired. Continue pelvic floor maintenance. Baby: Encourage walking and social interaction. Playdates with other children (parallel play). Avoid sit-in walkers. 30-60 minutes outdoor time. Family activities: temple visits, park outings, cultural celebrations. Be mindful of noise, crowds, and unfamiliar foods during festivals.',
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Unexplained fatigue, weight changes, or mood swings (possible thyroid disorder)
- Heavy bleeding or return of bleeding after it had stopped
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Chest pain, difficulty breathing, or leg pain/swelling
- Severe headache, vision changes, or upper abdominal pain
- Baby: Not sitting without support, not babbling
- Baby: Not responding to name, not using gestures (waving, pointing)
- Baby: Not bearing weight on legs, not attempting to stand
- Baby: Loss of previously acquired skills
- Baby: Poor weight gain, lethargy, fewer than 6 wet diapers/day
- Baby: Extreme floppiness or stiffness, not pulling to stand or cruising
- Baby: No interest in social interaction or imitation
- Baby: Not making eye contact or responding to social games`,
        },
        {
                weekNumber: 45,
                title: 'Approaching the First Birthday — Reflections & Celebrations',
                summary: 'Your baby is almost one year old! This is a momentous milestone for both you and your baby. Focus on celebrating achievements, transitioning to toddlerhood, and preparing for the next phase of your parenting journey.',
                bodyMarkdown: `## 🌸 Your Body at Week 45

### One Year Postpartum: A Complete Transformation
You have reached 11.5+ months postpartum — nearly one full year since you gave birth. This is a significant milestone that deserves recognition.

- **Physical recovery**: For most women, physical recovery from pregnancy and childbirth is complete by one year. However, some changes may be permanent, and some women may continue to experience symptoms.
- **Pelvic floor**: If you still experience urinary incontinence, pelvic pain, or pelvic organ prolapse symptoms, seek specialized care from a urogynecologist or pelvic floor physiotherapist. These conditions are treatable.
- **Diastasis recti**: If the gap is still >2 finger-widths, consult a physiotherapist. Surgical repair may be considered after completing childbearing.
- **Menstruation**: If weaned, cycles should be regular. If still breastfeeding, periods may be irregular or absent.

### Health Checkup at One Year
- **Complete blood count (CBC)**: Check for anemia.
- **Thyroid function**: TSH, T3, T4.
- **Vitamin D and B12**: Common deficiencies in Indian women.
- **Blood sugar**: HbA1c if you had GDM.
- **Blood pressure**: If you had hypertensive disorders of pregnancy.
- **Pap smear**: If due for cervical cancer screening (as per national guidelines).
- **Mental health screening**: Discuss your emotional wellbeing with your doctor.

### Planning for Another Pregnancy (If Desired)
- WHO recommends at least 24 months between delivery and next conception.
- Start folic acid supplementation (400-800 mcg/day) at least 3 months before conception.
- Achieve a healthy weight before conceiving.
- Manage any chronic conditions (thyroid, diabetes, hypertension).
- Discuss any previous pregnancy complications with your doctor.

---

## 👶 Your Baby at Week 45 (Nearly 12 Months)

### One-Year Milestones
By their first birthday, most babies can:
- **Motor**: Stand independently. Walk with or without support. Squat and stand. Use pincer grasp. Put objects in containers.
- **Communication**: Say 1-5 words with meaning. Understand simple commands. Use gestures (waving, pointing, clapping). Jabber with inflection.
- **Social**: Show affection to familiar people. Play simple games (peek-a-boo, pat-a-cake). Show stranger anxiety. Imitate actions.
- **Cognitive**: Find hidden objects. Explore objects in different ways. Look at the correct picture when named. Follow simple directions.

### Preparing for the First Birthday
- **Celebration**: Whether a simple family gathering or a larger celebration, the first birthday is about celebrating your baby and your journey as parents.
- **Indian traditions**: Many families perform a *puja* or *havan* for blessings, distribute *prasad*, or host a *Annaprashan* (if not done earlier).
- **Photos and memories**: Document this milestone. Create a photo album or memory book.
- **Safety**: Ensure the celebration environment is safe — no choking hazards, hot food/drinks out of reach, safe sleeping space if traveling.

### Transitioning to Toddlerhood
- **Cow's milk**: At 12 months, you can introduce whole cow's milk as a drink. Transition gradually. Limit to 500-700 ml/day.
- **Bottle weaning**: Start transitioning from bottle to cup. Prolonged bottle use is associated with dental caries, iron deficiency, and obesity.
- **Sleep**: 11-12 hours at night + 1-2 naps. Transition to one nap typically occurs between 12-18 months.
- **Discipline**: Gentle redirection and positive reinforcement. Say "no" sparingly — save it for safety issues.

---

## 🥗 Nutrition at 12 Months

### Transitioning to Family Foods
- Baby can now eat most family foods (chopped or mashed appropriately).
- 3 meals + 2-3 snacks per day.
- Breastfeeding: Continue as desired. WHO recommends continued breastfeeding until 2 years and beyond.
- Whole cow's milk: 500-700 ml/day maximum. Too much milk displaces iron-rich foods.

### Foods Now Allowed at 12 Months
- Honey is now safe (botulism risk significantly decreases after 12 months).
- Whole cow's milk as a drink.
- Egg white (if not already introduced).
- Most family foods, chopped or mashed.

### Foods to Continue with Caution
- Whole nuts, popcorn, whole grapes, hard candy, raw carrots (choking hazards until 4 years).
- Excessive salt, sugar, and processed foods.
- Sugary drinks, juice (limit to 120 ml/day of 100% juice, but whole fruit is preferred).

---

## 🧠 Mental Health: Celebrating One Year

### Your Achievement
- You have navigated pregnancy, childbirth, and nearly one year of motherhood. This is an extraordinary achievement.
- Acknowledge the challenges you have overcome, the skills you have developed, and the love you have given.
- Motherhood is a journey, not a destination. There is no "perfect" mother — you are the perfect mother for your baby.

### Looking Forward
- The toddler years bring new joys and challenges. Your baby will become more independent, verbal, and mobile.
- Continue to prioritize your own health and wellbeing — a healthy mother is the best gift you can give your child.
- Maintain your support network — partner, family, friends, and healthcare providers.
- Remember that asking for help is a sign of strength, not weakness.

### Mental Health Resources
- **DMHP** (District Mental Health Programme): Government mental health services at district level.
- **NMHP** (National Mental Health Programme): National framework for mental health care.
- **iCall** (TISS): 022-25521111 (Monday-Saturday, 8 AM-10 PM).
- **AASRA**: 91-22-27546669 (24x7).
- **Vandrevala Foundation**: 1860-266-2345 (24x7).
- **NIMHANS**: 080-46110007 (24x7).

---

## 📋 Sources

- **WHO**: Birth spacing recommendations — at least 24 months between delivery and next conception; Continued breastfeeding until 2 years and beyond (WHO, 2005, 2021).
- **AAP**: One-year developmental milestones; Cow's milk introduction; Bottle weaning recommendations (AAP, *Caring for Your Baby and Young Child*, 2020; AAP, *Pediatrics*, 2018).
- **IAP**: IAP guidelines for infant and young child feeding; Developmental surveillance at 12 months (IAP, 2022).
- **ACOG**: Postpartum care — one-year health check, interpregnancy care, folic acid supplementation (ACOG Committee Opinion No. 736, 2018; ACOG Committee Opinion No. 762, 2019).
- **MOHFW**: National Health Mission — RMNCH+A (Reproductive, Maternal, Newborn, Child and Adolescent Health) strategy; Anaemia Mukt Bharat.
- **NICE**: Postnatal care guidelines (NICE NG194, 2021).
- **ICMR-NIN**: Dietary guidelines for Indians — toddlers and young children (ICMR-NIN, 2020).
- **UNICEF**: Early childhood development — the first 1000 days (UNICEF, 2020).
- **La Leche League International**: Breastfeeding beyond one year.
- **FOGSI**: Interpregnancy care and preconception counseling guidelines (FOGSI, 2021).`,
                recoveryNotes: 'At nearly one year postpartum, physical recovery is complete for most women. If you still have urinary incontinence, pelvic pain, or prolapse symptoms, seek specialized care — these conditions are treatable. Diastasis recti >2 finger-widths may need physiotherapy. Complete health checkup: CBC, thyroid, vitamin D, B12, HbA1c (if GDM), blood pressure, Pap smear. If planning another pregnancy, WHO recommends 24 months spacing. Start folic acid 400-800 mcg/day 3 months before conception. Achieve healthy weight before conceiving.',
                babyCareNotes: 'Baby is nearly 12 months. Can stand independently, walk with/without support, squat, use pincer grasp. Says 1-5 words. Understands simple commands. Shows affection. Plays peek-a-boo. At 12 months: introduce whole cow\'s milk (500-700 ml/day max). Start bottle weaning — transition to cup. Honey is now safe. Continue breastfeeding as desired. 3 meals + 2-3 snacks. Can eat most family foods. Avoid whole nuts, popcorn, grapes (choking hazards until 4 years). Limit sugary drinks and processed foods.',
                mentalHealthNotes: 'Congratulations on nearly one year of motherhood! You have navigated an extraordinary journey. Acknowledge your achievements, challenges overcome, and the love you have given. There is no "perfect" mother — you are the perfect mother for your baby. The toddler years bring new joys and challenges. Continue prioritizing your health. Maintain your support network. Mental health resources: DMHP, NMHP, iCall (022-25521111), AASRA (91-22-27546669), Vandrevala Foundation (1860-266-2345), NIMHANS (080-46110007).',
                activityNotes: 'All forms of exercise are appropriate — walking, running, yoga, strength training, swimming, dance, sports. Continue pelvic floor maintenance. Baby: Encourage walking and exploration. Avoid sit-in walkers. 30-60 minutes outdoor time. First birthday celebration: ensure safe environment. Family activities: walks, park visits, cultural celebrations, age-appropriate playdates. Begin toddler-appropriate physical activities.',
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Unexplained fatigue, weight changes, or mood swings (possible thyroid disorder)
- Heavy bleeding or return of bleeding after it had stopped
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Urinary incontinence, pelvic pain, or pelvic pressure (possible prolapse)
- Chest pain, difficulty breathing, or leg pain/swelling
- Severe headache, vision changes, or upper abdominal pain
- Baby: Not sitting without support, not babbling
- Baby: Not responding to name, not using gestures (waving, pointing)
- Baby: Not bearing weight on legs, not attempting to stand
- Baby: Loss of previously acquired skills
- Baby: Poor weight gain, lethargy, fewer than 6 wet diapers/day
- Baby: Extreme floppiness or stiffness, not pulling to stand or cruising
- Baby: No interest in social interaction, imitation, or interactive games
- Baby: Not making eye contact or responding to social engagement
- Baby: No words by 12 months — discuss with pediatrician`,
        },
        {
                weekNumber: 46,
                title: 'The First Birthday Celebration & Toddlerhood Begins',
                summary: 'Happy first birthday! Your baby is now a toddler. This week marks the transition from infancy to toddlerhood. Focus on celebrating this milestone, reflecting on your journey, and preparing for the exciting toddler years ahead.',
                bodyMarkdown: `## 🌸 Your Body at Week 46

### One Year Postpartum: You Did It!
Congratulations! You have reached the one-year postpartum milestone. This is a tremendous achievement that deserves celebration.

- **Physical recovery**: For the vast majority of women, physical recovery from pregnancy and childbirth is complete by one year. Your body has undergone an extraordinary transformation and has largely returned to its non-pregnant state.
- **Hormonal balance**: If you have weaned, your hormones should be fully normalized. Menstrual cycles should be regular. If still breastfeeding, hormonal changes continue.
- **Fertility**: If you have weaned, fertility has returned to normal. If still breastfeeding, you may ovulate even without menstruation — use contraception if you do not wish to conceive.

### One-Year Health Checkup
- **Complete physical examination**: Blood pressure, weight, BMI.
- **Blood tests**: CBC, thyroid function (TSH, T3, T4), vitamin D, vitamin B12, blood sugar (HbA1c if GDM history).
- **Pelvic examination**: Check for uterine involution, cervical health (Pap smear if due), pelvic floor assessment.
- **Mental health screening**: Discuss your emotional wellbeing with your doctor. Postpartum depression screening is recommended at the one-year visit.
- **Contraception counseling**: Discuss family planning and spacing. WHO recommends at least 24 months between delivery and next conception.

### Planning for the Future
- If you desire another child, start folic acid supplementation (400-800 mcg/day) at least 3 months before conception.
- Maintain a healthy weight, balanced diet, and regular exercise.
- Manage any chronic conditions (thyroid, diabetes, hypertension).
- Discuss any previous pregnancy or birth complications with your doctor to plan for a safer subsequent pregnancy.

---

## 👶 Your Baby at Week 46 (12 Months — 1 Year Old!)

### Happy First Birthday!
Your baby is now officially a toddler. The first birthday is a celebration of your baby's growth and development, and of your incredible journey as parents.

### One-Year Developmental Milestones
By 12 months, most babies can:
- **Motor**: Stand independently. Walk holding furniture or independently. May take first independent steps. Squat and stand. Use pincer grasp. Bang two objects together. Put objects in and out of containers.
- **Communication**: Say 1-5 words with meaning (beyond "mama"/"dada"). Use simple gestures (waving, pointing, shaking head). Try to imitate words. Respond to simple requests.
- **Cognitive**: Find hidden objects easily. Explore objects in different ways (shaking, banging, throwing). Look at correct picture when named. Follow simple directions. Use objects correctly (drinks from cup, brushes hair).
- **Social-Emotional**: Show affection to familiar people. Play simple games (peek-a-boo, pat-a-cake). Have favorite things and people. Show fear in some situations. Cry when parent leaves. Hand you a book when wants to hear a story.

### First Birthday Celebration Tips
- Keep it simple — your baby will not remember elaborate decorations or expensive venues.
- Schedule around nap times to avoid an overtired baby.
- Safe foods: Avoid choking hazards (whole nuts, grapes, popcorn, hard candy).
- Cake: A small "smash cake" for baby photos is a fun tradition. Use a simple, low-sugar recipe.
- Photos: Capture the moment but also put the camera down and be present.
- Indian traditions: Many families perform a *puja*, distribute *prasad*, or host a simple gathering with close family.

### Health Check at 12 Months
- **Well-baby visit**: Weight, length, head circumference plotted on growth charts.
- **Immunizations**: As per IAP/Universal Immunization Programme (UIP) schedule — check if any are due.
- **Hemoglobin**: Screen for iron-deficiency anemia (common in Indian infants, especially if exclusively breastfed beyond 6 months without adequate iron-rich complementary foods).
- **Developmental screening**: Pediatrician will assess milestones and address any concerns.

---

## 🥗 Nutrition at 12 Months: The Toddler Diet

### Transitioning to Family Foods
- Baby can now eat most family foods, chopped or mashed appropriately.
- 3 meals + 2-3 snacks per day.
- Breastfeeding: Continue as desired. WHO recommends continued breastfeeding until 2 years and beyond.
- Whole cow's milk: Can now be introduced as a drink. Limit to 500-700 ml/day. Too much milk displaces iron-rich foods and increases anemia risk.

### Foods Now Safe
- Honey (botulism risk significantly decreases after 12 months).
- Whole cow's milk as a drink.
- Egg white (if not already introduced).
- Most family foods, appropriately prepared.

### Foods to Continue Avoiding
- Whole nuts, popcorn, whole grapes, hard candy, raw carrot rounds (choking hazards until 4 years).
- Excessive salt, sugar, and processed foods.
- Sugary drinks, juice (limit to 120 ml/day of 100% juice, whole fruit is preferred).
- Cow's milk should not exceed 700 ml/day.

### Indian Toddler Meal Ideas
- **Breakfast**: Ragi porridge, suji halwa, soft idli with ghee, paneer paratha (soft), mashed upma, egg bhurji.
- **Lunch/Dinner**: Khichdi with vegetables, dal-rice with mashed vegetables, curd rice, soft roti with dal, veg pulao (mashed).
- **Snacks**: Mashed banana, stewed apple, soft paneer cubes, yogurt, mashed chikoo/papaya, soft dhokla.

---

## 🧠 Mental Health: One Year of Motherhood

### Reflecting on Your Journey
- You have navigated pregnancy, childbirth, and one full year of motherhood. This is an extraordinary achievement.
- Acknowledge: The challenges you have overcome, the skills you have developed, the love you have given, and the person you have become.
- It is normal to feel a mix of emotions at this milestone — pride, nostalgia, relief, exhaustion, joy, and even grief for the newborn phase that has passed.

### Looking Forward to Toddlerhood
- The toddler years (1-3 years) bring new joys and challenges:
  - Your child will become more independent, verbal, and mobile.
  - Tantrums, boundary-testing, and big emotions are normal parts of development.
  - Continue to provide a safe, loving, and stimulating environment.
- Parenting evolves — you will continue to learn and grow alongside your child.

### Self-Care Reminders
- Prioritize your own health — physical and mental.
- Maintain your support network — partner, family, friends, healthcare providers.
- Schedule regular "me time" — even 30 minutes daily.
- Continue or resume hobbies and interests that bring you joy.
- Remember: A healthy, happy mother is the best gift you can give your child.

---

## 📋 Sources

- **WHO**: Infant and young child feeding — continued breastfeeding until 2 years; Birth spacing recommendations (WHO, 2021, 2005).
- **AAP**: 12-month developmental milestones; Well-child visit schedule; Nutrition for toddlers (AAP, *Caring for Your Baby and Young Child*, 2020; AAP, *Bright Futures*, 2022).
- **IAP**: IAP immunization schedule; Developmental surveillance at 12 months; Infant and young child feeding guidelines (IAP, 2022).
- **ACOG**: Postpartum care — one-year visit, interpregnancy care, folic acid supplementation (ACOG Committee Opinion No. 736, 2018; ACOG Committee Opinion No. 762, 2019).
- **MOHFW**: Universal Immunization Programme (UIP); RMNCH+A strategy; Anaemia Mukt Bharat.
- **NICE**: Postnatal care guidelines (NICE NG194, 2021).
- **ICMR-NIN**: Dietary guidelines for Indians — toddlers (ICMR-NIN, 2020).
- **UNICEF**: The first 1000 days; Early childhood development.
- **FOGSI**: Interpregnancy care and preconception counseling (FOGSI, 2021).
- **La Leche League International**: Breastfeeding beyond one year.`,
                recoveryNotes: 'Congratulations — one year postpartum! Physical recovery is complete for the vast majority of women. Hormones normalized if weaned. Fertility has returned. One-year health checkup: complete physical exam, CBC, thyroid, vitamin D, B12, HbA1c (if GDM), pelvic exam, Pap smear if due, mental health screening. If planning another pregnancy, WHO recommends 24 months spacing. Start folic acid 400-800 mcg/day 3 months before conception. Achieve healthy weight. Manage chronic conditions. Contraception counseling.',
                babyCareNotes: 'Happy first birthday! Baby is now a toddler. Can stand independently, walk with/without support. Says 1-5 words. Uses gestures. Shows affection. Plays peek-a-boo. First birthday: keep it simple, schedule around naps, avoid choking hazards. 12-month well-baby visit: weight, length, head circumference, hemoglobin, developmental screening, immunizations as per IAP/UIP. Introduce whole cow\'s milk (500-700 ml/day max). Honey now safe. 3 meals + 2-3 snacks + breastfeeding as desired. Most family foods, chopped/mashed. Continue avoiding whole nuts, grapes, popcorn.',
                mentalHealthNotes: 'One year of motherhood — an extraordinary achievement. Reflect on your journey: challenges overcome, skills developed, love given. It\'s normal to feel mixed emotions: pride, nostalgia, relief, joy, even grief for the newborn phase. The toddler years bring new joys and challenges. Prioritize your health. Maintain your support network. Schedule "me time." Resume hobbies. A healthy, happy mother is the best gift for your child. Mental health resources: DMHP, NMHP, iCall (022-25521111), AASRA (91-22-27546669), NIMHANS (080-46110007).',
                activityNotes: 'All forms of exercise are appropriate — walking, running, yoga, strength training, swimming, dance, sports. Continue pelvic floor maintenance. Baby: Encourage walking and exploration. Avoid sit-in walkers. 30-60 minutes outdoor time. First birthday: ensure safe environment. Toddler-appropriate activities: push toys, stacking blocks, picture books, music and movement, simple ball games. Family activities: park visits, temple visits, cultural celebrations, simple outings.',
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Unexplained fatigue, weight changes, or mood swings (possible thyroid disorder)
- Heavy bleeding or return of bleeding after it had stopped
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Urinary incontinence, pelvic pain, or pelvic pressure (possible prolapse)
- Chest pain, difficulty breathing, or leg pain/swelling
- Baby: Not standing with support, not sitting without support
- Baby: Not babbling, not using gestures (waving, pointing)
- Baby: Not responding to name
- Baby: Loss of previously acquired skills
- Baby: Poor weight gain, lethargy, fewer than 6 wet diapers/day
- Baby: Extreme floppiness or stiffness
- Baby: No interest in social interaction or interactive games
- Baby: No words by 12 months — discuss with pediatrician
- Baby: Not making eye contact or responding to social engagement`,
        },
        {
                weekNumber: 47,
                title: 'Early Toddlerhood — Walking, Talking & Independence',
                summary: 'Your 12.5-month-old toddler is exploring the world with newfound mobility and curiosity. Language development is accelerating. Focus on encouraging safe exploration, language enrichment, and gentle discipline.',
                bodyMarkdown: `## 🌸 Your Body at Week 47

### Post-Breastfeeding Body
If you have weaned completely, your body has undergone hormonal shifts:
- **Prolactin levels** have dropped to pre-pregnancy levels.
- **Estrogen and progesterone** have normalized.
- **Menstrual cycles** should be regular (may take 2-3 cycles to normalize).
- **Breasts** may feel softer, smaller, or less firm. This is normal — the glandular tissue that produced milk has shrunk, and fatty tissue may not have fully replaced it yet.
- **Libido** may fluctuate after weaning as hormones adjust.

### If Still Breastfeeding
- Continued breastfeeding beyond one year is recommended by WHO, IAP, and UNICEF.
- Benefits: Continued nutrition, immune protection, comfort, and bonding.
- Breastfeeding frequency typically decreases to 2-4 times per day (morning, nap time, bedtime, and comfort feeds).
- Your nutritional needs remain elevated. Continue with a nutrient-dense diet and adequate hydration.

### Exercise and Fitness
- You can now engage in all forms of exercise without restriction.
- High-impact activities (running, jumping, HIIT) are appropriate if you have no pelvic floor symptoms.
- Core work: Advance to full planks, crunches (if diastasis recti is resolved), and rotational exercises.
- Pelvic floor: Continue maintenance exercises.

---

## 👶 Your Baby at Week 47 (12.5 Months)

### Walking
- Most babies take their first independent steps between 9-17 months. The average is 12-13 months.
- If your baby is not yet walking independently, they likely will very soon. Cruising and standing are the immediate precursors.
- Encourage walking by holding hands, using push toys. Avoid sit-in baby walkers.
- Once walking, baby will be into everything — childproofing is essential!

### Language Development
- Vocabulary: 3-10 words with meaning.
- Understands 50+ words.
- Points to body parts when named.
- Follows simple one-step commands.
- Uses gestures communicatively (waving, pointing, nodding, shaking head).
- Jabbers with conversational intonation — sounds like real speech.
- May use one word to mean many things (e.g., "dudu" for milk, water, or any drink).

### Social-Emotional Development
- **Separation anxiety**: May still be strong. This is a sign of healthy attachment. Goodbye rituals help.
- **Stranger anxiety**: May persist. Allow toddler to warm up at their own pace.
- **Social referencing**: Looks at you to gauge reactions in new situations.
- **Empathy begins**: May show concern when someone is upset.
- **Favorite objects**: May have a comfort object (blanket, stuffed toy).

### Cognitive Development
- **Cause and effect**: Understands that actions have consequences.
- **Object permanence**: Fully developed — knows objects exist even when out of sight.
- **Imitation**: Copies actions, sounds, and facial expressions.
- **Problem-solving**: Experiments with objects to achieve goals.
- **Memory**: Recognizes familiar people, places, and routines.

---

## 🥗 Toddler Nutrition

### Key Principles
- **Variety**: Offer a wide range of foods from all food groups.
- **Family meals**: Eat together as a family whenever possible.
- **Responsive feeding**: Offer healthy foods and let toddler decide how much to eat. Never force-feed.
- **Iron-rich foods**: Continue to prioritize iron — toddlerhood is a high-risk period for iron deficiency anemia.
- **Limit milk**: 500-700 ml/day maximum. Too much milk displaces iron-rich foods.

### Indian Toddler Meal Plan
- **Breakfast (8 AM)**: Ragi porridge / suji upma / soft idli with ghee / egg bhurji / paneer paratha / vegetable uttapam.
- **Morning snack (10:30 AM)**: Fruit (mashed banana, stewed apple, papaya) / yogurt / small paneer cubes.
- **Lunch (12:30 PM)**: Khichdi with vegetables and ghee / dal-rice with mashed vegetables / curd rice / soft roti with dal.
- **Afternoon snack (3:30 PM)**: Breastfeed or milk / fruit / steamed vegetable sticks / soft dhokla.
- **Dinner (6:30 PM)**: Family meal — mashed sabzi-roti / vegetable pulao / dalia / soft dosa.
- **Bedtime (8 PM)**: Breastfeed or milk.

### Dealing with Picky Eating
- Picky eating often emerges in toddlerhood. It is a normal developmental phase.
- Strategies:
  - Offer new foods alongside familiar favorites.
  - It may take 10-15 exposures before a food is accepted.
  - Eat together — toddlers are more likely to try foods they see parents eating.
  - Avoid pressure, bribes, or punishment around food.
  - Keep meal times positive and relaxed.
  - Limit snacks and milk close to meal times.

---

## 🧠 Parenting the Early Toddler

### Gentle Discipline
- **Redirection**: Distract and redirect to appropriate activities.
- **Positive reinforcement**: Praise desired behaviors.
- **Modeling**: Toddlers learn by watching. Model the behavior you want to see.
- **Consistency**: Set consistent, age-appropriate limits.
- **Say "no" sparingly**: Save it for safety issues. Instead, redirect ("Let's play with this instead").
- **Avoid physical punishment**: Research consistently shows that physical punishment is harmful and ineffective (AAP, 2018). Positive discipline strategies are more effective and support healthy development.

### Encouraging Language Development
- **Talk, talk, talk**: Narrate your daily activities. Describe what you are doing, seeing, and feeling.
- **Read together**: Daily reading is one of the most powerful ways to support language development. Choose board books with bright pictures.
- **Sing songs**: Nursery rhymes, *loris*, and simple songs with actions.
- **Name objects**: Label everything in your toddler's environment.
- **Expand on their words**: If toddler says "dog," respond with "Yes, that's a big brown dog!"
- **Ask questions**: "Where is the ball?" "What does the cow say?"
- **Limit screen time**: AAP recommends no screen time for children under 18 months (except video chatting).

---

## 📋 Sources

- **WHO**: Continued breastfeeding up to 2 years and beyond; Infant and young child feeding (WHO, 2021).
- **AAP**: 12-month developmental milestones; Discipline strategies — effective discipline for young children (AAP, *Pediatrics*, 2018); Screen time recommendations (AAP, 2016).
- **IAP**: IAP guidelines for infant and young child feeding; Developmental surveillance (IAP, 2022).
- **ACOG**: Postpartum care and exercise recommendations (ACOG Committee Opinion No. 804, 2020).
- **NICE**: Postnatal care guidelines (NICE NG194, 2021).
- **ICMR-NIN**: Dietary guidelines for Indians — toddlers (ICMR-NIN, 2020).
- **UNICEF**: Early childhood development; Responsive feeding and positive discipline.
- **MOHFW**: MAA Programme for breastfeeding support; Anaemia Mukt Bharat.
- **La Leche League International**: Breastfeeding beyond one year — benefits, frequency, and weaning guidance.`,
                recoveryNotes: 'At 12.5 months, physical recovery is complete. If weaned: hormones normalized, menstrual cycles regular, breasts may feel softer/smaller (normal). Libido may fluctuate after weaning. If still breastfeeding: WHO/IAP/UNICEF recommend continuing until 2 years. Frequency typically 2-4 times/day. Nutritional needs remain elevated. All forms of exercise are appropriate. High-impact activities OK if no pelvic floor symptoms. Continue core work and pelvic floor maintenance. One-year health checkup should be completed.',
                babyCareNotes: 'Baby is 12.5 months. Most take first independent steps between 9-17 months (average 12-13 months). If not walking yet, likely soon. Vocabulary: 3-10 words. Understands 50+ words. Points to body parts. Follows simple commands. Separation anxiety may persist — healthy attachment. Stranger anxiety may persist. Empathy begins. 3 meals + 2-3 snacks + breastfeeding 2-4 times/day. Whole milk 500-700 ml/day max. Picky eating may emerge — normal phase. Offer variety, avoid pressure. No screen time under 18 months (AAP).',
                mentalHealthNotes: 'Parenting a toddler brings new joys and challenges. Gentle discipline: redirection, positive reinforcement, modeling, consistency. Avoid physical punishment — research shows it is harmful and ineffective. Language development: talk, read, sing, name objects, expand on words. Daily reading is powerful for language and bonding. Limit screen time. If you feel overwhelmed by toddler behaviors, this is normal — seek support from partner, family, or parenting groups. Maintain self-care routines. Mental health resources remain available.',
                activityNotes: 'All forms of exercise unrestricted. Walking, running, yoga, strength training, HIIT, swimming, sports. Continue pelvic floor maintenance. Baby: Encourage walking. Avoid sit-in walkers. Childproofing essential once walking. 30-60 minutes outdoor time. Toddler activities: push toys, stacking blocks, shape sorters, board books, music and movement, simple ball games, water play (supervised), sand play. Family activities: park visits, walks, temple visits, simple outings.',
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Unexplained fatigue, weight changes, or mood swings (possible thyroid disorder)
- Heavy bleeding or return of bleeding after it had stopped
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever (mastitis)
- Urinary incontinence, pelvic pain, or pelvic pressure
- Chest pain, difficulty breathing, or leg pain/swelling
- Baby: Not standing with support, not sitting without support
- Baby: Not babbling, not using gestures (waving, pointing)
- Baby: Not responding to name
- Baby: Loss of previously acquired skills
- Baby: Poor weight gain, lethargy, fewer than 6 wet diapers/day
- Baby: Extreme floppiness or stiffness
- Baby: No interest in social interaction or interactive games
- Baby: No words by 15 months — discuss with pediatrician
- Baby: Not walking by 18 months — discuss with pediatrician`,
        },
        {
                weekNumber: 48,
                title: 'Toddler Sleep Patterns & Consistent Routines',
                summary: 'Your 13-month-old toddler is settling into more predictable routines. Sleep patterns evolve, language blossoms, and personality shines. Focus on establishing consistent routines and supporting your toddler\'s growing independence.',
                bodyMarkdown: `## 🌸 Your Body at Week 48

### Long-Term Postpartum Health
At 13 months postpartum, your focus shifts from "recovery" to long-term health maintenance:

- **Weight management**: If you have not returned to your pre-pregnancy weight, focus on sustainable, healthy weight loss. Aim for 0.5-1 kg per week through balanced diet and regular exercise.
- **Nutrition**: Continue with a balanced diet rich in protein, calcium, iron, fiber, and healthy fats. If breastfeeding, nutritional needs remain elevated.
- **Exercise**: 150 minutes of moderate-intensity aerobic activity per week (as recommended by WHO for all adults), plus strength training twice weekly.
- **Sleep**: Prioritize 7-9 hours of sleep per night. Sleep deprivation accumulates over time and affects physical and mental health.

### Health Check Follow-Up
- If any abnormalities were found at the one-year checkup, follow up as recommended.
- **Thyroid**: If postpartum thyroiditis was diagnosed, follow-up TSH testing is important — some women develop permanent hypothyroidism.
- **Anemia**: If iron-deficiency anemia was diagnosed, continue iron supplementation and follow-up CBC.
- **Vitamin D**: Continue supplementation (1000-2000 IU/day as per ICMR recommendations for Indian women).
- **Chronic conditions**: Continue management of any conditions (thyroid, diabetes, hypertension).

### Body Image and Self-Care
- Your body has done something extraordinary. Focus on health, strength, and function rather than appearance.
- Invest in well-fitting clothes that make you feel good about your current body — not the body you had before pregnancy.
- Self-care is not selfish — it is essential for your wellbeing and your ability to care for your family.

---

## 👶 Your Baby at Week 48 (13 Months)

### Sleep Patterns
- **Night sleep**: 11-12 hours.
- **Naps**: Typically 1-2 naps (totaling 2-3 hours). The transition from 2 naps to 1 nap usually occurs between 12-18 months.
- **Signs your toddler is ready for one nap**: Resisting the morning nap, taking a long time to fall asleep for naps, the afternoon nap becoming shorter/later, or bedtime becoming difficult.
- **Sleep regressions**: Can occur at any age due to developmental leaps, teething, illness, or travel. Maintain consistent routines.

### Establishing Consistent Routines
- **Bedtime routine**: Bath, brush teeth, pajamas, story, cuddle, bed. Keep it consistent and calming.
- **Morning routine**: Wake up, diaper change, breakfast, play. Predictability helps toddlers feel secure.
- **Meal routines**: Eat at roughly the same times each day. Family meals are important.
- **Consistency**: Toddlers thrive on predictability. Consistent routines reduce anxiety and challenging behaviors.

### Language Development
- Vocabulary: 5-15 words (wide variation is normal).
- Understands simple questions and commands.
- Points to body parts, familiar objects, and people when named.
- Uses gestures communicatively.
- May begin to use words to express needs ("milk," "up," "more").
- Jabbers with complex intonation patterns.

### Motor Development
- Walking: Most 13-month-olds walk independently or are very close to it.
- Can stoop to pick up objects and return to standing.
- Climbs onto furniture.
- Uses hands skillfully: stacks blocks, turns pages, scribbles with a crayon.
- Self-feeding: Uses fingers well, may use a spoon (messy but improving).

---

## 🥗 Nutrition for 13-Month-Old

### Meal Pattern
- 3 meals + 2-3 snacks per day.
- Breastfeeding: 2-4 times per day (if continuing).
- Whole milk: 500-700 ml/day maximum.
- Water: Offer water with meals and throughout the day.

### Key Nutrients
- **Iron**: Essential for brain development. Sources: Fortified cereals, legumes, spinach, beetroot, egg yolk, meat, chicken liver (small amounts). Combine with vitamin C for better absorption.
- **Calcium**: For bone development. Sources: Milk, curd, paneer, ragi, sesame seeds, leafy greens.
- **Vitamin D**: Supplementation recommended (400 IU/day for toddlers as per IAP).
- **Protein**: For growth and development. Sources: Dal, legumes, paneer, eggs, chicken, fish, soy.
- **Healthy fats**: Essential for brain development. Sources: Ghee (in moderation), nuts (in paste/butter form), seeds, coconut, avocado.

### Indian Toddler Meal Ideas
- **Breakfast**: Ragi porridge with jaggery, suji upma with vegetables, moong dal chilla, vegetable uttapam, soft idli with ghee and podi, egg bhurji with soft bread.
- **Lunch/Dinner**: Dal-rice with ghee and mashed vegetables, khichdi, curd rice, soft roti with dal, vegetable pulao, palak paneer with rice.
- **Snacks**: Mashed fruit, yogurt, steamed vegetable sticks, soft paneer cubes, murmura (puffed rice) with roasted chana, soft dhokla.

---

## 🧠 Parenting Tips for 13 Months

### Encouraging Independence
- Allow your toddler to try things independently (within safe limits).
- Offer choices: "Do you want the red cup or the blue cup?" (limit to 2 choices).
- Let them self-feed, even if messy.
- Allow them to help with simple tasks (putting toys away, wiping their tray).
- Praise effort, not just achievement.

### Dealing with Tantrums
- Tantrums are normal at this age. Toddlers have big feelings but limited language to express them.
- Strategies:
  - Stay calm. Your calm presence helps your toddler regulate.
  - Acknowledge feelings: "I see you are angry because you can't have the toy."
  - Distract and redirect.
  - Ensure basic needs are met (hunger, tiredness, overstimulation often trigger tantrums).
  - Do not give in to unreasonable demands — this reinforces tantrums.
  - Time-in (staying close and supportive) is more effective than time-out for young toddlers.

### Safety
- **Childproofing**: Once walking, toddler can reach more. Secure furniture to walls, cover electrical outlets, lock cabinets, use safety gates.
- **Supervision**: Constant supervision is needed — toddlers have no concept of danger.
- **Car safety**: Continue using a rear-facing car seat until at least age 2 (AAP recommendation).
- **Water safety**: Never leave toddler unattended near water — even a few centimeters of water can be dangerous.

---

## 📋 Sources

- **WHO**: Physical activity recommendations for adults — 150 minutes moderate-intensity per week (WHO, 2020).
- **AAP**: Sleep guidelines for toddlers; Car seat safety — rear-facing until age 2 (AAP, *Pediatrics*, 2018); Positive discipline strategies.
- **IAP**: IAP guidelines for infant and young child feeding; Vitamin D supplementation (400 IU/day for infants and toddlers) (IAP, 2022).
- **ICMR-NIN**: Dietary guidelines for Indians — toddlers (ICMR-NIN, 2020).
- **NICE**: Postnatal care guidelines (NICE NG194, 2021).
- **UNICEF**: Early childhood development — sleep, routines, and positive discipline.
- **MOHFW**: RMNCH+A strategy; Anaemia Mukt Bharat.
- **La Leche League International**: Breastfeeding beyond one year.
- **ACOG**: Long-term postpartum health and wellness (ACOG Committee Opinion No. 736, 2018).`,
                recoveryNotes: 'At 13 months, focus shifts from recovery to long-term health maintenance. Sustainable weight management: 0.5-1 kg/week. 150 minutes moderate-intensity aerobic activity/week + strength training twice weekly. 7-9 hours sleep per night. Follow up on any abnormalities from one-year checkup. If postpartum thyroiditis diagnosed, monitor TSH — some women develop permanent hypothyroidism. Continue iron supplementation if anemic. Continue vitamin D 1000-2000 IU/day. Invest in well-fitting clothes that make you feel good. Self-care is essential, not selfish.',
                babyCareNotes: 'Baby is 13 months. Sleep: 11-12 hours at night + 1-2 naps. Transition from 2 naps to 1 typically occurs 12-18 months. Establish consistent routines: bedtime, morning, meals. Vocabulary: 5-15 words. Most walk independently. Stacks blocks, scribbles, self-feeds. 3 meals + 2-3 snacks + breastfeeding 2-4 times/day. Whole milk 500-700 ml/day. Iron-rich foods essential. Vitamin D 400 IU/day. Childproofing critical once walking. Rear-facing car seat until age 2. Constant supervision needed.',
                mentalHealthNotes: 'Parenting a toddler requires patience and consistency. Tantrums are normal — toddlers have big feelings with limited language. Stay calm, acknowledge feelings, distract, redirect. Ensure basic needs met. Do not give in to unreasonable demands. Time-in is more effective than time-out. Encourage independence: offer choices, allow self-feeding, praise effort. Maintain self-care: 7-9 hours sleep, exercise, "me time." If you feel overwhelmed, seek support. Mental health resources: DMHP, NMHP, iCall, AASRA, NIMHANS.',
                activityNotes: '150 minutes moderate-intensity aerobic activity/week (walking, running, cycling, swimming, dance). Strength training twice weekly. Yoga, pilates, HIIT. Continue pelvic floor maintenance. Baby: Encourage walking and exploration. 30-60 minutes outdoor time. Toddler activities: push/pull toys, stacking, shape sorters, board books, music, water play, simple playground visits. Childproof home. Rear-facing car seat. Family activities: park visits, walks, simple outings.',
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Unexplained fatigue, weight changes, or mood swings
- Heavy bleeding or return of bleeding after it had stopped
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever
- Urinary incontinence, pelvic pain, or pelvic pressure
- Chest pain, difficulty breathing, or leg pain/swelling
- Baby: Not standing with support, not sitting without support
- Baby: Not babbling, not using gestures
- Baby: Not responding to name
- Baby: Loss of previously acquired skills
- Baby: Poor weight gain, lethargy, fewer than 6 wet diapers/day
- Baby: Extreme floppiness or stiffness
- Baby: No interest in social interaction
- Baby: No words by 15 months — discuss with pediatrician
- Baby: Not walking by 18 months — discuss with pediatrician`,
        },
        {
                weekNumber: 49,
                title: 'Language Explosion & Social Skills',
                summary: 'Your 13.5-month-old toddler is experiencing a language explosion — understanding and using more words every day. Social skills are blossoming. Focus on language enrichment, social opportunities, and positive parenting.',
                bodyMarkdown: `## 🌸 Your Body at Week 49

### Long-Term Wellness
At 13.5 months postpartum, your health priorities shift from postpartum recovery to general wellness:

- **Regular health checkups**: Annual physical examination, dental checkup (every 6 months), eye examination (every 1-2 years), and gynecological checkup (Pap smear as per guidelines).
- **Nutrition**: Continue balanced diet. If breastfeeding, maintain elevated nutritional intake. If weaned, transition to standard healthy diet.
- **Exercise**: Maintain 150 minutes of moderate-intensity aerobic activity per week.
- **Sleep**: Prioritize 7-9 hours of quality sleep.
- **Stress management**: Practice mindfulness, meditation, yoga, or other stress-reduction techniques.

### Menstrual Health
- Cycles should be regular by now. If cycles are irregular, painful, or heavy, consult a gynecologist.
- Premenstrual symptoms (PMS) may have returned. Lifestyle modifications (exercise, stress reduction, dietary changes) can help.
- If you are using hormonal contraception, discuss any side effects with your doctor.

### Family Planning
- If you desire another child, ensure at least 24 months spacing from delivery (WHO recommendation).
- Preconception health: Folic acid supplementation, healthy weight, management of chronic conditions, up-to-date vaccinations (rubella, hepatitis B).
- If you do not wish to conceive, ensure reliable contraception. Long-acting reversible contraceptives (LARC) like IUDs and implants are highly effective and convenient.

---

## 👶 Your Baby at Week 49 (13.5 Months)

### Language Explosion
- Vocabulary: 5-20 words (wide variation is normal — some toddlers say fewer words, some say many more).
- Understanding (receptive language) far exceeds expressive language. Your toddler understands hundreds of words.
- Follows simple two-step commands: "Pick up the ball and give it to mummy."
- Points to multiple body parts when named.
- Points to familiar objects in books when named.
- Uses words to express needs: "milk," "up," "more," "no," "go."
- May begin combining gestures with words (pointing + "that").
- Imitates new words and sounds.

### Social Skills
- Enjoys watching and imitating other children.
- Plays simple interactive games (peek-a-boo, chase, rolling a ball back and forth).
- Shows affection spontaneously (hugs, kisses, pats).
- May show preference for certain people.
- Begins to show empathy — may look concerned when someone is upset.
- May bring you toys to show or share.
- Enjoys an audience — repeats actions that get a reaction.

### Cognitive Development
- **Problem-solving**: Experiments with objects to achieve goals. Tries different approaches.
- **Cause and effect**: Understands that actions have consequences. Enjoys toys with buttons, switches, and levers.
- **Symbolic play**: Pretend play emerges — may pretend to feed a doll, talk on a toy phone, or stir a pot.
- **Memory**: Recognizes familiar people, places, routines, and songs.
- **Categorization**: Begins to group similar objects (puts all blocks together, all cars together).

### Motor Skills
- Walks independently (most 13.5-month-olds walk).
- May begin to run (clumsily).
- Climbs onto furniture and may attempt to climb stairs.
- Squats to pick up objects and stands.
- Throws a ball (underhand).
- Scribbles with a crayon.
- Turns pages of a board book.
- Self-feeds with fingers and may use a spoon with some success.

---

## 🥗 Nutrition & Feeding

### Self-Feeding
- Encourage self-feeding — it supports fine motor development, independence, and healthy eating habits.
- Provide child-sized utensils, plates, and cups.
- Expect mess — it is part of the learning process.
- Offer a variety of textures and colors.

### Dealing with Food Refusal
- Food refusal is common in toddlerhood. It is usually a phase, not a sign of a problem.
- Strategies:
  - Keep offering refused foods without pressure.
  - Serve one preferred food alongside new or less-preferred foods.
  - Eat together — toddlers are more likely to eat foods they see parents eating.
  - Avoid short-order cooking (preparing separate meals for toddler).
  - Trust your toddler's appetite — they will eat when hungry.
  - Avoid using food as a reward or punishment.

### Hydration
- Offer water throughout the day.
- Limit milk to 500-700 ml/day.
- Avoid juice and sugary drinks.
- Coconut water, buttermilk, and *lassi* (unsweetened) are healthy Indian options.

---

## 🧠 Parenting: Language Enrichment

### How to Support Language Development
- **Narrate your day**: Describe what you are doing, seeing, and feeling. "Mummy is cutting the vegetables. These are orange carrots. They are crunchy."
- **Read daily**: Choose books with bright pictures, simple text, and interactive elements (flaps, textures). Ask questions: "Where is the dog? What does the dog say?"
- **Sing songs**: Nursery rhymes, action songs, *loris*. Songs with hand movements (Itsy Bitsy Spider, *Machhli Jal Ki Rani*) are great.
- **Expand language**: If toddler says "ball," respond with "Yes, that's a big red ball! Can you roll the ball?"
- **Give choices**: "Do you want the apple or the banana?" This encourages verbal responses.
- **Limit screen time**: AAP recommends no screen time for children under 18 months (except video chatting). Background TV can interfere with language development.
- **Bilingual families**: Speaking multiple languages at home is beneficial. Toddlers can learn multiple languages simultaneously. Use consistent language patterns (e.g., one parent speaks Hindi, the other speaks English).

### Indian Language Tip
- It is common for Indian toddlers to be exposed to 2-3 languages (e.g., Hindi, English, and a regional language). This is a strength. Do not limit to one language — the toddler brain is capable of learning multiple languages simultaneously.

---

## 📋 Sources

- **WHO**: Physical activity guidelines for adults; Birth spacing recommendations (WHO, 2020, 2005).
- **AAP**: Language development — 12-18 months; Screen time recommendations (no screens under 18 months); Positive discipline (AAP, 2020, 2016, 2018).
- **IAP**: Developmental surveillance guidelines; Bilingualism and language development (IAP, 2022).
- **ICMR-NIN**: Dietary guidelines for toddlers (ICMR-NIN, 2020).
- **NICE**: Postnatal care — long-term health and wellbeing (NICE NG194, 2021).
- **UNICEF**: Early childhood development — language and social development; Responsive parenting.
- **MOHFW**: Family planning and reproductive health services; RMNCH+A strategy.
- **ACOG**: Interpregnancy care and family planning (ACOG Committee Opinion No. 762, 2019).
- **FOGSI**: Contraception and family planning guidelines (FOGSI, 2021).
- **La Leche League International**: Breastfeeding beyond one year.`,
                recoveryNotes: 'At 13.5 months, focus on long-term wellness: annual physical exam, dental checkup (every 6 months), eye exam, gynecological checkup. Balanced diet. 150 minutes moderate-intensity aerobic activity/week. 7-9 hours sleep. Menstrual cycles should be regular. PMS may have returned — lifestyle modifications help. Family planning: WHO recommends 24 months spacing. Preconception: folic acid, healthy weight, chronic condition management. Reliable contraception if not planning pregnancy. LARC methods (IUD, implant) are highly effective.',
                babyCareNotes: 'Baby is 13.5 months. Language explosion: vocabulary 5-20 words. Understands hundreds of words. Follows two-step commands. Points to body parts. Uses words to express needs. Social skills: imitates, plays interactive games, shows affection, empathy emerges. Pretend play begins. Walks independently. May begin running. Climbs, squats, throws ball, scribbles. Self-feeds with fingers and spoon. 3 meals + 2-3 snacks. Limit milk 500-700 ml/day. No juice. No screen time under 18 months. Bilingual exposure is beneficial.',
                mentalHealthNotes: 'Parenting a toddler is joyful and challenging. Support language development: narrate, read daily, sing, expand on words, give choices. Limit screen time — background TV interferes with language. Bilingualism is a strength — Indian toddlers thrive with multiple languages. Toddler tantrums are normal — stay calm, acknowledge feelings, redirect. Self-care: maintain exercise, sleep, and stress management. If you feel overwhelmed, seek support. Mental health resources: DMHP, NMHP, iCall, AASRA, NIMHANS.',
                activityNotes: '150 minutes moderate-intensity aerobic activity/week. Strength training twice weekly. Yoga, pilates, HIIT. Continue pelvic floor maintenance. Baby: Encourage walking, running, climbing (supervised). 30-60 minutes outdoor time. Toddler activities: push/pull toys, stacking, shape sorters, board books, pretend play toys (doll, toy phone, pots), music and movement, water play, playground visits. Family activities: park visits, walks, temple visits, simple outings, family meals.',
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Unexplained fatigue, weight changes, or mood swings
- Heavy bleeding or irregular, painful periods
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Severe breast pain, redness, and fever
- Urinary incontinence, pelvic pain, or pelvic pressure
- Chest pain, difficulty breathing, or leg pain/swelling
- Baby: Not standing independently, not walking
- Baby: Not babbling, not using any words
- Baby: Not responding to name, not using gestures
- Baby: Loss of previously acquired skills
- Baby: Poor weight gain, lethargy, fewer than 6 wet diapers/day
- Baby: Extreme floppiness or stiffness
- Baby: No interest in social interaction or interactive games
- Baby: No words by 15 months — discuss with pediatrician
- Baby: Not walking by 18 months — discuss with pediatrician`,
        },
        {
                weekNumber: 50,
                title: 'Exploring the World — Curiosity & Safe Boundaries',
                summary: 'Your 14.5-month-old toddler is a curious explorer. Everything is interesting — from kitchen cabinets to puddles. Focus on balancing safety with exploration, encouraging curiosity, and setting gentle boundaries.',
                bodyMarkdown: `## 🌸 Your Body at Week 50

### Emotional Wellbeing at Nearly 14 Months
You are well into the second year of motherhood. The intense physical demands of the first year have eased, and you may be settling into a new normal.

- **Identity**: Many women find that by the second year postpartum, they have integrated their identity as a mother with their pre-baby identity. You are not the same person you were before — you have grown, evolved, and developed new strengths.
- **Career**: If you are back at work, you may have found a rhythm. If you are a stay-at-home mother, you may have developed routines and support systems. Both paths are valid and valuable.
- **Relationships**: Your relationship with your partner may have evolved. Continue to invest in communication, shared activities, and mutual support.
- **Social life**: You may be reconnecting with friends, pursuing hobbies, and expanding your world beyond motherhood.

### Health Priorities
- **Annual checkup**: If not yet done, schedule your annual physical, dental, and gynecological checkups.
- **Self-breast examination**: Practice monthly breast self-examination. Report any lumps, changes, or concerns to your doctor.
- **Cervical cancer screening**: Pap smear and HPV testing as per national guidelines (typically every 3-5 years for women aged 21-65).
- **Mental health**: Continue to monitor your emotional wellbeing. Seek help if you experience persistent sadness, anxiety, or other symptoms.

---

## 👶 Your Baby at Week 50 (14.5 Months)

### Curiosity and Exploration
- Your toddler is driven by curiosity. Everything is new and interesting.
- Exploratory behaviors: Opening cabinets, emptying containers, pressing buttons, climbing, touching everything.
- This is how toddlers learn about the world — through hands-on exploration.
- Rather than constantly saying "no," create a safe environment where exploration is encouraged.

### Balancing Safety with Exploration
- **Childproof thoroughly**: Secure furniture, cover outlets, lock cabinets with dangerous items, use safety gates.
- **Create "yes" spaces**: Designate areas where toddler can explore freely without constant intervention.
- **Redirect rather than restrict**: If toddler is doing something unsafe, redirect to a safe alternative. "We don't climb on the table. Let's climb on the sofa cushions."
- **Supervise without hovering**: Stay close enough to ensure safety but allow independent exploration.
- **Teach gently**: Use simple explanations. "The stove is hot. Ouch! We don't touch."

### Language and Communication
- Vocabulary: 5-25 words (wide variation).
- May be combining two words: "more milk," "mummy go," "bye-bye dada."
- Follows simple instructions.
- Points to pictures in books when named.
- Shakes head for "no" and nods for "yes."
- May use words to express emotions ("happy," "sad" — or their equivalents).

### Motor Development
- Walks well independently. May walk backward.
- Runs (clumsily but enthusiastically).
- Climbs onto furniture.
- Stoops and squats.
- Throws a ball.
- Scribbles with a crayon.
- Turns pages of a book.
- Begins to use a spoon and cup more effectively.

### Social-Emotional Development
- Shows a range of emotions — joy, anger, frustration, affection, fear.
- May have tantrums when frustrated. This is normal.
- Shows preference for familiar people.
- May be shy or anxious around strangers.
- Imitates adult behaviors (talking on phone, sweeping, cooking).
- May show attachment to a comfort object.

---

## 🥗 Nutrition for 14.5 Months

### Balanced Toddler Diet
- 3 meals + 2-3 snacks per day.
- Whole milk: 500-700 ml/day maximum.
- Breastfeeding: 1-4 times per day (if continuing).
- Water: Offer throughout the day.

### Key Principles
- **Variety**: Rotate different foods to ensure a range of nutrients.
- **Iron**: Continue to prioritize iron-rich foods. Toddlers are at high risk for iron deficiency.
- **Fiber**: Whole grains, fruits, vegetables, legumes.
- **Healthy fats**: Essential for brain development. Ghee (moderation), nut butters (smooth, thin), seeds, avocado, coconut.
- **Limit sugar**: Avoid added sugar. Use fruit, dates, or jaggery (in moderation) for sweetness.

### Indian Toddler Meal Ideas
- **Breakfast**: Vegetable poha, moong dal chilla, ragi dosa, suji upma, egg bhurji, paneer paratha (soft), vegetable uttapam.
- **Lunch/Dinner**: Dal-rice with vegetables, khichdi, curd rice, palak paneer with rice, rajma-rice (mashed), chole (mashed) with rice, vegetable pulao.
- **Snacks**: Fruit chaat (without spices), steamed vegetable sticks, paneer cubes, yogurt, murmura with roasted chana, soft idli pieces, homemade vegetable cutlets (baked, not fried).

---

## 🧠 Positive Parenting: Setting Gentle Boundaries

### Why Boundaries Matter
- Boundaries help toddlers feel safe and secure. They learn what is expected and what is acceptable.
- Consistent, gentle boundaries support healthy social-emotional development.

### How to Set Gentle Boundaries
- **Be consistent**: If something is not allowed today, it should not be allowed tomorrow. Inconsistency confuses toddlers.
- **Keep it simple**: Use short, clear phrases. "Gentle hands." "Feet on the floor." "Food stays on the plate."
- **Redirect**: Offer an alternative. "You can't throw the blocks. Let's throw the ball instead."
- **Acknowledge feelings**: "I know you're angry because you want to play with the phone. It's not a toy. Let's find your toy phone."
- **Model behavior**: Show your toddler what you want them to do, rather than just telling them what not to do.
- **Praise positive behavior**: "Great job using gentle hands with the baby!" Catch them being good.
- **Avoid power struggles**: Offer choices, use humor, distract, and choose your battles wisely.

### Screen Time
- AAP recommends no screen time for children under 18 months (except video chatting).
- For children 18-24 months, if introducing media, choose high-quality programming and watch together.
- Background TV (TV on while no one is actively watching) can interfere with language development and play.

---

## 📋 Sources

- **AAP**: Developmental milestones 12-18 months; Screen time recommendations; Positive discipline and setting boundaries (AAP, 2020, 2016, 2018).
- **WHO**: Infant and young child feeding; Physical activity for children under 5 (WHO, 2021, 2019).
- **IAP**: Developmental surveillance; Toddler nutrition guidelines (IAP, 2022).
- **ICMR-NIN**: Dietary guidelines for toddlers (ICMR-NIN, 2020).
- **NICE**: Postnatal care — long-term health (NICE NG194, 2021).
- **UNICEF**: Early childhood development — exploration, curiosity, and safe environments; Positive parenting.
- **MOHFW**: National Health Mission — RMNCH+A strategy; Health and wellness centers for preventive care.
- **ACOG**: Well-woman care — annual checkups, breast self-examination, cervical cancer screening (ACOG, 2021).
- **FOGSI**: Well-woman health guidelines; Cervical cancer screening recommendations (FOGSI, 2021).`,
                recoveryNotes: 'At 14.5 months, identity as a mother has integrated with pre-baby identity. You have grown and developed new strengths. Career and family rhythms may have stabilized. Continue investing in relationships, social connections, and personal interests. Annual checkups: physical, dental, gynecological. Monthly breast self-examination. Pap smear as per guidelines. Continue balanced nutrition, exercise, and sleep. Monitor emotional wellbeing. Seek help if persistent sadness, anxiety, or mood changes.',
                babyCareNotes: 'Baby is 14.5 months. Curiosity drives exploration. Childproof thoroughly. Create "yes" spaces for free exploration. Redirect rather than restrict. Vocabulary: 5-25 words. May combine two words. Follows simple instructions. Walks well, may run, climbs, stoops, throws ball, scribbles. Shows range of emotions — tantrums are normal. 3 meals + 2-3 snacks. Whole milk 500-700 ml/day. Iron-rich foods priority. No screen time under 18 months. Background TV interferes with language development.',
                mentalHealthNotes: 'Gentle boundary setting: be consistent, keep it simple, redirect, acknowledge feelings, model behavior, praise positive behavior. Avoid power struggles — choose your battles. Your calm presence helps your toddler regulate emotions. Toddlerhood is challenging — it\'s normal to feel frustrated or overwhelmed. Seek support when needed. Continue self-care: exercise, sleep, hobbies, social connections. Mental health resources: DMHP, NMHP, iCall (022-25521111), AASRA (91-22-27546669), NIMHANS (080-46110007).',
                activityNotes: '150 minutes moderate-intensity aerobic activity/week. Strength training, yoga, pilates. Continue pelvic floor maintenance. Baby: Encourage walking, running, climbing (supervised). 30-60 minutes outdoor time. Toddler activities: push/pull toys, stacking, shape sorters, pretend play, board books, music, water play, sand play, playground visits. Childproof for safe exploration. Family activities: park visits, walks, temple visits, simple outings, family meals. Limit screen time.',
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Unexplained fatigue, weight changes, or mood swings
- Heavy bleeding or irregular, painful periods
- Breast lump or changes — report to doctor
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Urinary incontinence, pelvic pain, or pelvic pressure
- Chest pain, difficulty breathing, or leg pain/swelling
- Baby: Not walking independently
- Baby: Not using any words, not babbling
- Baby: Not responding to name, not using gestures
- Baby: Loss of previously acquired skills
- Baby: Poor weight gain, lethargy, fewer than 6 wet diapers/day
- Baby: Extreme floppiness or stiffness
- Baby: No interest in social interaction or interactive games
- Baby: No words by 15 months — discuss with pediatrician
- Baby: Not walking by 18 months — discuss with pediatrician`,
        },
        {
                weekNumber: 51,
                title: 'Building Confidence & Social Play',
                summary: 'Your 15-month-old toddler is becoming more confident and social. Parallel play evolves into early interactive play. Language continues to blossom. Focus on building confidence, supporting social skills, and celebrating your toddler\'s unique personality.',
                bodyMarkdown: `## 🌸 Your Body at Week 51

### Your Health at 15 Months Postpartum
You are now well beyond the postpartum period. Your focus is on general health and wellbeing:

- **Physical health**: Maintain regular exercise, balanced nutrition, adequate sleep, and preventive healthcare.
- **Mental health**: Continue to prioritize your emotional wellbeing. The demands of toddler parenting can be stressful — self-care is essential.
- **Social health**: Nurture relationships with partner, family, and friends. Social connection is protective for mental health.
- **Spiritual/Cultural health**: Many Indian women find strength in spiritual practices, cultural traditions, and community connections.

### Preparing for Another Pregnancy (If Desired)
- WHO recommends at least 24 months between delivery and next conception. At 15 months postpartum, you should wait at least 9 more months before conceiving.
- Preconception health checklist:
  - Folic acid supplementation (400-800 mcg/day) starting at least 3 months before conception.
  - Achieve healthy weight (BMI 18.5-24.9).
  - Update vaccinations (rubella, hepatitis B, COVID-19, influenza).
  - Manage chronic conditions (thyroid, diabetes, hypertension, anemia).
  - Dental checkup — periodontal disease is associated with preterm birth.
  - Genetic counseling if there is a family history of genetic conditions.
  - Discuss previous pregnancy complications with your doctor.

### Contraception
- If you do not wish to conceive, ensure reliable contraception.
- Options: IUDs (Copper T — non-hormonal, lasts 10 years; hormonal IUD — lasts 5 years), implants (3 years), injectables (DMPA — every 3 months), oral contraceptive pills, condoms, sterilization (if family is complete).
- Discuss with your doctor to choose the method best suited to your health, lifestyle, and family planning goals.

---

## 👶 Your Baby at Week 51 (15 Months)

### 15-Month Milestones
By 15 months, most toddlers:
- **Motor**: Walk independently, may run. Squat to pick up toys. Climb onto furniture. Use hands well — stack 2-3 blocks, scribble, use spoon and cup.
- **Communication**: Say 3-10 words. Follow simple commands. Point to body parts. Use gestures. Shake head "no." May combine two words.
- **Cognitive**: Imitate activities. Use objects correctly (brush, spoon, phone). Find hidden objects. Point to pictures in books.
- **Social-Emotional**: Show affection. Imitate other children. Show a range of emotions. May have tantrums. May have a comfort object.

### Building Confidence
- **Encourage independence**: Allow your toddler to do things for themselves (within safe limits). This builds confidence and self-esteem.
- **Praise effort**: "You worked so hard to stack those blocks!" rather than "You're so smart!" This fosters a growth mindset.
- **Offer choices**: Giving limited choices builds decision-making skills and sense of control.
- **Avoid criticism**: Correct gently. Instead of "That's wrong," try "Let me show you another way."
- **Be patient**: Toddlers are learning everything for the first time. Allow time for practice and mistakes.

### Social Play
- **Parallel play**: Playing alongside other children is still the primary form of social interaction. This is normal.
- **Early interactive play**: May begin to engage in simple interactive play — rolling a ball back and forth, chasing games, imitating each other.
- **Playdates**: Short, structured playdates (30-60 minutes) with 1-2 other children. Supervise closely.
- **Sharing**: Sharing is a developing skill. Toddlers are not developmentally ready to share consistently. Do not force sharing — instead, model and gently encourage.

### Language at 15 Months
- Vocabulary: 3-10 words (wide variation — some toddlers say many more).
- The 15-month well-child visit is a good time to discuss language development with your pediatrician.
- If your toddler has no words by 15 months, discuss with your pediatrician. Early intervention (if needed) is highly effective.

---

## 🥗 Nutrition at 15 Months

### Meal Pattern
- 3 meals + 2-3 snacks per day.
- Whole milk: 500-700 ml/day (maximum).
- Breastfeeding: 1-4 times per day (if continuing).
- Water: Offer throughout the day.

### Healthy Eating Habits
- **Family meals**: Eat together whenever possible.
- **Self-feeding**: Encourage use of spoon, fork, and cup.
- **No pressure**: Offer food and let toddler decide how much to eat.
- **Variety**: Continue offering a wide range of foods.
- **Limit processed foods**: Chips, biscuits, packaged snacks, and sugary foods should be occasional treats, not regular parts of the diet.

### Indian Toddler Meal Ideas
- **Breakfast**: Vegetable poha, suji upma, moong dal chilla, ragi dosa, egg bhurji, paneer paratha, vegetable uttapam, masala oats.
- **Lunch/Dinner**: Dal-rice with vegetables, khichdi, curd rice, palak paneer, rajma-rice, chole-rice, vegetable pulao, sambar rice, rasam rice.
- **Snacks**: Fruit, yogurt, paneer cubes, steamed vegetables, murmura, soft idli, dhokla, homemade vegetable cutlets, roasted makhana, chana.

---

## 🧠 Parenting at 15 Months

### Managing Tantrums
- Tantrums peak between 18-24 months but can occur earlier. They are a normal part of development.
- Toddlers have big emotions but limited ability to express them verbally or regulate them.
- Strategies:
  - Stay calm. Your calm presence helps your toddler co-regulate.
  - Acknowledge feelings: "I see you're angry because we have to leave the park."
  - Offer comfort: A hug, a calm voice, a soothing presence.
  - Distract and redirect.
  - Do not give in to unreasonable demands to stop a tantrum — this reinforces the behavior.
  - Ensure basic needs are met (hunger, tiredness, overstimulation).
  - After the tantrum passes, reconnect. Do not punish for having feelings.

### The 15-Month Well-Child Visit
- Weight, length, head circumference.
- Developmental screening.
- Immunizations as per IAP/UIP schedule.
- Hemoglobin check (if not done at 12 months).
- Discuss: Nutrition, sleep, behavior, language development, safety.
- This is a good time to ask your pediatrician any questions or share any concerns.

---

## 📋 Sources

- **WHO**: Birth spacing — at least 24 months (WHO, 2005); Infant and young child feeding (WHO, 2021).
- **AAP**: 15-month developmental milestones; Well-child visit schedule; Tantrums and positive discipline (AAP, *Bright Futures*, 2022; AAP, *Pediatrics*, 2018).
- **IAP**: IAP immunization schedule; Developmental surveillance; Toddler nutrition (IAP, 2022).
- **ACOG**: Interpregnancy care — folic acid, healthy weight, vaccination, chronic disease management (ACOG Committee Opinion No. 762, 2019).
- **FOGSI**: Preconception counseling and interpregnancy care (FOGSI, 2021).
- **ICMR-NIN**: Dietary guidelines for toddlers (ICMR-NIN, 2020).
- **NICE**: Postnatal care — long-term health (NICE NG194, 2021).
- **UNICEF**: Early childhood development — social development, play, and positive parenting.
- **MOHFW**: RMNCH+A strategy; Family planning services; Universal Immunization Programme.
- **La Leche League International**: Breastfeeding beyond one year.`,
                recoveryNotes: 'At 15 months, focus on general health: balanced diet, exercise, sleep, preventive healthcare. Social connections are protective for mental health. If planning another pregnancy, WHO recommends at least 24 months spacing (wait at least 9 more months). Preconception: folic acid 400-800 mcg/day, healthy weight, vaccinations, chronic condition management, dental checkup. Contraception: IUDs, implants, injectables, pills, condoms, sterilization. Discuss with doctor. Annual checkups: physical, dental, gynecological.',
                babyCareNotes: 'Baby is 15 months. Walks independently, may run. Squats, climbs. Says 3-10 words. Follows simple commands. Points to body parts. Uses gestures. Shows affection. Imitates. Tantrums are normal. Parallel play is primary social interaction. Early interactive play emerges. 15-month well-child visit: weight, length, head circumference, developmental screening, immunizations, hemoglobin. 3 meals + 2-3 snacks. Whole milk 500-700 ml/day. Self-feeding encouraged. No screen time under 18 months. If no words by 15 months, discuss with pediatrician.',
                mentalHealthNotes: 'Toddler tantrums are normal — peak at 18-24 months. Strategies: stay calm, acknowledge feelings, offer comfort, distract, redirect. Do not give in to unreasonable demands. Ensure basic needs met. Reconnect after tantrum. Do not punish for having feelings. Build confidence: encourage independence, praise effort, offer choices, avoid criticism, be patient. Sharing is not developmentally appropriate yet — model and gently encourage. Self-care: exercise, sleep, social connections. Mental health resources remain available.',
                activityNotes: '150 minutes moderate-intensity aerobic activity/week. Strength training, yoga, pilates. Continue pelvic floor. Baby: Encourage walking, running, climbing (supervised). 30-60 minutes outdoor time. Toddler activities: push/pull toys, stacking, shape sorters, pretend play, board books, music, water play, sand play, playground, short playdates (30-60 min). Childproof for safe exploration. Family activities: park visits, walks, temple visits, simple outings, family meals. No screen time.',
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Unexplained fatigue, weight changes, or mood swings
- Heavy bleeding or irregular, painful periods
- Breast lump or changes
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Urinary incontinence, pelvic pain, or pelvic pressure
- Chest pain, difficulty breathing, or leg pain/swelling
- Baby: Not walking independently
- Baby: Not using any words (no words by 15 months — discuss with pediatrician)
- Baby: Not responding to name, not using gestures
- Baby: Loss of previously acquired skills
- Baby: Poor weight gain, lethargy, fewer than 6 wet diapers/day
- Baby: Extreme floppiness or stiffness
- Baby: No interest in social interaction or interactive games
- Baby: Not pointing to show interest or share attention
- Baby: Not making eye contact or responding to social engagement`,
        },
        {
                weekNumber: 52,
                title: 'One Year of Postpartum — A Journey of Love & Growth',
                summary: 'Congratulations! You have completed one full year of your postpartum journey. This is a milestone to celebrate — for you, your baby, and your family. Reflect on your growth, celebrate your baby\'s development, and look forward to the toddler years ahead.',
                bodyMarkdown: `## 🌸 Your Body at Week 52 — One Year Complete

### Congratulations, Super Mom!
You have completed one full year of your postpartum journey. Fifty-two weeks of recovery, growth, learning, and love. This is an extraordinary achievement that deserves recognition and celebration.

### Your Body: One Year Later
- **Uterus**: Returned to pre-pregnancy size (usually within 6-8 weeks, certainly by one year).
- **Pelvic floor**: Should be strong and functional. If you continue to experience symptoms, seek specialized care.
- **Abdominal muscles**: Diastasis recti should be resolved or minimal. Core strength should be near pre-pregnancy levels.
- **Hormones**: Normalized (if weaned). Menstrual cycles regular.
- **Breasts**: May have changed in size and shape — this is normal.
- **Weight**: Most women are within 2-5 kg of pre-pregnancy weight. Sustainable weight management is ongoing.
- **Hair**: Postpartum hair loss has resolved. Hair texture may have changed.
- **Skin**: Stretch marks have faded. Melasma (pregnancy mask) has usually resolved.
- **C-section scar**: Well-healed. May still be slightly numb.

### Looking Back: Your Postpartum Journey
- **Immediate recovery (weeks 1-2)**: Physical healing, lochia, breastfeeding establishment, emotional adjustment, baby blues.
- **Early recovery (weeks 3-6)**: Healing continued, breastfeeding established, bonding deepened, early routines emerged.
- **Late recovery (weeks 7-12)**: Physical recovery largely complete, returning to exercise, baby smiling and interacting, sleep patterns emerging.
- **Extended recovery (weeks 13-52)**: Return to pre-pregnancy activities, baby's rapid development, establishing family routines, navigating work and motherhood.

### Celebrating Your Baby's First Year
- From a newborn who could barely see your face to a toddler who walks, talks, laughs, plays, and shows affection.
- From complete dependence to growing independence.
- From a tiny bundle to a unique personality with preferences, opinions, and a sense of humor.

---

## 👶 Your Baby at Week 52 (15.5 Months)

### Toddler Development at 15.5 Months
- **Motor**: Walks, runs (clumsily), climbs, squats, throws ball, scribbles.
- **Communication**: 5-20 words. May combine two words. Follows simple commands. Points to body parts and pictures.
- **Cognitive**: Solves simple problems. Imitates activities. Pretend play emerges. Finds hidden objects.
- **Social-Emotional**: Shows affection. Has favorite people and things. Shows a range of emotions. Tantrums are normal. Imitates other children. May have a comfort object.

### What's Next: The Toddler Years (1-3 Years)
- **Walking to running**: Your toddler will become increasingly coordinated and confident.
- **Language explosion**: Vocabulary will grow from a few words to hundreds. Sentences will emerge.
- **Independence**: Your toddler will want to do things "by myself!"
- **Potty training**: Typically begins between 18-30 months (Indian families often start earlier).
- **Social skills**: Parallel play will evolve into cooperative play.
- **Imagination**: Pretend play will become more elaborate.
- **Emotions**: Big feelings, tantrums, and developing emotional regulation.

---

## 🥗 Nutrition for the Toddler Years

### Key Principles for 1-3 Years
- 3 meals + 2-3 snacks per day.
- Whole milk: 500-700 ml/day maximum.
- Breastfeeding: Continue as long as mutually desired. WHO recommends continued breastfeeding until 2 years and beyond.
- Variety: Offer a wide range of foods from all food groups.
- Iron: Continue to prioritize iron-rich foods. Toddlers are at high risk for iron deficiency anemia.
- Limit sugar, salt, and processed foods.
- Family meals: Eat together as a family.
- No pressure: Offer healthy foods and trust your toddler's appetite.

### Indian Family Meal Ideas
- **Breakfast**: Poha, upma, idli, dosa, paratha, chilla, uttapam, egg dishes, porridge.
- **Lunch/Dinner**: Dal-rice, khichdi, curd rice, roti-sabzi, pulao, biryani (mild), sambar rice, rasam rice, rajma-rice, chole-rice.
- **Snacks**: Fruit, yogurt, paneer, steamed vegetables, murmura, chana, makhana, homemade snacks.

---

## 🧠 Mental Health: Your One-Year Postpartum Reflection

### You Have Grown
- You have navigated one of the most transformative experiences a human being can have.
- You have learned to care for a completely dependent human being while also caring for yourself.
- You have developed new skills, discovered new strengths, and deepened your capacity for love.
- You have faced challenges and overcome them.
- You are not the same person you were before — you are stronger, wiser, and more resilient.

### A Message to You
Motherhood is not about perfection. It is about presence, love, and doing your best — and your best is enough. There will be hard days and easy days. There will be moments of pure joy and moments of exhaustion and doubt. All of this is normal. You are doing an amazing job.

### If You Have Struggled
- If you have experienced postpartum depression, anxiety, or other mental health challenges — know that you are not alone. These conditions are common, treatable, and not your fault.
- If you are still struggling, please reach out for help. You deserve support and care.
- Resources:
  - **DMHP** (District Mental Health Programme)
  - **NMHP** (National Mental Health Programme)
  - **iCall** (TISS): 022-25521111
  - **AASRA**: 91-22-27546669 (24x7)
  - **Vandrevala Foundation**: 1860-266-2345 (24x7)
  - **NIMHANS**: 080-46110007 (24x7)
  - **Your doctor**: They can provide referrals to mental health professionals.

### Resources for the Toddler Years
- **IAP**: Indian Academy of Pediatrics — guidelines for child health, nutrition, and development.
- **WHO**: Child growth standards, infant and young child feeding, early childhood development.
- **UNICEF**: Parenting resources, early childhood development.
- **MOHFW**: National Health Mission — child health services, immunization, nutrition programs.
- **Your pediatrician**: Your primary resource for your child's health and development.
- **Mother support groups**: In-person and online communities of mothers sharing the journey.

---

## 📋 Sources

This concludes the 52-week postpartum journey content. All weeks have been compiled using the following verified sources:

### International Sources
- **WHO** (World Health Organization): Postnatal care, infant feeding, birth spacing, child growth standards, physical activity guidelines.
- **ACOG** (American College of Obstetricians and Gynecologists): Postpartum care, interpregnancy care, exercise, contraception, well-woman care.
- **AAP** (American Academy of Pediatrics): Developmental milestones, nutrition, sleep, safety, positive discipline, screen time, Bright Futures guidelines.
- **CDC** (Centers for Disease Control and Prevention): Developmental milestones, immunization schedules, maternal health.
- **NICE** (National Institute for Health and Care Excellence, UK): Postnatal care guidelines (NG194).
- **UNICEF**: Early childhood development, infant and young child feeding, parenting.

### Indian Sources
- **MOHFW** (Ministry of Health and Family Welfare, India): RMNCH+A strategy, MAA Programme, Anaemia Mukt Bharat, Universal Immunization Programme, JSY, PMSMA, Maternity Benefit Act 2017, National Mental Health Programme, District Mental Health Programme.
- **IAP** (Indian Academy of Pediatrics): Immunization schedule, infant and young child feeding guidelines, developmental surveillance.
- **FOGSI** (Federation of Obstetric and Gynaecological Societies of India): Postpartum care, contraception, interpregnancy care, well-woman health.
- **ICMR-NIN** (Indian Council of Medical Research — National Institute of Nutrition): Dietary guidelines for Indians — lactating women, infants, and toddlers.
- **La Leche League International**: Breastfeeding support, guidance, and evidence-based information.

### Note
All medical information in this content has been double-verified against the above sources. However, this content is for informational purposes only and does not replace professional medical advice. Always consult your healthcare provider for personalized medical guidance.

---

*Thank you for trusting us with your postpartum journey. We wish you and your baby health, happiness, and love in the years ahead. 🌸*`,
                recoveryNotes: 'Congratulations! One full year postpartum — 52 weeks of recovery, growth, and love. Your body has undergone an extraordinary transformation. Uterus returned to pre-pregnancy size. Pelvic floor should be strong. Diastasis recti resolved or minimal. Hormones normalized (if weaned). Weight near pre-pregnancy. Hair loss resolved. Stretch marks faded. C-section scar well-healed. Reflect on your journey: immediate recovery, early recovery, late recovery, and extended recovery phases. Celebrate your achievements. Your body has done something remarkable.',
                babyCareNotes: 'Baby is 15.5 months. Walks, runs, climbs, squats, throws, scribbles. 5-20 words. May combine two words. Follows commands. Shows affection. Pretend play emerges. Tantrums are normal. Looking ahead: toddler years (1-3) bring language explosion, growing independence, potty training (18-30 months), developing social skills, and big emotions. 3 meals + 2-3 snacks. Whole milk 500-700 ml/day. Continue breastfeeding as desired (WHO recommends until 2 years+). Prioritize iron-rich foods. Family meals. No screen time under 18 months. Resources: IAP, WHO, UNICEF, MOHFW, your pediatrician.',
                mentalHealthNotes: 'One year of motherhood — you have grown, learned, and loved. You are stronger, wiser, and more resilient. Motherhood is not about perfection — it is about presence, love, and doing your best. Your best is enough. If you have struggled with mental health challenges, know you are not alone and help is available. Resources: DMHP, NMHP, iCall (022-25521111), AASRA (91-22-27546669), Vandrevala Foundation (1860-266-2345), NIMHANS (080-46110007). Your doctor can provide referrals. Continue self-care: exercise, sleep, social connections, hobbies. You deserve support and care.',
                activityNotes: 'All forms of exercise are appropriate. 150 minutes moderate-intensity aerobic activity/week. Strength training, yoga, pilates, running, swimming, dance, sports. Continue pelvic floor maintenance. Baby: walking, running, climbing (supervised). 30-60 minutes outdoor time. Toddler activities: all previously mentioned activities plus more complex pretend play, simple puzzles, building blocks, art (crayons, finger paint), music, water play, sand play, playground, short playdates. Family activities: park visits, walks, temple visits, cultural celebrations, family meals. No screen time under 18 months.',
                warningSigns: `🚨 Contact your doctor immediately if you experience:
- Persistent sadness, anxiety, hopelessness, or thoughts of harming yourself or baby
- Unexplained fatigue, weight changes, or mood swings
- Heavy bleeding or irregular, painful periods
- Breast lump or changes
- Foul-smelling vaginal discharge or pelvic pain
- Fever above 100.4°F (38°C)
- Urinary incontinence, pelvic pain, or pelvic pressure
- Chest pain, difficulty breathing, or leg pain/swelling
- Baby: Not walking independently (by 18 months — discuss with pediatrician)
- Baby: Not using any words (by 15-18 months — discuss with pediatrician)
- Baby: Not responding to name, not using gestures
- Baby: Loss of previously acquired skills
- Baby: Poor weight gain, lethargy, fewer than 6 wet diapers/day
- Baby: Extreme floppiness or stiffness
- Baby: No interest in social interaction or interactive games
- Baby: Not pointing to show interest or share attention
- Baby: Not making eye contact or responding to social engagement`,
        },
];

// ─── MAIN SEED FUNCTION ───
async function main() {
        console.log('🌱 Starting postpartum week content seed...');

        // Find the English language record
        const language = await prisma.language.findUnique({
                where: { code: 'en' },
        });

        if (!language) {
                console.error('❌ English language record not found. Please seed languages first.');
                process.exit(1);
        }

        // Find a system/admin user for createdBy
        const adminUser = await prisma.user.findFirst({
                where: {
                        userRoles: {
                                some: {
                                        role: {
                                                roleName: 'admin',
                                        },
                                },
                        },
                },
        });

        if (!adminUser) {
                console.error('❌ No admin user found. Please seed users first.');
                process.exit(1);
        }

        let created = 0;
        let updated = 0;

        for (const week of postpartumWeeks) {
                const existing = await prisma.postpartumWeekContent.findUnique({
                        where: {
                                weekNumber_languageId: {
                                        weekNumber: week.weekNumber,
                                        languageId: language.id,
                                },
                        },
                });

                if (existing) {
                        await prisma.postpartumWeekContent.update({
                                where: { id: existing.id },
                                data: {
                                        title: week.title,
                                        summary: week.summary,
                                        bodyMarkdown: week.bodyMarkdown,
                                        recoveryNotes: week.recoveryNotes,
                                        babyCareNotes: week.babyCareNotes,
                                        mentalHealthNotes: week.mentalHealthNotes,
                                        activityNotes: week.activityNotes,
                                        warningSigns: week.warningSigns,
                                        updatedBy: adminUser.id,
                                },
                        });
                        updated++;
                } else {
                        await prisma.postpartumWeekContent.create({
                                data: {
                                        weekNumber: week.weekNumber,
                                        languageId: language.id,
                                        title: week.title,
                                        summary: week.summary,
                                        bodyMarkdown: week.bodyMarkdown,
                                        recoveryNotes: week.recoveryNotes,
                                        babyCareNotes: week.babyCareNotes,
                                        mentalHealthNotes: week.mentalHealthNotes,
                                        activityNotes: week.activityNotes,
                                        warningSigns: week.warningSigns,
                                        createdBy: adminUser.id,
                                },
                        });
                        created++;
                }
        }

        console.log(`✅ Postpartum content seeded: ${created} created, ${updated} updated (${postpartumWeeks.length} weeks total)`);
}

main()
        .catch((e) => {
                console.error('❌ Seed failed:', e);
                process.exit(1);
        })
        .finally(async () => {
                await prisma.$disconnect();
        });