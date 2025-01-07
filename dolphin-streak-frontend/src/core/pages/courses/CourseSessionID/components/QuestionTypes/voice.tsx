import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IQuestionTypeComponent } from "./types";
import { VoiceRecorder } from "../voice-recorder";
import { TQuestion } from "@/server/types/questions";

interface VoicePageProps extends IQuestionTypeComponent {
    questionData: { question: TQuestion, questionIndex: number, totalQuestions: number };
    setRecordedAudio: (audio: Blob | null) => void;
    recordedAudio: Blob | null;
    lives: number;
    timeLeft: number;
}

export default function VoicePage({ questionData, setRecordedAudio, recordedAudio, lives, timeLeft }: VoicePageProps) {


    return (
        <div className="space-y-4">
            <p className="text-slate-200 mb-4">{questionData.question.question.text}</p>
            <VoiceRecorder onRecordingComplete={(blob) => setRecordedAudio(blob)} />
            {recordedAudio && (
                <div className="mt-4">
                    <audio controls>
                        <source src={URL.createObjectURL(recordedAudio)} type="audio/webm" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
        </div>
    );
}