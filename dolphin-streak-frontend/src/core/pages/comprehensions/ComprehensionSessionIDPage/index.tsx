import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/core/stores/authStore";
import { trpc } from "@/utils/trpc";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/core/components/container";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle, CheckCircle2, Timer as TimerIcon } from "lucide-react";
import { Header } from "@/core/pages/dasboard/components/Header";
import { QuestionType } from "@/server/types/questions";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import EssayPage from "../../../components/courses/QuestionTypes/essay";
import { LivesIndicator } from "../../../components/courses/lives-indicator";
import { Timer } from "../../../components/courses/timer";

export function ComprehensionSessionIDPage() {
    const router = useRouter();
    const { getAccessToken } = useAuthStore();
    const accessToken = getAccessToken();
    const params = useParams();
    const comprehensionSessionId = params?.comprehensionSessionId as string;

    // UI states
    const [textAnswer, setTextAnswer] = useState("");
    const [isAnswered, setIsAnswered] = useState(false);
    const [lives, setLives] = useState(3);

    /**
     * We treat isCorrect as:
     * - true if correct
     * - null if waiting
     * - false if incorrect
     */
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [timeLeft, setTimeLeft] = useState(30); // 30 seconds timer
    const { toast } = useToast();
    const [suggestion, setSuggestion] = useState<string | null>(null);

    // Fetch session data
    const { data: comprehensionSessionData, refetch } = trpc.course.getCourseSessionId.useQuery({
        accessToken: accessToken || "",
        courseSessionId: comprehensionSessionId as string
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
        isPending: isPostSubmitAnswerPending
    } = trpc.comprehension.postSubmitAnswer.useMutation({
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
            data.data?.isLatest
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

    const questionData = comprehensionSessionData?.data;

    // Try to submit or reset answer
    const handleSubmitAnswer = async (answer: string | null) => {
        // If not answered yet, try to answer
        if (!isAnswered) {
            setIsAnswered(true);

            // Only mutate if we have something
            if (answer) {
                postSubmitAnswer({
                    questionType: questionData?.question.questionType as QuestionType,
                    accessToken: accessToken || "",
                    courseSessionId: comprehensionSessionId,
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
        setTextAnswer("");
        setIsAnswered(false);
        setSuggestion(null);
        setTimeLeft(30);
        refetch();
    };


    const progressPercentage =
        questionData ? (questionData.questionIndex / questionData.totalQuestions) * 100 : 0;

    // Decide alert background color
    const alertBgClass = (() => {
        if (isCorrect === true && !isPostSubmitAnswerPending) {
            // user is correct
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
            return <TimerIcon className="w-5 h-5 text-yellow-400" />;
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
        if (!questionData) return true;
        // If we haven't selected or typed anything and haven't answered => disable
        if (questionData.question.questionType === QuestionType.ESSAY && !textAnswer && !isAnswered) {
            return true;
        }
        // If pending => disable
        if (isPostSubmitAnswerPending) {
            return true;
        }
        return false;
    })();


    // Render the appropriate page based on question type
    if (!questionData) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
            </div>
        );
    }

    const handleQuestionSubmit = (answer: string | null) => {
        handleSubmitAnswer(answer);
    };

    return (
        <Container>
            <Header currentPath="/comprehension-session" />

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
                            <LivesIndicator lives={lives} />

                            {/* Timer */}
                            <Timer timeLeft={timeLeft} />

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
                                <h2 className="text-2xl font-semibold text-slate-200">
                                    {questionData?.question.question.text}
                                </h2>
                            </div>

                            {questionData.question.questionType === QuestionType.ESSAY && (
                                <EssayPage
                                    questionData={questionData}
                                    setTextAnswer={setTextAnswer}
                                    textAnswer={textAnswer}
                                    lives={lives}
                                    timeLeft={timeLeft}
                                    suggestion={suggestion || ''}
                                />
                            )}
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
                                            <AlertDescription className="text-lg text-slate-200">
                                                {alertMessage}
                                            </AlertDescription>
                                        </div>
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit / Re-try / Continue button */}
                        <Button
                            className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-slate-200"
                            disabled={isButtonDisabled}
                            onClick={() => {
                                let answer = null;
                                if (questionData.question.questionType === QuestionType.ESSAY) {
                                    answer = textAnswer;
                                }
                                handleSubmitAnswer(answer);
                            }}
                        >
                            {buttonLabel}
                        </Button>
                    </motion.div>
                </div>
            </main>
        </Container>
    );
}
