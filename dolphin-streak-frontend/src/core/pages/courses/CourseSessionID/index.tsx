import React, { useState, useEffect, useRef } from "react";
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
import {
  Heart,
  Volume2,
  XCircle,
  Mic,
  CheckCircle2,
  AlignJustify,
  Timer,
  Undo2,
} from "lucide-react";
import { Header } from "@/core/pages/dasboard/components/Header";
import { QuestionType } from "@/server/types/questions";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

export function CourseSessionIDPage() {
  const router = useRouter();
  const { getAccessToken } = useAuthStore();
  const accessToken = getAccessToken();
  const params = useParams();
  const courseSessionId = params?.courseSessionId as string;
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [lives, setLives] = useState(3);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const { toast } = useToast();
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const correctAnimationControls = useAnimation();

  const { data: courseSessionData, refetch: refetchCourseSession } =
    trpc.course.getCourseSessionId.useQuery({
      accessToken: accessToken || "",
      courseSessionId: courseSessionId as string,
      enabled: !isLoadingNext,
    });

  useEffect(() => {
    if (!isAnswered && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isAnswered]);

  const { mutate: postSubmitAnswer, isPending: isPostSubmitAnswerPending } =
    trpc.course.postSubmitAnswer.useMutation({
      onSuccess(data) {
        setIsSubmitting(false);
        setIsCorrect(data.data?.isCorrect || null);
        setIsAnswered(true);
        if (data.data?.isCorrect) {
          playSound("correct");
          correctAnimationControls.start({ scale: 1.1, transition: { duration: 0.2 } });
          correctAnimationControls.start({ scale: 1, transition: { duration: 0.2, delay: 0.2 } });
        } else {
          setLives((prev) => Math.max(0, prev - 1));
          setSuggestion(data.data?.suggestion || null);
          playSound("incorrect");
          setIsAnswered(false); // Allow re-answering if wrong
        }
      },
      onError(error) {
        setIsSubmitting(false);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const playSound = (type: "correct" | "incorrect") => {
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.play().catch(console.error);
  };

  const questionData = courseSessionData?.data;

  const handleSubmitAnswer = async () => {
    if (!isAnswered) {
      setIsSubmitting(true);
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

      if (answer) {
        postSubmitAnswer({
          accessToken: accessToken || "",
          courseSessionId: courseSessionId,
          answer: answer,
        });
      }
    } else if (isCorrect) {
      setIsLoadingNext(true);
      setTimeout(async () => {
        await refetchCourseSession();
        resetState();
        setIsLoadingNext(false);
      }, 1000);
    }
  };

  const resetState = () => {
    setSelectedAnswer(null);
    setTextAnswer("");
    setIsAnswered(false);
    setSuggestion(null);
    setIsCorrect(null);
    setTimeLeft(30);
    setIsSubmitting(false);
  };

  const renderQuestionContent = () => {
    if (!questionData) return null;

    switch (questionData.question.questionType) {
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {questionData.question.answerOptions.map((answer, index) => (
              <motion.div
                key={answer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={
                    selectedAnswer === answer
                      ? isSubmitting
                        ? "ghost"
                        : "default"
                      : "outline"
                  }
                  className={`w-full h-16 text-lg font-medium transition-all ${isAnswered
                    ? selectedAnswer === answer
                      ? isCorrect
                        ? "bg-green-600 hover:bg-green-600"
                        : "bg-red-600 hover:bg-red-600"
                      : "bg-slate-800 hover:bg-slate-800"
                    : "hover:bg-slate-800"
                    }`}
                  onClick={() => !isAnswered && setSelectedAnswer(answer)}
                  disabled={isSubmitting || isAnswered}
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
            <p className="text-slate-400 italic text-sm">Question Type: Essay</p>
            <Textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Write your essay here..."
              className="min-h-[200px] bg-slate-900 border-slate-700 text-lg text-slate-200"
              disabled={isAnswered}
            />
            {suggestion && isAnswered && (
              <Alert className="bg-blue-900/50 border-blue-500 text-slate-200">
                <AlignJustify className="w-4 h-4 text-blue-400" />
                <AlertDescription>{suggestion}</AlertDescription>
              </Alert>
            )}
          </div>
        );

      case QuestionType.FILL_IN:
        return (
          <div className="space-y-4">
            <p className="text-slate-400 italic text-sm">Question Type: Fill In</p>
            <div className="flex items-center gap-2">
              <span className="text-lg text-slate-200">
                {questionData.question.question.text.split("__")[0]}
              </span>
              <Input
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Fill in the blank..."
                className="w-32 bg-slate-900 border-slate-700 text-lg text-slate-200"
                disabled={isAnswered}
              />
              <span className="text-lg text-slate-200">
                {questionData.question.question.text.split("__")[1]}
              </span>
            </div>
            {suggestion && isAnswered && (
              <Alert className="bg-blue-900/50 border-blue-500 text-slate-200">
                <AlignJustify className="w-4 h-4 text-blue-400" />
                <AlertDescription>{suggestion}</AlertDescription>
              </Alert>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!questionData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  const progressPercentage =
    (questionData.questionIndex / questionData.totalQuestion) * 100;

  return (
    <Container>
      <Header currentPath="/course-session" />

      <main className="min-h-screen bg-slate-950 text-white pt-24 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:bg-slate-800"
              >
                <XCircle className="w-6 h-6 text-slate-400" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={resetState}
                className="hover:bg-slate-800"
                disabled={(!isAnswered && !isLoadingNext) || isSubmitting}
              >
                <Undo2 className="w-6 h-6 text-slate-400" />
              </Button>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex gap-1">
                <AnimatePresence>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 1 }}
                      animate={{ scale: i < lives ? 1 : 0.8 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      <Heart
                        className={`w-6 h-6 transition-colors ${i < lives ? "text-red-500" : "text-slate-700"
                          }`}
                        fill={i < lives ? "currentColor" : "none"}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-blue-400" />
                <span className="text-lg font-medium">{timeLeft}s</span>
              </div>

              <div className="w-32">
                <Progress value={progressPercentage} className="h-2.5 bg-slate-700" />
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-slate-800 mt-1"
                >
                  <Volume2 className="w-6 h-6 text-blue-400" />
                </Button>
                <h2 className="text-2xl font-semibold text-slate-200">
                  {questionData?.question.question.text}
                </h2>
              </div>

              {renderQuestionContent()}
            </Card>

            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  key="answer-feedback"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert
                    className={`${isCorrect === null && isPostSubmitAnswerPending
                      ? "bg-yellow-900/50"
                      : isCorrect === true && !isPostSubmitAnswerPending
                        ? "bg-green-900/50"
                        : "bg-red-900/50"
                      } border-none`}
                  >
                    <div className="flex items-center gap-2">
                      {isCorrect === null && isPostSubmitAnswerPending ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-500" />
                      ) : isCorrect === true && !isPostSubmitAnswerPending ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <AlertDescription className="text-lg text-slate-200">
                        {isCorrect === null && isPostSubmitAnswerPending
                          ? "Checking your answer..."
                          : isCorrect === true && !isPostSubmitAnswerPending
                            ? "Awesome! You got it right!"
                            : "Not quite. Keep trying!"}
                      </AlertDescription>
                    </div>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div animate={correctAnimationControls}>
              <Button
                className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                disabled={
                  (!selectedAnswer && !textAnswer && !isSubmitting) ||
                  isLoadingNext
                }
                onClick={handleSubmitAnswer}
              >
                {isSubmitting
                  ? "Checking..."
                  : isAnswered
                    ? isLoadingNext
                      ? "Loading Next..."
                      : "Continue"
                    : "Check Answer"}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </Container>
  );
}