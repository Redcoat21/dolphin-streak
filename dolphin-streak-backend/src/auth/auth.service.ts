import { Injectable } from "@nestjs/common";
import { verify } from "argon2";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOne({ email: email });

        const passwordMatched = await verify(user?.password, password);
        if (passwordMatched) {
            const { password: foundedUserPassword, ...result } = user
                .toObject();
            return result;
        }
        return null;
    }
}
