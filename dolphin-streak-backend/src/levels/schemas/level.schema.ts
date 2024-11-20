import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Language } from "../../languages/schemas/language.schema";

export type LevelDocument = HydratedDocument<Level>;

@Schema()
export class Level {
    @Prop({ required: true, maxlength: 255 }) // Replaced length with maxlength
    name: string;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language",
    })
    language: Language;
}

export const LevelSchema = SchemaFactory.createForClass(Level);
