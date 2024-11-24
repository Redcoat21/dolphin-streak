import { Body, Injectable } from "@nestjs/common";
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
    constructor(
        @InjectModel(Session.name) private sessionModel: Model<Session>,
    ) {}

    create(createSessionDto: CreateSessionDto) {
        return this.sessionModel.create(createSessionDto);
    }

    createToken(tokenType: TokenType, rememberMe?: boolean): TokenData {
        // If token type is access token then the livetime is 30 minutes.
        // For refresh token, depending on rememberMe, if its checked its 30 days, if its not its 24 hours.
        const liveTime = tokenType === TokenType.ACCESS
            ? 30 * 60 * 1000
            : rememberMe
            ? 30 * 24 * 60 * 60 * 1000
            : 24 * 60 * 60 * 1000;

        return {
            token: crypto.randomBytes(64).toString("hex"),
            liveTime: DateTime.now().plus(liveTime).toJSDate(),
        };
    }

    findOne(
        filter: FilterQuery<Session>,
        projection?: ProjectionType<Session>,
    ) {
        return this.sessionModel.findOne(filter, projection);
    }

    updateOne(
        id: string,
        update: UpdateQuery<Session>,
    ) {
        return this.sessionModel.findByIdAndUpdate(id, update);
    }
}