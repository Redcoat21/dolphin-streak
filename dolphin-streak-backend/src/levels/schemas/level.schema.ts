import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Language } from "../../languages/schemas/language.schema";

export type LevelDocument = HydratedDocument<Level>;

@Schema()
export class Level {
    @Prop({ required: true, length: 255 })
    name: string;

    @Prop({
        required: true,
        type: { type: mongoose.Schema.Types.ObjectId, ref: "Language" },
    })
    language: Language;
}

export const LevelSchema = SchemaFactory.createForClass(Level);
