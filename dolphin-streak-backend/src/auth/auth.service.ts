import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { verify } from "argon2";
import { AuthResponse } from "src/lib/types/response.type";
import { User } from "src/users/schemas/user.schema";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async validateUser(
        email: string,
        password: string,
    ): Promise<Omit<User, "password">> {
        const user = await this.usersService.findOne({ email: email });

        const passwordMatched = await verify(user?.password, password);
        if (passwordMatched) {
            const { password: foundedUserPassword, ...result } = user
                .toObject();
            return result;
        }
        return null;
    }

    login(
        user: Omit<User, "password"> & { _id: string },
        rememberMe: boolean = false,
    ): AuthResponse {
        const payload = { email: user.email, sub: user.sub ?? user._id };
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
}
