import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Document } from "mongoose";
import { User } from "src/users/schemas/user.schema";

export enum FeedbackType {
    REPORT,
    FEEDBACK
};

export type FeedbackDocument = HydratedDocument<Feedback>;

@Schema({ timestamps: true })
export class Feedback extends Document {
    @Prop({ type: mongoose.Types.ObjectId, ref: "User", required: true })
    user: User;

    @Prop({ required: true, maxLength: 255, enum: FeedbackType })
    type: FeedbackType;

    @Prop({ required: true, maxLength: 500 })
    content: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);