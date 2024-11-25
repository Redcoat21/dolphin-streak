import { IsEnum, IsMongoId, IsOptional } from "class-validator";
import { FeedbackType } from "../schemas/feedback.schema";
import { Transform } from "class-transformer";

export class FindFeedbacksQuery {
    // Input will be string, convert it into a number first.
    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsEnum(FeedbackType)
    type: FeedbackType;
    
    @IsOptional()
    @IsMongoId()
    user: string;
};