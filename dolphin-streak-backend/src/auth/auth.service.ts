import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { AuthResponse } from "src/lib/types/response.type";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { Provider, User } from "src/users/schemas/user.schema";
import { UsersService } from "src/users/users.service";
import { extractPassword } from "src/lib/utils/user";
import * as crypto from "crypto";
import { InjectModel } from "@nestjs/mongoose";
import { ResetPassword } from "./schemas/reset-password.schema";
import { Model } from "mongoose";
import { MailService } from "src/mail/mail.service";
import { EncryptionService } from "src/security/encryption.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(ResetPassword.name) private resetPasswordModel: Model<
      ResetPassword
    >,
    private mailService: MailService,
    private encryptionService: EncryptionService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, "password">> {
    const user = await this.usersService.findOne({ email: email });

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    const passwordMatched = await argon2.verify(user?.password, password);
    if (passwordMatched) {
      const result = extractPassword(user);
      return result;
    }
    return null;
  }

  login(
    user: Omit<User, "password"> & { _id: string },
    rememberMe: boolean = false,
  ): AuthResponse {
    const payload = {
      email: user.email,
      sub: user.sub ?? user._id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("ACCESS_TOKEN_SECRET_KEY"),
      expiresIn: "15m",
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("REFRESH_TOKEN_SECRET_KEY"),
      expiresIn: rememberMe ? "7d" : "1d",
    });

    this.usersService.findOne({ email: user.email }).updateOne(
      { refreshToken: refreshToken, accessToken: accessToken },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  // This is a wrapper for the UsersService.create method.
  // Feel free to eliminate this method if you think its not needed.
  async register(createUserDto: CreateUserDto) {
    try {
      const createdUser = extractPassword(
        await this.usersService.create({
          ...createUserDto,
          provider: Provider.LOCAL,
        }),
      );
      return createdUser;
    } catch (error) {
      throw new HttpException("User already exists", HttpStatus.CONFLICT);
    }
  }

  refreshToken(userPayload: unknown) {
    try {
      //TODO: Give this proper typing.
      return this.jwtService.sign(userPayload as object, {
        secret: this.configService.get<string>("ACCESS_TOKEN_SECRET_KEY"),
        expiresIn: "5m",
      });
    } catch (error) {
      throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
    }
  }

  // Note: That this method does not update the password, it only sends the confirmation email.
  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.usersService.findOne({ email: email });

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    // Random token that will be used for password reset.
    const token = crypto.randomBytes(32).toString("hex");

    // Find the record and delete if if it exists.
    // The goal is to ensure each user can only request a password reset once in a given time.
    await this.resetPasswordModel.findOneAndDelete({ user: user.id });

    await this.resetPasswordModel.create({
      user: user.id,
      token: token,
    });

    await this.mailService.sendPasswordResetMail(email, user.id, token);
  }

  async resetPassword(
    encryptedPayload: string,
    iv: string,
    newPassword: string,
  ): Promise<void> {
    const decryptedString = await this.encryptionService.decryptPayload(
      encryptedPayload,
      iv,
    );

    const [userId, token] = decryptedString.split(":");

    const resetPasswordRecord = await this.resetPasswordModel.findOne({
      user: userId,
    });

    // Token here mean the payload in the url.
    if (!resetPasswordRecord) {
      throw new HttpException(
        "Invalid token given! User not found",
        HttpStatus.NOT_FOUND,
      );
    }

    // Next verify if the token and the hashed token matched.
    const tokenMatched = await argon2.verify(resetPasswordRecord.token, token);

    if (!tokenMatched) {
      throw new HttpException(
        "Invalid token given! Token doesn't match",
        HttpStatus.UNAUTHORIZED,
      );
    }

    // If all things done, its time to update the password.

    await this.usersService.update(userId, {
      password: await argon2.hash(newPassword),
    });

    // Then we delete the token from the database to prevent misuse.
    await this.resetPasswordModel.findByIdAndDelete(resetPasswordRecord.id);
  }
}
