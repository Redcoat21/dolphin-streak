import { fetchAPI } from "@/utils/generic";
import { ZRegisterInput, TLoginResponse } from "../types/auth";

export class AuthService {
  async login(email: string, password: string): Promise<TLoginResponse> {
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

  async register(
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
}
