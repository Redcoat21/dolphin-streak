import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/core/stores/authStore";
import { trpc } from "@/utils/trpc";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/core/components/container";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Volume2, XCircle, Mic, CheckCircle2, AlignJustify, Timer } from "lucide-react";
import { Header } from "@/core/pages/dasboard/components/Header";
import { QuestionType } from "@/server/types/questions";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export function CourseSessionIDPage() {
    const router = useRouter();
    const { getAccessToken } = useAuthStore();
    const accessToken = getAccessToken();
    const params = useParams();
    const courseSessionId = params?.courseSessionId as string;

    // UI states
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [textAnswer, setTextAnswer] = useState("");
    const [isAnswered, setIsAnswered] = useState(false);
    const [lives, setLives] = useState(3);

    /**
     * We treat isCorrect as:
     * - true if correct
     * - null if incorrect
     */
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30); // 30 seconds timer
    const { toast } = useToast();
    const [suggestion, setSuggestion] = useState<string | null>(null);

    // Fetch session data
    const { data: courseSessionData, refetch } = trpc.course.getCourseSessionId.useQuery({
        accessToken: accessToken || "",
        courseSessionId: courseSessionId as string
    });

    // Decrement timer if question not answered
    useEffect(() => {
        if (!isAnswered && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, isAnswered]);

    // Submit answer
    const {
        mutate: postSubmitAnswer,
        isLoading: isPostSubmitAnswerPending
    } = trpc.course.postSubmitAnswer.useMutation({
        onSuccess(data) {
            // If correct => set isCorrect to true
            // If incorrect => set isCorrect to null
            if (data.data?.isCorrect) {
                setIsCorrect(true);
                playSound("correct");
            } else {
                setIsCorrect(null);
                setLives(prev => Math.max(0, prev - 1));
                setSuggestion(data.data?.suggestion || null);
                playSound("incorrect");
            }
        },
        onError(error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        },
    });

    // Play correct/incorrect sounds
    const playSound = (type: "correct" | "incorrect") => {
        const audio = new Audio(`/sounds/${type}.mp3`);
        audio.play().catch(console.error);
    };

    const questionData = courseSessionData?.data;

    // Try to submit or reset answer
    const handleSubmitAnswer = () => {
        // If not answered yet, try to answer
        if (!isAnswered) {
            setIsAnswered(true);
            let answer: string | null = null;

            switch (questionData?.question.questionType) {
                case QuestionType.MULTIPLE_CHOICE:
                    answer = selectedAnswer;
                    break;
                case QuestionType.ESSAY:
                case QuestionType.FILL_IN:
                    answer = textAnswer;
                    break;
                case QuestionType.VOICE:
                    // Handle voice recording
                    break;
            }
            // Only mutate if we have something
            if (answer) {
                postSubmitAnswer({
                    accessToken: accessToken || "",
                    courseSessionId: courseSessionId,
                    answer: answer
                });
            }
        } else {
            // If answered and we click this again, we reset
            // This allows re-answering if wrong
            resetQuestionState();
        }
    };

    const resetQuestionState = () => {
        setSelectedAnswer(null);
        setTextAnswer("");
        setIsAnswered(false);
        setSuggestion(null);
        setTimeLeft(30);
        refetch();
    };

    // Fill in the blank UI
    const renderFillInBlank = (text: string) => {
        // Split on `__` placeholder
        const parts = text.split("__");
        if (parts.length === 1) {
            // No blank to fill in, fallback
            return <p>{text}</p>;
        }
        return (
            <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-lg">
                    {parts.map((part, i) => {
                        // Insert input for everything except last chunk
                        if (i < parts.length - 1) {
                            return (
                                <React.Fragment key={i}>
                                    <span>{part}</span>
                                    <Input
                                        value={textAnswer}
                                        onChange={(e) => setTextAnswer(e.target.value)}
                                        className="w-40 bg-slate-900 text-lg caret-blue-400"
                                        disabled={isAnswered}
                                    />
                                </React.Fragment>
                            );
                        }
                        // Last chunk
                        return <span key={i}>{part}</span>;
                    })}
                </div>
            </div>
        );
    };

    // Render different question types
    const renderQuestionContent = () => {
        if (!questionData) return null;

        switch (questionData.question.questionType) {
            case QuestionType.MULTIPLE_CHOICE:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {questionData.question.answerOptions?.map((answer, index) => (
                            <motion.div
                                key={answer}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Button
                                    variant={selectedAnswer === answer ? "default" : "outline"}
                                    className={`w-full h-16 text-lg font-medium transition-all ${
                                        isAnswered
                                            ? selectedAnswer === answer
                                                ? isCorrect === true
                                                    ? "bg-green-600 hover:bg-green-600"
                                                    : "bg-red-600 hover:bg-red-600"
                                                : "bg-slate-800 hover:bg-slate-800"
                                            : "hover:bg-slate-800"
                                    }`}
                                    onClick={() => !isAnswered && setSelectedAnswer(answer)}
                                    disabled={isPostSubmitAnswerPending || isAnswered}
                                >
                                    {answer}
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                );

            case QuestionType.ESSAY:
                return (
                    <div className="space-y-4">
                        <Textarea
                            value={textAnswer}
                            onChange={(e) => setTextAnswer(e.target.value)}
                            placeholder="Write your essay here..."
                            className="min-h-[200px] bg-slate-900 border-slate-700 text-lg"
                            disabled={isAnswered}
                        />
                        {suggestion && isAnswered && (
                            <Alert className="bg-blue-900/50 border-blue-500">
                                <AlignJustify className="w-4 h-4 text-blue-400" />
                                <AlertDescription>{suggestion}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                );

            case QuestionType.FILL_IN:
                return (
                    <div className="space-y-4">
                        {renderFillInBlank(questionData.question.question.text)}
                    </div>
                );

            // Add other cases for VOICE, WRITING, etc. if needed
            default:
                return null;
        }
    };

    // If no question data, show loader
    if (!questionData) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
            </div>
        );
    }

    // Calculate progress bar
    const progressPercentage = (questionData.questionIndex / questionData.totalQuestion) * 100;

    // Decide alert background color
    const alertBgClass = (() => {
        if (isCorrect === true && !isPostSubmitAnswerPending) {
            return "bg-green-900/50";
        }
        if (isCorrect === null && isAnswered && !isPostSubmitAnswerPending) {
            // user is wrong
            return "bg-red-900/50";
        }
        if (isCorrect === null && isPostSubmitAnswerPending) {
            // checking
            return "bg-yellow-900/50";
        }
        return "bg-slate-900/50";
    })();

    // Decide alert icon + message
    const alertIcon = (() => {
        if (isCorrect === true && !isPostSubmitAnswerPending) {
            return <CheckCircle2 className="w-5 h-5 text-green-400" />;
        }
        if (isCorrect === null && isPostSubmitAnswerPending) {
            return <Timer className="w-5 h-5 text-yellow-400" />;
        }
        if (isCorrect === null && isAnswered && !isPostSubmitAnswerPending) {
            return <XCircle className="w-5 h-5 text-red-400" />;
        }
        // Default or not answered
        return <XCircle className="w-5 h-5 text-slate-400" />;
    })();

    const alertMessage = (() => {
        if (isCorrect === true && !isPostSubmitAnswerPending) {
            return "Great job! That's correct!";
        }
        if (isCorrect === null && isPostSubmitAnswerPending) {
            return "Checking your answer...";
        }
        if (isCorrect === null && isAnswered && !isPostSubmitAnswerPending) {
            return "Not quite right. Try again!";
        }
        return "Answer not submitted yet.";
    })();

    // Decide button label
    const buttonLabel = (() => {
        if (!isAnswered) {
            return "Check Answer";
        }
        // If correct => "Continue"
        if (isCorrect === true && !isPostSubmitAnswerPending) {
            return "Continue";
        }
        // If pending => "Checking..."
        if (isCorrect === null && isPostSubmitAnswerPending) {
            return "Checking...";
        }
        // If wrong => "Try Again"
        if (isCorrect === null && !isPostSubmitAnswerPending) {
            return "Try Again";
        }
        return "Answer Submitted";
    })();

    // Decide button disabled
    const isButtonDisabled = (() => {
        // If we haven't selected or typed anything and haven't answered => disable
        if (!selectedAnswer && !textAnswer && !isAnswered) {
            return true;
        }
        // If pending => disable
        if (isPostSubmitAnswerPending) {
            return true;
        }
        return false;
    })();

    return (
        <Container>
            <Header currentPath="/course-session" />
            
            <main className="min-h-screen bg-slate-950 text-white pt-24 pb-8 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Top bar with back, lives, timer, progress */}
                    <div className="flex items-center justify-between mb-8">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="hover:bg-slate-800"
                        >
                            <XCircle className="w-6 h-6 text-slate-400" />
                        </Button>

                        <div className="flex items-center gap-6">
                            {/* Lives */}
                            <div className="flex gap-1">
                                <AnimatePresence>
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 1 }}
                                            animate={{ scale: i < lives ? 1 : 0.8 }}
                                            exit={{ scale: 0 }}
                                        >
                                            <Heart
                                                className={`w-6 h-6 transition-colors ${
                                                    i < lives ? "text-red-500" : "text-slate-700"
                                                }`}
                                                fill={i < lives ? "currentColor" : "none"}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                            
                            {/* Timer */}
                            <div className="flex items-center gap-2">
                                <Timer className="w-5 h-5 text-blue-400" />
                                <span className="text-lg font-medium">{timeLeft}s</span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-32">
                                <Progress 
                                    value={progressPercentage} 
                                    className="h-2.5 bg-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Question card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <Card className="bg-slate-900 border-slate-800 p-6">
                            <div className="flex items-start gap-4 mb-8">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-slate-800 mt-1"
                                >
                                    <Volume2 className="w-6 h-6 text-blue-400" />
                                </Button>
                                <h2 className="text-2xl font-semibold text-slate-200">
                                    {questionData.question.question.text}
                                </h2>
                            </div>

                            {renderQuestionContent()}
                        </Card>

                        {/* Alert for correct/wrong/pending states */}
                        <AnimatePresence>
                            {isAnswered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <Alert className={`${alertBgClass} border-none`}>
                                        <div className="flex items-center gap-2">
                                            {alertIcon}
                                            <AlertDescription className="text-lg">
                                                {alertMessage}
                                            </AlertDescription>
                                        </div>
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit / Re-try / Continue button */}
                        <Button
                            className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                            disabled={isButtonDisabled}
                            onClick={handleSubmitAnswer}
                        >
                            {buttonLabel}
                        </Button>
                    </motion.div>
                </div>
            </main>
        </Container>
    );
}