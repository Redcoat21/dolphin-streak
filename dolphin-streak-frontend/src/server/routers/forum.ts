import { fetchAPI } from '@/utils/generic';
import { authedProcedure, publicProcedure, router } from '../trpc';
import { TGetAllForumsResponse } from '../types/forums';

export const forumRouter = router({
    getAllForums: authedProcedure.query(async ({ ctx }) => {
        try {
            const response = await fetchAPI('/api/forums', 'GET');
            return response as TGetAllForumsResponse;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }),
});