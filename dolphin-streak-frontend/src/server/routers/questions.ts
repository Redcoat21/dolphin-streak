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

      const response = await fetchAPI(
        `/api/levels/${levelId}/question/${questionIndex}?sessionId=${sessionId}`,
        'GET',
        { token: accessToken }
      ) as TQuestionResponse;

      return response;
    }),

  nextQuestion: authedProcedure
    .input(ZNextQuestionInput)
    .mutation(async ({ input }) => {
      const { sessionId, currentQuestionIndex, accessToken } = input;

      const response = await fetchAPI(
        `/api/levels/next-question?sessionId=${sessionId}`,
        'POST',
        {
          token: accessToken,
          body: { currentQuestionIndex },
        }
      ) as TNextQuestionResponse;

      return response;
    }),

  submitAnswer: authedProcedure
    .input(ZSubmitAnswerRequest)
    .mutation(async ({ input }) => {
      const { sessionId, questionIndex, levelId, answer, accessToken } = input;

      const response = await fetchAPI(
        `/api/levels/${levelId}/question/${questionIndex}/submit?sessionId=${sessionId}`,
        'POST',
        {
          token: accessToken,
          body: { answer },
        }
      ) as TSubmitAnswerResponse;

      return response;
    }),
});