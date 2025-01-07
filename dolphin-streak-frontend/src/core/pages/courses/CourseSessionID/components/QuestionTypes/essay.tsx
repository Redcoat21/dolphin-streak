import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IQuestionTypeComponent } from "./types";
import { TQuestion } from "@/server/types/questions";

interface EssayPageProps extends IQuestionTypeComponent {
    questionData: { question: TQuestion, questionIndex: number, totalQuestions: number };
    setTextAnswer: (answer: string) => void;
    textAnswer: string;
    lives: number;
    timeLeft: number;
    suggestion: string
}

export default function EssayPage({ questionData, setTextAnswer, textAnswer, lives, timeLeft, suggestion }: EssayPageProps) {
    return (
        <div className="space-y-4">
            <Textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Write your essay here..."
                className="min-h-[200px] bg-slate-900 border-slate-700 text-lg text-slate-200"
            />
            {suggestion && (
                <Alert className="bg-blue-900/50 border-blue-500">
                    <AlignJustify className="w-4 h-4 text-blue-400" />
                    <AlertDescription className="text-slate-200">{suggestion}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}