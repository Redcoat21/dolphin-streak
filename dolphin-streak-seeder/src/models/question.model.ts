import mongoose, { Schema, Document } from 'mongoose';
import { Course } from './course.model';

export enum QuestionType {
    MULTIPLE_CHOICE,
    ESSAY,
    FILL_IN,
    VOICE,
    WRITING,
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
    level?: mongoose.Types.ObjectId;
}

const QuestionSchema = new Schema<IQuestion>({
    question: { type: Schema.Types.Mixed, required: true },
    type: { type: Number, enum: Object.values(QuestionType), required: true },
    answerOptions: [{ type: String }],
    correctAnswer: { type: Schema.Types.Mixed },
    useAi: { type: Boolean, required: true },
    courses: [{ type: mongoose.Types.ObjectId, ref: 'Course', default: [] }],
    level: { type: mongoose.Types.ObjectId, ref: 'Level' },
});

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);