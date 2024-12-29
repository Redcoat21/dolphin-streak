import mongoose, { Document, Schema } from 'mongoose';

export interface LevelDocument extends Document {
    name: string;
    languageId: string;
}

const LevelSchema: Schema<LevelDocument> = new mongoose.Schema({
    name: { type: String, required: true },
    languageId: { type: String, required: true },
});

const LevelModel = mongoose.model<LevelDocument>('Level', LevelSchema);
export default LevelModel;
