import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/users/schemas/user.schema";
import { IBrowser, ICPU, IDevice, IEngine, IOS, IResult } from "ua-parser-js";

export type Token = {
    token: string;
    expires: Date;
};

export type DeviceInfo = {
    userAgent: string;
    browser?: string;
    cpu?: string;
    device?: string;
    engine?: string;
    os?: string;
    ip: string;
};

@Schema({ timestamps: true })
export class Session extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    user: User;

    @Prop({
        required: true,
        type: {
            token: { type: String, required: true },
            expires: { type: Date, required: true },
        },
    })
    accessToken: Token;

    @Prop({
        required: true,
        type: {
            token: { type: String, required: true },
            expires: { type: Date, required: true },
        },
    })
    refreshToken: Token;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({
        type: {
            userAgent: { type: String, required: true },
            browser: { type: String, required: false },
            cpu: { type: String, required: false },
            device: { type: String, required: false },
            engine: { type: String, required: false },
            os: { type: String, required: false },
            ip: { type: String, required: true },
        },
    })
    deviceInfo: DeviceInfo;

    @Prop({ default: Date.now })
    lastActive: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
