import { baseProcedure, router } from '../trpc';
import { authRouter } from './auth';
import { coursesRouter } from './courses';
import { forumRouter } from './forum';
import { languageRouter } from './language';
import { levelsRouter } from './levels';
import { todoRouter } from './todo';

export const appRouter = router({
  todo: todoRouter,
  auth: authRouter,
  forum: forumRouter,
  language: languageRouter,
  course: coursesRouter,
  levels: levelsRouter
  // i18n: baseProcedure.query(({ ctx }) => ({
  //   i18n: ctx.i18n,
  //   locale: ctx.locale,
  // })),
});

export type AppRouter = typeof appRouter;
