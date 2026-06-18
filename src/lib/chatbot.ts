import Groq from 'groq-sdk';
import { logger } from './logger';
import prisma from './prisma';
import { detectEmergencyKeywords, computePregnancyWeek, computePregnancyWeekFromDueDate } from './utils';
import { pregnancyKnowledgeBase } from './pregnancy-knowledge';

// ─── Chatbot Types ───

export type ChatbotMode = 'mother' | 'partner' | 'shared' | 'admin_safe';

export interface ChatbotRequest {
    userId: string;
    sessionId?: string;
    message: string;
    mode: ChatbotMode;
}

export interface ChatbotResponse {
    message: string;
    isEmergency: boolean;
    escalationGuidance?: string;
    suggestedActions?: string[];
    sessionId: string;
}

// ─── Groq Client ───

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Emergency Response (static — safety first) ───

const EMERGENCY_RESPONSE = {
    message: '⚠️🚨 **Important Safety Notice**\n\nThis platform supports pregnancy care but does not replace clinical care. Based on what you have shared, you may be experiencing signs that need immediate medical attention 🥺\n\n**Please take the following steps now:**\n1. 📞 Contact your healthcare provider immediately.\n2. 🏥 If you cannot reach them, go to the nearest hospital emergency department.\n3. 🚑 If you are in India, you can call **108** for emergency ambulance services.\n4. ⏰ Do not wait for the next scheduled appointment.\n\nYour health and your baby\'s health are the priority 💕👶 We care about you and want you to be safe.',
    isEmergency: true,
    escalationGuidance: 'Immediate clinical care recommended. Do not delay. 🚨',
};

// ─── Personalization Context Builder ───

