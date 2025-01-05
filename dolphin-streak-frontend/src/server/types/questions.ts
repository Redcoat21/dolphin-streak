import { z } from 'zod';
import type { TDefaultResponse } from './generic';

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
    accessToken: z.string(),
});
export type TGetQuestionByIdRequest = z.infer<typeof ZGetQuestionByIdRequest>;

export const ZSubmitAnswerRequest = z.object({
    sessionId: z.string(),
    questionIndex: z.number(),
    levelId: z.string(),
    answer: z.string(),
    accessToken: z.string(),
});
export type TSubmitAnswerRequest = z.infer<typeof ZSubmitAnswerRequest>;


export const ZNextQuestionInput = z.object({
    sessionId: z.string(),
    currentQuestionIndex: z.number(),
    accessToken: z.string(),
});
export type TNextQuestionInput = z.infer<typeof ZNextQuestionInput>;


export const ZStartSessionRequest = z.object({
    levelId: z.string(),
    accessToken: z.string(),
});
export type TStartSessionRequest = z.infer<typeof ZStartSessionRequest>;

export type TQuestion = {
    question: { type: string, text: string };
    _id: string;
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

export type TNextQuestionResponse = TDefaultResponse<{
    nextQuestionIndex: number;
    nextQuestion: TQuestion;
}>;

// export type TSubmitAnswerResponse = TDefaultResponse<{
//     isCorrect: boolean;
// }>;

export type TStartSessionResponse = TDefaultResponse<{
    totalQuestions: number;
}>;