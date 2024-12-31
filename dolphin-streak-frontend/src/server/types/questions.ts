import { z } from 'zod';

export enum QuestionType {
    MULTIPLE_CHOICE = 0,
    ESSAY = 1,
    FILL_IN = 2,
    VOICE = 3,
    WRITING = 4,
}

export const ZGetQuestionByIdRequest = z.object({
    sessionId: z.string(),
    questionIndex: z.number(),
});

export const ZQuestionResponse = z.object({
    id: z.string(),
    text: z.string(),
    type: z.enum(['MULTIPLE_CHOICE', 'ESSAY', 'VOICE']),
    answerOptions: z.array(z.string()).optional(),
    correctAnswer: z.array(z.string()),
});

export type TQuestionResponse = z.infer<typeof ZQuestionResponse>;