'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { Card, Button, Spinner } from '@/components/ui';
import { apiFetch } from '@/lib/api-client';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Dumbbell, CheckCircle2, Timer, Play, Pause, RotateCcw, Trophy } from 'lucide-react';

interface Exercise {
    id: string;
    name: string;
    description: string;
    duration: number; // seconds
    sets: number;
    reps: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    instructions: string[];
}

const PELVIC_FLOOR_EXERCISES: Exercise[] = [
    {
        id: 'kegels-basic',
        name: 'Basic Kegel Exercise',
        description: 'The foundation of pelvic floor recovery. Strengthens the muscles that support the bladder, uterus, and bowels.',
        duration: 5,
        sets: 3,
        reps: 10,
        difficulty: 'beginner',
        instructions: [
            'Sit or lie down comfortably with your knees slightly apart.',
            'Tighten your pelvic floor muscles (imagine stopping urination mid-flow).',
            'Hold the contraction for 5 seconds while breathing normally.',
            'Relax completely for 5 seconds.',
            'Repeat 10 times for each set.',
        ],
    },
    {
        id: 'kegels-quick',
        name: 'Quick Flick Kegels',
        description: 'Trains fast-twitch muscle fibers for sudden pressure responses (coughing, sneezing, laughing).',
        duration: 1,
        sets: 3,
        reps: 10,
        difficulty: 'beginner',
        instructions: [
            'Sit or stand comfortably.',
            'Quickly tighten and release your pelvic floor muscles.',
            'Each contraction and release should take about 1 second.',
            'Repeat 10 times for each set.',
        ],
    },
    {
        id: 'bridge',
        name: 'Glute Bridge with Pelvic Floor',
        description: 'Combines glute activation with pelvic floor engagement for comprehensive core support.',
        duration: 3,
        sets: 3,
        reps: 12,
        difficulty: 'intermediate',
        instructions: [
            'Lie on your back with knees bent and feet flat on the floor.',
            'Engage your pelvic floor muscles.',
            'Squeeze your glutes and lift your hips toward the ceiling.',
            'Hold for 3 seconds while maintaining pelvic floor engagement.',
            'Slowly lower back down and relax.',
        ],
    },
    {
        id: 'bird-dog',
        name: 'Bird Dog (Modified)',
        description: 'Gentle core and pelvic stability exercise. Start with small movements.',
        duration: 2,
        sets: 2,
        reps: 8,
        difficulty: 'intermediate',
        instructions: [
            'Start on hands and knees (tabletop position).',
            'Engage your pelvic floor and core muscles.',
            'Slowly extend your right arm forward and left leg back.',
            'Keep your back flat and avoid arching.',
            'Hold for 2 seconds, then return to start.',
            'Alternate sides for each rep.',
        ],
    },
    {
        id: 'deep-squat',
        name: 'Deep Breathing Squat',
        description: 'Combines diaphragmatic breathing with pelvic floor relaxation. Important for balanced pelvic health.',
        duration: 5,
        sets: 2,
        reps: 5,
        difficulty: 'advanced',
        instructions: [
            'Stand with feet slightly wider than hip-width.',
            'Inhale deeply, allowing your belly to expand.',
            'As you exhale, slowly squat down while relaxing your pelvic floor.',
            'Hold the squat for 3-5 seconds, breathing naturally.',
            'Inhale as you stand back up, engaging your pelvic floor.',
        ],
    },
    {
        id: 'heel-slides',
        name: 'Heel Slides',
        description: 'Gentle core and pelvic floor coordination exercise. Safe for early recovery.',
        duration: 2,
        sets: 2,
        reps: 10,
        difficulty: 'beginner',
        instructions: [
            'Lie on your back with knees bent and feet flat.',
            'Engage your pelvic floor muscles gently.',
            'Slowly slide one heel away from your body, straightening the leg.',
            'Keep your back flat against the floor.',
            'Slide the heel back to the starting position.',
            'Alternate legs for each rep.',
        ],
    },
];

interface ExerciseLog {
    exercisesDone: string[];
    kegelCount: number;
    logDate: string;
}

