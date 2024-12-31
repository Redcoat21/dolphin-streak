import { fetchAPI } from '@/utils/generic';
import { authedProcedure, router } from '../trpc';
import { ZGetLevelDetailRequest } from '../types/levels';
import type { TGetLevelDetailResponse, TLevelQuestion, TPostStartSessionResponse } from '../types/levels';

type TLevelSession = {
  levelId: string;
  token: string;
  questions: TLevelQuestion[];
  sessionId: string;
};

export const levelsRouter = router({
  getLevelDetail: authedProcedure.input(ZGetLevelDetailRequest).query(async ({ input }) => {
    const response = await fetchAPI(`/api/levels/${input.levelId}`, 'GET', {
      token: input.accessToken,
    }) as TGetLevelDetailResponse;
    return { questionsLength: response.data?.questions.length };
  }),
  startLevel: authedProcedure.input(ZGetLevelDetailRequest).mutation(async ({ input }) => {
    // Fetch level details
    const levelDetailResponse = await fetchAPI(`/api/levels/${input.levelId}`, 'GET', {
      token: input.accessToken,
    }) as TGetLevelDetailResponse;

    // Start session
    const startSessionResponse = await fetchAPI(`/api/levels/${input.levelId}/start-session`, 'POST', {
      token: input.accessToken,
    }) as TPostStartSessionResponse;

    const expiresAt = startSessionResponse.data?.expiresAt;
    const sessionId = startSessionResponse.data?.sessionId;

    return { sessionId, questionsLength: levelDetailResponse.data?.questions.length, expiresAt };
  }),
  
});