import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { Book, PenSquare, Mic, CheckCircle, XCircle, Type, Edit } from 'lucide-react';
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
  const courseId = params?.id as string;
  const levelId = params?.levelId as string;
  const questionIdx = params?.questionIdx as string;
  const sessionId = router.query.sessionId as string; // Get sessionId from query params

  const { getAccessToken } = useAuthStore(); // Get access token from auth context
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(Number(questionIdx) || 0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [userAnswer, setUserAnswer] = useState(''); // For FILL_IN, VOICE, and WRITING types

  const accessToken = getAccessToken() || '';

  // Fetch level details
  const { data: levelData } = trpc.levels.getLevelDetail.useQuery(
    {
      levelId: levelId,
      accessToken,
    },
    {
      enabled: !!levelId && !!accessToken,
    }
  );

  // Fetch question by index and sessionId
  const { data: questionData } = trpc.question.getQuestionById.useQuery(
    {
      levelId: levelId, // Pass levelId
      sessionId: sessionId, // Use sessionId from query params
      questionIndex: currentQuestionIndex,
      accessToken,
    },
    {
      enabled: !!sessionId && !!accessToken,
    }
  );

  const question = questionData?.question;

  const handleSubmitAnswer = useCallback(
    async (answer: string) => {
      if (!question) return;

      setSelectedAnswer(answer);
      setShowFeedback(true);
      const isAnswerCorrect = answer === question.correctAnswer[0];
      setIsCorrect(isAnswerCorrect);

      setTimeout(() => {
        setShowFeedback(false);
        if (questionData && currentQuestionIndex < (levelData?.questionCount || 0) - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedAnswer(null);
          setUserAnswer(''); // Reset user answer for the next question
          router.replace(`/course/${courseId}/level/${levelId}/question/${currentQuestionIndex + 1}?sessionId=${sessionId}`);
        } else {
          router.push(`/course/${courseId}`);
        }
      }, 1500);
    },
    [currentQuestionIndex, question, courseId, router, questionData, levelData?.questionCount, levelId, sessionId]
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
          {question.type === QuestionType.MULTIPLE_CHOICE
            ? 'Select the best answer from the options below'
            : question.type === QuestionType.FILL_IN
              ? 'Fill in the blank'
              : question.type === QuestionType.VOICE
                ? 'Record your answer'
                : question.type === QuestionType.WRITING
                  ? 'Write your answer below'
                  : 'Complete this question to progress'}
        </p>
      </div>
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="space-y-8">
            <h2 className="text-2xl font-medium leading-relaxed">{question.text}</h2>
            <div className="grid grid-cols-1 gap-4">
              {question.type === QuestionType.MULTIPLE_CHOICE ? (
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
              ) : question.type === QuestionType.FILL_IN ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    className="w-full bg-slate-800/50 border-slate-700 rounded-lg p-4
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      placeholder:text-slate-500 text-lg"
                    placeholder="Type your answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                  <Button
                    className="w-full"
                    onClick={() => handleSubmitAnswer(userAnswer)}
                    disabled={showFeedback}
                  >
                    Submit
                  </Button>
                </div>
              ) : question.type === QuestionType.VOICE ? (
                <div className="space-y-4">
                  <Button
                    className="w-full"
                    onClick={() => {
                      // Implement voice recording logic here
                      alert('Voice recording not implemented yet');
                    }}
                  >
                    Start Recording
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => handleSubmitAnswer('Voice response')}
                    disabled={showFeedback}
                  >
                    Submit
                  </Button>
                </div>
              ) : question.type === QuestionType.WRITING ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full min-h-[200px] bg-slate-800/50 border-slate-700 rounded-lg p-6
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
                      placeholder:text-slate-500 text-lg"
                    placeholder="Write your answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                  <Button
                    className="w-full"
                    onClick={() => handleSubmitAnswer(userAnswer)}
                    disabled={showFeedback}
                  >
                    Submit
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}