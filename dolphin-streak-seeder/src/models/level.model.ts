import mongoose, { Schema, Document } from 'mongoose';

export interface ILevel extends Document {
    name: string;
    language: mongoose.Types.ObjectId;
}

const LevelSchema: Schema = new Schema({
    name: { type: String, required: true, maxlength: 255 },
    language: { type: mongoose.Types.ObjectId, ref: 'Language', required: true },
});

export const Level = mongoose.model<ILevel>('Level', LevelSchema);