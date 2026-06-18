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
    city: z.string().min(1, 'City is required'),
    age: z.number().int().positive('Age must be positive'),
    weeksOfPregnancy: z.number().int().min(0, 'Weeks must be 0 or more').max(42, 'Weeks cannot exceed 42').default(0),
    isFirstPregnancy: z.boolean(),
    numberOfChildren: z.number().int().min(0).optional(),
    lmpDate: z.string().optional(),
    dueDate: z.string().optional(),
    bloodGroup: z.string().min(1, 'Blood group is required'),
    allergies: z.string().optional(),
    medications: z.string().optional(),
    diet: z.enum(['veg', 'non-veg']),
    husbandName: z.string().min(1, 'Husband name is required'),
    emergencyContact: z.string().min(1, 'Emergency contact is required'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
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
    // Previous pregnancy history
    previousMiscarriage: z.boolean().optional(),
    previousCSection: z.boolean().optional(),
    previousPrematureDelivery: z.boolean().optional(),
    previousStillBirth: z.boolean().optional(),
    pregnancyComplications: z.string().optional(),
    // Lifestyle
    smokingExposure: z.boolean().default(false),
    alcoholExposure: z.boolean().default(false),
    // Postpartum-specific
    deliveryType: z.enum(['vaginal', 'c-section', 'assisted']).optional(),
    deliveryDate: z.string().optional(),
    breastfeedingStatus: z.enum(['exclusive', 'mixed', 'formula']).optional(),
    babyBirthWeight: z.number().positive().optional(),
    babyGender: z.enum(['boy', 'girl', 'prefer-not-say']).optional(),
    deliveryComplications: z.string().optional(),
    babyCount: z.number().int().min(1).max(10).optional(),
    nicuStay: z.boolean().optional(),
    nicuStayDuration: z.number().int().positive().optional(),
    postpartumSupport: z.string().optional(),
}).refine(
    data => {
        // If both LMP and due date are provided, validate consistency
        if (data.lmpDate && data.dueDate) {
            const lmp = new Date(data.lmpDate);
            const due = new Date(data.dueDate);
            if (isNaN(lmp.getTime()) || isNaN(due.getTime())) return true; // Let Zod date validation handle
            const expectedDue = new Date(lmp.getTime() + 280 * 86400000);
            const diffDays = Math.abs((due.getTime() - expectedDue.getTime()) / 86400000);
            // Allow ±21 days tolerance (about 3 weeks) for natural variation
            return diffDays <= 21;
        }
        return true;
    },
    {
        message: 'Due date is inconsistent with LMP date. Expected due date should be approximately 280 days (40 weeks) after LMP.',
        path: ['dueDate'],
    }
);

const updateHealthProfileSchema = z.object({
    height: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    city: z.string().min(1).optional(),
    age: z.number().int().positive().optional(),
    weeksOfPregnancy: z.number().int().min(0).max(42).optional(),
    isFirstPregnancy: z.boolean().optional(),
    numberOfChildren: z.number().int().min(0).optional(),
    lmpDate: z.string().optional(),
    dueDate: z.string().optional(),
    bloodGroup: z.string().min(1).optional(),
    allergies: z.string().optional(),
    medications: z.string().optional(),
    diet: z.enum(['veg', 'non-veg']).optional(),
    husbandName: z.string().min(1).optional(),
    emergencyContact: z.string().min(1).optional(),
    phoneNumber: z.string().min(1).optional(),
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
    previousMiscarriage: z.boolean().optional(),
    previousCSection: z.boolean().optional(),
    previousPrematureDelivery: z.boolean().optional(),
    previousStillBirth: z.boolean().optional(),
    pregnancyComplications: z.string().optional(),
    smokingExposure: z.boolean().optional(),
    alcoholExposure: z.boolean().optional(),
    deliveryType: z.enum(['vaginal', 'c-section', 'assisted']).optional(),
    deliveryDate: z.string().optional(),
    breastfeedingStatus: z.enum(['exclusive', 'mixed', 'formula']).optional(),
    babyBirthWeight: z.number().positive().optional(),
    babyGender: z.enum(['boy', 'girl', 'prefer-not-say']).optional(),
    // Postpartum-specific
    deliveryComplications: z.string().optional(),
    babyCount: z.number().int().min(1).max(10).optional(),
    nicuStay: z.boolean().optional(),
    nicuStayDuration: z.number().int().positive().optional(),
    postpartumSupport: z.string().optional(),
}).refine(
    data => {
        // If both LMP and due date are provided, validate consistency
        if (data.lmpDate && data.dueDate) {
            const lmp = new Date(data.lmpDate);
            const due = new Date(data.dueDate);
            if (isNaN(lmp.getTime()) || isNaN(due.getTime())) return true;
            const expectedDue = new Date(lmp.getTime() + 280 * 86400000);
            const diffDays = Math.abs((due.getTime() - expectedDue.getTime()) / 86400000);
            return diffDays <= 21;
        }
        return true;
    },
    {
        message: 'Due date is inconsistent with LMP date. Expected due date should be approximately 280 days (40 weeks) after LMP.',
        path: ['dueDate'],
    }
);

