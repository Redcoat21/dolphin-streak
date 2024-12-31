import { z } from "zod";
import type { TDefaultResponse } from "./generic";

export const ZGetLevelDetailRequest = z.object({
    levelId: z.string(),
    accessToken: z.string(),
});

export type TLevel = {
    _id: string;
    name: string;
    language: string;
    __v: number;
};

export type TLevelQuestion = {
    _id: string;
    type: number;
    answerOptions: string[];
    correctAnswer: string[];
    useAi: boolean;
    courses: Array<{
        _id: string;
        name: string;
        levels: string[];
        language: string;
        type: number;
        thumbnail: string;
        __v: number;
    }>;
    __v: number;
    question?: {
        type: string;
        text: string;
        voice: string;
    };
};

export type TLevelDetail = {
    level: TLevel;
    questions: TLevelQuestion[];
};

export type TGetLevelDetailResponse = TDefaultResponse<TLevelDetail>;