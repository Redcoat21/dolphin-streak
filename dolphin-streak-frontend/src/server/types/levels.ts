import { z } from "zod";
import type { TDefaultResponse } from "./generic";

export const ZGetLevelDetailRequest = z.object({ levelId: z.string(), accessToken: z.string(), });

type Level = {
    _id: string;
    name: string;
};

type Question = {
    _id: string;
    type: number;
};

export type TLevelDetail = {
    level: Level;
    questions: Question[];
};

export type TGetLevelDetailResponse = TDefaultResponse<TLevelDetail>;