import { fetchAPI } from '../../utils/generic';
import { authedProcedure, router } from '../trpc';
import { z } from 'zod';
import type {
    TStartDailyResponse,
    TGetDailySessionResponse,
    TSubmitDailyAnswerResponse,
    TGetDailyFromLanguageResponse,
} from '../types/daily';
import {
    ZPostStartDaily,
    ZGetDailySessionRequest,
    ZPostSubmitDailyAnswerRequest,
    ZGetDailyFromLanguageRequest,
} from '../types/daily';
import { QuestionType } from '../types/questions';


export const dailyRouter = router({
    startDaily: authedProcedure
        .input(ZPostStartDaily)
        .mutation(async ({ input }) => {
            const response = await fetchAPI(
                `/api/daily/start`,
                'POST',
                {
                    token: input.accessToken,
                    body: {
                        languageId: input.languageId
                    }
                }
            );
            return response as TStartDailyResponse;
        }),
    getDailySession: authedProcedure.input(ZGetDailySessionRequest).query(async ({ input }) => {
        const response = await fetchAPI(
            `/api/daily/session/${input.dailySessionId}`,
            'GET',
            {
                token: input.accessToken,
            }
        );
        console.log({ response });
        return response as TGetDailySessionResponse;
    }),
    postSubmitDailyAnswer: authedProcedure
        .input(ZPostSubmitDailyAnswerRequest)
        .mutation(async ({ input }) => {
            if (input.questionType == QuestionType.VOICE) {
                // Convert base64 to blob
                const base64Data = input.answer.split(',')[1];
                const binaryData = atob(base64Data);
                const arrayBuffer = new Uint8Array(binaryData.length);
                for (let i = 0; i < binaryData.length; i++) {
                    arrayBuffer[i] = binaryData.charCodeAt(i);
                }
                const blob = new Blob([arrayBuffer], { type: 'audio/webm' });

                // Create FormData and append the blob
                const formData = new FormData();
                formData.append('audio', blob, 'recording.webm');

                const response = await fetchAPI(
                    `/api/daily/session/${input.dailySessionId}/submit-answer`,
                    'POST',
                    {
                        token: input.accessToken,
                        body: formData,
                    }
                );
                return response as TSubmitDailyAnswerResponse;
            } else {
                const response = await fetchAPI(
                    `/api/daily/session/${input.dailySessionId}/submit-answer`,
                    'POST',
                    {
                        token: input.accessToken,
                        body: {
                            answer: input.answer
                        }
                    }
                );
                console.log({ response })
                return response as TSubmitDailyAnswerResponse;
            }
        }),
    getDailyFromLanguage: authedProcedure
        .input(ZGetDailyFromLanguageRequest)
        .query(async ({ input }) => {
            console.log({ inputGetDailyFromLanguage: input })
            const response = await fetchAPI(
                `/api/daily/language/${input.language}`,
                'GET',
                {
                    token: input.accessToken,
                }
            );
            return response as TGetDailyFromLanguageResponse;
        }),
});

