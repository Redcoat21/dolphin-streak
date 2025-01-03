import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mic2, StopCircle } from 'lucide-react';

interface QuestionVoiceProps {
    sentence: string;
    pinyin: string;
    onContinue: () => void;
}

export function QuestionVoice({ sentence, pinyin, onContinue }: QuestionVoiceProps) {
    const [isRecording, setIsRecording] = useState(false);
    const micButtonRef = useRef<HTMLDivElement>(null); // Create a ref for the div

    const handleStartRecording = () => {
        setIsRecording(true);
        // Logic to start recording goes here
        console.log("Starting recording");
    };

    const handleStopRecording = () => {
        setIsRecording(false);
    };

    const getMicColor = () => {
        if (isRecording) {
            return "bg-red-500";
        }
        return "bg-green-500";
    }

    const getMicIcon = () => {
        if (isRecording) {
            return <StopCircle size={48} color="white" />
        }
        return <Mic2 size={48} color="white" />
    }

    const getMicAction = () => {
        if (isRecording) {
            return handleStopRecording
        }
        return handleStartRecording
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // Prevent default action (like form submit on enter)
            if (micButtonRef.current) {
                micButtonRef.current.click(); // Simulate a click on the div
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-between w-full h-full gap-8">
            <div className="text-center px-4">
                <p className="text-2xl mb-2">{sentence}</p>
                <p className="text-sm text-neutral-400">{pinyin}</p>
            </div>

            <div
                ref={micButtonRef}
                className="p-4 rounded-md cursor-pointer"
                onClick={getMicAction()}
                onKeyDown={handleKeyDown}
                tabIndex={0}
            >
                <div className={cn(
                    "flex items-center justify-center w-24 h-24 rounded-md",
                    isRecording ? "bg-red-500" : "bg-neutral-700"
                )}
                >
                    {getMicIcon()}
                </div>
            </div>
            <Button className="w-full" onClick={onContinue}>Continue</Button>
        </div>
    );
};