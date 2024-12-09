import { publicProcedure, router } from '../trpc';
import { ZLoginInput, ZRegisterInput } from '../types/auth';
import { AuthService } from '../services/auth.service';

export const authRouter = router({
  login: publicProcedure
    .input(ZLoginInput)
    .mutation(async ({ input }) => {
      const authService = new AuthService();
      return await authService.login(input.email, input.password);
    }),
  register: publicProcedure
    .input(ZRegisterInput)
    .mutation(async ({ input }) => {
      const authService = new AuthService();
      return await authService.register(input.firstName, input.lastName, input.email, input.password);
    }),
});
