import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface QuestionMultipleChoiceProps {
    questions: string[];
    answers: string[];
    correctAnswers: string[]; // Expecting string representation of index
    onComplete: (answer: string) => void;
}

export function QuestionMultipleChoice({ questions, answers, correctAnswers, onComplete }: QuestionMultipleChoiceProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);


    const handleAnswerSelection = (answerIdx:number) => {
        setSelectedAnswerIdx(answerIdx);
        setSelectedAnswer(answers[answerIdx]);
        setShowFeedback(true);
    };

    const handleContinue = () => {
         if (selectedAnswer) {
            onComplete(selectedAnswer);
        }
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setSelectedAnswerIdx(null); // Reset selected index as well
        setShowFeedback(false);
    };
    // Calculate isCorrect inside the render method, using the stored index
    const isCorrect = selectedAnswerIdx !== null ? answers[selectedAnswerIdx] === answers[parseInt(correctAnswers[currentQuestionIndex])] : false;
    
    return (
        <div className="flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{questions[currentQuestionIndex]}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {answers.map((answer,index) => (
                        <Button
                            key={answer}
                            onClick={() => handleAnswerSelection(index)}
                            variant="outline"
                            className={cn(
                                "w-full",
                                selectedAnswer === answer &&
                                (isCorrect ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-white hover:bg-red-600"),
                                showFeedback && "cursor-not-allowed"
                            )}
                            disabled={showFeedback}
                        >
                            {answer}
                        </Button>
                    ))}
                    {showFeedback && (
                        <div className="mt-4">
                            <p className={cn(isCorrect ? 'text-green-500' : 'text-red-500')}>
                                {isCorrect ? 'Correct!' : 'Incorrect!'}
                            </p>
                            <Button onClick={handleContinue} className="w-full">
                                Continue
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};