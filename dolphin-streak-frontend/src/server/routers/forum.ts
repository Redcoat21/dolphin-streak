import { fetchAPI } from '@/utils/generic';
import { authedProcedure, publicProcedure, router } from '../trpc';
import { TGetAllForumsResponse, ZGetAllForumsRequest } from '../types/forums';

export const forumRouter = router({
    getAllForums: authedProcedure.input(ZGetAllForumsRequest).query(async ({ ctx, input }) => {
        try {
            const response = await fetchAPI('/api/forums', 'GET', {
                token: ctx.token.accessToken, query: {
                    search: input.search
                }
            });
            return response as TGetAllForumsResponse;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }),

});