import { fetchAPI } from "@/utils/generic";
import {
  ZRegisterInput,
  TLoginResponse,
  ZUpdateLanguagePreferencesInput,
  TUpdateLanguagePreferencesInput,
  ZForgotPasswordInput,
  TForgotPasswordInput,
  ZResetPasswordInput,
  TResetPasswordInput,
  TRefreshAccessTokenResponse,
} from "../types/auth";
import { z } from "zod";

export class AuthService {
  static async login(email: string, password: string): Promise<TLoginResponse> {
    try {
      const response = await fetchAPI<TLoginResponse>("/api/auth/login", "POST", {
        body: { email, password },
      });
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error("Login failed: " + error.message);
      } else {
        throw new Error("Login failed: Unknown error");
      }
    }
  }

  static async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    try {
      const response = await fetchAPI("/api/auth/register", "POST", {
        body: { firstName, lastName, email, password },
      });
      console.log({ response });
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Registration failed: ${JSON.stringify({ error })}`);
      } else {
        throw new Error("Registration failed: Unknown error");
      }
    }
  }

  static async updateLanguagePreferences(
    input: TUpdateLanguagePreferencesInput
  ) {
    try {
      const response = await fetchAPI(
        "/api/auth/updateLanguagePreferences",
        "PUT",
        { body: input }
      );
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error("Update language preferences failed: " + error.message);
      } else {
        throw new Error("Update language preferences failed: Unknown error");
      }
    }
  }

  static async forgotPassword(email: string) {
    try {
      const response = await fetchAPI("/api/auth/forgot-password", "POST", {
        body: { email },
      });
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error("Forgot password failed: " + error.message);
      } else {
        throw new Error("Forgot password failed: Unknown error");
      }
    }
  }

  static async resetPassword(input: TResetPasswordInput) {
    try {
      const response = await fetchAPI("/api/auth/reset-password", "POST", {
        body: input
      },
      );
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error("Reset password failed: " + error.message);
      } else {
        throw new Error("Reset password failed: Unknown error");
      }
    }
  }

  static async refreshAccessToken(refreshToken: string) {
    try {
      const response = await fetchAPI("/api/auth/refresh", "POST", {
        body: { refreshToken },
      });
      console.log({ responseRefreshToken: response });
      return response as TRefreshAccessTokenResponse;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error("Refresh token failed: " + error.message);
      } else {
        throw new Error("Refresh token failed: Unknown error");
      }
    }
  }

  static async getProfile(accessToken: string) { 
    // TODO Implement
  }
}