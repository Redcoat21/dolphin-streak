import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { ApiResponse, AuthResponse } from "src/lib/types/response.type";
import { BaseCreateUserDto } from "src/lib/dto/base-create-user.dto";
import { Provider, Role } from "src/users/schemas/user.schema";

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

  @Post("register")
  async register(@Body() createUserDto: BaseCreateUserDto) {
    const registrationData = {
      ...createUserDto,
      role: Role.USER,
      provider: Provider.LOCAL,
    };

    return {
      message: "User registered succesfully",
      data: await this.authService.register(registrationData),
    };
  }
}
