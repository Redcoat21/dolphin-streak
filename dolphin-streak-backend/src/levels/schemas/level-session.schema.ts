import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Question } from 'src/questions/schemas/question.schema';

export type LevelSessionDocument = HydratedDocument<LevelSession>;

@Schema()
export class LevelSession {
  @Prop({ required: true, maxlength: 255 }) // Replaced length with maxlength
  user: User;

  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
  })
  questions: Question[];

  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
  })
  answeredQuestions: Question[];

  @Prop({ required: true })
  score: number;
}

export const LevelSessionSchema = SchemaFactory.createForClass(LevelSession);
