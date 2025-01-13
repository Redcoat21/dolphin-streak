import { Module } from '@nestjs/common';
import { ComprehensionController } from './comprehension.controller';
import { ComprehensionService } from './comprehension.service';
import { CoursesModule } from 'src/courses/courses.module';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
    imports: [CoursesModule, QuestionsModule],
    controllers: [ComprehensionController],
    providers: [ComprehensionService],
})
export class ComprehensionModule { }