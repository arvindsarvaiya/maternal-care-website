'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { Card, Badge, Button, ProgressBar } from '@/components/ui';
import { api } from '@/lib/api-client';
import {
    Sun,
    Moon,
    Coffee,
    ChefHat,
    UtensilsCrossed,
    Flame,
    Leaf,
    Droplets,
    Bone,
    RefreshCw,
    Calendar,
    AlertCircle,
    Sparkles,
} from 'lucide-react';

// ─── Types ───

interface MealItem {
    id: string;
    name: string;
    mealType: string;
    trimester: string;
    calories: number;
    folate: number;
    iron: number;
    calcium: number;
    diet: string;
}

interface MealSlot {
    type: string;
    meal: MealItem;
    nutritionalSummary: {
        calories: number;
        folate: number;
        iron: number;
        calcium: number;
    };
}

interface MealPlanResponse {
    pregnancyWeek: number;
    pregnancyDay: number;
    trimester: string;
    diet: string;
    meals: MealSlot[];
    dailyTotals: {
        calories: number;
        folate: number;
        iron: number;
        calcium: number;
    };
    generatedAt: string;
}

// ─── Meal type display config ───

const MEAL_TYPE_META: Record<string, { icon: React.ElementType; label: string; color: string; bgClass: string; borderClass: string }> = {
    breakfast: {
        icon: Coffee,
        label: 'Breakfast',
        color: 'text-amber-600',
        bgClass: 'bg-amber-50 dark:bg-amber-950/30',
        borderClass: 'border-amber-200 dark:border-amber-800',
    },
    lunch: {
        icon: Sun,
        label: 'Lunch',
        color: 'text-orange-600',
        bgClass: 'bg-orange-50 dark:bg-orange-950/30',
        borderClass: 'border-orange-200 dark:border-orange-800',
    },
    snack: {
        icon: ChefHat,
        label: 'Snack',
        color: 'text-purple-600',
        bgClass: 'bg-purple-50 dark:bg-purple-950/30',
        borderClass: 'border-purple-200 dark:border-purple-800',
    },
    dinner: {
        icon: Moon,
        label: 'Dinner',
        color: 'text-indigo-600',
        bgClass: 'bg-indigo-50 dark:bg-indigo-950/30',
        borderClass: 'border-indigo-200 dark:border-indigo-800',
    },
};

// ─── Nutritional targets by trimester (meal-plan scope: 4 meals/day) ───
// These represent what 4 well-chosen meals can realistically provide.
// Full daily RDA (including supplements, drinks & extra snacks) is higher.

const NUTRITION_TARGETS: Record<string, { calories: number; folate: number; iron: number; calcium: number }> = {
    FIRST: { calories: 1300, folate: 300, iron: 12, calcium: 500 },
    SECOND: { calories: 1500, folate: 350, iron: 16, calcium: 700 },
    THIRD: { calories: 1800, folate: 350, iron: 16, calcium: 850 },
};

// ─── Component ───