async function buildUserContext(userId: string, mode: ChatbotMode): Promise<string> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true },
    });

    const contextParts: string[] = [];

    if (user) {
        contextParts.push(`User name: ${user.firstName} ${user.lastName}`);
    }

    contextParts.push(`Chat mode: ${mode}`);

    // ── Pregnancy profile ──
    const pregnancyProfile = await prisma.pregnancyProfile.findUnique({
        where: { userId },
    });

    if (pregnancyProfile) {
        let weekNum: number | null = null;
        let trimester: number | null = null;

        if (pregnancyProfile.lmpDate) {
            const calc = computePregnancyWeek(pregnancyProfile.lmpDate);
            weekNum = calc.week;
            trimester = calc.trimester;
        } else if (pregnancyProfile.dueDate) {
            const calc = computePregnancyWeekFromDueDate(pregnancyProfile.dueDate);
            weekNum = calc.week;
            trimester = calc.trimester;
        }

        if (weekNum) {
            contextParts.push(`Current pregnancy week: ${weekNum}${trimester ? `, Trimester: ${trimester}` : ''}`);

            // Inject week-specific knowledge from the local database
            const weekKnowledge = pregnancyKnowledgeBase.find(w => w.week === weekNum);
            if (weekKnowledge) {
                contextParts.push(`Week ${weekNum} baby development: ${weekKnowledge.babyDevelopment.join('; ')}`);
                contextParts.push(`Week ${weekNum} baby size: ${weekKnowledge.babySize}, weight: ${weekKnowledge.babyWeight}, length: ${weekKnowledge.babyLength}`);
                contextParts.push(`Week ${weekNum} mother body changes: ${weekKnowledge.motherBodyChanges.join('; ')}`);
                contextParts.push(`Week ${weekNum} common symptoms: ${weekKnowledge.commonSymptoms.join('; ')}`);
                contextParts.push(`Week ${weekNum} nutritional focus: ${weekKnowledge.nutritionalFocus.join('; ')}`);
                contextParts.push(`Week ${weekNum} exercise guidance: ${weekKnowledge.exerciseGuidance.join('; ')}`);
                contextParts.push(`Week ${weekNum} warning signs: ${weekKnowledge.warningSigns.join('; ')}`);
            }
        }

        if (pregnancyProfile.highRiskFlag) {
            contextParts.push('⚠️ This is flagged as a HIGH-RISK pregnancy');
        }

        if (pregnancyProfile.dueDate) {
            const daysLeft = Math.ceil((new Date(pregnancyProfile.dueDate).getTime() - Date.now()) / 86400000);
            if (daysLeft > 0) {
                contextParts.push(`Days until due date: ${daysLeft}`);
            }
        }
    }

    // ── Mother health profile (for mother/shared modes) ──
    if (mode === 'mother' || mode === 'shared') {
        const motherHealth = await prisma.motherHealthProfile.findUnique({
            where: { userId },
        });

        if (motherHealth) {
            contextParts.push(`Age: ${motherHealth.age}, BMI: ${motherHealth.bmi}`);
            contextParts.push(`Diet preference: ${motherHealth.diet}`);
            contextParts.push(`Blood group: ${motherHealth.bloodGroup}`);
            if (motherHealth.allergies) contextParts.push(`Allergies: ${motherHealth.allergies}`);
            if (motherHealth.medications) contextParts.push(`Current medications: ${motherHealth.medications}`);
            if (motherHealth.isFirstPregnancy) contextParts.push('This is her first pregnancy');

            const conditions: string[] = [];
            if (motherHealth.diabetes) conditions.push('diabetes');
            if (motherHealth.highBP) conditions.push('high blood pressure');
            if (motherHealth.lowBP) conditions.push('low blood pressure');
            if (motherHealth.thyroidDisorder) conditions.push('thyroid disorder');
            if (motherHealth.pcos) conditions.push('PCOS');
            if (motherHealth.asthma) conditions.push('asthma');
            if (motherHealth.anemia) conditions.push('anemia');
            if (motherHealth.heartDisease) conditions.push('heart disease');
            if (motherHealth.kidneyIssues) conditions.push('kidney issues');
            if (motherHealth.epilepsy) conditions.push('epilepsy');
            if (motherHealth.depressionAnxiety) conditions.push('depression/anxiety');
            if (conditions.length > 0) {
                contextParts.push(`Medical conditions: ${conditions.join(', ')}`);
            }

            if (motherHealth.previousMiscarriage) contextParts.push('Previous miscarriage history');
            if (motherHealth.previousCSection) contextParts.push('Previous C-section history');
        }
    }

    // ── Father health profile (for partner mode) ──
    if (mode === 'partner') {
        const fatherHealth = await prisma.fatherHealthProfile.findUnique({
            where: { userId },
        });

        if (fatherHealth) {
            contextParts.push(`Partner age: ${fatherHealth.age}`);
            contextParts.push(`First-time father: ${fatherHealth.isFirstTimeFather ? 'yes' : 'no'}`);
            contextParts.push(`Living with mother: ${fatherHealth.livingWithMother ? 'yes' : 'no'}`);
            contextParts.push(`Physical activity level: ${fatherHealth.physicalActivity}`);
            contextParts.push(`Working hours per day: ${fatherHealth.workingHours}`);
        }
    }

    // ── Recent symptoms (last 7 days) ──
    if (mode === 'mother' || mode === 'shared') {
        const recentSymptoms = await prisma.symptomLog.findMany({
            where: {
                userId,
                createdAt: { gte: new Date(Date.now() - 7 * 86400000) },
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: { symptomType: true, severity: true, createdAt: true },
        });

        if (recentSymptoms.length > 0) {
            const symptomSummary = recentSymptoms.map(s =>
                `${s.symptomType} (severity ${s.severity}/10, ${s.createdAt.toLocaleDateString()})`
            ).join('; ');
            contextParts.push(`Recently logged symptoms: ${symptomSummary}`);
        }
    }

    // ── Upcoming appointments ──
    const upcomingAppointments = await prisma.appointment.findMany({
        where: {
            userId,
            scheduledAt: { gte: new Date() },
        },
        orderBy: { scheduledAt: 'asc' },
        take: 3,
        include: {
            appointmentType: { select: { typeName: true } },
        },
    });

    if (upcomingAppointments.length > 0) {
        const apptSummary = upcomingAppointments.map(a =>
            `${a.appointmentType.typeName} with ${a.providerName || 'provider'} on ${a.scheduledAt.toLocaleDateString()}`
        ).join('; ');
        contextParts.push(`Upcoming appointments: ${apptSummary}`);
    }

    return contextParts.join('\n');
}

// ─── System Prompt Builder ───

