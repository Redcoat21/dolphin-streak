import { Inject, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-http-bearer";
import { SessionService } from "../session/session.service";
import { extractPassword } from "src/lib/utils/user";
import { DateTime } from "luxon";

export class BearerTokenStrategy
    extends PassportStrategy(Strategy, "bearer-token") {
    constructor(
        @Inject(SessionService) private readonly sessionService: SessionService,
    ) {
        super();
    }

    async validate(token: string) {
        const session = await this.sessionService.findOne({
            "accessToken.token": token,
            isActive: true,
        });

        if (!session) {
            throw new UnauthorizedException("Invalid or expired token");
        }

        if (session.accessToken.expires < DateTime.now().toJSDate()) {
            throw new UnauthorizedException("Token has expired");
        }

        const result = extractPassword(session.user as any);

        return result;
    }
}
