import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { ApiResponse, AuthResponse } from "src/lib/types/response.type";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req): Promise<ApiResponse> {
    // Where does req.user came from? It came from the LocalAuthGuard or specifically from the LocalStrategy.
    return {
      message: "Logged in succesfully",
      data: this.authService.login(req.user),
    };
  }
}
