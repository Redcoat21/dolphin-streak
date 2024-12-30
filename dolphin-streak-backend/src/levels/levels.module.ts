import { Module } from "@nestjs/common";
import { LevelsService } from "./levels.service";
import { QuestionsService } from "../questions/questions.service";
import { QuestionSchema } from "../questions/schemas/question.schema";
import { LevelsController } from "./levels.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { LevelSchema } from "./schemas/level.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Level", schema: LevelSchema }]),
    MongooseModule.forFeature([{ name: "Question", schema: QuestionSchema }]), 
  ],
  controllers: [LevelsController],
  providers: [LevelsService, QuestionsService], 
})
export class LevelsModule {}
