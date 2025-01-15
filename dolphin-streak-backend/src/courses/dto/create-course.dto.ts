import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { CourseType } from '../schemas/course.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    description: 'The name of the course',
    example: 'Shakespearean English',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'The levels of this course',
    example: ['612a4b7e8c4e2c001f1f8c5a', '612a4b7e8c4e2c001f1f8c5b'],
  })
  @IsOptional()
  @IsMongoId({ each: true })
  levels?: string[];

  @ApiProperty({
    description: 'Which language this course is for',
    example: '612a4b7e8c4e2c001f1f8c5a',
  })
  @IsMongoId()
  language: string;

  @ApiProperty({
    description: 'The type of this course',
    example: 0,
    enum: CourseType,
  })
  @IsEnum(CourseType)
  type: CourseType;
}
