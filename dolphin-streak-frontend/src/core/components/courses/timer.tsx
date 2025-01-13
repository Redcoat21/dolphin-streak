import { Timer as TimerIcon } from "lucide-react";

interface TimerProps {
    timeLeft: number;
}

export function Timer({ timeLeft }: TimerProps) {
    return (
        <div className="flex items-center gap-2">
            <TimerIcon className="w-5 h-5 text-blue-400" />
            <span className="text-lg font-medium text-slate-200">{timeLeft}s</span>
        </div>
    );
}