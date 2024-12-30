import mongoose, { Schema, Document } from 'mongoose';

export interface ILanguage extends Document {
    name: string;
    image: string;
}

const LanguageSchema: Schema = new Schema({
    name: { type: String, required: true, maxlength: 255 },
    image: { type: String, required: true, maxlength: 255 },
});

export const Language = mongoose.model<ILanguage>('Language', LanguageSchema);