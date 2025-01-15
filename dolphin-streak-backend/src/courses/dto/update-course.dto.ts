import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import { IsUrl } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @ApiProperty({
    description: 'The thumbnail image for this course',
    example: 'https://example.jpg',
  })
  @IsUrl()
  thumbnail: string;
}
