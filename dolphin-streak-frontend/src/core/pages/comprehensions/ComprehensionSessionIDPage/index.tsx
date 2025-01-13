import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { TGetCourseSessionIdResponse } from "@/server/types/courses";
import { CompletedCourse } from "@/core/components/completed-course";

export function ComprehensionSessionIDPage() {
    const router = useRouter();
    const { getAccessToken } = useAuthStore();
    const accessToken = getAccessToken();
    const params = useParams();
    const comprehensionSessionId = params?.comprehensionSessionId as string;
    const { toast } = useToast();

    // UI states
    const [textAnswer, setTextAnswer] = useState("");
    const [isAnswered, setIsAnswered] = useState(false);
    const [lives, setLives] = useState(3);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [suggestion, setSuggestion] = useState<string | null>(null);

    const [comprehensionSession, setComprehensionSession] = useState<TGetCourseSessionIdResponse | undefined>();

    // Fetch session data
    const { data: comprehensionSessionData, refetch, isPending: isComprehensionSessionDataPending } = trpc.course.getCourseSessionId.useQuery({
        accessToken: accessToken || "",
        courseSessionId: comprehensionSessionId as string
    }, {
    });


    const {
        mutate: postSubmitAnswer,
        isPending: isPostSubmitAnswerPending
    } = trpc.comprehension.postSubmitAnswer.useMutation({
        onSuccess(data) {
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

    // Effects and memoized values
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!isAnswered && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [timeLeft, isAnswered]);
    useEffect(() => {
        if (comprehensionSessionData) {
            setComprehensionSession(comprehensionSessionData)
        };
    }, [comprehensionSessionData]);
    const progressPercentage = useMemo(() => {
        return comprehensionSession?.data ?
            (comprehensionSession.data.questionIndex / comprehensionSession.data.totalQuestion) * 100
            : 0;
    }, [comprehensionSession]);

    // Helper functions
    const playSound = useCallback((type: "correct" | "incorrect") => {
        const audio = new Audio(`/sounds/${type}.mp3`);
        audio.play().catch(console.error);
    }, []);

    const resetQuestionState = useCallback(() => {
        setTextAnswer("");
        setIsAnswered(false);
        setSuggestion(null);
        setTimeLeft(30);
        refetch();
    }, [refetch]);

    const handleSubmitAnswer = async (answer: string | null) => {
        if (!isAnswered) {
            setIsAnswered(true);
            if (answer && comprehensionSession?.data) {
                postSubmitAnswer({
                    questionType: comprehensionSession.data.question.questionType as QuestionType,
                    accessToken: accessToken || "",
                    courseSessionId: comprehensionSessionId,
                    answer: answer
                });
            }
        } else {
            resetQuestionState();
        }
    };

    // UI helper values
    const alertBgClass = isCorrect === true && !isPostSubmitAnswerPending
        ? "bg-green-900/50"
        : isCorrect === null && isAnswered && !isPostSubmitAnswerPending
            ? "bg-red-900/50"
            : isCorrect === null && isPostSubmitAnswerPending
                ? "bg-yellow-900/50"
                : "bg-slate-900/50";

    const alertIcon = isCorrect === true && !isPostSubmitAnswerPending
        ? <CheckCircle2 className="w-5 h-5 text-green-400" />
        : isCorrect === null && isPostSubmitAnswerPending
            ? <TimerIcon className="w-5 h-5 text-yellow-400" />
            : isCorrect === null && isAnswered && !isPostSubmitAnswerPending
                ? <XCircle className="w-5 h-5 text-red-400" />
                : <XCircle className="w-5 h-5 text-slate-400" />;

    const alertMessage = isCorrect === true && !isPostSubmitAnswerPending
        ? "Great job! That's correct!"
        : isCorrect === null && isPostSubmitAnswerPending
            ? "Checking your answer..."
            : isCorrect === null && isAnswered && !isPostSubmitAnswerPending
                ? "Not quite right. Try again!"
                : "Answer not submitted yet.";

    const buttonLabel = !isAnswered
        ? "Check Answer"
        : isCorrect === true && !isPostSubmitAnswerPending
            ? "Continue"
            : isCorrect === null && isPostSubmitAnswerPending
                ? "Checking..."
                : isCorrect === null && !isPostSubmitAnswerPending
                    ? "Try Again"
                    : "Answer Submitted";

    const isButtonDisabled = !comprehensionSession?.data
        || (comprehensionSession?.data?.question?.questionType === QuestionType.ESSAY
            && !textAnswer && !isAnswered)
        || isPostSubmitAnswerPending;

    if (comprehensionSession?.data?.questionIndex == comprehensionSession?.data?.totalQuestion && !isComprehensionSessionDataPending) {
        return <CompletedCourse score={comprehensionSession?.data?.score || 0} />;
    } else if (!comprehensionSession?.data) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
            </div>
        );
    } else {
        return (
            <Container>
                <Header currentPath="/comprehension-session" />
                <main className="min-h-screen bg-slate-950 text-white pt-24 pb-8 px-4">
                    <div className="max-w-3xl mx-auto">
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
                                <LivesIndicator lives={lives} />
                                <Timer timeLeft={timeLeft} />
                                <div className="w-32">
                                    <Progress
                                        value={progressPercentage}
                                        className="h-2.5 bg-slate-700"
                                    />
                                </div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Card className="bg-slate-900 border-slate-800 p-6">
                                <div className="flex items-start gap-4 mb-8">
                                    <h2 className="text-2xl font-semibold text-slate-200">
                                        {comprehensionSession?.data?.question?.question?.text}
                                    </h2>
                                </div>

                                {comprehensionSession?.data?.question?.questionType === QuestionType.ESSAY ? (
                                    <EssayPage
                                        questionData={comprehensionSession.data}
                                        setTextAnswer={setTextAnswer}
                                        textAnswer={textAnswer}
                                        lives={lives}
                                        timeLeft={timeLeft}
                                        suggestion={suggestion || ''}
                                    />
                                ) : null}
                            </Card>

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

                            <Button
                                className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-slate-200"
                                disabled={isButtonDisabled}
                                onClick={() => handleSubmitAnswer(
                                    comprehensionSession.data?.question.questionType === QuestionType.ESSAY
                                        ? textAnswer
                                        : null
                                )}
                            >
                                {buttonLabel}
                            </Button>
                        </motion.div>
                    </div>
                </main>
            </Container>
        );
    }
}