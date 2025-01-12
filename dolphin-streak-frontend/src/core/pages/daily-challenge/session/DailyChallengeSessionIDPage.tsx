"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/core/stores/authStore";
import { trpc } from "@/utils/trpc";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/core/components/container";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    XCircle,
    CheckCircle2,
    Timer as TimerIcon,
} from "lucide-react";
import { Header } from "@/core/pages/dasboard/components/Header";
import { QuestionType } from "@/server/types/questions";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

import MultipleChoicePage from "@/core/components/courses/QuestionTypes/multiple-choice";
import EssayPage from "@/core/components/courses/QuestionTypes/essay";
import FillInPage from "@/core/components/courses/QuestionTypes/fill-in";
import VoicePage from "@/core/components/courses/QuestionTypes/voice";
import WritingPage from "@/core/components/courses/QuestionTypes/writing";

import { LivesIndicator } from "@/core/components/courses/lives-indicator";
import { Timer } from "@/core/components/courses/timer";
import { CompletedCourse } from "@/core/components/completed-course";

export function DailyChallengeSessionIDPage() {
    const router = useRouter();
    const { getAccessToken } = useAuthStore();
    const accessToken = getAccessToken();
    const params = useParams();
    const dailyChallengeSessionId = params?.dailyChallengeSessionId as string;

    // --- UI / State Management ---
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [textAnswer, setTextAnswer] = useState("");
    // For fill-in-the-blanks: key => user typed answer
    const [fillInAnswers, setFillInAnswers] = useState<{ [key: string]: string }>({});
    const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);

    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(30);
    const [suggestion, setSuggestion] = useState<string | null>(null);

    const { toast } = useToast();

    // --- Fetch daily-challenge session data ---
    const { data: dailyChallengeSessionData, refetch, isPending: isDailyChallengeSessionDataPending } = trpc.daily.getDailySession.useQuery(
        {
            accessToken: accessToken || "",
            dailySessionId: dailyChallengeSessionId,
        }
    );

    // We only care about .data inside dailyChallengeSessionData
    const questionData = dailyChallengeSessionData?.data;

    // --- Count down the timer if question is not answered ---
    useEffect(() => {
        if (!isAnswered && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeLeft, isAnswered]);

    // --- Submit daily-challenge answer mutation ---
    const {
        mutate: postSubmitAnswer,
        isPending: isPostSubmitAnswerPending,
    } = trpc.daily.postSubmitDailyAnswer.useMutation({
        onSuccess(data) {
            // If correct => set isCorrect = true
            // If incorrect => set isCorrect = null, lose a life, show suggestion, etc.
            if (data.data?.isCorrect) {
                setIsCorrect(true);
                playSound("correct");
            } else {
                setIsCorrect(null);
                setLives((prev) => Math.max(0, prev - 1));
                setSuggestion(data.data?.suggestion || null);
                playSound("incorrect");
            }
        },
        onError(error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    // --- Utility to play feedback sounds ---
    const playSound = (type: "correct" | "incorrect") => {
        const audio = new Audio(`/sounds/${type}.mp3`);
        audio.play().catch(console.error);
    };

    // --- Attempt to submit or reset the question ---
    const handleSubmitAnswer = async (answer: string | null) => {
        // If not answered yet => submit
        if (!isAnswered) {
            setIsAnswered(true);

            if (answer) {
                postSubmitAnswer({
                    questionType: questionData?.question.questionType as QuestionType,
                    accessToken: accessToken || "",
                    dailySessionId: dailyChallengeSessionId,
                    answer: answer,
                });
            }
        } else {
            // If user has answered => reset states for next attempt or next question
            resetQuestionState();
        }
    };

    const resetQuestionState = () => {
        setSelectedAnswer(null);
        setTextAnswer("");
        setFillInAnswers({});
        setRecordedAudio(null);
        setIsAnswered(false);
        setIsCorrect(null);
        setSuggestion(null);
        setTimeLeft(30);
        refetch();
    };

    // --- Compute progress bar percentage ---
    // dailyChallengeSessionData?.data => { questionIndex, totalQuestion, question: {...} }
    const progressPercentage = questionData
        ? (questionData.questionIndex / questionData.totalQuestion) * 100
        : 0;

    // --- Decide alert background color (feedback) ---
    const alertBgClass = (() => {
        if (isCorrect === true && !isPostSubmitAnswerPending) return "bg-green-900/50";
        if (isCorrect === null && isAnswered && !isPostSubmitAnswerPending) return "bg-red-900/50";
        if (isCorrect === null && isPostSubmitAnswerPending) return "bg-yellow-900/50";
        return "bg-slate-900/50";
    })();

    // --- Decide alert icon and message (feedback) ---
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
        // Default
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

    // --- Decide button label and disable state ---
    const buttonLabel = (() => {
        // If not answered => "Check Answer"
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
        return "Submit";
    })();

    const isButtonDisabled = (() => {
        // If no question data => disable
        if (!questionData) return true;

        // Check if user has selected or typed something:
        switch (questionData.question.questionType) {
            case QuestionType.MULTIPLE_CHOICE:
                if (!selectedAnswer && !isAnswered) return true;
                break;
            case QuestionType.ESSAY:
            case QuestionType.WRITING:
                if (!textAnswer && !isAnswered) return true;
                break;
            case QuestionType.FILL_IN:
                if (Object.keys(fillInAnswers).length === 0 && !isAnswered) return true;
                break;
            case QuestionType.VOICE:
                if (!recordedAudio && !isAnswered) return true;
                break;
            default:
                break;
        }

        if (isPostSubmitAnswerPending) return true;
        return false;
    })();

    if (questionData?.questionIndex == questionData?.totalQuestion && !isDailyChallengeSessionDataPending) {
        return <CompletedCourse score={questionData?.score || 0} />;
    }
    // --- If still loading, show spinner ---
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

                    {/* Top bar with "go back", LivesIndicator, Timer, Progress */}
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

                            {/* Progress */}
                            <div className="w-32">
                                <Progress
                                    value={progressPercentage}
                                    className="h-2.5 bg-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Question Card */}
                        <Card className="bg-slate-900 border-slate-800 p-6">
                            {/*
                Optionally, you can add a "Play audio" button here
                if the question text needs TTS or similar
              */}
                            <div className="flex items-start gap-4 mb-8">
                                {/* Example: If you want a "volume" button: 
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-slate-800 mt-1"
                  >
                    <Volume2 className="w-6 h-6 text-blue-400" />
                  </Button>
                */}
                                {questionData.question.questionType !== QuestionType.FILL_IN && (
                                    <h2 className="text-2xl font-semibold text-slate-200">
                                        {questionData.question.question.text}
                                    </h2>
                                )}
                            </div>

                            {/* Render question form based on type */}
                            {questionData.question.questionType === QuestionType.MULTIPLE_CHOICE && (
                                <MultipleChoicePage
                                    questionData={questionData}
                                    selectedAnswer={selectedAnswer}
                                    setSelectedAnswer={setSelectedAnswer}
                                    lives={lives}
                                    timeLeft={timeLeft}
                                />
                            )}
                            {questionData.question.questionType === QuestionType.ESSAY && (
                                <EssayPage
                                    questionData={questionData}
                                    setTextAnswer={setTextAnswer}
                                    textAnswer={textAnswer}
                                    lives={lives}
                                    timeLeft={timeLeft}
                                    suggestion={suggestion || ""}
                                />
                            )}
                            {questionData.question.questionType === QuestionType.FILL_IN && (
                                <FillInPage
                                    questionData={questionData}
                                    fillInAnswers={fillInAnswers}
                                    setFillInAnswers={setFillInAnswers}
                                    lives={lives}
                                    timeLeft={timeLeft}
                                />
                            )}
                            {questionData.question.questionType === QuestionType.VOICE && (
                                <VoicePage
                                    questionData={questionData}
                                    setRecordedAudio={setRecordedAudio}
                                    recordedAudio={recordedAudio}
                                    lives={lives}
                                    timeLeft={timeLeft}
                                />
                            )}
                            {questionData.question.questionType === QuestionType.WRITING && (
                                <WritingPage
                                    questionData={questionData}
                                    setTextAnswer={setTextAnswer}
                                    textAnswer={textAnswer}
                                    lives={lives}
                                    timeLeft={timeLeft}
                                />
                            )}
                        </Card>

                        {/* Feedback Alert */}
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

                        {/* Submit / Retry / Continue button */}
                        <Button
                            className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-slate-200"
                            disabled={isButtonDisabled}
                            onClick={() => {
                                // Gather the user’s answer depending on question type
                                let answer: string | null = null;
                                switch (questionData.question.questionType) {
                                    case QuestionType.MULTIPLE_CHOICE:
                                        answer = selectedAnswer;
                                        break;
                                    case QuestionType.ESSAY:
                                    case QuestionType.WRITING:
                                        answer = textAnswer;
                                        break;
                                    case QuestionType.FILL_IN:
                                        // You might merge all fillInAnswers into a single string, 
                                        // or only 1 blank. Adjust as needed:
                                        // answer = JSON.stringify(fillInAnswers);
                                        answer = fillInAnswers[0];
                                        break;
                                    case QuestionType.VOICE:
                                        if (recordedAudio) {
                                            const reader = new FileReader();
                                            reader.readAsDataURL(recordedAudio);
                                            reader.onloadend = () => {
                                                const base64Audio = reader.result as string;
                                                handleSubmitAnswer(base64Audio);
                                            };
                                            return;
                                        }
                                        break;
                                    default:
                                        break;
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
