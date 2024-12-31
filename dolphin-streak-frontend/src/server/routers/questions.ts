import { authedProcedure, router } from '../trpc';
import { levelsSession } from './levels';
import { ZGetQuestionByIdRequest } from '../types/questions';
import type { TQuestionResponse } from '../types/questions';
import { fetchAPI } from '@/utils/generic'; // Assuming fetchAPI is a utility function

export const questionsRouter = router({
  getQuestionById: authedProcedure
    .input(ZGetQuestionByIdRequest)
    .query(async ({ input }) => {
      const { questionIndex, sessionId, accessToken } = input;

      // const isValidToken = await fetchAPI('/api/validate-token', 'POST', { token: accessToken });
      // if (!isValidToken) throw new Error('Invalid access token');

      console.log({ levelsSession })
      const session = levelsSession.find(s => s.sessionId === sessionId);
      if (!session) throw new Error('Session not found');

      const question = session.questions[questionIndex];
      if (!question) throw new Error('Question not found');
      return { question } as TQuestionResponse;
    }),
});