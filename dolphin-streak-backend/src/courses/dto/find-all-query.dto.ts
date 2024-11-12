import { IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { CourseType } from "../schemas/course.schema";

export class FindAllCourseQuery {
    @IsOptional()
    @IsMongoId()
    language?: string;

    @IsOptional()
    @IsEnum(CourseType)
    type?: CourseType;
}
