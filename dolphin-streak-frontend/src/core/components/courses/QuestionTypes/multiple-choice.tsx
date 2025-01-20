import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { IQuestionTypeComponent } from "./types";
import { TQuestion } from "@/server/types/questions";
import { TCourseSessionData } from "@/server/types/courses";

interface MultipleChoicePageProps extends IQuestionTypeComponent {
    questionData: TCourseSessionData;
    setSelectedAnswer: (answer: string | null) => void;
    selectedAnswer: string | null;
    lives: number;
    timeLeft: number;
}

export default function MultipleChoicePage({ questionData, setSelectedAnswer, selectedAnswer, lives, timeLeft }: MultipleChoicePageProps) {


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
                        className={`w-full h-16 text-lg font-medium transition-all ${selectedAnswer === answer
                            ? "bg-blue-600 hover:bg-blue-700 text-slate-200"
                            : "hover:bg-slate-800 hover:text-slate-100"
                            }`}
                        onClick={() => setSelectedAnswer(answer)}
                    >
                        {answer}
                    </Button>
                </motion.div>
            ))}
        </div>
    );
}