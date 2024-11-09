import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Language } from "src/languages/schemas/language.schema";
import { Level } from "src/levels/entities/level.entity";

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
    @Prop({ required: true, length: 255 })
    name: string;

    @Prop({
        required: true,
        default: [],
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Level" }],
    })
    levels: Level[];

    @Prop({
        required: true,
        type: { type: mongoose.Schema.Types.ObjectId, ref: "Language" },
    })
    language: Language;

    @Prop({ required: true, length: 255 })
    type: string;

    @Prop({ required: false, length: 255 })
    thumbnail: 255;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
