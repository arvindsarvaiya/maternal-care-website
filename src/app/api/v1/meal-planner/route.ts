import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { calcPregnancyWeek, getTrimester } from '@/lib/pregnancy-calculator';
import { logger } from '@/lib/logger';

// ─── Rotation helper ────────────────────────────────────────────
// Given a day index and meal type, deterministically pick a meal index.
// Uses prime offsets per meal type so each category rotates independently,
// making each day's combination feel unique even with only 20 meals per category.
const MEAL_TYPE_ORDER = ['BREAKFAST', 'LUNCH', 'SNACK', 'DINNER'] as const;
type MealType = (typeof MEAL_TYPE_ORDER)[number];

const PRIME_OFFSETS: Record<MealType, number> = {
    BREAKFAST: 7,
    LUNCH: 13,
    SNACK: 17,
    DINNER: 23,
};

function pickMealIndex(dayIndex: number, mealType: MealType, mealCount: number): number {
    const offset = PRIME_OFFSETS[mealType];
    return ((dayIndex * offset) % mealCount + mealCount) % mealCount;
}

// ─── GET: Daily meal plan ───────────────────────────────────────
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        // 1. Fetch pregnancy dates — try pregnancyProfile first, then motherHealthProfile
        const [pregnancyProfile, motherHealth] = await Promise.all([
            prisma.pregnancyProfile.findUnique({
                where: { userId: payload.userId },
                select: { lmpDate: true, dueDate: true },
            }),
            prisma.motherHealthProfile.findUnique({
                where: { userId: payload.userId },
                select: { lmpDate: true, dueDate: true, weeksOfPregnancy: true, diet: true },
            }),
        ]);

        // Get the best available LMP and due date from either profile
        const lmpDate: Date | null =
            pregnancyProfile?.lmpDate ?? motherHealth?.lmpDate ?? null;
        const dueDate: Date | null =
            pregnancyProfile?.dueDate ?? motherHealth?.dueDate ?? null;
        const diet = motherHealth?.diet || 'veg';

        if (!lmpDate && !dueDate) {
            return badRequest('Pregnancy profile not set. Please complete your pregnancy profile first.');
        }

        // 2. Calculate pregnancy week info
        const weekInfo = calcPregnancyWeek({
            lmpDate: lmpDate?.toISOString(),
            dueDate: dueDate?.toISOString(),
        });

        if (!weekInfo) {
            return badRequest('Unable to calculate pregnancy week. Please update your pregnancy profile.');
        }

        // 3. Get trimester string for DB query
        const trimesterNum = getTrimester(weekInfo.week);
        const trimesterMap: Record<number, string> = { 1: 'FIRST', 2: 'SECOND', 3: 'THIRD' };
        const trimester = trimesterMap[trimesterNum];

        // 4. Calculate day index for rotation
        // Use days since LMP as the base index so each calendar day gets a unique meal plan
        let dayIndex: number;
        if (lmpDate) {
            const now = new Date();
            dayIndex = Math.floor((now.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
        } else if (dueDate) {
            // Approximate LMP from due date: dueDate - 280 days
            const approxLmp = new Date(dueDate.getTime() - 280 * 24 * 60 * 60 * 1000);
            const now = new Date();
            dayIndex = Math.floor((now.getTime() - approxLmp.getTime()) / (1000 * 60 * 60 * 24));
        } else {
            // Fallback: use pregnancy week * 7
            dayIndex = weekInfo.week * 7 + new Date().getDay();
        }
        dayIndex = Math.max(0, dayIndex); // ensure non-negative

        // 5. Fetch all meals for the trimester and diet
        const allMeals = await prisma.meal.findMany({
            where: {
                trimester,
                diet,
            },
            orderBy: { name: 'asc' }, // deterministic ordering for consistent rotation
        });

        if (allMeals.length === 0) {
            return notFound('No meals found for your current trimester');
        }

        // 6. Group meals by type
        const mealsByType: Record<string, typeof allMeals> = {};
        for (const meal of allMeals) {
            if (!mealsByType[meal.mealType]) mealsByType[meal.mealType] = [];
            mealsByType[meal.mealType].push(meal);
        }

        // 7. Pick one meal per type using rotation
        const mealPlan: {
            type: string;
            meal: (typeof allMeals)[0];
            nutritionalSummary: { calories: number; folate: number; iron: number; calcium: number };
        }[] = [];

        for (const mealType of MEAL_TYPE_ORDER) {
            const meals = mealsByType[mealType];
            if (!meals || meals.length === 0) continue;

            const index = pickMealIndex(dayIndex, mealType, meals.length);
            const selected = meals[index];

            mealPlan.push({
                type: mealType.toLowerCase(),
                meal: selected,
                nutritionalSummary: {
                    calories: selected.calories,
                    folate: selected.folate,
                    iron: selected.iron,
                    calcium: selected.calcium,
                },
            });
        }

        // 8. Calculate daily totals
        const dailyTotals = mealPlan.reduce(
            (acc, item) => ({
                calories: acc.calories + item.nutritionalSummary.calories,
                folate: acc.folate + item.nutritionalSummary.folate,
                iron: acc.iron + item.nutritionalSummary.iron,
                calcium: acc.calcium + item.nutritionalSummary.calcium,
            }),
            { calories: 0, folate: 0, iron: 0, calcium: 0 },
        );

        // 9. Determine which pregnancy day this is (for display)
        const pregnancyDay = dayIndex + 1; // 1-based

        return success({
            pregnancyWeek: weekInfo.week,
            pregnancyDay,
            trimester,
            diet,
            meals: mealPlan,
            dailyTotals,
            generatedAt: new Date().toISOString(),
        });
    } catch (err) {
        logger.error('Meal planner error', 'meal-planner', err instanceof Error ? err : undefined);
        return badRequest('Failed to generate meal plan');
    }
}