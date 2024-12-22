import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type {
  CreateInnerContextOptions,
  createInnerTRPCContext,
} from "./context";
import { z } from "zod";
import { ZAuthedProcedureInput } from "./types/auth";

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

// Enhanced authenticated procedure that checks token validity and handles refresh
export const authedProcedure = baseProcedure
  .input(ZAuthedProcedureInput)
  .use(async ({ ctx, next, input }) => {
    // Get token from input instead of trying to access localStorage
    const accessToken = input.accessToken;

    if (!accessToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Missing authentication token",
      });
    }

    // Update context with token from input
    ctx.token = { accessToken };

    try {
      // Try the operation with current token
      return await next({
        ctx: {
          ...ctx,
          token: ctx.token,
        },
      });
    } catch (error) {
      // Let the client handle token refresh
      if (error instanceof TRPCError && error.code === "UNAUTHORIZED") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Token has expired",
        });
      }
      throw error;
    }
  });