function buildSystemPrompt(userContext: string, mode: ChatbotMode): string {
    const modeDescriptions: Record<ChatbotMode, string> = {
        mother: 'You are speaking directly to the pregnant mother 🤱. Be warm, supportive, and deeply empathetic. Provide personalized advice based on her pregnancy week, health conditions, and diet preferences. Address her by name if known. Make her feel cared for and understood.',
        partner: 'You are speaking to the partner/father 💪. Help them understand how to support the mother effectively. Provide practical tips and emotional guidance for partners. Acknowledge their important role and encourage them warmly.',
        shared: 'You are speaking to both the mother and partner together 👨‍👩‍👧. Help them coordinate care, plan together, and support each other as a team. Encourage collaborative decision-making and celebrate their partnership.',
        admin_safe: 'You are providing safe, general pregnancy information in an admin-reviewed mode 📋. Keep responses factual and evidence-based while still being warm and approachable.',
    };

    return `You are MaternalCare AI, a compassionate and knowledgeable pregnancy support assistant embedded in the MaternalCare platform 🌸. You provide personalized, evidence-based pregnancy guidance tailored to each user's specific situation.

${modeDescriptions[mode]}

IMPORTANT RULES:
- Always be compassionate, non-judgmental, and culturally sensitive (especially for the Indian context — Indian diet, Indian medical system, Indian emergency numbers like 108) 🇮🇳
- Provide specific, actionable advice personalized to the user's pregnancy week, health conditions, diet, and symptoms
- If the user mentions any emergency symptoms (bleeding, severe headache, reduced fetal movement, severe pain, vision changes, fever with chills, fluid leaking, contractions before 37 weeks, thoughts of self-harm), IMMEDIATELY prioritize telling them to seek medical attention — do not delay 🚨
- Never diagnose or replace medical advice — always recommend consulting their healthcare provider for clinical decisions 👩‍⚕️
- Reference the user's pregnancy week, health conditions, and diet when giving nutrition, exercise, or symptom advice
- Keep responses concise but thorough (2-4 paragraphs typically, use bullet lists for multiple items)
- Use markdown formatting: **bold** for key points, bullet lists for enumerations
- End with a relevant follow-up question or suggestion to keep the conversation engaging
- Suggest specific actions the user can take within the MaternalCare platform (logging symptoms, checking weekly journey, viewing appointments, etc.)

🌍 MULTILINGUAL RESPONSE RULES (CRITICAL):
- ALWAYS respond in the SAME language and script that the user writes in. This is the most important rule.
- If the user writes in Hindi (Devanagari), respond in Devanagari Hindi — e.g., "मुझे चक्कर आ रहे हैं" → respond in Hindi
- If the user writes in Hinglish (Romanized Hindi/Urdu with words like "muje", "he", "kya", "nahi", "bahut", "aap", "tum", "hum", "kaise", "aisa", "waisa"), respond in Hinglish — e.g., "muje chakker aa rahe he" → respond in Hinglish like "Aree, chakkar aana pregnancy mein common hai lekin... 🤗"
- If the user writes in Bengali script, respond in Bengali; Tamil script → Tamil; Telugu script → Telugu; Marathi script → Marathi; Gujarati script → Gujarati; Kannada script → Kannada; Malayalam script → Malayalam; Odia script → Odia; Punjabi script → Punjabi; Urdu script → Urdu
- If the user writes in English, respond in English

🔤 ROMANIZED INDIAN LANGUAGES (CRITICAL — users often type Indian languages using English keyboard!):
Many users type their native language using the Latin alphabet (English keyboard). You MUST identify the language from the words used, NOT just assume it's Hindi/Hinglish. Look for these language-specific marker words:
  • ROMANIZED GUJARATI: Words like "chhe" (છે), "jevu" (જેવું), "thay" (થાય), "mane" (મને), "bov" (બોવ), "tame" (તમે), "kem" (કેમ), "shu" (શું), "pan" (પણ), "pachi" (પછી), "joiye" (જોઈએ), "avo" (આવો), "nathi" (નથી), "saru" (સારું), "kharab" (ખરાબ), "avse" (આવશે), "jode" (જોડે), "badhu" (બધું), "pagal" (પગલ) → If you see 2+ of these words, respond in GUJARATI SCRIPT (ગુજરાતી), NOT Hindi!
  • ROMANIZED BENGALI: Words like "ami" (আমি), "tumi" (তুমি), "kore" (করে), "khabo" (খাব), "bhalo" (ভালো), "ekta" (একটা), "kotha" (কথা), "kintu" (কিন্তু), "jodi" (যদি), "thik" (ঠিক), "ekhon" (এখন), "kemon" (কেমন), "kichu" (কিছু), "hobe" (হবে), "lage" (লাগে), "bujhte" (বুঝতে) → respond in BENGALI SCRIPT (বাংলা), NOT Hindi!
  • ROMANIZED TAMIL: Words like "irukku" (இருக்கு), "venum" (வேணும்), "illa" (இல்ல), "romba" (ரொம்ப), "nalla" (நல்லா), "enna" (என்ன), "ippo" (இப்போ), "anga" (அங்க), "inga" (இங்க), "pannu" (பண்ணு), "teriyum" (தெரியும்), "varum" (வரும்), "pogum" (போகும்), "konjam" (கொஞ்சம்), "nalla" (நல்ல) → respond in TAMIL SCRIPT (தமிழ்), NOT Hindi!
  • ROMANIZED TELUGU: Words like "undi" (ఉంది), "kavali" (కావాలి), "ledu" (లేదు), "chala" (చాలా), "baga" (బాగా), "emiti" (ఏమిటి), "ippudu" (ఇప్పుడు), "akkada" (అక్కడ), "ikkada" (ఇక్కడ), "cheppu" (చెప్పు), "telusu" (తెలుసు), "vastundi" (వస్తుంది), "avutundi" (అవుతుంది) → respond in TELUGU SCRIPT (తెలుగు), NOT Hindi!
  • ROMANIZED MARATHI: Words like "ahe" (आहे), "pahije" (पाहिजे), "nahi" (नाही), "khup" (खूप), "changla" (छान), "kay" (काय), "ithe" (इथे), "tikde" (तिकडे), "mhanje" (म्हणजे), "pan" (पण), "mala" (मला), "tula" (तुला), "barobar" (बरोबर), "vatat" (वाटत) → respond in MARATHI SCRIPT (देवनागरी मराठी), NOT Hindi!
  • ROMANIZED KANNADA: Words like "ide" (ಇದೆ), "beku" (ಬೇಕು), "illa" (ಇಲ್ಲ), "tumba" (ತುಂಬಾ), "chennagi" (ಚೆನ್ನಾಗಿ), "enu" (ಏನು), "illi" (ಇಲ್ಲಿ), "alli" (ಅಲ್ಲಿ), "maadi" (ಮಾಡಿ), "gottu" (ಗೊತ್ತು), "aagide" (ಆಗಿದೆ), "barutte" (ಬರುತ್ತೆ) → respond in KANNADA SCRIPT (ಕನ್ನಡ), NOT Hindi!
  • ROMANIZED MALAYALAM: Words like "und" (ഉണ്ട്), "venam" (വേണം), "illa" (ഇല്ല), "valare" (വളരെ), "nallath" (നല്ലത്), "enth" (എന്ത്), "ivide" (ഇവിടെ), "avid" (അവിടെ), "cheyyam" (ചെയ്യാം), "ariyam" (അറിയാം), "varum" (വരും), "aanu" (ആണ്), "kurach" (കുറച്ച്) → respond in MALAYALAM SCRIPT (മലയാളം), NOT Hindi!
  • ROMANIZED PUNJABI: Words like "hai" (ਹੈ), "chahida" (ਚਾਹੀਦਾ), "nahi" (ਨਹੀਂ), "bahut" (ਬਹੁਤ), "vadia" (ਵਧੀਆ), "ki" (ਕੀ), "ithe" (ਇੱਥੇ), "othe" (ਓਥੇ), "karda" (ਕਰਦਾ), "lagda" (ਲੱਗਦਾ), "hunda" (ਹੁੰਦਾ), "tusi" (ਤੁਸੀਂ), "mainu" (ਮੈਨੂੰ), "tenu" (ਤੈਨੂੰ) → respond in PUNJABI SCRIPT (ਪੰਜਾਬੀ — Gurmukhi), NOT Hindi!

- If the user mixes languages (e.g., English + Gujarati, English + Hindi), match their mix proportion — respond in the same blended style
- NEVER respond in Hindi when the user wrote in Romanized Gujarati/Bengali/Tamil/etc. — this is a common mistake and feels alienating
- NEVER respond in English when the user wrote in a different language — this feels alienating
- If you're unsure which Romanized language the user is using, ask politely: "Could you tell me which language you're writing in? 😊" — but try to guess from the words first!
- Keep the tone natural and conversational in whatever language you use — not formal or textbook-like
- Use culturally appropriate expressions and empathy in the local language (e.g., "Aree" in Hinglish, "અરે" in Gujarati, "ஏய்" in Tamil, "अरे" in Marathi, "അയ്യോ" in Malayalam, "ಅಯ್ಯೋ" in Kannada)

💖 EMPATHY & EMOJI RULES:
- Use relevant emojis throughout your responses to convey warmth and care — but don't overdo it (2-5 emojis per response is ideal)
- Common emojis to use contextually: 🤗 (comfort), 💕 (love/care), 🤱 (pregnancy/mother), 👶 (baby), 🍎 (nutrition), 💊 (medication), 🏃‍♀️ (exercise), 😴 (sleep/rest), 💧 (hydration), ⚠️ (caution), 🚨 (emergency), 👩‍⚕️ (doctor), 💪 (strength/support), 🌸 (gentleness), 🙏 (respect/blessings), ❤️ (love), 😊 (warmth), 🥺 (concern), 🍽️ (food), ☀️ (positivity)
- Show genuine concern when the user mentions discomfort: "I understand this must be difficult 🥺" or Hinglish: "Aree, yeh mushkil hai na 🥺"
- Celebrate milestones and positive news: "That's wonderful! 🎉💕"
- When giving reassurance: "You're doing great! 💪🌸"
- Emergency responses should still use ⚠️🚨 but remain compassionate, not robotic

USER CONTEXT:
${userContext}

Respond to the user's message with personalized, helpful guidance based on their specific context above. Remember: match their language exactly and be warm with emojis 💕`;
}

