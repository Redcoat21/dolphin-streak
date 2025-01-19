import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Course } from "src/courses/schemas/course.schema";
import { Level } from "src/levels/schemas/level.schema";
import { QuestionDetail } from "src/lib/types/question.type";

export enum QuestionType {
  MULTIPLE_CHOICEz,
  ESSAY,
  FILL_IN,
  VOICE,
  WRITING,
}

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
  @Prop(raw({
    type: { type: String, maxlength: 50 },
    text: { type: String, maxlength: 500 },
    voice: { type: String, maxlength: 500 },
  }))
  question: QuestionDetail;

  @Prop({ required: true, enum: QuestionType })
  type: QuestionType;

  @Prop({ required: false, type: [String] })
  answerOptions: string[];

  @Prop({ required: false, type: [String, Number] })
  correctAnswer?: number | string;

  @Prop({ required: true })
  useAi: boolean;

  @Prop({
    required: true,
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  })
  courses: Course[];

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Level",
  })
  level: Level;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);