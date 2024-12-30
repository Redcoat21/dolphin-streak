import { fetchAPI } from '@/utils/generic';
import { authedProcedure, publicProcedure, router } from '../trpc';
import type { TLanguagesResponse } from '../types/language';

export const levelsRouter = router({
    getLevels: authedProcedure.query(async ({ input }) => {
        const response = await fetchAPI('/api/languages', 'GET', {
            token: input.accessToken,
        });
        return response as TLanguagesResponse;
    }),
});