// ─── Suggested Actions Generator ───

function generateSuggestedActions(mode: ChatbotMode, message: string): string[] {
    const lower = message.toLowerCase();

    if (/symptom|pain|nausea|feel/i.test(lower)) {
        return mode === 'mother'
            ? ['log_symptom', 'view_symptom_history', 'emergency_guidance']
            : ['partner_dashboard', 'support_actions'];
    }
    if (/eat|food|diet|nutrition|meal/i.test(lower)) {
        return ['wellness_page', 'weekly_guidance', 'supplement_reminder'];
    }
    if (/exercise|walk|yoga|activity|movement/i.test(lower)) {
        return ['wellness_page', 'weekly_guidance'];
    }
    if (/appointment|doctor|checkup|scan|ultrasound/i.test(lower)) {
        return ['view_appointments', 'add_appointment', 'prepare_questions'];
    }
    if (/week|how far|pregnancy week|gestation/i.test(lower)) {
        return ['view_dashboard', 'weekly_guidance', 'check_milestones'];
    }
    if (/help her|support|partner|how to help/i.test(lower)) {
        return ['partner_dashboard', 'support_actions', 'check_in'];
    }
    if (/sad|anxious|stress|mood|emotional|depressed/i.test(lower)) {
        return mode === 'mother'
            ? ['log_mood', 'support_resources', 'talk_to_provider']
            : ['emotional_support_tips', 'partner_dashboard'];
    }
    if (/warning|danger|sign|should i worry|red flag/i.test(lower)) {
        return ['emergency_guidance', 'contact_provider'];
    }
    if (/remind|reminder|notification/i.test(lower)) {
        return ['view_reminders', 'settings', 'notification_preferences'];
    }

    // Default suggestions per mode
    switch (mode) {
        case 'mother':
            return ['check_week', 'log_symptom', 'view_reminders', 'weekly_guidance'];
        case 'partner':
            return ['view_support_actions', 'appointment_prep', 'emotional_support_tips'];
        case 'shared':
            return ['view_shared_tasks', 'check_calendar', 'add_note'];
        default:
            return ['check_week', 'log_symptom', 'view_reminders'];
    }
}

