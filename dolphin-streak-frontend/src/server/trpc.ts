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

// Define your authenticated procedure
export const authedProcedure = baseProcedure
  .input(z.object({
    // Define your input schema here, e.g., for a post reply
    content: z.string().min(1, "Content is required"),
  }))
  .mutation(async ({ input, context }) => {
    // Extract the token from the context
    const token = context.token; // Assuming the token is stored in the context

    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    // Here you can handle the logic for the authenticated action
    // For example, you might want to save a reply to a post
    // const reply = await saveReplyToPost(input.content, token);

    return {
      success: true,
      // reply, // Return the reply or any other relevant data
    };
  });
