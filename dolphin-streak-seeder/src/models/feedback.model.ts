import mongoose, { Schema, Document } from 'mongoose';
import UserModel from './user.model';

export enum FeedbackType {
    REPORT = 'REPORT',
    FEEDBACK = 'FEEDBACK'
}

export interface IFeedback extends Document {
    user: mongoose.Types.ObjectId;
    type: FeedbackType;
    content: string;
}

const FeedbackSchema = new Schema<IFeedback>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(FeedbackType), required: true },
    content: { type: String, required: true, maxlength: 500 },
}, { timestamps: true });

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);