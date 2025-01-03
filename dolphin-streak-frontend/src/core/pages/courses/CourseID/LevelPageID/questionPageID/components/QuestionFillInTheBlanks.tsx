import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuestionFillInTheBlanksProps {
    sentence: string;
    correctAnswer: string;
    onComplete: (answer: string) => void;
}

export function QuestionFillInTheBlanks({ sentence, correctAnswer, onComplete }: QuestionFillInTheBlanksProps) {
    const [userAnswer, setUserAnswer] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);

    const handleSubmit = () => {
        setShowFeedback(true);
        onComplete(userAnswer);
    };


    const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();


    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Fill in the blank:</h2>
                <p className="mb-4">{sentence}</p>
                <Input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Your answer"
                    className="mb-4"
                />
                <Button onClick={handleSubmit} className="w-full" disabled={showFeedback}>
                    Submit
                </Button>
                {showFeedback && (
                    <div className="mt-4">
                        <p className={cn(isCorrect ? 'text-green-500' : 'text-red-500')}>
                            {isCorrect ? 'Correct!' : 'Incorrect!'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}