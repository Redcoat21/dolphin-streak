import { authedProcedure, publicProcedure, router } from '../trpc';
import { ZLoginInput, ZRegisterInput, ZUpdateLanguagePreferencesInput, ZForgotPasswordInput, ZResetPasswordInput, ZRefreshAccessTokenRequest, ZUpdateProfileInput, ZUpdateProfilePictureInput, ZPostSubscribeRequest } from '../types/auth';
import { AuthService } from '../services/auth.service';

export const authRouter = router({
  login: publicProcedure
    .input(ZLoginInput)
    .mutation(async ({ input }) => {
      console.log({ input });
      const result = await AuthService.login(input.email, input.password, input.rememberMe);
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


      return await AuthService.register(input.firstName, input.email, input.password, input?.lastName,);
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
  refreshAccessToken: publicProcedure.input(ZRefreshAccessTokenRequest).mutation(async ({ input }) => {
    return await AuthService.refreshAccessToken(input.refreshToken);
  }),
  getProfile: authedProcedure.query(async ({ input }) => {
    return await AuthService.getProfile(input.accessToken);
  }),
  updateProfile: authedProcedure
    .input(ZUpdateProfileInput)
    .mutation(async ({ input }) => {
      return await AuthService.updateProfile(input, input.accessToken);
    }),
  updateProfilePicture: authedProcedure
    .input(ZUpdateProfilePictureInput)
    .mutation(async ({ input }) => {
      const { profilePicture, accessToken } = input;

      if (!profilePicture) {
        throw new Error("No file uploaded");
      }

      return await AuthService.updateProfilePicture(profilePicture, accessToken);
    }),

  subscribe: authedProcedure.input(ZPostSubscribeRequest).mutation(async ({ input }) => { 
    return await AuthService.subscribe(input, input.accessToken);
  })
});
