import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from 'lucide-react';

interface QuestionEssayProps {
    topic: string;
    onComplete: (essay: string) => void;
}

export function QuestionEssay({ topic, onComplete }: QuestionEssayProps) {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [essayText, setEssayText] = useState("");

    const handleConfirm = () => {
        setIsConfirmed(true);
    };

    const handleEssayChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEssayText(event.target.value);
    };

    const handleSubmit = () => {
        onComplete(essayText);
    };


    if (!isConfirmed) {
        return (
            <div className="flex flex-col items-center justify-between w-full h-full gap-8">
                <div className='text-center px-4'>
                    <h2 className="text-4xl font-bold mb-4">Are you sure you want to take the Comprehension Assignment?</h2>
                </div>
                <Button className="w-full" onClick={handleConfirm}>Continue</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-between h-full w-full gap-4">
            <div className="flex items-center p-4">

                <span className="font-medium">Comprehension</span>
            </div>
            <div className="flex flex-col px-4 gap-2">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-medium text-xl">Essay Topic: {topic}</h2>
                    <span className="text-sm text-neutral-500">{essayText.length}/1000</span>
                </div>
                <textarea
                    className="border border-neutral-700 rounded-md p-2 focus:outline-none resize-none h-[60vh]"
                    placeholder="Start writing your essay here..."
                    value={essayText}
                    onChange={handleEssayChange}
                    maxLength={1000}
                />
            </div>
            <Button className="w-full" onClick={handleSubmit}>Submit</Button>
        </div>
    );
};