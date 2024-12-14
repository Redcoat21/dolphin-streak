import { publicProcedure, router } from '../trpc';
import { ZLoginInput, ZRegisterInput, ZUpdateLanguagePreferencesInput, ZForgotPasswordInput, ZResetPasswordInput } from '../types/auth';
import { AuthService } from '../services/auth.service';

export const authRouter = router({
  login: publicProcedure
    .input(ZLoginInput)
    .mutation(async ({ input }) => {
      const result = await AuthService.login(input.email, input.password);
      return {
        success: true,
        data: result.data
      };
    }),
  register: publicProcedure
    .input(ZRegisterInput)
    .mutation(async ({ input }) => {
      if (input.password !== input.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      return await AuthService.register(input.firstName, input.lastName, input.email, input.password);
    }),
  updateLanguagePreferences: publicProcedure
    .input(ZUpdateLanguagePreferencesInput)
    .mutation(async ({ input }) => {
      return await AuthService.updateLanguagePreferences(input);
    }),
  forgotPassword: publicProcedure
    .input(ZForgotPasswordInput)
    .mutation(async ({ input }) => {
      return await AuthService.forgotPassword(input.email);
    }),
  resetPassword: publicProcedure
    .input(ZResetPasswordInput)
    .mutation(async ({ input }) => {
      return await AuthService.resetPassword(input);
    }),
});
