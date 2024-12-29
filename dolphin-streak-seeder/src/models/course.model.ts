import mongoose, { Document, Schema } from 'mongoose';

export interface CourseDocument extends Document {
    name: string;
    languageId: string;
    type: string;
}

const CourseSchema: Schema<CourseDocument> = new mongoose.Schema({
    name: { type: String, required: true },
    languageId: { type: String, required: true },
    type: { type: String, required: true },
});

const CourseModel = mongoose.model<CourseDocument>('Course', CourseSchema);
export default CourseModel;
