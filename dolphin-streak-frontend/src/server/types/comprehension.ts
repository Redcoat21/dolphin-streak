import { z } from "zod";
import { QuestionType, TQuestion } from "./questions";
import { TDefaultResponse, TAnswerResult } from "./generic";

export const ZPostStartComprehension = z.object({
    accessToken: z.string(),
    languageId: z.string(),
});

export type TStartComprehensionResponse = TDefaultResponse<{
    comprehensionId: string;
    expiresAt: string;
    totalQuestions: number;
}>;

export const ZGetComprehensionSessionRequest = z.object({
    accessToken: z.string(),
    comprehensionSessionId: z.string(),
});

export type TGetComprehensionSessionResponse = TDefaultResponse<{
    question: TQuestion;
    totalQuestion: number;
    questionIndex: number;
    score: number;
}>;

export const ZPostSubmitComprehensionAnswerRequest = z.object({
    accessToken: z.string(),
    comprehensionSessionId: z.string(),
    answer: z.string(),
});

export type TSubmitComprehensionAnswerResponse = TDefaultResponse<TAnswerResult>;

export const ZGetAllComprehensionsRequest = z.object({
    accessToken: z.string(),
    language: z.string(),
});


export const ZComprehension = z.object({
    _id: z.string(),
    name: z.string(),
    language: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const ZGetAllComprehensionsResponse = z.object({
    data: z.array(ZComprehension),
    message: z.string(),
    status: z.number(),
});

export type TGetAllComprehensionsResponse = z.infer<typeof ZGetAllComprehensionsResponse>;
