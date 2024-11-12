import {
    IsEnum,
    IsMongoId,
    IsOptional,
    IsString,
    IsUrl,
} from "class-validator";
import { CourseType } from "../schemas/course.schema";

export class CreateCourseDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsMongoId({ each: true })
    levels?: string[];

    @IsMongoId()
    language: string;

    @IsEnum(CourseType)
    type: CourseType;

    @IsUrl()
    thumbnail: string;
}
