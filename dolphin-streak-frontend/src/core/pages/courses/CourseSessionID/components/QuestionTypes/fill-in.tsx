import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IQuestionTypeComponent } from "./types";

interface FillInPageProps extends IQuestionTypeComponent {
    questionData: any; // Replace `any` with the correct type
}

export default function FillInPage({ questionData, onSubmit }: FillInPageProps) {
    const [fillInAnswers, setFillInAnswers] = useState<{ [key: string]: string }>({});
    const [isAnswered, setIsAnswered] = useState(false);

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
                                value={fillInAnswers[currentInputIndex || ""]}
                                onChange={(e) => {
                                    setFillInAnswers((prev) => ({
                                        ...prev,
                                        [currentInputIndex]: e.target.value,
                                    }));
                                }}
                                className="w-40 bg-slate-900 text-lg caret-blue-400 text-slate-200"
                                disabled={isAnswered}
                            />
                        );
                    }
                    return <span key={i} className="text-slate-200">{part}</span>;
                })}
            </div>
        );
    };

    const handleSubmitAnswer = () => {
        setIsAnswered(true);
        // Add logic to check the answers
    };

    return (
        <div className="space-y-4">
            {renderFillInBlank(questionData.question.question.text)}
            <Button onClick={handleSubmitAnswer} disabled={isAnswered}>
                Submit
            </Button>
        </div>
    );
}