import { NextRequest } from 'next/server';
import { Groq } from 'groq-sdk';
import { success, badRequest, tooManyRequests } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import { rateLimit, getClientIP } from '@/lib/rate-limit';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are Vatsalya AI, an empathetic maternal healthcare assistant designed for Indian families.

You provide pregnancy guidance, emotional support, nutritional suggestions, wellness advice, and parenting guidance.

You do not diagnose diseases.

You do not prescribe medicines.

If symptoms appear severe or dangerous, recommend consulting a healthcare professional immediately.

Keep responses simple, supportive, and easy to understand.`;

const EMERGENCY_KEYWORDS = [
  'bleeding',
  'severe pain',
  'chest pain',
  'fainting',
  'faint',
  'seizure',
  'unconscious',
  'heavy bleeding',
  'vaginal bleeding',
  'abdominal pain',
  'head injury',
  'difficulty breathing',
  'shortness of breath',
];

function detectEmergency(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return EMERGENCY_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

// Public chatbot rate limit: 10 requests per minute per IP (no auth, so must be strict)
const CHAT_RATE_LIMIT = { maxRequests: 10, windowMs: 60_000 };

export async function POST(req: NextRequest) {
  try {
    // Rate limiting for public endpoint (no auth)
    const clientIp = getClientIP(req);
    const rateLimitResult = rateLimit(clientIp, CHAT_RATE_LIMIT);
    if (!rateLimitResult.allowed) {
      logger.warn('Chat rate limit exceeded', 'chat', { ip: clientIp });
      return tooManyRequests('Too many requests. Please wait a moment before sending another message.');
    }

    logger.debug('Chat API called', 'chat', { groqKeyConfigured: !!process.env.GROQ_API_KEY });

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return badRequest('Message is required and must be a string');
    }

    logger.debug('Chat message received', 'chat', { messageLength: message.length });

    // Check for emergency keywords
    const isEmergency = detectEmergency(message);
    let enhancedMessage = message;

    if (isEmergency) {
      enhancedMessage = `EMERGENCY CONTEXT: The user is reporting symptoms that may require immediate medical attention. ${message}`;
    }

    logger.debug('Calling Groq API', 'chat');
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: enhancedMessage,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
    });

    logger.debug('Groq API response received', 'chat', { isEmergency });
    const response = chatCompletion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    // Prepend emergency warning if emergency was detected
    let finalResponse = response;
    if (isEmergency) {
      finalResponse = `⚠️ This may require immediate medical attention. Please contact a healthcare professional immediately.\n\n${response}`;
    }

    return success({
      response: finalResponse,
      isEmergency,
    });
  } catch (error) {
    logger.error('Chat API error:', 'chat', error instanceof Error ? error : undefined, { errorDetails: String(error) });
    return badRequest('Failed to process chat message');
  }
}
