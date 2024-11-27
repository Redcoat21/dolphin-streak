import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/users/schemas/user.schema";
import { JwtStrategy } from "src/auth/strategy/jwt.strategy";
import { CloudinaryModule } from "src/upload/cloudinary.module";
import { SessionModule } from "src/auth/session/session.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    CloudinaryModule,
    SessionModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
