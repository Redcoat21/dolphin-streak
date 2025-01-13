import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/users/schemas/user.schema";
import { Question } from "src/questions/schemas/question.schema";
import { Course } from "./course.schema";

export type CourseSessionDocument = HydratedDocument<CourseSession>;

@Schema()
export class CourseSession {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" }) // Replaced length with maxlength
  user: User;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Course" })
  course: Course;

  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  })
  questions: Question[];

  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    default: [],
  })
  answeredQuestions: Question[];

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  expiresAt: Date;
}

export const CourseSessionSchema = SchemaFactory.createForClass(CourseSession);
