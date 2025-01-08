import { Module } from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CoursesController } from "./courses.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { CourseSchema } from "./schemas/course.schema";
import { CourseSessionSchema } from "./schemas/course-session.schema";
import { QuestionsModule } from "src/questions/questions.module";
import { ConfigModule } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Course", schema: CourseSchema }]),
    MongooseModule.forFeature([{
      name: "CourseSession",
      schema: CourseSessionSchema,
    }]),
    QuestionsModule,
    ConfigModule,
    MulterModule.register(),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
