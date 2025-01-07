import { Mic, StopCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

interface VoiceRecorderProps {
    onRecordingComplete: (audioBlob: Blob) => void;
}

const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
};

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const { toast } = useToast();

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
                setAudioBlob(audioBlob);
                onRecordingComplete(audioBlob); // Callback with the audio blob
                audioChunks.current = [];
                const tracks = stream.getTracks()
                for (let i = 0; i < tracks.length; i++) {
                    tracks[i].stop();
                }
                toast({ title: "Recording saved!" });
            };

            mediaRecorder.current.start();
            setIsRecording(true);

        } catch (error) {
            toast({ title: "Error", description: "Error when recording" });
        }

    }, [onRecordingComplete, toast]);

    const stopRecording = useCallback(() => {
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    }, []);

    const playAudio = () => {
        if (audioBlob) {
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        } else {
            toast({ title: "Error", description: "No audio has been recorded" });
        }
    };

    return (
        <div className="space-y-4">
            <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`w-full p-8 rounded-lg flex items-center justify-center ${isRecording ? "bg-red-600" : "bg-blue-600"}`}
                onClick={isRecording ? stopRecording : startRecording}
            >
                {isRecording ? (
                    <StopCircle className="w-8 h-8 animate-pulse" />
                ) : (
                    <Mic className="w-8 h-8" />
                )}
            </motion.button>
            {audioBlob && (
                <Button onClick={playAudio} className="w-full">
                    <Play className="w-4 h-4 mr-2" /> Play Recording
                </Button>
            )}
        </div>
    );
}