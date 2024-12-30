import mongoose, { Schema, Document } from 'mongoose';
import { Course } from './course.model';

export enum QuestionType {
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    ESSAY = 'ESSAY',
    FILL_IN = 'FILL_IN',
    VOICE = 'VOICE',
    WRITING = 'WRITING',
}

export interface IQuestionDetail {
    type?: string;
    text?: string;
    voice?: string;
}

export interface IQuestion extends Document {
    question: IQuestionDetail;
    type: QuestionType;
    answerOptions?: string[];
    correctAnswer?: string | number;
    useAi: boolean;
    courses: mongoose.Types.ObjectId[];
}

const QuestionSchema = new Schema<IQuestion>({
    question: {
        type: {
            type: { type: String, maxlength: 50 },
            text: { type: String, maxlength: 500 },
            voice: { type: String, maxlength: 500 },
        },
        default: {},
    },
    type: { type: String, enum: Object.values(QuestionType), required: true },
    answerOptions: [{ type: String }],
    correctAnswer: { type: Schema.Types.Mixed },
    useAi: { type: Boolean, required: true },
    courses: [{ type: mongoose.Types.ObjectId, ref: 'Course', default: [] }],
});

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);