import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Course } from "src/courses/entities/course.entity";
import { QuestionDetail } from "src/lib/types/question.type";

export enum QuestionType {
    MULTIPLE_CHOICE = "MultipleChoice",
    ESSAY = "Essay",
    FILL_IN = "FillIn",
    VOICE = "Voice",
    WRITING = "Writing",
}

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
    @Prop(raw({
        type: { type: String, length: 50 },
        text: { type: String, length: 500 },
        voice: { type: Object },
    }))
    question: QuestionDetail;

    @Prop({
        required: true,
        enum: QuestionType,
    })
    type: QuestionType;

    @Prop({ required: true, type: [String] })
    answerOptions: string[];

    @Prop({ required: true, type: [String, Number] })
    correctAnswer: number | string;

    @Prop({ required: true })
    useAi: boolean;

    @Prop({
        required: true,
        default: [],
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    })
    courses: Course[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