// ─── GET: Fetch mother health profile ───
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const profile = await prisma.motherHealthProfile.findUnique({
            where: { userId: payload.userId },
        });

        if (!profile) return notFound('Mother health profile');

        const bmiCat = bmiCategory(profile.bmi);
        return success({ ...profile, bmiCategory: bmiCat });
    } catch (err) {
        logger.error('Get mother health profile error:', 'mother-health', err instanceof Error ? err : undefined);
        return notFound('Mother health profile');
    }
}

// ─── POST: Create mother health profile ───
export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = createHealthProfileSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        // Check if profile already exists
        const existing = await prisma.motherHealthProfile.findUnique({
            where: { userId: payload.userId },
        });
        if (existing) return badRequest('Profile already exists. Use PUT to update.');

        // Calculate BMI
        const bmi = calcBMI(parsed.data.weight, parsed.data.height);
        const bmiCat = bmiCategory(bmi);

        const profile = await prisma.motherHealthProfile.create({
            data: {
                userId: payload.userId,
                height: parsed.data.height,
                weight: parsed.data.weight,
                bmi,
                city: stripHtml(parsed.data.city),
                age: parsed.data.age,
                weeksOfPregnancy: parsed.data.weeksOfPregnancy,
                isFirstPregnancy: parsed.data.isFirstPregnancy,
                numberOfChildren: parsed.data.isFirstPregnancy ? null : (parsed.data.numberOfChildren ?? 0),
                lmpDate: parsed.data.lmpDate ? new Date(parsed.data.lmpDate) : null,
                dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
                bloodGroup: parsed.data.bloodGroup,
                allergies: parsed.data.allergies ? stripHtml(parsed.data.allergies) : '',
                medications: parsed.data.medications ? stripHtml(parsed.data.medications) : '',
                diet: parsed.data.diet,
                husbandName: stripHtml(parsed.data.husbandName),
                emergencyContact: stripHtml(parsed.data.emergencyContact),
                phoneNumber: stripHtml(parsed.data.phoneNumber),
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
                previousMiscarriage: parsed.data.previousMiscarriage,
                previousCSection: parsed.data.previousCSection,
                previousPrematureDelivery: parsed.data.previousPrematureDelivery,
                previousStillBirth: parsed.data.previousStillBirth,
                pregnancyComplications: parsed.data.pregnancyComplications ? stripHtml(parsed.data.pregnancyComplications) : null,
                smokingExposure: parsed.data.smokingExposure,
                alcoholExposure: parsed.data.alcoholExposure,
                deliveryType: parsed.data.deliveryType ?? null,
                deliveryDate: parsed.data.deliveryDate ? new Date(parsed.data.deliveryDate) : null,
                breastfeedingStatus: parsed.data.breastfeedingStatus ?? null,
                babyBirthWeight: parsed.data.babyBirthWeight ?? null,
                babyGender: parsed.data.babyGender ?? null,
                deliveryComplications: parsed.data.deliveryComplications ?? null,
                babyCount: parsed.data.babyCount ?? null,
                nicuStay: parsed.data.nicuStay ?? null,
                nicuStayDuration: parsed.data.nicuStayDuration ?? null,
                postpartumSupport: parsed.data.postpartumSupport ?? null,
                profileCompleted: true,
            },
        });

        return created({ ...profile, bmiCategory: bmiCat });
    } catch (err) {
        logger.error('Create mother health profile error:', 'mother-health', err instanceof Error ? err : undefined);
        return badRequest('Failed to create mother health profile');
    }
}

