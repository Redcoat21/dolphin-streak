import { QuestionType } from "@/server/types/questions";
import { Book, Edit, Mic, PenSquare, Type } from "lucide-react";

interface QuestionTypeIconProps {
    type: QuestionType;
}

export const QuestionTypeIcon = ({ type }: QuestionTypeIconProps) => {
    switch (type) {
        case QuestionType.MULTIPLE_CHOICE:
            return <Book className="w-5 h-5" />;
        case QuestionType.ESSAY:
            return <PenSquare className="w-5 h-5" />;
        case QuestionType.FILL_IN:
            return <Type className="w-5 h-5" />;
        case QuestionType.VOICE:
            return <Mic className="w-5 h-5" />;
        case QuestionType.WRITING:
            return <Edit className="w-5 h-5" />;
        default:
            return <PenSquare className="w-5 h-5" />;
    }
};