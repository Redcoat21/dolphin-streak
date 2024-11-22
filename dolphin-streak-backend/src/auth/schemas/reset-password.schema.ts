import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DateTime } from "luxon";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/users/schemas/user.schema";
import * as argon2 from "argon2";

export type ResetPasswordDocument = HydratedDocument<ResetPassword>;

@Schema()
export class ResetPassword {
    // The unique token that will be used to reset the password.
    @Prop({ required: true })
    token: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;

    // Default creation date will be now.
    @Prop({ required: false, default: () => DateTime.now().toJSDate() })
    createdAt: Date;

    // Default expiration date will be 15 minutes from now.
    @Prop({
        required: false,
        default: () => DateTime.now().plus({ minute: 15 }).toJSDate(),
    })
    expiredAt: Date;
}

export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);

ResetPasswordSchema.pre("save", async function (next) {
    if (this.isModified("token")) {
        const hashedToken = await argon2.hash(this.token);
        this.token = hashedToken;
    }
    next();
});

ResetPasswordSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
