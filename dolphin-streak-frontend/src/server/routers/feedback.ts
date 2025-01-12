import { fetchAPI } from '@/utils/generic';
import { authedProcedure, router } from '../trpc';
import { ZGetAllFeedback, TGetAllFeedback } from '../types/feedback';

export const feedbackRouter = router({
    getAllFeedbackForUser: authedProcedure.input(ZGetAllFeedback).query(async ({ input }) => {
        const response = await fetchAPI(
            `/api/feedbacks/user`,
            'GET',
            {
                token: input.accessToken,
                query: {
                    sort: input.sort,
                    search: input.search,
                    type: input.type
                }
            }
        );
        return response;
    }),
});