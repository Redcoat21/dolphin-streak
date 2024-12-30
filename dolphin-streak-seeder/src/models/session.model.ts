import mongoose, { Schema, Document } from 'mongoose';

export interface IToken {
    token: string;
    expires: Date;
}

export interface IDeviceInfo {
    userAgent: string;
    browser?: string;
    cpu?: string;
    device?: string;
    engine?: string;
    os?: string;
    ip: string;
}

export interface ISession extends Document {
    user: mongoose.Types.ObjectId;
    accessToken: IToken;
    refreshToken: IToken;
    isActive: boolean;
    deviceInfo: IDeviceInfo;
    lastActive: Date;
}

const SessionSchema = new Schema<ISession>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accessToken: {
        token: { type: String, required: true },
        expires: { type: Date, required: true },
    },
    refreshToken: {
        token: { type: String, required: true },
        expires: { type: Date, required: true },
    },
    isActive: { type: Boolean, default: true },
    deviceInfo: {
        userAgent: { type: String, required: true },
        browser: { type: String },
        cpu: { type: String },
        device: { type: String },
        engine: { type: String },
        os: { type: String },
        ip: { type: String, required: true },
    },
    lastActive: { type: Date, default: Date.now },
}, { timestamps: true });

export const Session = mongoose.model<ISession>('Session', SessionSchema);