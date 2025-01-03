import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useParams, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/core/stores/authStore";
import { trpc } from "@/utils/trpc";
import { LoadingSkeleton } from "../../../components/LoadingSkeleton";
import { Container } from "@/core/components/container";
import { Header } from "@/core/pages/dasboard/components/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuestionType, TQuestion } from "@/server/types/questions";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { QuestionMultipleChoice } from "./components/QuestionMultipleChoice";
import { QuestionVoice } from "./components/QuestionVoice";
import { QuestionHanzi } from "./components/QuestionHanzi";
import { ChevronLeft } from "lucide-react";
import { QuestionEssay } from "./components/QuestionEssay";
import { QuestionFillInTheBlanks } from "./components/QuestionFillInTheBlanks";

export function QuestionPageID() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params?.courseId as string;
  const levelId = params?.levelId as string;
  const questionIdx = params?.questionIdx as string;
  const sessionId = searchParams.get('sessionId') as string;
  const { getAccessToken } = useAuthStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(Number(questionIdx) || 0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const accessToken = getAccessToken() || '';
  const { toast } = useToast();

  const {
    data: questionData,
    isLoading: isQuestionLoading,
    isError: isQuestionError,
    error: questionError
  } = trpc.question.getQuestionById.useQuery(
    {
      levelId,
      sessionId,
      questionIndex: currentQuestionIndex,
      accessToken,
    },
    {
      enabled: !!sessionId && !!accessToken && levelId !== undefined,
      retry: 1,
    }
  );

  const {
    data: levelDetailData,
    isLoading: isLevelDetailLoading,
    isError: isLevelDetailError,
    error: levelDetailError
  } = trpc.levels.getLevelDetail.useQuery(
    {
      levelId,
      accessToken,
    },
    {
      enabled: !!accessToken && levelId !== undefined,
      retry: 1,
    }
  );

  const submitAnswerMutation = trpc.question.submitAnswer.useMutation({
    onError: (error) => {
      toast({
        title: "Error submitting answer",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const nextQuestionMutation = trpc.question.nextQuestion.useMutation({
    onError: (error) => {
      toast({
        title: "Error loading next question",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const question = questionData?.data?.question;
  const totalQuestions = levelDetailData?.questionsLength;

  const handleSubmitAnswer = useCallback(
    async (answer: string) => {
      if (!question) return;

      setSelectedAnswer(answer);
      setShowFeedback(true);

      try {
        const result = await submitAnswerMutation.mutateAsync({
          sessionId,
          questionIndex: currentQuestionIndex,
          levelId,
          answer,
          accessToken,
        });

        setIsCorrect(result.data?.isCorrect || false);

        // Show feedback toast
        toast({
          title: result.data?.isCorrect ? "Correct!" : "Incorrect",
          variant: result.data?.isCorrect ? "default" : "destructive",
        });

        setTimeout(async () => {
          setShowFeedback(false);
          try {
            const nextQuestion = await nextQuestionMutation.mutateAsync({
              sessionId,
              currentQuestionIndex,
              accessToken,
            });

            if (nextQuestion.data && nextQuestion.data.nextQuestionIndex < (totalQuestions || Number.POSITIVE_INFINITY)) {
              setCurrentQuestionIndex(nextQuestion.data.nextQuestionIndex);
              setSelectedAnswer(null);
              setUserAnswer('');
              router.push(
                `/course/${courseId}/levels/${levelId}/question/${nextQuestion.data.nextQuestionIndex}?sessionId=${sessionId}`
              );
            } else {
              toast({
                title: "Level Complete!",
                description: "Redirecting to course page...",
              });
              router.push(`/course/${courseId}`);
            }
          } catch (error) {
            console.error('Error fetching next question:', error);
            router.push(`/course/${courseId}`);
          }
        }, 1500);
      } catch (error) {
        console.error('Error submitting answer:', error);
      }
    },
    [currentQuestionIndex, question, courseId, levelId, sessionId, accessToken, router, submitAnswerMutation, nextQuestionMutation, totalQuestions]
  );

  const handleBack = useCallback(() => {
    const confirmExit = window.confirm('Are you sure you want to exit? Your progress will be lost.');
    if (confirmExit) {
      router.push(`/course/${courseId}`);
    }
  }, [courseId, router]);

  useEffect(() => {
    if (totalQuestions) {
      setProgress((currentQuestionIndex / totalQuestions) * 100);
    }
  }, [currentQuestionIndex, totalQuestions]);

  if (isQuestionLoading || isLevelDetailLoading) {
    return <LoadingSkeleton />;
  }

  if (isQuestionError || isLevelDetailError) {
    return (
      <Container>
        <Header currentPath={`/course/${courseId}/levels/${levelId}`} />
        <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white pt-20 pb-8 px-4">
          <Alert variant="destructive" className="max-w-4xl mx-auto">
            <AlertDescription>
              {questionError?.message || levelDetailError?.message || "Failed to load question content. Please try again."}
            </AlertDescription>
          </Alert>
        </main>
      </Container>
    );
  }

  const renderQuestion = (question: TQuestion) => {
    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <QuestionMultipleChoice
            questions={[question.question.text]}
            answers={question.answerOptions || []}
            correctAnswers={question.correctAnswer}
            onComplete={(answer) => handleSubmitAnswer(answer)} // Pass handleSubmitAnswer
          />
        );
      case QuestionType.ESSAY:
        return <QuestionEssay topic={question.question.text} onComplete={(answer) => handleSubmitAnswer(answer)} />;
      case QuestionType.FILL_IN:
        return <QuestionFillInTheBlanks sentence={question.question.text} correctAnswer={question.correctAnswer[0] || ""} onComplete={(answer) => handleSubmitAnswer(answer)} />;
      case QuestionType.VOICE:
        return <QuestionVoice sentence={question.question.text} pinyin={"TODO"} onContinue={(answer) => handleSubmitAnswer(answer)} />;
      case QuestionType.WRITING:
        return <QuestionHanzi character={question.question.text} onContinue={(answer) => handleSubmitAnswer(answer)} />;
      default:
        return null; // Or a default component
    }
  };


  return (
    <Container>
      <Header currentPath={`/course/${courseId}/levels/${levelId}`} />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 pt-20 pb-8 px-4 bg-[#0b1120]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-6">

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  className="text-slate-600 hover:text-slate-900 group flex items-center gap-2"
                  onClick={handleBack}
                >
                  <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  <span>Back to Course</span>
                </Button>
                <div className="text-sm text-slate-600">
                  Question {currentQuestionIndex + 1} of {totalQuestions || '?'}
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            {question && renderQuestion(question)}
          </div>
        </div>
      </main>
    </Container>
  );
}