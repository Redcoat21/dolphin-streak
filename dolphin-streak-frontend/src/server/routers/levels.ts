import { fetchAPI } from '@/utils/generic';
import { authedProcedure, router } from '../trpc';
import { ZGetLevelDetailRequest } from '../types/levels';
import type { TGetLevelDetailResponse, TLevelQuestion } from '../types/levels';

type TLevelSession = {
    levelId: string;
    token: string;
    questions: TLevelQuestion[];
    sessionId: string;
};

export const levelsSession: TLevelSession[] = [];

export const levelsRouter = router({
    getLevelDetail: authedProcedure.input(ZGetLevelDetailRequest).query(async ({ input }) => {
        const response = await fetchAPI(`/api/levels/${input.levelId}`, 'GET', {
            token: input.accessToken,
        }) as TGetLevelDetailResponse;
        return { questionsLength: response.data?.questions.length };
    }),
    startLevel: authedProcedure.input(ZGetLevelDetailRequest).mutation(async ({ input }) => {
        const response = await fetchAPI(`/api/levels/${input.levelId}`, 'GET', {
            token: input.accessToken,
        }) as TGetLevelDetailResponse;
        const sessionId = `session-${Date.now()}`;
        const levelSession: TLevelSession = {
            levelId: input.levelId,
            token: input.accessToken,
            questions: response.data?.questions || [],
            sessionId: sessionId,
        };
        levelsSession.push(levelSession);
        return { sessionId, questionsLength: response.data?.questions.length };
    }),
});