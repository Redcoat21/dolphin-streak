import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { Book, PenSquare, Mic, CheckCircle, XCircle } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { QuestionType } from '@/server/types/questions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/core/stores/authStore';

interface QuestionTypeIconProps {
  type: QuestionType;
}

const QuestionTypeIcon = ({ type }: QuestionTypeIconProps) => {
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

export function QuestionPageID() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;
  const levelId = params?.levelId as string;
  const questionIdx = params?.questionIdx as string;

  const { getAccessToken } = useAuthStore(); // Get access token from auth context
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(Number(questionIdx) || 0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const accessToken = getAccessToken() || '';

  const { data: levelData } = trpc.levels.getLevelDetail.useQuery(
    {
      levelId: levelId,
      accessToken,
    },
    {
      enabled: !!levelId && !!accessToken,
    }
  );

  const { data: questionData } = trpc.question.getQuestionById.useQuery(
    {
      sessionId: levelId, // Assuming sessionId is the same as levelId
      questionIndex: currentQuestionIndex,
      accessToken,
    },
    {
      enabled: !!levelId && !!accessToken,
    }
  );

  const question = questionData?.question;

  const handleSubmitAnswer = useCallback(
    async (answer: string) => {
      setSelectedAnswer(answer);
      setShowFeedback(true);
      const isAnswerCorrect = answer === question?.correctAnswer[0];
      setIsCorrect(isAnswerCorrect);
      setTimeout(() => {
        setShowFeedback(false);
        if (questionData && currentQuestionIndex < (levelData?.questionCount || 0) - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedAnswer(null);
          router.replace(`/course/${courseId}/level/${levelId}/question/${currentQuestionIndex + 1}`);
        } else {
          router.push(`/course/${courseId}`);
        }
      }, 1500);
    },
    [currentQuestionIndex, question, courseId, router, questionData, levelData?.questionCount, levelId]
  );

  const handleBack = useCallback(() => {
    if (confirmed) {
      const confirmExit = window.confirm('Are you sure you want to exit? Your progress will be lost.');
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

  useEffect(() => {
    if (levelData?.questionCount) {
      setProgress((currentQuestionIndex / levelData.questionCount) * 100);
    }
  }, [currentQuestionIndex, levelData?.questionCount]);

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full">
          <QuestionTypeIcon type={question.type} />
          <span className="text-lg font-medium">Question {currentQuestionIndex + 1}</span>
        </div>
        <p className="text-slate-400">
          {question.type === 'MULTIPLE_CHOICE'
            ? 'Select the best answer from the options below'
            : 'Complete this question to progress'}
        </p>
      </div>
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="space-y-8">
            <h2 className="text-2xl font-medium leading-relaxed">{question.text}</h2>
            <div className="grid grid-cols-1 gap-4">
              {question.type === 'MULTIPLE_CHOICE' ? (
                question.answerOptions?.map((option: string, idx: number) => (
                  <Button
                    key={`${question.id}-option-${idx}`}
                    variant="outline"
                    className={`w-full justify-start p-6 border-slate-800 hover:border-blue-500
                      hover:bg-blue-500/10 transition-all duration-200 group
                      ${selectedAnswer === option ? 'ring-2 ring-blue-500' : ''}
                      ${showFeedback && selectedAnswer === option
                        ? isCorrect
                          ? 'bg-green-500/20 border-green-500'
                          : 'bg-red-500/20 border-red-500'
                        : ''}`}
                    onClick={() => handleSubmitAnswer(option)}
                    disabled={showFeedback}
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800
                          group-hover:bg-blue-500/20 transition-colors text-slate-400 group-hover:text-blue-400"
                      >
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
}