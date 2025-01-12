import { fetchAPI } from '@/utils/generic';
import { authedProcedure, router } from '../trpc';
import { ZGetAllFeedback, TGetAllFeedback, FeedbackType, TGetAllFeedbackResponse } from '../types/feedback';

export const feedbackRouter = router({
    getAllFeedbackForUser: authedProcedure.input(ZGetAllFeedback).query(async ({ input }) => {
        console.log({ input })
        const type = input.type === "any" ? -1 : parseInt(input.type || "0") as FeedbackType;
        console.log({
            sort: input.sort as string,
            search: input.search as string,
            type: type
        })
        const response = await fetchAPI(
            `/api/feedbacks/user`,
            'GET',
            {
                token: input.accessToken,
                query: {
                    sort: input.sort as string,
                    search: input.search as string,
                    type: type
                }
            }
        );
        return response as TGetAllFeedbackResponse;
    }),
});