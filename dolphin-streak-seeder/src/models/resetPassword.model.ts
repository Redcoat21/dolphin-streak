import mongoose, { Schema, Document } from 'mongoose';
import * as argon2 from 'argon2';

export interface IResetPassword extends Document {
    token: string;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    expiredAt: Date;
}

const ResetPasswordSchema = new Schema<IResetPassword>({
    token: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    expiredAt: { type: Date, default: () => Date.now() + 15 * 60 * 1000 },
});

ResetPasswordSchema.pre<IResetPassword>('save', async function (next) {
    if (this.isModified('token')) {
        this.token = await argon2.hash(this.token);
    }
    next();
});

ResetPasswordSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

export const ResetPassword = mongoose.model<IResetPassword>('ResetPassword', ResetPasswordSchema);