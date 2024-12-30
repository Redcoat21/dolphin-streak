import { useMediaQuery } from "@/hooks/use-media-query";
import { Container } from "@/core/components/container";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft, AlertCircle, Mic, PenSquare,
  CheckCircle, XCircle, Book, ArrowRight,
} from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { useAuthStore } from "@/core/stores/authStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSkeleton } from "../../components/LoadingSkeleton";
import { Header } from "@/core/pages/dasboard/components/Header";

export enum QuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  ESSAY = "ESSAY",
  FILL_IN = "FILL_IN",
  VOICE = "VOICE",
  WRITING = "WRITING",
}

export function LevelPageID() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;
  const levelId = params?.levelId as string;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { getAccessToken } = useAuthStore();
  const accessToken = getAccessToken();

  const [confirmed, setConfirmed] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [progress, setProgress] = useState(0);

  const { data, isLoading, isError } = trpc.levels.getLevelDetail.useQuery({
    levelId,
    accessToken: accessToken || "",
  });

  useEffect(() => {
    if (data?.data?.questions) {
      setProgress((currentQuestionIndex / data.data.questions.length) * 100);
    }
  }, [currentQuestionIndex, data?.data?.questions]);

  const handleBack = useCallback(() => {
    if (confirmed) {
      const confirmExit = window.confirm("Are you sure you want to exit? Your progress will be lost.");
      if (confirmExit) {
        window.history.back();
      }
    } else {
      window.history.back();
    }
  }, [confirmed]);

  const handleConfirm = useCallback(() => {
    setConfirmed(true);
  }, []);

  const handleSubmitAnswer = useCallback(async (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isAnswerCorrect = answer === data?.data?.questions[currentQuestionIndex].correctAnswer[0];
    setIsCorrect(isAnswerCorrect);

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestionIndex < (data?.data?.questions?.length || 0) - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        router.push(`/course/${courseId}`);
      }
    }, 1500);
  }, [currentQuestionIndex, data, courseId, router]);

  const QuestionTypeIcon = ({ type }: { type: QuestionType }) => {
    switch (type) {
      case QuestionType.MULTIPLE_CHOICE:
        return <Book className="w-5 h-5" />;
      case QuestionType.ESSAY:
        return <PenSquare className="w-5 h-5" />;
      case QuestionType.VOICE:
        return <Mic className="w-5 h-5" />;
      default:
        return <PenSquare className="w-5 h-5" />;
    }
  };

  const renderQuestion = () => {
    if (!data?.data?.questions?.[currentQuestionIndex]) return null;
    const question = data.data.questions[currentQuestionIndex];

    return (
      <div className="space-y-8 transition-all duration-300 ease-out transform opacity-100 translate-y-0">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <QuestionTypeIcon type={question.type} />
            <span className="ml-2">Question {currentQuestionIndex + 1}</span>
          </h1>
          <p className="text-slate-400">
            {question.type === QuestionType.MULTIPLE_CHOICE
              ? "Choose the correct answer"
              : "Complete this question to progress"}
          </p>
        </div>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="py-6">
            <div className="space-y-6">
              <h2 className="text-xl font-medium">{question.text}</h2>
              <div className="grid grid-cols-1 gap-3">
                {question.type === QuestionType.MULTIPLE_CHOICE ? (
                  question.answerOptions?.map((option, idx) => (
                    <Button
                      key={`${option}-${idx}`}
                      variant="outline"
                      className={`w-full justify-start p-6 border-slate-800 hover:border-blue-500 
                      hover:bg-blue-500/10 transition-all duration-200
                      ${selectedAnswer === option ? "ring-2 ring-blue-500" : ""}
                      ${showFeedback && selectedAnswer === option
                        ? isCorrect
                          ? "bg-green-500/20 border-green-500"
                          : "bg-red-500/20 border-red-500"
                        : ""}`}
                      onClick={() => handleSubmitAnswer(option)}
                      disabled={showFeedback}
                    >
                      <span className="mr-4 text-slate-500 font-mono">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                      {showFeedback && selectedAnswer === option && (
                        <span className="ml-auto">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </span>
                      )}
                    </Button>
                  ))
                ) : (
                  <textarea
                    className="w-full min-h-[200px] bg-slate-800 border-slate-700 rounded-lg p-4 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Write your answer here..."
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderConfirmation = () => (
    <div className="space-y-8 transition-all duration-300 ease-out transform opacity-100 translate-y-0">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Ready to Begin?</h1>
        <p className="text-slate-400 max-w-md mx-auto">
          This level contains {data?.data?.questions?.length} questions.
          Take your time and answer carefully. Good luck!
        </p>
      </div>
      <Button
        variant="default"
        size="lg"
        className="w-full max-w-md mx-auto h-14 bg-blue-500 hover:bg-blue-600
        transform transition-all duration-200 hover:scale-105"
        onClick={handleConfirm}
      >
        Start Level
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </div>
  );

  return (
    <Container>
      <Header currentPath={`/course/${courseId}/levels/${levelId}`} />
      <main className="min-h-screen bg-slate-950 text-white pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              className="text-slate-400 hover:text-white group"
              onClick={handleBack}
            >
              <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Course
            </Button>
            {confirmed && (
              <div className="text-slate-400">
                Question {currentQuestionIndex + 1} of {data?.data?.questions?.length}
              </div>
            )}
          </div>
          {confirmed ? (
            <>
              <div className="mb-8">
                <Progress value={progress} className="h-2 bg-slate-800" />
              </div>
              {renderQuestion()}
            </>
          ) : (
            renderConfirmation()
          )}
        </div>
      </main>
    </Container>
  );
}
