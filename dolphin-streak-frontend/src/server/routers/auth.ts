import { publicProcedure, router } from '../trpc';
import { ZLoginInput, ZRegisterInput, ZUpdateLanguagePreferencesInput } from '../types/auth';
import { AuthService } from '../services/auth.service';

export const authRouter = router({
  login: publicProcedure
    .input(ZLoginInput)
    .mutation(async ({ input }) => {
      return await AuthService.login(input.email, input.password);
    }),
  register: publicProcedure
    .input(ZRegisterInput)
    .mutation(async ({ input }) => {
      return await AuthService.register(input.firstName, input.lastName, input.email, input.password);
    }),
  updateLanguagePreferences: publicProcedure
    .input(ZUpdateLanguagePreferencesInput)
    .mutation(async ({ input }) => {
      return await AuthService.updateLanguagePreferences(input);
    }),
});
