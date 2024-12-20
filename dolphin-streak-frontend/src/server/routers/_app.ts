import { baseProcedure, router } from '../trpc';
import { authRouter } from './auth';
import { forumRouter } from './forum';
import { todoRouter } from './todo';

export const appRouter = router({
  todo: todoRouter,
  auth: authRouter,
  forum: forumRouter,
  i18n: baseProcedure.query(({ ctx }) => ({
    i18n: ctx.i18n,
    locale: ctx.locale,
  })),
});

export type AppRouter = typeof appRouter;
