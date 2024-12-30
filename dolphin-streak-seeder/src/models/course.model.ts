import mongoose, { Schema, Document } from 'mongoose';

export enum CourseType {
    Daily = 0,
    Weekly = 1,
}

export interface ICourse extends Document {
    name: string;
    levels: mongoose.Types.ObjectId[];
    language: mongoose.Types.ObjectId;
    type: CourseType;
    thumbnail?: string;
}

const CourseSchema: Schema = new Schema({
    name: { type: String, required: true, maxlength: 255 },
    levels: [{ type: mongoose.Types.ObjectId, ref: 'Level' }],
    language: { type: mongoose.Types.ObjectId, ref: 'Language', required: true },
    type: { type: Number, enum: CourseType, required: true },
    thumbnail: { type: String, required: false, maxlength: 255 },
});

export const Course = mongoose.model<ICourse>('Course', CourseSchema);