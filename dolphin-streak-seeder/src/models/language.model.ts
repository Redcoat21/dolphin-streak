import mongoose, { Document, Schema } from 'mongoose';

export interface LanguageDocument extends Document {
    name: string;
    image: string;
}

const LanguageSchema: Schema<LanguageDocument> = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
});

const LanguageModel = mongoose.model<LanguageDocument>('Language', LanguageSchema);

export default LanguageModel;
