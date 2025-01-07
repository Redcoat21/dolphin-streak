import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { QuestionType } from "@/server/types/questions";
import { IQuestionTypeComponent } from "./types";

interface MultipleChoicePageProps extends IQuestionTypeComponent {
    questionData: any; // Replace `any` with the correct type
}

export default function MultipleChoicePage({ questionData, onSubmit }: MultipleChoicePageProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleSubmitAnswer = () => {
        setIsAnswered(true);
        // Add logic to check if the answer is correct
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {questionData.question.answerOptions?.map((answer: string, index: number) => (
                <motion.div
                    key={answer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Button
                        variant={selectedAnswer === answer ? "default" : "outline"}
                        className={`w-full h-16 text-lg font-medium transition-all ${isAnswered
                            ? selectedAnswer === answer
                                ? isCorrect === true
                                    ? "bg-green-600 hover:bg-green-600 text-slate-200"
                                    : "bg-red-600 hover:bg-red-600 text-slate-200"
                                : "bg-slate-800 hover:bg-slate-800 text-slate-200"
                            : "hover:bg-slate-800 hover:text-slate-100"
                            }`}
                        onClick={() => !isAnswered && setSelectedAnswer(answer)}
                        disabled={isAnswered}
                    >
                        {answer}
                    </Button>
                </motion.div>
            ))}
            <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer || isAnswered}>
                Submit
            </Button>
        </div>
    );
}