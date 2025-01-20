import { Module } from '@nestjs/common';
import { DailyController } from './daily.controller';
import { DailyService } from './daily.service';
import { CoursesModule } from 'src/courses/courses.module';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
    imports: [CoursesModule, QuestionsModule],
    controllers: [DailyController],
    providers: [DailyService],
})
export class DailyModule { }