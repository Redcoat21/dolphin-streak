import { Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) {
        /*
            This one here is a special case, and most likely the guard only be used in the POST /refresh endpoint.
        */
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("REFRESH_TOKEN_SECRET_KEY"),
        });
    }

    async validate(payload: any): Promise<unknown> {
        return { sub: payload.sub, email: payload.email, role: payload.role };
    }
}