export default function PelvicFloorPage() {
    const { user, isPostpartum } = useAuth();
    const t = useTranslations('postpartum');
    const n = useTranslations('nav');
    const m = useTranslations('mother');
    const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
    const [currentSet, setCurrentSet] = useState(1);
    const [currentRep, setCurrentRep] = useState(1);
    const [isActive, setIsActive] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [completedToday, setCompletedToday] = useState<string[]>([]);
    const [totalKegels, setTotalKegels] = useState(0);
    const [loading, setLoading] = useState(true);
    const [streak, setStreak] = useState(0);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiFetch<{ logs: ExerciseLog[] }>('/profile/postpartum-health?logType=pelvic_floor&days=7');
            if (res && res.logs) {
                const today = new Date().toLocaleDateString('en-IN');
                const todayLog = res.logs.find(l => {
                    const logDate = new Date(l.logDate).toLocaleDateString('en-IN');
                    return logDate === today;
                });
                if (todayLog) {
                    setCompletedToday(todayLog.exercisesDone || []);
                    setTotalKegels(todayLog.kegelCount || 0);
                }

                // Calculate streak
                let streakCount = 0;
                const todayDate = new Date();
                for (let i = 0; i < 7; i++) {
                    const checkDate = new Date(todayDate);
                    checkDate.setDate(checkDate.getDate() - i);
                    const dateStr = checkDate.toLocaleDateString('en-IN');
                    const hasLog = res.logs.some(l => {
                        const logDate = new Date(l.logDate).toLocaleDateString('en-IN');
                        return logDate === dateStr;
                    });
                    if (hasLog) streakCount++;
                    else break;
                }
                setStreak(streakCount);
            }
        } catch {
            // Silently handle
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && !isResting && activeExercise) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev >= activeExercise.duration) {
                        // Move to next rep or set
                        if (currentRep < activeExercise.reps) {
                            setCurrentRep(prev => prev + 1);
                            return 0;
                        } else if (currentSet < activeExercise.sets) {
                            setCurrentSet(prev => prev + 1);
                            setCurrentRep(1);
                            setIsResting(true);
                            return 0;
                        } else {
                            // Exercise complete
                            handleExerciseComplete();
                            return 0;
                        }
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, isResting, activeExercise, currentRep, currentSet]);

    const startExercise = (exercise: Exercise) => {
        setActiveExercise(exercise);
        setCurrentSet(1);
        setCurrentRep(1);
        setTimer(0);
        setIsActive(true);
        setIsResting(false);
    };

    const pauseExercise = () => {
        setIsActive(false);
    };

    const resumeExercise = () => {
        setIsActive(true);
    };

    const resetExercise = () => {
        setActiveExercise(null);
        setCurrentSet(1);
        setCurrentRep(1);
        setTimer(0);
        setIsActive(false);
        setIsResting(false);
    };

    const handleExerciseComplete = async () => {
        setIsActive(false);
        const exerciseId = activeExercise!.id;
        const newCompleted = [...completedToday, exerciseId];
        setCompletedToday(newCompleted);

        const newKegelCount = exerciseId.startsWith('kegels')
            ? totalKegels + (activeExercise!.sets * activeExercise!.reps)
            : totalKegels;
        setTotalKegels(newKegelCount);

        // Save to API
        try {
            await apiFetch('/profile/postpartum-health', {
                method: 'POST',
                body: JSON.stringify({
                    logType: 'pelvic_floor',
                    logDate: new Date().toISOString(),
                    exercisesDone: newCompleted,
                    kegelCount: newKegelCount,
                }),
            });
        } catch {
            // Silently handle
        }

        setActiveExercise(null);
        setCurrentSet(1);
        setCurrentRep(1);
        setTimer(0);
    };

    const getDifficultyColor = (d: string) => {
        switch (d) {
            case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return '';
        }
    };

    if (!isPostpartum) {
        return (
            <AuthenticatedShell>
                <div className="max-w-4xl mx-auto py-12 text-center">
                    <Dumbbell className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-display text-velvet-800 dark:text-surface-100 mb-2">
                        {n('pelvicFloor') || 'Pelvic Floor Exercises'}
                    </h1>
                    <p className="text-surface-500 mb-6">
                        This section is available after recording your delivery. Visit your dashboard to transition.
                    </p>
                    <Link href="/mother" className="btn-primary">
                        {m('backToDashboard') || 'Go to Dashboard'}
                    </Link>
                </div>
            </AuthenticatedShell>
        );
    }

    return (
        <AuthenticatedShell>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <Link href="/mother" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-2">
                        <ArrowLeft className="w-4 h-4" />
                        {n('backToDashboard') || 'Back to Dashboard'}
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        <div>
                            <h1 className="text-2xl font-display text-gradient-mandala">
                                {n('pelvicFloor') || 'Pelvic Floor Exercises'}
                            </h1>
                            <p className="text-surface-500 text-sm mt-1">
                                {t('pelvicFloor') || 'Strengthen your pelvic floor for better recovery'}
                            </p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Spinner className="w-8 h-8" />
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <Card padding="sm" className="text-center">
                                <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto mb-1" />
                                <div className="text-2xl font-bold text-velvet-800 dark:text-surface-100">{completedToday.length}</div>
                                <div className="text-xs text-surface-500">Exercises Today</div>
                            </Card>
                            <Card padding="sm" className="text-center">
                                <Dumbbell className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                                <div className="text-2xl font-bold text-velvet-800 dark:text-surface-100">{totalKegels}</div>
                                <div className="text-xs text-surface-500">Kegels Today</div>
                            </Card>
                            <Card padding="sm" className="text-center">
                                <Trophy className="w-5 h-5 text-gold-500 mx-auto mb-1" />
                                <div className="text-2xl font-bold text-velvet-800 dark:text-surface-100">{streak}</div>
                                <div className="text-xs text-surface-500">Day Streak</div>
                            </Card>
                        </div>

                        {/* Active Exercise */}
                        {activeExercise && (
                            <Card variant="primary">
                                <div className="text-center">
                                    <h2 className="text-xl font-semibold text-white mb-1">{activeExercise.name}</h2>
                                    <div className="flex items-center justify-center gap-4 text-white/80 text-sm mb-4">
                                        <span>Set {currentSet}/{activeExercise.sets}</span>
                                        <span>•</span>
                                        <span>Rep {currentRep}/{activeExercise.reps}</span>
                                    </div>
                                    {isResting ? (
                                        <div className="mb-4">
                                            <p className="text-white text-lg mb-3">Rest for 30 seconds...</p>
                                            <Button
                                                variant="secondary"
                                                onClick={() => { setIsResting(false); setIsActive(true); }}
                                            >
                                                <Play className="w-4 h-4 mr-1" /> Continue
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-4xl font-bold text-white mb-4">
                                                {timer}s / {activeExercise.duration}s
                                            </div>
                                            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                                                <div
                                                    className="bg-white rounded-full h-2 transition-all duration-1000"
                                                    style={{ width: `${(timer / activeExercise.duration) * 100}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-center gap-3">
                                                {isActive ? (
                                                    <Button variant="secondary" onClick={pauseExercise}>
                                                        <Pause className="w-4 h-4 mr-1" /> Pause
                                                    </Button>
                                                ) : (
                                                    <Button variant="secondary" onClick={resumeExercise}>
                                                        <Play className="w-4 h-4 mr-1" /> Resume
                                                    </Button>
                                                )}
                                                <Button variant="ghost" className="text-white/80 hover:text-white" onClick={resetExercise}>
                                                    <RotateCcw className="w-4 h-4 mr-1" /> Stop
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* Exercise List */}
                        <div className="space-y-4">
                            {PELVIC_FLOOR_EXERCISES.map((exercise) => {
                                const isCompleted = completedToday.includes(exercise.id);
                                const isActiveExercise = activeExercise?.id === exercise.id;

                                return (
                                    <Card key={exercise.id} className={isActiveExercise ? 'ring-2 ring-primary-400' : ''}>
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                                                ? 'bg-green-100 dark:bg-green-900/30'
                                                : 'bg-primary-50 dark:bg-primary-900/20'
                                                }`}>
                                                {isCompleted ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <Dumbbell className="w-5 h-5 text-primary-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-velvet-800 dark:text-surface-100">
                                                        {exercise.name}
                                                    </h3>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                                                        {exercise.difficulty}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-surface-500 mb-2">{exercise.description}</p>
                                                <div className="flex items-center gap-3 text-xs text-surface-400 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <Timer className="w-3 h-3" /> {exercise.duration}s hold
                                                    </span>
                                                    <span>{exercise.sets} sets</span>
                                                    <span>{exercise.reps} reps</span>
                                                </div>
                                                <div className="space-y-1 mb-3">
                                                    {exercise.instructions.map((step, i) => (
                                                        <p key={i} className="text-xs text-velvet-600 dark:text-surface-400 flex gap-2">
                                                            <span className="text-primary-400 font-medium">{i + 1}.</span>
                                                            {step}
                                                        </p>
                                                    ))}
                                                </div>
                                                {!isCompleted && !isActiveExercise && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => startExercise(exercise)}
                                                    >
                                                        <Play className="w-4 h-4 mr-1" /> Start Exercise
                                                    </Button>
                                                )}
                                                {isCompleted && (
                                                    <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                                                        <CheckCircle2 className="w-4 h-4" /> Completed Today
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Disclaimer */}
                        <Card className="border-warning-200 dark:border-warning-800 bg-warning-50/50 dark:bg-warning-900/10">
                            <p className="text-sm text-warning-700 dark:text-warning-300">
                                <strong>Important:</strong> Always consult your healthcare provider before starting any exercise program after delivery. Stop immediately if you experience pain, bleeding, or discomfort. Wait for your 6-week postpartum checkup clearance before attempting intermediate or advanced exercises.
                            </p>
                        </Card>
                    </>
                )}
            </div>
        </AuthenticatedShell>
    );
}