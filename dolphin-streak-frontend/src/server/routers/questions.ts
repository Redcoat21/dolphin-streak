import { authedProcedure, router } from '../trpc';
import { ZGetQuestionByIdRequest } from '../types/questions';
import type { TQuestionResponse } from '../types/questions';
import { fetchAPI } from '@/utils/generic'; // Assuming fetchAPI is a utility function

export const questionsRouter = router({
  getQuestionById: authedProcedure
    .input(ZGetQuestionByIdRequest)
    .query(async ({ input }) => {
      const { questionIndex, sessionId, accessToken } = input;

      const response = await fetchAPI(`/api/levels/${input.levelId}/question/${questionIndex}?sessionId=${sessionId}`, 'GET', {
        token: accessToken,
      }) as TQuestionResponse;

      return response;
    }),
});