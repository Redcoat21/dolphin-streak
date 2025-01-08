import { fetchAPI } from '../../utils/generic';
import { authedProcedure, router } from '../trpc';
import { z } from 'zod';
import type {
    TStartComprehensionResponse,
    TGetComprehensionSessionResponse,
    TSubmitComprehensionAnswerResponse,
    TGetAllComprehensionsResponse,
    TComprehensionResponse
} from '../types/comprehension';
import {
    ZPostStartComprehension,
    ZGetComprehensionSessionRequest,
    ZPostSubmitComprehensionAnswerRequest,
    ZGetAllComprehensionsRequest,
    ZGetComprehensionByIdRequest,
} from '../types/comprehension';

export const comprehensionRouter = router({
    startComprehension: authedProcedure
        .input(ZPostStartComprehension)
        .mutation(async ({ input }) => {
            const response = await fetchAPI(
                `/api/comprehension/start`,
                'POST',
                {
                    token: input.accessToken,
                    body: {
                        courseId: input.courseId
                    }
                }
            );
            return response as TStartComprehensionResponse;
        }),
    getQuestionBySessionId: authedProcedure.input(ZGetComprehensionSessionRequest).mutation(async ({ input }) => {
        const response = await fetchAPI(
            `/api/comprehension/session/${input.id}`,
            'GET',
            {
                token: input.accessToken,
            }
        );
        return response as TGetComprehensionSessionResponse;
    }),
    postSubmitAnswer: authedProcedure
        .input(ZPostSubmitComprehensionAnswerRequest)
        .mutation(async ({ input }) => {
            const response = await fetchAPI(
                `/api/comprehension/session/${input.courseSessionId}/submit-answer`,
                'POST',
                {
                    token: input.accessToken,
                    body: {
                        answer: input.answer
                    }
                }
            );
            return response as TSubmitComprehensionAnswerResponse;
        }),
    getAllComprehensions: authedProcedure
        .input(ZGetAllComprehensionsRequest)
        .query(async ({ input }) => {
            const response = await fetchAPI(
                `/api/comprehension/language/${input.language}`,
                'GET',
                {
                    token: input.accessToken,
                }
            );
            return response as TGetAllComprehensionsResponse;
        }),
});