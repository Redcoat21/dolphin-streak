import { z } from 'zod';

export const ZLoginInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type TLoginInput = z.infer<typeof ZLoginInput>;

export const ZRegisterInput = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
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
