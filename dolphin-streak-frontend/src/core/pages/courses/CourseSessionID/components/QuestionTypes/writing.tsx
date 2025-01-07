import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IQuestionTypeComponent } from "./types";
import { TQuestion } from "@/server/types/questions";
import HanziWriter from 'hanzi-writer';
import { TCourseSessionData } from "@/server/types/courses";

interface WritingPageProps extends IQuestionTypeComponent {
    questionData: TCourseSessionData;
    setTextAnswer: (answer: string) => void;
    textAnswer: string;
    lives: number;
    timeLeft: number;
}

export default function WritingPage({ questionData, setTextAnswer, textAnswer, lives, timeLeft }: WritingPageProps) {
    const writerRef = useRef<HTMLDivElement>(null);
    const [writer, setWriter] = useState<any>(null);


    useEffect(() => {
        if (writerRef.current && questionData.question.question.text) {
            const newWriter = HanziWriter.create(writerRef.current, questionData.question.question.text, {
                width: 400,
                height: 400,
                padding: 5,
                showOutline: true,
                strokeColor: '#FFFFFF',
                radicalColor: '#FFFFFF',
                showCharacter: false,
                
            });
            setWriter(newWriter);
        }
    }, [questionData.question.question.text]);

    const handleStartDrawing = () => {
        if (writer) {
            writer.startQuiz({
                onComplete: (summaryData: any) => {
                    setTextAnswer(summaryData.characterTraced);
                }
            });
        }
    };


    const clearCanvas = () => {
        if (writer) {
            writer.cancelQuiz();
            setTextAnswer('');
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <div
                    ref={writerRef}
                    className="border-2 border-slate-700 rounded-lg bg-slate-900"
                />
                <Button
                    onClick={clearCanvas}
                    className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700"
                >
                    Clear
                </Button>
                <Button
                    onClick={handleStartDrawing}
                    className="absolute top-2 left-2 bg-slate-800 hover:bg-slate-700"
                >
                    Start
                </Button>
            </div>
            <div className="text-center text-slate-400 text-sm">
                Write the character in the box above
            </div>
        </div>
    );
}