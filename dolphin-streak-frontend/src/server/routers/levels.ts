import { fetchAPI } from '@/utils/generic';
import { authedProcedure, publicProcedure, router } from '../trpc';
import { ZGetLevelDetailRequest } from '../types/levels';
import type { TGetLevelDetailResponse, } from '../types/levels';

export const levelsRouter = router({
    getLevelDetail: authedProcedure.input(ZGetLevelDetailRequest).query(async ({ input }) => {
        const response = await fetchAPI(`/api/levels/${input.levelId}`, 'GET', {
            token: input.accessToken,
        });
        return response as TGetLevelDetailResponse;
    }),
});