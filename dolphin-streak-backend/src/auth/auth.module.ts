import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenStrategy } from "./strategy/jwt-refresh.strategy";

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtService, RefreshTokenStrategy],
})
export class AuthModule {}
