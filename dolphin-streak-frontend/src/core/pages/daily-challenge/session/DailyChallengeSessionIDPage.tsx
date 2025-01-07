import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/core/stores/authStore";
import { trpc } from "@/utils/trpc";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/core/components/container";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Volume2, XCircle, CheckCircle2, Timer as TimerIcon } from "lucide-react";
import { Header } from "@/core/pages/dasboard/components/Header";
import { QuestionType } from "@/server/types/questions";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import WritingPage from "../../../components/courses/QuestionTypes/writing";
import VoicePage from "../../../components/courses/QuestionTypes/voice";
import FillInPage from "../../../components/courses/QuestionTypes/fill-in";
import EssayPage from "../../../components/courses/QuestionTypes/essay";
import MultipleChoicePage from "../../../components/courses/QuestionTypes/multiple-choice";
import { LivesIndicator } from "../../../components/courses/lives-indicator";
import { Timer } from "../../../components/courses/timer";

export function DailyChallengeSessionIDPage() {
    const router = useRouter();
    const { getAccessToken } = useAuthStore();
    const accessToken = getAccessToken();
    const params = useParams();
    const dailyChallengeSessionId = params?.dailyChallengeSessionId as string;

    // UI states
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [textAnswer, setTextAnswer] = useState("");
    const [fillInAnswers, setFillInAnswers] = useState<{ [key: string]: string }>({});
    const [isAnswered, setIsAnswered] = useState(false);
    const [lives, setLives] = useState(3);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);

    const { toast } = useToast();
    const audioRef = useRef<HTMLAudioElement>(null);

    // Fetch session data
    const { data: dailyChallengeSessionData, refetch } = trpc.daily.getDailySession.useQuery({
        accessToken: accessToken || "",
        dailySessionId: dailyChallengeSessionId
    });

    // Timer effect
    useEffect(() => {
        if (!isAnswered && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, isAnswered]);

    // Submit answer mutation
    const {
        mutate: postSubmitAnswer,
        isPending: isPostSubmitAnswerPending
    } = trpc.daily.postSubmitDailyAnswer.useMutation({
        onSuccess(data) {
            if (data.data?.isCorrect) {
                setIsCorrect(true);
                playSound("correct");
            } else {
                setIsCorrect(false);
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

    // Sound effects
    const playSound = (type: "correct" | "incorrect") => {
        const audio = new Audio(`/sounds/${type}.mp3`);
        audio.play().catch(console.error);
    };

    const questionData = dailyChallengeSessionData?.data;

    // Handle answer submission
    const handleSubmitAnswer = async (answer: string | null) => {
        if (!isAnswered) {
            setIsAnswered(true);
            if (answer) {
                postSubmitAnswer({
                    questionType: questionData?.question.type as QuestionType,
                    accessToken: accessToken || "",
                    dailySessionId: dailyChallengeSessionId,
                    answer: answer
                });
            }
        } else {
            resetQuestionState();
        }
    };

    // Reset question state
    const resetQuestionState = () => {
        setSelectedAnswer(null);
        setTextAnswer("");
        setIsAnswered(false);
        setSuggestion(null);
        setTimeLeft(30);
        setFillInAnswers({});
        setRecordedAudio(null);
        setIsCorrect(null);
        refetch();
    };

    const progressPercentage = questionData
        ? (questionData.questionIndex / questionData.totalQuestion) * 100
        : 0;

    // UI state computations
    const alertBgClass = (() => {
        if (isCorrect === true && !isPostSubmitAnswerPending) return "bg-green-900/50";
        if (isCorrect === false && !isPostSubmitAnswerPending) return "bg-red-900/50";
        if (isPostSubmitAnswerPending) return "bg-yellow-900/50";
        return "bg-slate-900/50";
    })();

    const alertIcon = (() => {
        if (isCorrect === true && !isPostSubmitAnswerPending) {
            return <CheckCircle2 className="w-5 h-5 text-green-400" />;
        }
        if (isPostSubmitAnswerPending) {
            return <TimerIcon className="w-5 h-5 text-yellow-400" />;
        }
        if (isCorrect === false && !isPostSubmitAnswerPending) {
            return <XCircle className="w-5 h-5 text-red-400" />;
        }
        return <XCircle className="w-5 h-5 text-slate-400" />;
    })();

    const alertMessage = (() => {
        if (isCorrect === true && !isPostSubmitAnswerPending) {
            return "Great job! That's correct!";
        }
        if (isPostSubmitAnswerPending) {
            return "Checking your answer...";
        }
        if (isCorrect === false && !isPostSubmitAnswerPending) {
            return "Not quite right. Try again!";
        }
        return "Answer not submitted yet.";
    })();

    const buttonLabel = isAnswered ? "Try Again" : "Check Answer";

    const isButtonDisabled = (() => {
        if (!questionData) return true;
        if (isPostSubmitAnswerPending) return true;

        if (!isAnswered) {
            switch (questionData.question.type) {
                case QuestionType.MULTIPLE_CHOICE:
                    return !selectedAnswer;
                case QuestionType.ESSAY:
                case QuestionType.WRITING:
                    return !textAnswer;
                case QuestionType.FILL_IN:
                    return Object.keys(fillInAnswers).length === 0;
                case QuestionType.VOICE:
                    return !recordedAudio;
                default:
                    return false;
            }
        }
        return false;
    })();

    if (!questionData) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
            </div>
        );
    }

    return (
        <Container>
            <Header currentPath="/daily-challenge" />

            <main className="min-h-screen bg-slate-950 text-white pt-24 pb-8 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Top bar */}
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
                                {questionData.question.type !== QuestionType.FILL_IN && (
                                    <h2 className="text-2xl font-semibold text-slate-200">
                                        {questionData.question.question.text}
                                    </h2>
                                )}
                            </div>

                            {/* Question type components */}
                            {questionData.question.type === QuestionType.MULTIPLE_CHOICE && (
                                <MultipleChoicePage
                                    questionData={questionData}
                                    setSelectedAnswer={setSelectedAnswer}
                                    selectedAnswer={selectedAnswer}
                                    lives={lives}
                                    timeLeft={timeLeft}
                                />
                            )}
                            {questionData.question.type === QuestionType.ESSAY && (
                                <EssayPage
                                    questionData={questionData}
                                    setTextAnswer={setTextAnswer}
                                    textAnswer={textAnswer}
                                    lives={lives}
                                    timeLeft={timeLeft}
                                    suggestion={suggestion || ''}
                                />
                            )}
                            {questionData.question.type === QuestionType.FILL_IN && (
                                <FillInPage
                                    questionData={questionData}
                                    setFillInAnswers={setFillInAnswers}
                                    fillInAnswers={fillInAnswers}
                                    lives={lives}
                                    timeLeft={timeLeft}
                                />
                            )}
                            {questionData.question.type === QuestionType.VOICE && (
                                <VoicePage
                                    questionData={questionData}
                                    setRecordedAudio={setRecordedAudio}
                                    recordedAudio={recordedAudio}
                                    lives={lives}
                                    timeLeft={timeLeft}
                                />
                            )}
                            {questionData.question.type === QuestionType.WRITING && (
                                <WritingPage
                                    questionData={questionData}
                                    setTextAnswer={setTextAnswer}
                                    textAnswer={textAnswer}
                                    lives={lives}
                                    timeLeft={timeLeft}
                                />
                            )}
                        </Card>

                        {/* Alert for feedback */}
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

                        {/* Submit button */}
                        <Button
                            className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-slate-200"
                            disabled={isButtonDisabled}
                            onClick={() => {
                                let answer = null;
                                switch (questionData.question.type) {
                                    case QuestionType.MULTIPLE_CHOICE:
                                        answer = selectedAnswer;
                                        break;
                                    case QuestionType.ESSAY:
                                    case QuestionType.WRITING:
                                        answer = textAnswer;
                                        break;
                                    case QuestionType.FILL_IN:
                                        answer = JSON.stringify(fillInAnswers);
                                        break;
                                    case QuestionType.VOICE:
                                        if (recordedAudio) {
                                            const reader = new FileReader();
                                            reader.readAsDataURL(recordedAudio);
                                            reader.onloadend = () => {
                                                handleSubmitAnswer(reader.result as string);
                                            };
                                            return;
                                        }
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