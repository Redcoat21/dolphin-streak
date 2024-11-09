import { Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) {
        /*
            We only need the ACCESS_TOKEN_SECRET_KEY here because only access token will be used for authentication.
            Refresh token will be only used for generating new access token.
        */
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("ACCESS_TOKEN_SECRET_KEY"),
        });
    }

    async validate(payload: any): Promise<unknown> {
        return { sub: payload.sub, email: payload.email, role: payload.role };
    }
}
