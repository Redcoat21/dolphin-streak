import { IsEnum, IsMongoId, IsOptional } from "class-validator";
import { FeedbackType } from "../schemas/feedback.schema";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class FindFeedbacksQuery {
    // Input will be string, convert it into a number first.
    @ApiProperty({
        description: "The type of feedback",
        example: 0,
        enum: FeedbackType,
    })
    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsEnum(FeedbackType)
    type: FeedbackType;
    
    @ApiProperty({
        description: "The user who created thefeedback",
        example: "612a4b7e8c4e2c001f1f8c5a",
    })
    @IsOptional()
    @IsMongoId()
    user: string;
};