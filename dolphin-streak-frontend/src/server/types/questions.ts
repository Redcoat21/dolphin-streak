import { z } from 'zod';
import { TDefaultResponse } from './generic';

export enum QuestionType {
    MULTIPLE_CHOICE = 0,
    ESSAY = 1,
    FILL_IN = 2,
    VOICE = 3,
    WRITING = 4,
}

export const ZGetQuestionByIdRequest = z.object({
    levelId: z.string(),
    sessionId: z.string(),
    questionIndex: z.number(),
});

export type TQuestion = {
    question: { type: "text", text: string };
    _id: string;
    level: string;
    __v: number;
    answerOptions: string[];
    correctAnswer: string[];
    courses: {
        _id: string;
        language: string;
        name: string;
        __v: number;
        levels: string[];
        thumbnail: string;
        type: number;
    }[];
    type: QuestionType;
    useAi: boolean;
};

export type TQuestionResponse = TDefaultResponse<{
    question: TQuestion;
}>;