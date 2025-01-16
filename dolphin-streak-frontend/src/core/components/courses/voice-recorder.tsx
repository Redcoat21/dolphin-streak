"use client"

import { Mic, StopCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useState } from "react";
import dynamic from 'next/dynamic';

const ReactMic = dynamic(() => import('react-mic').then(mod => mod.ReactMic), {
    ssr: false,
});


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
    const { toast } = useToast();

    const startRecording = () => {
        setIsRecording(true);
    };

    const stopRecording = () => {
        setIsRecording(false);
    };

    const onStop = (recordedBlob: { blob: Blob }) => {
        setAudioBlob(recordedBlob.blob);
        onRecordingComplete(recordedBlob.blob);
        toast({ title: "Recording saved!" });
    };


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
            <ReactMic
                record={isRecording}
                className="sound-wave"
                onStop={onStop}
                strokeColor="#000000"
                backgroundColor="#FF4081"
                mimeType="audio/webm"
            />
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