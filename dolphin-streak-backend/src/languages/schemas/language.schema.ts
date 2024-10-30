import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type LanguageDocument = HydratedDocument<Language>;

@Schema()
export class Language {
    @Prop({ required: true, length: 255 })
    name: string;

    @Prop({ required: true, length: 255 })
    image: string;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
