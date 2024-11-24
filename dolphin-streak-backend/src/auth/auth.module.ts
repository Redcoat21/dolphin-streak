import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenStrategy } from "./strategy/jwt-refresh.strategy";
import { MongooseModule } from "@nestjs/mongoose";
import { ResetPasswordSchema } from "./schemas/reset-password.schema";
import { MailModule } from "src/mail/mail.module";
import { EncryptionModule } from "src/security/encryption.module";
import { SessionModule } from "./session/session.module";
import { BearerTokenStrategy } from "./strategy/bearer-token.strategy";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{
      name: "ResetPassword",
      schema: ResetPasswordSchema,
    }]),
    MailModule,
    EncryptionModule,
    SessionModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtService,
    RefreshTokenStrategy,
    BearerTokenStrategy,
  ],
})
export class AuthModule {}
