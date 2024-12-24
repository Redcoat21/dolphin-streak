import { fetchAPI } from '@/utils/generic';
import { authedProcedure, publicProcedure, router } from '../trpc';
import { TLanguagesResponse } from '../types/language';

export const languageRouter = router({
    getLanguages: authedProcedure.query(async ({ input }) => {
        const response = await fetchAPI('/api/languages', 'GET', {
            token: input.accessToken,
        });
        return response as TLanguagesResponse;
    }),
});