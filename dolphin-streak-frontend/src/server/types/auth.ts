import { z } from 'zod';
import { TDefaultResponse } from './generic';

export const ZAuthedProcedureInput = z.object({
  accessToken: z.string(),
});

export const ZLoginInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});

export type TLoginInput = z.infer<typeof ZLoginInput>;

export const ZRegisterInput = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  profilePicture: z.string().optional(),
  birthDate: z.string().optional(),
});

export type TRegisterInput = z.infer<typeof ZRegisterInput>;

export type TLoginResponse = {
  messages: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export type TUserData = {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  loginHistories: string[];
  languages: string[];
  completedCourses: string[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TRegisterResponse = {
  messages: string;
  data: TUserData;
};

export const ZUpdateLanguagePreferencesInput = z.object({
  language: z.string(),
  motherLanguage: z.string().optional(),
  learningLanguage: z.string().optional(),
  proficiencyLevel: z.string().optional(),
  learningTime: z.string().optional(),
});

export type TUpdateLanguagePreferencesInput = z.infer<typeof ZUpdateLanguagePreferencesInput>;

export const ZForgotPasswordInput = z.object({
  email: z.string().email(),
});

export type TForgotPasswordInput = z.infer<typeof ZForgotPasswordInput>;

export const ZResetPasswordInput = z.object({
  encryptedPayload: z.string(),
  iv: z.string(),
  newPassword: z.string().min(8),
});

export type TResetPasswordInput = z.infer<typeof ZResetPasswordInput>;

export const ZRefreshAccessTokenRequest = z.object({
  refreshToken: z.string(),
});

export type TRefreshAccessTokenRequest = z.infer<typeof ZRefreshAccessTokenRequest>;

export type TRefreshAccessTokenResponse = {
  messages: string;
  data: {
    accessToken: string;
  };
};

export type TUserProfileData = {
  _id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  provider: number;
  profilePicture: string;
  loginHistories: string[];
  role: number;
  languages: string[];
  completedCourses: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type TGetUserProfileDataResponse = TDefaultResponse<TUserProfileData>;

export const ZUpdateProfileInput = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  profilePicture: z.string().optional(),
});

export type TUpdateProfileInput = z.infer<typeof ZUpdateProfileInput>;

export const ZUpdateProfilePictureInput = z.object({
  profilePicture: z.string(),
});

export type TUpdateProfilePictureInput = z.infer<typeof ZUpdateProfilePictureInput>;
export type TUpdateProfilePictureResponse = TDefaultResponse<{ imageUrl: string }>;