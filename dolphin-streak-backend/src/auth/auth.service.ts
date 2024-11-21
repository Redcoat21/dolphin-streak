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
        return {
            accessToken: this.jwtService.sign(payload, {
                secret: this.configService.get<string>(
                    "ACCESS_TOKEN_SECRET_KEY",
                ),
                expiresIn: "5m",
            }),
            refreshToken: this.jwtService.sign(payload, {
                secret: this.configService.get<string>(
                    "REFRESH_TOKEN_SECRET_KEY",
                ),
                expiresIn: rememberMe ? "7d" : "1d",
            }),
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
            throw new HttpException(
                "User already exists",
                HttpStatus.CONFLICT,
            );
        }
    }

    refreshToken(userPayload: unknown) {
        try {
            //TODO: Give this proper typing.
            return this.jwtService.sign(userPayload as object, {
                secret: this.configService.get<string>(
                    "ACCESS_TOKEN_SECRET_KEY",
                ),
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

        const token = crypto.randomBytes(32).toString("hex");

        // Find the record and delete if if it exists.
        await this.resetPasswordModel.findOneAndDelete({ user: user.id });

        await this.resetPasswordModel.create({
            user: user.id,
            token: token,
        });

        await this.mailService.sendPasswordResetMail(email, token);
    }

    async resetPassword(
        token: string,
        userId: string,
        newPassword: string,
    ): Promise<void> {
        const resetPasswordRecord = await this.resetPasswordModel.findOne({
            user: userId,
        });

        if (!resetPasswordRecord) {
            throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
        }

        const user = await this.usersService.findOne({
            _id: userId,
        });

        await this.usersService.update(user.id, {
            password: await argon2.hash(newPassword),
        });

        await this.resetPasswordModel.findByIdAndDelete(resetPasswordRecord.id);
    }
}
