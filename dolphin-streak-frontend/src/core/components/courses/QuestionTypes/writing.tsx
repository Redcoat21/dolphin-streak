import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Volume2, Heart } from "lucide-react";
import HanziWriter from 'hanzi-writer';
import { TCourseSessionData, } from "@/server/types/courses";

interface WritingPageProps {
    questionData: TCourseSessionData;
    setTextAnswer: (answer: string) => void;
    textAnswer: string;
    lives: number;
    timeLeft: number;
}

export default function WritingPage({ questionData, setTextAnswer, textAnswer, lives, timeLeft }: WritingPageProps) {
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (targetRef.current && questionData.question.question.text) {
            targetRef.current.innerHTML = ""
            const writer = HanziWriter.create(targetRef.current, questionData.question.question.text, {
                width: 200,
                height: 200,
                padding: 5
            });

            writer.quiz({
                onComplete: (summaryData) => {
                    console.log('Quiz completed:', summaryData);
                    setTextAnswer(questionData.question.question.text)
                    // setIsQuizzing(false);
                    // Update score or provide feedback here
                },
                onMistake: (strokeData) => {
                    console.log('Mistake:', strokeData);
                    // Handle mistakes, e.g., reduce lives
                },
                onCorrectStroke: (strokeData) => {
                    console.log('Correct stroke:', strokeData);
                    // Provide positive feedback
                },
            });
        }
    }, [questionData.question.question.text, textAnswer]);

    return (
        <><div
            ref={targetRef}
            className="w-full max-w-xs h-80 bg-white rounded-lg shadow-md p-4 flex items-center justify-center m-auto"
        />
        </>
    );
}