// ─── Fallback Responses (if Groq API is unavailable) ───

function getFallbackResponse(mode: ChatbotMode): string {
    switch (mode) {
        case 'mother':
            return 'I\'m here to support you through your pregnancy journey 🤗💕 I can help you track your week, log symptoms, set reminders, and find personalized guidance. What would you like help with today? 🌸';
        case 'partner':
            return 'I\'m here to help you provide meaningful support 💪🤗 Check your Partner Dashboard for today\'s actions, or ask me about specific ways to help. What would you like guidance on? 🌸';
        case 'shared':
            return 'I\'m here to help coordinate your pregnancy care together 👨‍👩‍👧💕 You can check shared tasks, upcoming milestones, and plan collaboratively. What would you like to explore? 🌸';
        default:
            return 'I\'m here to help with your pregnancy care questions 🤗💕 What would you like to know? 🌸';
    }
}

// ─── Main Chatbot Handler ───

export async function handleChatbotMessage(req: ChatbotRequest): Promise<ChatbotResponse> {
    const { userId, message, mode, sessionId } = req;

    // ── Emergency pre-check — always intercept emergency keywords first ──
    if (detectEmergencyKeywords(message).length > 0) {
        let session = sessionId
            ? await prisma.chatbotSession.findUnique({ where: { id: sessionId } })
            : null;

        if (!session) {
            session = await prisma.chatbotSession.create({
                data: { userId, mode },
            });
        }

        // Store user message
        await prisma.chatbotMessage.create({
            data: {
                sessionId: session.id,
                senderType: 'user',
                messageText: message,
            },
        });

        // Log escalation event
        await prisma.chatbotEscalationEvent.create({
            data: {
                sessionId: session.id,
                escalationType: 'emergency',
            },
        });

        // Store bot response
        await prisma.chatbotMessage.create({
            data: {
                sessionId: session.id,
                senderType: 'system',
                messageText: EMERGENCY_RESPONSE.message,
            },
        });

        return {
            ...EMERGENCY_RESPONSE,
            sessionId: session.id,
            suggestedActions: ['seek_immediate_care', 'call_108', 'go_to_hospital'],
        };
    }

    // ── Get or create session ──
    let session = sessionId
        ? await prisma.chatbotSession.findUnique({ where: { id: sessionId } })
        : null;

    if (!session) {
        session = await prisma.chatbotSession.create({
            data: { userId, mode },
        });
    }

    // Store user message
    await prisma.chatbotMessage.create({
        data: {
            sessionId: session.id,
            senderType: 'user',
            messageText: message,
        },
    });

    // ── Build personalized context ──
    let userContext: string;
    try {
        userContext = await buildUserContext(userId, mode);
    } catch (ctxErr) {
        logger.error('Failed to build user context', 'chatbot', ctxErr instanceof Error ? ctxErr : undefined);
        userContext = `Chat mode: ${mode}`;
    }

    const systemPrompt = buildSystemPrompt(userContext, mode);
    const systemPromptSize = systemPrompt.length;

    // ── Fetch recent conversation history for context continuity ──
    const recentMessages = await prisma.chatbotMessage.findMany({
        where: { sessionId: session.id },
        orderBy: { createdAt: 'asc' },
        take: 20,
    });

    const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = recentMessages.map(m => ({
        role: m.senderType === 'user' ? 'user' : 'assistant',
        content: m.messageText,
    }));

    // ── Call Groq API for dynamic AI response ──
    let responseMessage = '';
    const suggestedActions = generateSuggestedActions(mode, message);

    try {
        const chatCompletion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                ...conversationHistory,
            ],
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 0.9,
        });

        // ── Diagnostic: log raw response structure to debug empty content issue ──
        const rawChoice = chatCompletion.choices[0];
        const finishReason = rawChoice?.finish_reason ?? 'none';
        const rawContent = rawChoice?.message?.content ?? null;
        const contentLen = typeof rawContent === 'string' ? rawContent.length : 0;

        logger.info(
            `Groq response diagnostic | finish_reason=${finishReason} contentLen=${contentLen} totalTokens=${chatCompletion.usage?.total_tokens ?? '?'} promptTokens=${chatCompletion.usage?.prompt_tokens ?? '?'} completionTokens=${chatCompletion.usage?.completion_tokens ?? '?'} systemPromptSize=${systemPromptSize} historyMsgs=${conversationHistory.length} mode=${mode}`,
            'chatbot',
            { contentPreview: typeof rawContent === 'string' ? rawContent.slice(0, 200) : String(rawContent) },
        );

        responseMessage = rawContent || '';

        // ── If the model returned empty/near-empty content (e.g. huge system prompt
        //     overwhelms the model → 1 token output), retry with a minimal prompt ──
        if (!responseMessage.trim() || responseMessage.trim().length < 5) {
            logger.warn(
                `Groq API returned empty/negligible content (finish_reason=${finishReason} contentLen=${responseMessage.trim().length})`,
                'chatbot',
                { mode, systemPromptSize, finishReason, rawContent: rawContent ? String(rawContent).slice(0, 100) : '(null)' },
            );

            try {
                const safeContext = `Chat mode: ${mode}. User ID: ${userId}. You are a supportive pregnancy AI assistant.`;
                const safeSystemPrompt = buildSystemPrompt(safeContext, mode);
                logger.info('Retrying with minimal safe system prompt', 'chatbot', { safeSize: safeSystemPrompt.length });

                const safeCompletion = await groq.chat.completions.create({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: safeSystemPrompt },
                        { role: 'user', content: message },
                    ],
                    temperature: 0.7,
                    max_tokens: 1024,
                    top_p: 0.9,
                });

                const safeContent = safeCompletion.choices[0]?.message?.content || '';
                if (!safeContent.trim() || safeContent.trim().length < 5) {
                    logger.warn('Safe retry also returned empty content', 'chatbot', {
                        finishReason: safeCompletion.choices[0]?.finish_reason,
                        safeContentLen: safeContent.trim().length,
                    });
                    responseMessage = getFallbackResponse(mode);
                } else {
                    logger.info(`Safe retry succeeded (${safeContent.trim().length} chars)`, 'chatbot');
                    responseMessage = safeContent;
                }
            } catch (safeErr) {
                logger.error('Safe retry failed', 'chatbot', safeErr instanceof Error ? safeErr : undefined);
                responseMessage = getFallbackResponse(mode);
            }
        }
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : String(err);
        const errStack = err instanceof Error ? err.stack : undefined;
        logger.error(`Groq API error: ${errMessage}`, 'chatbot', err instanceof Error ? err : undefined, { mode, systemPromptSize });

        // ── Retry with minimal system prompt (no pregnancy knowledge, no health data) ──
        try {
            const minimalContext = `Chat mode: ${mode}. User ID: ${userId}.`;
            const minimalSystemPrompt = buildSystemPrompt(minimalContext, mode);
            logger.info('Retrying Groq API with minimal system prompt', 'chatbot', { minimalSize: minimalSystemPrompt.length });

            const retryCompletion = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: minimalSystemPrompt },
                    { role: 'user', content: message },
                ],
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 0.9,
            });

            responseMessage = retryCompletion.choices[0]?.message?.content || '';

            if (!responseMessage.trim()) {
                logger.warn('Groq API retry returned empty response', 'chatbot');
                responseMessage = getFallbackResponse(mode);
            } else {
                logger.info('Groq API retry succeeded with minimal prompt', 'chatbot');
            }
        } catch (retryErr) {
            const retryMsg = retryErr instanceof Error ? retryErr.message : String(retryErr);
            logger.error(`Groq API retry also failed: ${retryMsg}`, 'chatbot', retryErr instanceof Error ? retryErr : undefined);
            responseMessage = getFallbackResponse(mode);
        }
    }

    // Store bot response
    await prisma.chatbotMessage.create({
        data: {
            sessionId: session.id,
            senderType: 'bot',
            messageText: responseMessage,
        },
    });

    return {
        message: responseMessage,
        isEmergency: false,
        sessionId: session.id,
        suggestedActions,
    };
}

// ─── Get Chat History ───

export async function getChatHistory(sessionId: string) {
    const messages = await prisma.chatbotMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
        take: 100,
    });

    return messages.map(m => ({
        id: m.id,
        sender: m.senderType as 'user' | 'bot' | 'system',
        text: m.messageText,
        timestamp: m.createdAt,
    }));
}