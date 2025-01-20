import { Body, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Session } from "./schemas/session.schema";
import mongoose, {
    FilterQuery,
    Model,
    ProjectionType,
    Types,
    UpdateQuery,
} from "mongoose";
import { CreateSessionDto } from "./dto/create-session.dto";
import crypto from "crypto";
import { DateTime } from "luxon";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UsersService } from "src/users/users.service";

export enum TokenType {
    ACCESS,
    REFRESH,
}

export type TokenData = {
    token: string;
    liveTime: Date;
};

@Injectable()
export class SessionService {
    private readonly logger = new Logger(SessionService.name);
    constructor(
        private readonly usersService: UsersService,
        @InjectModel(Session.name) private sessionModel: Model<Session>,
    ) { }

    create(createSessionDto: CreateSessionDto) {
        return this.sessionModel.create(createSessionDto);
    }

    createToken(tokenType: TokenType, rememberMe?: boolean): TokenData {
        // If token type is access token then the livetime is 30 minutes.
        // For refresh token, depending on rememberMe, if its checked its 30 days, if its not its 24 hours.
        const liveTime = tokenType === TokenType.ACCESS
            ? 60 * 60 * 1000
            : rememberMe
                ? 30 * 24 * 60 * 60 * 1000
                : 24 * 60 * 60 * 1000;
        // const liveTime = tokenType === TokenType.ACCESS
        //     ? 30 * 60 * 1000
        //     : rememberMe
        //     ? 30 * 24 * 60 * 60 * 1000
        //     : 24 * 60 * 60 * 1000;

        return {
            token: crypto.randomBytes(64).toString("hex"),
            liveTime: DateTime.now().plus(liveTime * 60).toJSDate(),
        };
    }

    find(filter: FilterQuery<Session>, projection?: ProjectionType<Session>) {
        return this.sessionModel.find(filter, projection).populate({
            path: "user",
            select: "email",
        });
    }

    findOne(
        filter: FilterQuery<Session>,
        projection?: ProjectionType<Session>,
    ) {
        return this.sessionModel.findOne(filter, projection).populate("user");
    }

    updateOne(
        id: string,
        update: UpdateQuery<Session>,
    ) {
        return this.sessionModel.findByIdAndUpdate(id, update, { new: true });
    }

    invalidateSession(id: string) {
        return this.updateOne(id, {
            isActive: false,
        });
    }

    deleteMany(filter: FilterQuery<Session>) {
        return this.sessionModel.deleteMany(filter);
    }

    //TODO: Change the cron expression to be a longer time in production.
    @Cron(CronExpression.EVERY_MINUTE)
    private async removeExpiredSessions() {
        // For now it only removes the inactive sessions based on the isActive flag, it doesn't check token expiry.
        const count = await this.sessionModel.deleteMany({
            isActive: false,
        });

        this.logger.log(`Removed ${count.deletedCount} expired sessions`);
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    private async restoreLives(){
        const restore = await this.usersService.restoreLives();

        this.logger.log(`${restore} user's lives have been restored`)
    }
}
