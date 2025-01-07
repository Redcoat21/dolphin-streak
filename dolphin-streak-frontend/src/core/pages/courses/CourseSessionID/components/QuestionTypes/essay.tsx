import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IQuestionTypeComponent } from "./types";

interface EssayPageProps extends IQuestionTypeComponent {
    questionData: any; // Replace `any` with the correct type
}

export default function EssayPage({ questionData, onSubmit }: EssayPageProps) {
    const [textAnswer, setTextAnswer] = useState("");
    const [isAnswered, setIsAnswered] = useState(false);
    const [suggestion, setSuggestion] = useState<string | null>(null);

    const handleSubmitAnswer = () => {
        setIsAnswered(true);
        // Add logic to check the essay and set suggestion
    };

    return (
        <div className="space-y-4">
            <Textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Write your essay here..."
                className="min-h-[200px] bg-slate-900 border-slate-700 text-lg text-slate-200"
                disabled={isAnswered}
            />
            {suggestion && isAnswered && (
                <Alert className="bg-blue-900/50 border-blue-500">
                    <AlignJustify className="w-4 h-4 text-blue-400" />
                    <AlertDescription className="text-slate-200">{suggestion}</AlertDescription>
                </Alert>
            )}
            <Button onClick={handleSubmitAnswer} disabled={!textAnswer || isAnswered}>
                Submit
            </Button>
        </div>
    );
}