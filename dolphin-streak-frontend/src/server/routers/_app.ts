import { baseProcedure, router } from '../trpc';
import { authRouter } from './auth';
import { comprehensionRouter } from './comprehension';
import { coursesRouter } from './courses';
import { dailyRouter } from './daily';
import { feedbackRouter } from './feedback';
import { forumRouter } from './forum';
import { languageRouter } from './language';
import { levelsRouter } from './levels';
import { questionsRouter } from './questions';
// import { todoRouter } from './todo';

export const appRouter = router({
  auth: authRouter,
  comprehension: comprehensionRouter,
  forum: forumRouter,
  feedback: feedbackRouter,
  language: languageRouter,
  course: coursesRouter,
  levels: levelsRouter,
  question: questionsRouter,
  daily: dailyRouter
});

export type AppRouter = typeof appRouter;
