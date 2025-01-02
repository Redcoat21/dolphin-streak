// dolphin-streak-frontend/src/server/routers/questions.ts
import { authedProcedure, router } from '../trpc';
import { ZGetQuestionByIdRequest, ZSubmitAnswerRequest, ZNextQuestionInput, ZStartSessionRequest } from '../types/questions';
import type { TQuestionResponse, TSubmitAnswerResponse, TNextQuestionResponse, TStartSessionResponse } from '../types/questions';
import { fetchAPI } from '@/utils/generic';
import { TRPCError } from '@trpc/server';

export const questionsRouter = router({
  getQuestionById: authedProcedure
    .input(ZGetQuestionByIdRequest)
    .query(async ({ input }) => {
      const { questionIndex, sessionId, accessToken, levelId } = input;
      console.log({ input });

      const response = await fetchAPI(
        `/api/levels/${levelId}/question/${questionIndex}?sessionId=${sessionId}`,
        'GET',
        { token: accessToken }
      ) as TQuestionResponse;

      console.log({ responseGetQuestionBYID: response });

      if (!response.success) {
        throw new TRPCError({ code: 'NOT_FOUND', message: response.message || 'Failed to fetch question' });
      }

      return response;
    }),

  nextQuestion: authedProcedure
    .input(ZNextQuestionInput)
    .mutation(async ({ input }) => {
      const { sessionId, currentQuestionIndex, accessToken } = input;

      const response = await fetchAPI(
        `/api/sessions/${sessionId}/next-question`,
        'POST',
        {
          token: accessToken,
          body: { currentQuestionIndex },
        }
      ) as TNextQuestionResponse;

      if (!response.success) {
        throw new TRPCError({ code: 'NOT_FOUND', message: response.message || 'Failed to fetch next question' });
      }

      return response;
    }),

  submitAnswer: authedProcedure
    .input(ZSubmitAnswerRequest)
    .mutation(async ({ input }) => {
      const { sessionId, questionIndex, levelId, answer, accessToken } = input;

      const response = await fetchAPI(
        `/api/sessions/${sessionId}/submit-answer`,
        'POST',
        {
          token: accessToken,
          body: { questionIndex, levelId, answer },
        }
      ) as TSubmitAnswerResponse;

      if (!response.success) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: response.message || 'Failed to submit answer' });
      }

      return response;
    }),

});