import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Language } from "src/languages/schemas/language.schema";
import { Level } from "src/levels/schemas/level.schema";

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
    @Prop({ required: true, maxlength: 255 })
    name: string;

    @Prop({
        required: true,
        default: [],
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Level" }],
    })
    levels: Level[];

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language", // Remove the extra `{ type: ... }` object
    })
    language: Language;

    @Prop({ required: true, maxlength: 255 })
    type: string;

    @Prop({ required: false, maxlength: 255 })
    thumbnail: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
