import { fetchAPI } from '../../utils/generic';
import { authedProcedure, router } from '../trpc';
import { z } from 'zod';
import type {
    TStartComprehensionResponse,
    TGetComprehensionSessionResponse,
    TSubmitComprehensionAnswerResponse,
    TGetAllComprehensionsResponse
} from '../types/comprehension';
import {
    ZPostStartComprehension,
    ZGetComprehensionSessionRequest,
    ZPostSubmitComprehensionAnswerRequest,
    ZGetAllComprehensionsRequest,
} from '../types/comprehension';
import { QuestionType } from '../types/questions';


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
                        languageId: input.languageId
                    }
                }
            );
            return response as TStartComprehensionResponse;
        }),
    getQuestionBySessionId: authedProcedure.input(ZGetComprehensionSessionRequest).mutation(async ({ input }) => {
        const response = await fetchAPI(
            `/api/comprehension/session/${input.comprehensionSessionId}`,
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
                `/api/comprehension/session/${input.comprehensionSessionId}/submit-answer`,
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
                `/api/comprehension`,
                'GET',
                {
                    token: input.accessToken,
                    params: {
                        language: input.language,
                    }
                }
            );
            return response as TGetAllComprehensionsResponse;
        }),
});