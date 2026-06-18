import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, created, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

// ─── BMI Calculation ───
function calcBMI(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

function bmiCategory(bmi: number): string {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'healthy';
    if (bmi < 30) return 'overweight';
    return 'obese';
}

// ─── Schemas ───
const createHealthProfileSchema = z.object({
    height: z.number().positive('Height must be positive'),
    weight: z.number().positive('Weight must be positive'),
    age: z.number().int().positive('Age must be positive'),
    occupation: z.string().min(1, 'Occupation is required'),
    workingHours: z.number().int().min(0, 'Working hours must be 0 or more').max(24, 'Working hours cannot exceed 24'),
    livingWithMother: z.boolean(),
    isFirstTimeFather: z.boolean(),
    // Medical history
    diabetes: z.boolean().default(false),
    highBP: z.boolean().default(false),
    lowBP: z.boolean().default(false),
    thyroidDisorder: z.boolean().default(false),
    pcos: z.boolean().default(false),
    asthma: z.boolean().default(false),
    heartDisease: z.boolean().default(false),
    kidneyIssues: z.boolean().default(false),
    epilepsy: z.boolean().default(false),
    anemia: z.boolean().default(false),
    depressionAnxiety: z.boolean().default(false),
    // Lifestyle
    smokingStatus: z.enum(['never', 'former', 'current']),
    tobaccoConsumption: z.boolean().default(false),
    drugExposure: z.boolean().default(false),
    physicalActivity: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active']),
});

const updateHealthProfileSchema = z.object({
    height: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    age: z.number().int().positive().optional(),
    occupation: z.string().min(1).optional(),
    workingHours: z.number().int().min(0).max(24).optional(),
    livingWithMother: z.boolean().optional(),
    isFirstTimeFather: z.boolean().optional(),
    diabetes: z.boolean().optional(),
    highBP: z.boolean().optional(),
    lowBP: z.boolean().optional(),
    thyroidDisorder: z.boolean().optional(),
    pcos: z.boolean().optional(),
    asthma: z.boolean().optional(),
    heartDisease: z.boolean().optional(),
    kidneyIssues: z.boolean().optional(),
    epilepsy: z.boolean().optional(),
    anemia: z.boolean().optional(),
    depressionAnxiety: z.boolean().optional(),
    smokingStatus: z.enum(['never', 'former', 'current']).optional(),
    tobaccoConsumption: z.boolean().optional(),
    drugExposure: z.boolean().optional(),
    physicalActivity: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active']).optional(),
});

// ─── GET: Fetch father health profile ───
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const profile = await prisma.fatherHealthProfile.findUnique({
            where: { userId: payload.userId },
        });

        if (!profile) return notFound('Father health profile');

        const bmiCat = bmiCategory(profile.bmi);
        return success({ ...profile, bmiCategory: bmiCat });
    } catch (err) {
        logger.error('Get father health profile error:', 'father-health', err instanceof Error ? err : undefined);
        return notFound('Father health profile');
    }
}

// ─── POST: Create father health profile ───
export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = createHealthProfileSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        // Check if profile already exists
        const existing = await prisma.fatherHealthProfile.findUnique({
            where: { userId: payload.userId },
        });
        if (existing) return badRequest('Profile already exists. Use PUT to update.');

        // Calculate BMI
        const bmi = calcBMI(parsed.data.weight, parsed.data.height);
        const bmiCat = bmiCategory(bmi);

        const profile = await prisma.fatherHealthProfile.create({
            data: {
                userId: payload.userId,
                height: parsed.data.height,
                weight: parsed.data.weight,
                bmi,
                age: parsed.data.age,
                occupation: stripHtml(parsed.data.occupation),
                workingHours: parsed.data.workingHours,
                livingWithMother: parsed.data.livingWithMother,
                isFirstTimeFather: parsed.data.isFirstTimeFather,
                diabetes: parsed.data.diabetes,
                highBP: parsed.data.highBP,
                lowBP: parsed.data.lowBP,
                thyroidDisorder: parsed.data.thyroidDisorder,
                pcos: parsed.data.pcos,
                asthma: parsed.data.asthma,
                heartDisease: parsed.data.heartDisease,
                kidneyIssues: parsed.data.kidneyIssues,
                epilepsy: parsed.data.epilepsy,
                anemia: parsed.data.anemia,
                depressionAnxiety: parsed.data.depressionAnxiety,
                smokingStatus: parsed.data.smokingStatus,
                tobaccoConsumption: parsed.data.tobaccoConsumption,
                drugExposure: parsed.data.drugExposure,
                physicalActivity: parsed.data.physicalActivity,
                profileCompleted: true,
            },
        });

        return created({ ...profile, bmiCategory: bmiCat });
    } catch (err) {
        logger.error('Create father health profile error:', 'father-health', err instanceof Error ? err : undefined);
        return badRequest('Failed to create father health profile');
    }
}

