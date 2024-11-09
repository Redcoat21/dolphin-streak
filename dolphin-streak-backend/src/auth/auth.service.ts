import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { verify } from "argon2";
import { AuthResponse } from "src/lib/types/response.type";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/schemas/user.schema";
import { UsersService } from "src/users/users.service";
import { extractPassword } from "src/utils/user";

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

        if (!user) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }

        const passwordMatched = await verify(user?.password, password);
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
                await this.usersService.create(createUserDto),
            );
            return createdUser;
        } catch (error) {
            throw new HttpException(
                "User already exists",
                HttpStatus.CONFLICT,
            );
        }
    }
}
