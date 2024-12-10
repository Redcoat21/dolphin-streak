import { fetchAPI } from "@/utils/generic";
import {
  ZRegisterInput,
  TLoginResponse,
  ZUpdateLanguagePreferencesInput,
  TUpdateLanguagePreferencesInput,
} from "../types/auth";
import { z } from "zod";

export class AuthService {
  static async login(email: string, password: string): Promise<TLoginResponse> {
    try {
      const response = await fetchAPI("/api/auth/login", "POST", {
        email,
        password,
      });
      return response as TLoginResponse;
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
        firstName,
        lastName,
        email,
        password,
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

  static async updateLanguagePreferences(input: TUpdateLanguagePreferencesInput) {
    try {
      const response = await fetchAPI(
        "/api/auth/updateLanguagePreferences",
        "PUT",
        input
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
}