// ─── PUT: Update father health profile ───
export async function PUT(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = updateHealthProfileSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        const existing = await prisma.fatherHealthProfile.findUnique({
            where: { userId: payload.userId },
        });
        if (!existing) return notFound('Father health profile');

        // Recalculate BMI if height or weight changed
        const height = parsed.data.height ?? existing.height;
        const weight = parsed.data.weight ?? existing.weight;
        const bmi = (parsed.data.height !== undefined || parsed.data.weight !== undefined)
            ? calcBMI(weight, height)
            : existing.bmi;

        const profile = await prisma.fatherHealthProfile.update({
            where: { userId: payload.userId },
            data: {
                ...(parsed.data.height !== undefined && { height: parsed.data.height }),
                ...(parsed.data.weight !== undefined && { weight: parsed.data.weight }),
                bmi,
                ...(parsed.data.age !== undefined && { age: parsed.data.age }),
                ...(parsed.data.occupation !== undefined && { occupation: stripHtml(parsed.data.occupation) }),
                ...(parsed.data.workingHours !== undefined && { workingHours: parsed.data.workingHours }),
                ...(parsed.data.livingWithMother !== undefined && { livingWithMother: parsed.data.livingWithMother }),
                ...(parsed.data.isFirstTimeFather !== undefined && { isFirstTimeFather: parsed.data.isFirstTimeFather }),
                ...(parsed.data.diabetes !== undefined && { diabetes: parsed.data.diabetes }),
                ...(parsed.data.highBP !== undefined && { highBP: parsed.data.highBP }),
                ...(parsed.data.lowBP !== undefined && { lowBP: parsed.data.lowBP }),
                ...(parsed.data.thyroidDisorder !== undefined && { thyroidDisorder: parsed.data.thyroidDisorder }),
                ...(parsed.data.pcos !== undefined && { pcos: parsed.data.pcos }),
                ...(parsed.data.asthma !== undefined && { asthma: parsed.data.asthma }),
                ...(parsed.data.heartDisease !== undefined && { heartDisease: parsed.data.heartDisease }),
                ...(parsed.data.kidneyIssues !== undefined && { kidneyIssues: parsed.data.kidneyIssues }),
                ...(parsed.data.epilepsy !== undefined && { epilepsy: parsed.data.epilepsy }),
                ...(parsed.data.anemia !== undefined && { anemia: parsed.data.anemia }),
                ...(parsed.data.depressionAnxiety !== undefined && { depressionAnxiety: parsed.data.depressionAnxiety }),
                ...(parsed.data.smokingStatus !== undefined && { smokingStatus: parsed.data.smokingStatus }),
                ...(parsed.data.tobaccoConsumption !== undefined && { tobaccoConsumption: parsed.data.tobaccoConsumption }),
                ...(parsed.data.drugExposure !== undefined && { drugExposure: parsed.data.drugExposure }),
                ...(parsed.data.physicalActivity !== undefined && { physicalActivity: parsed.data.physicalActivity }),
            },
        });

        const bmiCat = bmiCategory(profile.bmi);
        return success({ ...profile, bmiCategory: bmiCat });
    } catch (err) {
        logger.error('Update father health profile error:', 'father-health', err instanceof Error ? err : undefined);
        return badRequest('Failed to update father health profile');
    }
}