import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Container } from '@/core/components/container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Star, Home, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect, useRef, useCallback } from 'react';
import { Header } from '../pages/dasboard/components/Header';

interface CompletedCourseProps {
    score: number;
    courseType: "comprehensions" | "course" | 'daily-challenge'
}

export function CompletedCourse({ score, courseType }: CompletedCourseProps) {
    const router = useRouter();
    const animationRef = useRef<number | null>(null);

    const fireConfetti = useCallback(() => {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#6366f1', '#8b5cf6', '#3b82f6']
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6366f1', '#8b5cf6', '#3b82f6']
            });

            if (Date.now() < end) {
                animationRef.current = requestAnimationFrame(frame);
            }
        };
        frame();
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const cleanup = fireConfetti();
        return () => {
            cleanup && cleanup();
        }
    }, [fireConfetti]);

    return (
        <Container>
            {/* <Header currentPath="/comprehensions" /> */}
            <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-lg"
                >
                    <Card className="bg-slate-900/50 backdrop-blur border-slate-800 p-8">
                        <div className="text-center space-y-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="inline-block p-4 bg-yellow-500/10 rounded-full"
                            >
                                <Trophy className="w-16 h-16 text-yellow-500" />
                            </motion.div>

                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Congratulations!
                                </h1>
                                <p className="text-slate-400">
                                    You've successfully completed the comprehension!
                                </p>
                            </div>

                            <div className="flex justify-center items-center gap-2 py-4">
                                <Star className="w-6 h-6 text-yellow-500" />
                                <span className="text-4xl font-bold text-white">
                                    {score}
                                </span>
                            </div>

                            <p className="text-slate-300 max-w-sm mx-auto">
                                Great job! Keep up the excellent work and continue your learning journey.
                            </p>

                            <div className="grid grid-cols-2 gap-4 pt-6">
                                <Button
                                    variant="outline"
                                    className="bg-slate-800 border-slate-700 hover:bg-slate-700"
                                    onClick={() => router.push('/')}
                                >
                                    <Home className="w-4 h-4 mr-2" />
                                    Home
                                </Button>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() => router.push(`/${courseType}`)}
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Try Another
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </main>
        </Container>
    );
}