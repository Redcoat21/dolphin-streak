import { baseProcedure, router } from '../trpc';
import { authRouter } from './auth';
import { comprehensionRouter } from './comprehension';
import { coursesRouter } from './courses';
import { dailyRouter } from './daily';
import { forumRouter } from './forum';
import { languageRouter } from './language';
import { levelsRouter } from './levels';
import { questionsRouter } from './questions';
// import { todoRouter } from './todo';

export const appRouter = router({
  // todo: todoRouter,
  auth: authRouter,
  comprehension: comprehensionRouter,
  forum: forumRouter,
  language: languageRouter,
  course: coursesRouter,
  levels: levelsRouter,
  question: questionsRouter,
  daily: dailyRouter
  // i18n: baseProcedure.query(({ ctx }) => ({
  //   i18n: ctx.i18n,
  //   locale: ctx.locale,
  // })),
});

export type AppRouter = typeof appRouter;
