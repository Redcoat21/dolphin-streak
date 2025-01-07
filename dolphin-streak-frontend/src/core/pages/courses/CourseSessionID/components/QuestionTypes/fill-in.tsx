import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IQuestionTypeComponent } from "./types";
import { TQuestion } from "@/server/types/questions";
import { TCourseSessionData } from "@/server/types/courses";

interface FillInPageProps extends IQuestionTypeComponent {
    questionData: TCourseSessionData;
    setFillInAnswers: (answers: { [key: string]: string }) => void;
    fillInAnswers: { [key: string]: string };
    lives: number;
    timeLeft: number;
}

export default function FillInPage({ questionData, setFillInAnswers, fillInAnswers, lives, timeLeft }: FillInPageProps) {


    const renderFillInBlank = (text: string) => {
        const parts = text.split(/(__)/);
        if (parts.length === 1) {
            return <p className="text-slate-200">{text}</p>;
        }

        let inputIndex = 0;
        return (
            <div className="flex flex-wrap items-center gap-2 text-lg">
                {parts.map((part, i) => {
                    if (part === "__") {
                        const currentInputIndex = inputIndex++;
                        return (
                            <Input
                                key={`input-${currentInputIndex}`}
                                value={fillInAnswers[currentInputIndex] || ""}
                                onChange={(e) => {
                                    setFillInAnswers((prev) => ({
                                        ...prev,
                                        [currentInputIndex]: e.target.value,
                                    }));
                                }}
                                className="w-40 bg-slate-900 text-lg caret-blue-400 text-slate-200"
                            />
                        );
                    }
                    return <span key={i} className="text-slate-200">{part}</span>;
                })}
            </div>
        );
    };


    return (
        <div className="space-y-4">
            {renderFillInBlank(questionData.question.question.text)}
        </div>
    );
}