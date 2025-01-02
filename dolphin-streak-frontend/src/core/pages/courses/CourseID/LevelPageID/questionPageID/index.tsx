// tsx dolphin-streak-frontend/src/core/pages/courses/CourseID/LevelPageID/questionPageID/index.tsx
import { useState, useCallback, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Book, PenSquare, Mic, CheckCircle, XCircle, Type, Edit, ChevronLeft } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { QuestionType } from '@/server/types/questions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/core/stores/authStore';
import { Container } from '@/core/components/container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { LoadingSkeleton } from '../../../components/LoadingSkeleton';
import { Header } from '@/core/pages/dasboard/components/Header';

interface QuestionTypeIconProps {
  type: QuestionType;
}

const QuestionTypeIcon = ({ type }: QuestionTypeIconProps) => {
  switch (type) {
    case QuestionType.MULTIPLE_CHOICE:
      return <Book className="w-5 h-5" />;
    case QuestionType.ESSAY:
      return <PenSquare className="w-5 h-5" />;
    case QuestionType.FILL_IN:
      return <Type className="w-5 h-5" />;
    case QuestionType.VOICE:
      return <Mic className="w-5 h-5" />;
    case QuestionType.WRITING:
      return <Edit className="w-5 h-5" />;
    default:
      return <PenSquare className="w-5 h-5" />;
  }
};

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

  const { data: questionData, isLoading: isQuestionLoading, isError: isQuestionError } =
    trpc.question.getQuestionById.useQuery(
      {
        levelId,
        sessionId,
        questionIndex: currentQuestionIndex,
        accessToken,
      },
      {
        enabled: !!sessionId && !!accessToken,
      }
    );

  const { data: totalQuestionsData, isLoading: isTotalQuestionsLoading, isError: isTotalQuestionsError } =
    trpc.levels.getLevelTotalQuestions.useQuery(
      {
        levelId,
        sessionId,
        accessToken,
      },
      {
        enabled: !!sessionId && !!accessToken,
      }
    );

  const submitAnswerMutation = trpc.question.submitAnswer.useMutation();
  const nextQuestionMutation = trpc.question.nextQuestion.useMutation();
  const question = questionData?.data?.question;
  const totalQuestions = totalQuestionsData?.totalQuestions;

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
        setTimeout(async () => {
          setShowFeedback(false);
          try {
            const nextQuestion = await nextQuestionMutation.mutateAsync({
              sessionId,
              currentQuestionIndex,
              accessToken,
            });
            if (nextQuestion.data) {
              setCurrentQuestionIndex(nextQuestion.data.nextQuestionIndex);
              setSelectedAnswer(null);
              setUserAnswer('');
              router.push(
                `/course/${courseId}/levels/${levelId}/question/${nextQuestion.data.nextQuestionIndex}?sessionId=${sessionId}`
              );
            } else {
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
    [currentQuestionIndex, question, courseId, levelId, sessionId, accessToken, router, submitAnswerMutation, nextQuestionMutation]
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


  if (isQuestionLoading || isTotalQuestionsLoading) {
    return <LoadingSkeleton />;
  }
  if (isQuestionError || isTotalQuestionsError) {
    return (
      <Container>
        <Header currentPath={`/course/${courseId}/levels/${levelId}`} />
        <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white pt-20 pb-8 px-4">
          <Alert variant="destructive" className="max-w-4xl mx-auto">
            <AlertDescription>Failed to load question content. Please try again.</AlertDescription>
          </Alert>
        </main>
      </Container>
    );
  }

  return (
    <Container>
      <Header currentPath={`/course/${courseId}/levels/${levelId}`} />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 pt-20 pb-8 px-4 bg-[#0b1120]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-6">
            {/* Navigation and Progress */}
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
            {/* Question Content */}
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                  <QuestionTypeIcon type={question?.type || QuestionType.MULTIPLE_CHOICE} />
                  <span className="text-lg font-medium">
                    {question?.type === QuestionType.MULTIPLE_CHOICE ? 'Multiple Choice' :
                      question?.type === QuestionType.FILL_IN ? 'Fill in the Blank' :
                        question?.type === QuestionType.VOICE ? 'Voice Response' :
                          question?.type === QuestionType.WRITING ? 'Writing' : 'Question'}
                  </span>
                </div>
              </div>
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    <h2 className="text-2xl font-medium leading-relaxed text-slate-900">
                      {question?.question.text}
                    </h2>
                    {/* Question Type Specific UI */}
                    <div className="grid grid-cols-1 gap-4">
                      {question?.type === QuestionType.MULTIPLE_CHOICE && (
                        question.answerOptions?.map((option: string, idx: number) => (
                          <Button
                            key={option}
                            variant="outline"
                            className={`w-full justify-start p-6 border-slate-200 hover:border-blue-500
                                hover:bg-blue-50 transition-all duration-200 group
                                ${selectedAnswer === option ? 'ring-2 ring-blue-500' : ''}
                                ${showFeedback && selectedAnswer === option
                                ? isCorrect
                                  ? 'bg-green-50 border-green-500'
                                  : 'bg-red-50 border-red-500'
                                : ''}`}
                            onClick={() => handleSubmitAnswer(option)}
                            disabled={showFeedback}
                          >
                            <span className="flex items-center gap-4">
                              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100
                                    group-hover:bg-blue-100 transition-colors text-slate-600 group-hover:text-blue-600">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="flex-1 text-slate-800">{option}</span>
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
                      )}
                      {question?.type === QuestionType.FILL_IN && (
                        <div className="space-y-4">
                          <input
                            type="text"
                            className="w-full bg-slate-50 border-slate-200 rounded-lg p-4
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                placeholder:text-slate-400 text-lg"
                            placeholder="Type your answer here..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                          />
                          <Button
                            className="w-full"
                            onClick={() => handleSubmitAnswer(userAnswer)}
                            disabled={!userAnswer.trim() || showFeedback}
                          >
                            Submit Answer
                          </Button>
                        </div>
                      )}
                      {question?.type === QuestionType.WRITING && (
                        <div className="space-y-4">
                          <textarea
                            className="w-full min-h-[200px] bg-slate-50 border-slate-200 rounded-lg p-4
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
                                placeholder:text-slate-400 text-lg"
                            placeholder="Write your answer here..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                          />
                          <Button
                            className="w-full"
                            onClick={() => handleSubmitAnswer(userAnswer)}
                            disabled={!userAnswer.trim() || showFeedback}
                          >
                            Submit Answer
                          </Button>
                        </div>
                      )}
                      {question?.type === QuestionType.VOICE && (
                        <div className="space-y-4">
                          <Button
                            className="w-full"
                            onClick={() => {
                              // Implement voice recording logic
                              alert('Voice recording feature coming soon!');
                            }}
                          >
                            <Mic className="w-5 h-5 mr-2" />
                            Start Recording
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </Container>
  );
}