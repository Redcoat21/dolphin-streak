import { fetchAPI } from "../../utils/generic";

export class AuthService {
  async login(email: string, password: string): Promise<any> {
    try {
      const response = await fetchAPI("/api/auth/login", "POST", {
        email,
        password,
      });
      console.log({ response });
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error("Login failed: " + error.message);
      } else {
        throw new Error("Login failed: Unknown error");
      }
    }
  }
}
