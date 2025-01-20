import { IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { CourseType } from "../schemas/course.schema";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class FindAllCoursesQuery {
    @ApiProperty({
        description: "The language of the course to filter with",
        example: "612a4b7e8c4e2c001f1f8c5a",
    })
    @IsOptional()
    @IsMongoId()
    language?: string;

    @ApiProperty({
        description: "The type of the course to filter with",
        example: 0,
        enum: CourseType,
    })
    @Transform(({ value }) => parseInt(value, 10)) // Convert to a number
    @IsEnum(CourseType)
    @IsOptional()
    type?: CourseType;
}
