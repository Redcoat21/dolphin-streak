import { fetchAPI } from '@/utils/generic';
import { authedProcedure, publicProcedure, router } from '../trpc';
import { 
    TGetAllForumsResponse, 
    TGetForumDetailResponse,
    TCreateForumReplyResponse,
    TCreateThreadResponse,
    ZGetAllForumsRequest, 
    ZGetForumsDetailRequest,
    ZCreateForumReplyRequest,
    ZCreateThreadRequest
} from '../types/forums';

export const forumRouter = router({
    getAllForums: authedProcedure.input(ZGetAllForumsRequest).query(async ({ input }) => {
        try {
            const response = await fetchAPI('/api/forums', 'GET', {
                token: input.accessToken,
                query: {
                    search: input.search || '',
                }
            });
            return response as TGetAllForumsResponse;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }),
    getForumDetail: authedProcedure.input(ZGetForumsDetailRequest).query(async ({ input }) => {
        try {
            const response = await fetchAPI(`/api/forums/${input.forumId}`, 'GET', {
                token: input.accessToken,
            });
            return response as TGetForumDetailResponse;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }),
    createReply: authedProcedure.input(ZCreateForumReplyRequest).mutation(async ({ input }) => {
        try {
            const response = await fetchAPI(`/api/forums/${input.forumId}/replies`, 'POST', {
                token: input.accessToken,
                body: {
                    title: input.title,
                    content: input.content,
                }
            });
            return response as TCreateForumReplyResponse;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }),
    createThread: authedProcedure.input(ZCreateThreadRequest).mutation(async ({ input }) => {
        try {
            const response = await fetchAPI('/api/forums', 'POST', {
                token: input.accessToken,
                body: {
                    title: input.title,
                    content: input.content,
                }
            });
            return response as TCreateThreadResponse;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }),
});