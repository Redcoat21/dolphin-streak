import { publicProcedure, router } from '../trpc';
import { ZLoginInput } from '../types/auth';
import { AuthService } from '../services/auth.service';

export const authRouter = router({
  login: publicProcedure
    .input(ZLoginInput)
    .mutation(async ({ input }) => {
      const authService = new AuthService();
      return await authService.login(input.email, input.password);
    }),
});
