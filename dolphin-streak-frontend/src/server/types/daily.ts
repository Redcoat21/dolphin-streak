import { z } from "zod";
import { QuestionType, TQuestion } from "./questions";
import { TDefaultResponse, TAnswerResult } from "./generic";

export const ZPostStartDaily = z.object({
    accessToken: z.string(),
    languageId: z.string(),
});

export type TStartDailyResponse = TDefaultResponse<{
    dailyId: string;
    expiresAt: string;
    totalQuestions: number;
    dailyChallenge: any;
}>;

export const ZGetDailySessionRequest = z.object({
    accessToken: z.string(),
    dailySessionId: z.string(),
});

export type TGetDailySessionResponse = TDefaultResponse<{
    question: TQuestion;
    totalQuestion: number;
    questionIndex: number;
    score: number;
}>;

export const ZPostSubmitDailyAnswerRequest = z.object({
    accessToken: z.string(),
    dailySessionId: z.string(),
    answer: z.string(),
    questionType: z.nativeEnum(QuestionType),
});

export type TSubmitDailyAnswerResponse = TDefaultResponse<TAnswerResult>;

export const ZGetDailyFromLanguageRequest = z.object({
    accessToken: z.string(),
    language: z.string(),
});

export type TGetDailyFromLanguageResponse = TDefaultResponse<{
    dailyChallenge: {
        courseId: string;
        expiresAt: string;
    };
    course: {
        _id: string;
        language: {
            _id: string;
            name: string;
            __v: number;
            image: string;
        };
        name: string;
        __v: number;
        levels: string[];
        thumbnail: string;
        type: number;
    };
}>;