// ─── PUT: Update mother health profile ───
export async function PUT(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = updateHealthProfileSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        const existing = await prisma.motherHealthProfile.findUnique({
            where: { userId: payload.userId },
        });
        if (!existing) return notFound('Mother health profile');

        // Recalculate BMI if height or weight changed
        const height = parsed.data.height ?? existing.height;
        const weight = parsed.data.weight ?? existing.weight;
        const bmi = (parsed.data.height !== undefined || parsed.data.weight !== undefined)
            ? calcBMI(weight, height)
            : existing.bmi;

        // If isFirstPregnancy is being toggled, handle numberOfChildren
        let numberOfChildren: number | null | undefined = parsed.data.numberOfChildren;
        if (parsed.data.isFirstPregnancy === true) {
            numberOfChildren = null;
        } else if (parsed.data.isFirstPregnancy === false && numberOfChildren === undefined) {
            numberOfChildren = existing.numberOfChildren ?? 0;
        }

        const profile = await prisma.motherHealthProfile.update({
            where: { userId: payload.userId },
            data: {
                ...(parsed.data.height !== undefined && { height: parsed.data.height }),
                ...(parsed.data.weight !== undefined && { weight: parsed.data.weight }),
                bmi,
                ...(parsed.data.city !== undefined && { city: stripHtml(parsed.data.city) }),
                ...(parsed.data.age !== undefined && { age: parsed.data.age }),
                ...(parsed.data.weeksOfPregnancy !== undefined && { weeksOfPregnancy: parsed.data.weeksOfPregnancy }),
                ...(parsed.data.isFirstPregnancy !== undefined && { isFirstPregnancy: parsed.data.isFirstPregnancy }),
                ...(numberOfChildren !== undefined && { numberOfChildren }),
                ...(parsed.data.lmpDate !== undefined && { lmpDate: parsed.data.lmpDate ? new Date(parsed.data.lmpDate) : null }),
                ...(parsed.data.dueDate !== undefined && { dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null }),
                ...(parsed.data.bloodGroup !== undefined && { bloodGroup: parsed.data.bloodGroup }),
                ...(parsed.data.allergies !== undefined && { allergies: parsed.data.allergies ? stripHtml(parsed.data.allergies) : '' }),
                ...(parsed.data.medications !== undefined && { medications: parsed.data.medications ? stripHtml(parsed.data.medications) : '' }),
                ...(parsed.data.diet !== undefined && { diet: parsed.data.diet }),
                ...(parsed.data.husbandName !== undefined && { husbandName: stripHtml(parsed.data.husbandName) }),
                ...(parsed.data.emergencyContact !== undefined && { emergencyContact: stripHtml(parsed.data.emergencyContact) }),
                ...(parsed.data.phoneNumber !== undefined && { phoneNumber: stripHtml(parsed.data.phoneNumber) }),
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
                ...(parsed.data.previousMiscarriage !== undefined && { previousMiscarriage: parsed.data.previousMiscarriage }),
                ...(parsed.data.previousCSection !== undefined && { previousCSection: parsed.data.previousCSection }),
                ...(parsed.data.previousPrematureDelivery !== undefined && { previousPrematureDelivery: parsed.data.previousPrematureDelivery }),
                ...(parsed.data.previousStillBirth !== undefined && { previousStillBirth: parsed.data.previousStillBirth }),
                ...(parsed.data.pregnancyComplications !== undefined && { pregnancyComplications: parsed.data.pregnancyComplications ? stripHtml(parsed.data.pregnancyComplications) : null }),
                ...(parsed.data.smokingExposure !== undefined && { smokingExposure: parsed.data.smokingExposure }),
                ...(parsed.data.alcoholExposure !== undefined && { alcoholExposure: parsed.data.alcoholExposure }),
                ...(parsed.data.deliveryType !== undefined && { deliveryType: parsed.data.deliveryType }),
                ...(parsed.data.deliveryDate !== undefined && { deliveryDate: parsed.data.deliveryDate ? new Date(parsed.data.deliveryDate) : null }),
                ...(parsed.data.breastfeedingStatus !== undefined && { breastfeedingStatus: parsed.data.breastfeedingStatus }),
                ...(parsed.data.babyBirthWeight !== undefined && { babyBirthWeight: parsed.data.babyBirthWeight }),
                ...(parsed.data.babyGender !== undefined && { babyGender: parsed.data.babyGender }),
                ...(parsed.data.deliveryComplications !== undefined && { deliveryComplications: parsed.data.deliveryComplications }),
                ...(parsed.data.babyCount !== undefined && { babyCount: parsed.data.babyCount }),
                ...(parsed.data.nicuStay !== undefined && { nicuStay: parsed.data.nicuStay }),
                ...(parsed.data.nicuStayDuration !== undefined && { nicuStayDuration: parsed.data.nicuStayDuration }),
                ...(parsed.data.postpartumSupport !== undefined && { postpartumSupport: parsed.data.postpartumSupport }),
            },
        });

        const bmiCat = bmiCategory(profile.bmi);
        return success({ ...profile, bmiCategory: bmiCat });
    } catch (err) {
        logger.error('Update mother health profile error:', 'mother-health', err instanceof Error ? err : undefined);
        return badRequest('Failed to update mother health profile');
    }
}