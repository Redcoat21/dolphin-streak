import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import type { CreateInnerContextOptions, createInnerTRPCContext } from './context';
import { z } from 'zod';
import { ZAuthedProcedureInput } from './types/auth';

// Define the token interface
interface TokenData {
  accessToken?: string;
  refreshToken?: string;
}

// Define the extended context type with token
type AuthedContext = ReturnType<typeof createInnerTRPCContext> & {
  token?: TokenData;
};

const t = initTRPC.context<AuthedContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const baseProcedure = t.procedure;
export const publicProcedure = baseProcedure;

export const authedProcedure = baseProcedure.input(ZAuthedProcedureInput)