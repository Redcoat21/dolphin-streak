import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { AuthResponse } from "src/lib/types/response.type";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { Provider, User } from "src/users/schemas/user.schema";
import { UsersService } from "src/users/users.service";
import { extractPassword } from "src/lib/utils/user";
import * as crypto from "crypto";
import { InjectModel } from "@nestjs/mongoose";
import { ResetPassword } from "./schemas/reset-password.schema";
import mongoose, { Model } from "mongoose";
import { MailService } from "src/mail/mail.service";
import { EncryptionService } from "src/security/encryption.service";
import { DeviceInfo } from "./session/schemas/session.schema";
import { IResult, UAParser } from "ua-parser-js";
import { Request } from "express";
import { SessionService, TokenType } from "./session/session.service";
import { DateTime } from "luxon";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectModel(ResetPassword.name) private resetPasswordModel: Model<
      ResetPassword
    >,
    private mailService: MailService,
    private encryptionService: EncryptionService,
    private sessionService: SessionService,
  ) {}

  // This code only check if the user exists and the password is correct.
  // This code DOES NOT check if the session is valid or not
  // That will be handle by the login() method
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

  private getDeviceInfo(req: Request): DeviceInfo {
    const parser: IResult = UAParser(req.headers["user-agent"]);

    return {
      userAgent: parser.ua,
      browser: parser.browser.name,
      cpu: parser.cpu.architecture,
      device: parser.device.type,
      engine: parser.engine.name,
      os: parser.os.name,
      ip: req.ip,
    };
  }

  // This method is to create a new session.
  async login(
    req: Request & {
      user: Omit<User, "password"> & { _id: mongoose.Types.ObjectId };
    },
    rememberMe: boolean = false,
  ): Promise<AuthResponse> {
    const { user } = req;
    const deviceInfo = this.getDeviceInfo(req);

    const accessToken = this.sessionService.createToken(TokenType.ACCESS);

    const refreshToken = this.sessionService.createToken(
      TokenType.REFRESH,
      rememberMe,
    );

    // First check if an existing session exists. If it does invalidate it.
    const existingSession = await this.sessionService.findOne({
      user: user._id,
      isActive: true,
    });

    // If the session is still active, then we should invalidate it.
    // NOTE: That this method check if the session is still active, since if its not active, then it can't be used anyway.
    if (existingSession) {
      await this.sessionService.invalidateSession(
        existingSession._id.toString(),
      );
    }

    // Then create a new session.
    await this.sessionService.create({
      user: user._id.toString(),
      accessToken: {
        token: accessToken.token,
        expires: accessToken.liveTime,
      },
      refreshToken: {
        token: refreshToken.token,
        expires: refreshToken.liveTime,
      },
      deviceInfo: deviceInfo,
      isActive: true,
      lastActive: DateTime.now().toJSDate(),
    });

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
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

  async refreshToken(refreshToken: string) {
    const session = await this.sessionService.findOne({
      "refreshToken.token": refreshToken,
      isActive: true,
    });

    if (!session) {
      throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
    }

    // Check if the token already expired.
    if (session.refreshToken.expires < DateTime.now().toJSDate()) {
      throw new HttpException("Token has expired", HttpStatus.UNAUTHORIZED);
    }

    // If the token is still valid, we should first invalidate the current session.
    await this.sessionService.invalidateSession(
      session._id.toString(),
    );
    // Then create a new session with the same refresh token? For now, lets use the same refresh token.
    const accessToken = this.sessionService.createToken(TokenType.ACCESS);

    this.sessionService.create({
      //@ts-ignore
      user: session.user._id,
      accessToken: {
        token: accessToken.token,
        expires: accessToken.liveTime,
      },
      refreshToken: {
        token: session.refreshToken.token,
        expires: session.refreshToken.expires,
      },
      deviceInfo: session.deviceInfo,
      isActive: true,
      lastActive: DateTime.now().toJSDate(),
    });

    return {
      accessToken: accessToken.token,
    };
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
      password: await newPassword,
    });

    // Then we delete the token from the database to prevent misuse.
    await this.resetPasswordModel.findByIdAndDelete(resetPasswordRecord.id);
  }

  async logout(userId: string) {
    const session = await this.sessionService.findOne({
      user: userId,
    });
    return await this.sessionService.invalidateSession(session._id.toString());
  }
}