export default function MealPlannerPage() {
    const t = useTranslations();
    const [mealPlan, setMealPlan] = useState<MealPlanResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMealPlan = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError(null);

            const data = await api.get<MealPlanResponse>('/meal-planner');
            setMealPlan(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load meal plan');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchMealPlan();
    }, [fetchMealPlan]);

    // ─── Trimester label ───
    const trimesterLabel = (t: string) => {
        const map: Record<string, string> = {
            FIRST: 'First Trimester',
            SECOND: 'Second Trimester',
            THIRD: 'Third Trimester',
        };
        return map[t] || t;
    };

    // ─── Loading skeleton ───
    if (loading) {
        return (
            <AuthenticatedShell>
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 w-64 bg-surface-200 dark:bg-surface-700 rounded" />
                        <div className="h-4 w-48 bg-surface-200 dark:bg-surface-700 rounded" />
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-surface-200 dark:bg-surface-700 rounded-xl" />
                        ))}
                    </div>
                </div>
            </AuthenticatedShell>
        );
    }

    // ─── Error state ───
    if (error || !mealPlan) {
        return (
            <AuthenticatedShell>
                <div className="max-w-4xl mx-auto">
                    <Card variant="calm">
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-razzmatazz-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-2">
                                {error || 'No meal plan available'}
                            </h3>
                            <p className="text-surface-500 mb-6">
                                {error?.includes('Pregnancy profile')
                                    ? 'Please complete your pregnancy profile first to get personalized meal recommendations.'
                                    : 'We could not generate your meal plan. Please try again.'}
                            </p>
                            <Button variant="primary" onClick={() => fetchMealPlan()}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>
                        </div>
                    </Card>
                </div>
            </AuthenticatedShell>
        );
    }

    const targets = NUTRITION_TARGETS[mealPlan.trimester] || NUTRITION_TARGETS.SECOND;

    return (
        <AuthenticatedShell>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* ─── Header ─── */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                            <UtensilsCrossed className="w-6 h-6 text-primary-500" />
                            Today's Meal Plan
                        </h1>
                        <p className="text-surface-500 mt-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Week {mealPlan.pregnancyWeek} &middot; Day {mealPlan.pregnancyDay} &middot;{' '}
                            <Badge variant="primary">{trimesterLabel(mealPlan.trimester)}</Badge>
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchMealPlan(true)}
                        loading={refreshing}
                        icon={<RefreshCw className="w-4 h-4" />}
                    >
                        Refresh
                    </Button>
                </div>

                {/* ─── Daily Meal-Plan Nutrition ─── */}
                <Card variant="primary" padding="lg">
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-5 h-5 text-primary-500" />
                        <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                            Nutrition from Today's Meals
                        </h2>
                    </div>
                    <p className="text-xs text-surface-400 mb-4">
                        Contribution from 4 planned meals. Full daily needs are met through
                        additional snacks, beverages, and prenatal supplements.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            {
                                icon: Flame,
                                label: 'Calories',
                                value: mealPlan.dailyTotals.calories,
                                target: targets.calories,
                                unit: 'kcal',
                                color: 'text-orange-500',
                            },
                            {
                                icon: Leaf,
                                label: 'Folate',
                                value: Math.round(mealPlan.dailyTotals.folate),
                                target: targets.folate,
                                unit: 'mcg',
                                color: 'text-green-500',
                            },
                            {
                                icon: Droplets,
                                label: 'Iron',
                                value: Math.round(mealPlan.dailyTotals.iron * 10) / 10,
                                target: targets.iron,
                                unit: 'mg',
                                color: 'text-red-500',
                            },
                            {
                                icon: Bone,
                                label: 'Calcium',
                                value: Math.round(mealPlan.dailyTotals.calcium),
                                target: targets.calcium,
                                unit: 'mg',
                                color: 'text-blue-500',
                            },
                        ].map(nut => (
                            <div key={nut.label} className="text-center">
                                <nut.icon className={`w-5 h-5 ${nut.color} mx-auto mb-1`} />
                                <p className="text-xs text-surface-500">{nut.label}</p>
                                <div className="flex items-baseline justify-center gap-0.5">
                                    <p className="text-lg font-bold text-surface-900 dark:text-surface-100">
                                        {nut.value}
                                    </p>
                                    <p className="text-xs text-surface-400">
                                        / {nut.target} {nut.unit}
                                    </p>
                                </div>
                                <ProgressBar
                                    value={nut.value}
                                    max={nut.target}
                                    size="sm"
                                    variant={nut.value >= nut.target ? 'gold' : 'primary'}
                                    className="mt-1"
                                />
                            </div>
                        ))}
                    </div>
                </Card>

                {/* ─── Meal Cards ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mealPlan.meals.map(slot => {
                        const meta = MEAL_TYPE_META[slot.type] || MEAL_TYPE_META.breakfast;
                        const Icon = meta.icon;
                        return (
                            <Card
                                key={slot.type}
                                variant="default"
                                padding="lg"
                                className={`border-l-4 ${meta.borderClass} ${meta.bgClass}`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`p-2 rounded-lg bg-white dark:bg-surface-800 shadow-sm`}>
                                        <Icon className={`w-5 h-5 ${meta.color}`} />
                                    </div>
                                    <div>
                                        <h3 className={`text-sm font-semibold ${meta.color}`}>
                                            {meta.label}
                                        </h3>
                                        <p className="text-base font-medium text-surface-900 dark:text-surface-100">
                                            {slot.meal.name}
                                        </p>
                                    </div>
                                </div>

                                {/* Nutritional breakdown per meal */}
                                <div className="grid grid-cols-4 gap-2 text-center pt-3 border-t border-surface-100 dark:border-surface-700">
                                    <div>
                                        <Flame className="w-3.5 h-3.5 text-orange-500 mx-auto mb-0.5" />
                                        <p className="text-xs font-semibold text-surface-800 dark:text-surface-200">
                                            {slot.nutritionalSummary.calories}
                                        </p>
                                        <p className="text-[10px] text-surface-400">kcal</p>
                                    </div>
                                    <div>
                                        <Leaf className="w-3.5 h-3.5 text-green-500 mx-auto mb-0.5" />
                                        <p className="text-xs font-semibold text-surface-800 dark:text-surface-200">
                                            {Math.round(slot.nutritionalSummary.folate)}
                                        </p>
                                        <p className="text-[10px] text-surface-400">mcg folate</p>
                                    </div>
                                    <div>
                                        <Droplets className="w-3.5 h-3.5 text-red-500 mx-auto mb-0.5" />
                                        <p className="text-xs font-semibold text-surface-800 dark:text-surface-200">
                                            {Math.round(slot.nutritionalSummary.iron * 10) / 10}
                                        </p>
                                        <p className="text-[10px] text-surface-400">mg iron</p>
                                    </div>
                                    <div>
                                        <Bone className="w-3.5 h-3.5 text-blue-500 mx-auto mb-0.5" />
                                        <p className="text-xs font-semibold text-surface-800 dark:text-surface-200">
                                            {Math.round(slot.nutritionalSummary.calcium)}
                                        </p>
                                        <p className="text-[10px] text-surface-400">mg calcium</p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* ─── Disclaimer ─── */}
                <p className="text-xs text-surface-400 text-center">
                    This meal plan is for informational purposes only. Please consult your healthcare provider
                    for personalized dietary advice during pregnancy.
                </p>
            </div>
        </AuthenticatedShell>
    );
}