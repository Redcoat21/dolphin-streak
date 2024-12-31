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
  Flag,
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

  // Update the renderQuestion function to include better styling
  const renderQuestion = () => {
    if (!data?.data?.questions?.[currentQuestionIndex]) return null;
    const question = data.data.questions[currentQuestionIndex];

    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full">
            <QuestionTypeIcon type={question.type} />
            <span className="text-lg font-medium">Question {currentQuestionIndex + 1}</span>
          </div>
          <p className="text-slate-400">
            {question.type === QuestionType.MULTIPLE_CHOICE
              ? "Select the best answer from the options below"
              : "Complete this question to progress"}
          </p>
        </div>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="space-y-8">
              <h2 className="text-2xl font-medium leading-relaxed">{question.text}</h2>

              <div className="grid grid-cols-1 gap-4">
                {question.type === QuestionType.MULTIPLE_CHOICE ? (
                  question.answerOptions?.map((option, idx) => (
                    <Button
                      key={`${option}-${idx}`}
                      variant="outline"
                      className={`w-full justify-start p-6 border-slate-800 hover:border-blue-500 
                    hover:bg-blue-500/10 transition-all duration-200 group
                    ${selectedAnswer === option ? "ring-2 ring-blue-500" : ""}
                    ${showFeedback && selectedAnswer === option
                          ? isCorrect
                            ? "bg-green-500/20 border-green-500"
                            : "bg-red-500/20 border-red-500"
                          : ""}`}
                      onClick={() => handleSubmitAnswer(option)}
                      disabled={showFeedback}
                    >
                      <span className="flex items-center gap-4">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 
                        group-hover:bg-blue-500/20 transition-colors text-slate-400 group-hover:text-blue-400">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{option}</span>
                      </span>
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
                    className="w-full min-h-[200px] bg-slate-800/50 border-slate-700 rounded-lg p-6
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
                  placeholder:text-slate-500 text-lg"
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
  return (
    <Container>
      <Header currentPath={`/course/${courseId}/levels/${levelId}`} />
      <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between mb-8 bg-slate-900/50 p-4 rounded-xl backdrop-blur-sm border border-slate-800">
            <Button
              variant="ghost"
              className="text-slate-400 hover:text-white group flex items-center gap-2 transition-all duration-200"
              onClick={handleBack}
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Course</span>
            </Button>
            {confirmed && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-400 bg-slate-800/50 py-2 px-4 rounded-lg">
                  <Flag className="w-4 h-4" />
                  <span>Question {currentQuestionIndex + 1} of {data?.data?.questions?.length}</span>
                </div>
              </div>
            )}
          </div>

          {/* Error State */}
          {isError && (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>Failed to load level content. Please try again.</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading ? (
            <LoadingSkeleton count={1} type="course-detail" />
          ) : (
            <>
              {confirmed ? (
                <div className="space-y-8">
                  {/* Progress Bar */}
                  <div className="relative">
                    <Progress
                      value={progress}
                      className="h-2 bg-slate-800"
                    />
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-slate-400">
                      <span>Start</span>
                      <span>Finish</span>
                    </div>
                  </div>

                  {renderQuestion()}
                </div>
              ) : (
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="space-y-8">
                      <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                          Ready to Begin?
                        </h1>
                        <p className="text-lg text-slate-400 max-w-md mx-auto leading-relaxed">
                          This level contains {data?.data?.questions?.length} questions.
                          Take your time and answer carefully. Good luck!
                        </p>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                        <Button
                          size="lg"
                          className="w-full max-w-md h-14 bg-gradient-to-r from-blue-500 to-blue-600 
                          hover:from-blue-600 hover:to-blue-700 text-lg font-medium
                          transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl
                          hover:shadow-blue-500/20"
                          onClick={handleConfirm}
                        >
                          Start Level
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </Container>
  );
}
