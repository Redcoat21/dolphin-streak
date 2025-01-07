import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IQuestionTypeComponent } from "./types";
import { VoiceRecorder } from "../voice-recorder";

interface VoicePageProps extends IQuestionTypeComponent {
    questionData: any; // Replace `any` with the correct type
}

export default function VoicePage({ questionData, onSubmit }: VoicePageProps) {
    const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleSubmitAnswer = () => {
        setIsAnswered(true);
        // Add logic to handle the recorded audio
    };

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
            <Button onClick={handleSubmitAnswer} disabled={!recordedAudio || isAnswered}>
                Submit
            </Button>
        </div>
    );
}