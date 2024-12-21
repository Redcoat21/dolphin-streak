import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import type { createInnerTRPCContext } from './context';
import { z } from 'zod';

const t = initTRPC.context<typeof createInnerTRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const baseProcedure = t.procedure;
export const publicProcedure = baseProcedure;

export const authedProcedure = baseProcedure.use(({ ctx, next }) => {
  // Try to get the token from local storage
  let token = ctx.token || localStorage.getItem('token') || sessionStorage.getItem('token');

  if (!token) {
    throw new Error('Not authenticated');
  }

  return next({
    ctx: {
      token,
    },
  });
});