import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { FeedbackType } from "../schemas/feedback.schema";

export enum SortType {
    NEWEST = 'newest',
    OLDEST = 'oldest'
}

export class FindFeedbacksUserQuery {
    @ApiProperty({
        description: "Search for feedback content",
        required: false,
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({
        description: "Filter by feedback type",
        required: false,
        enum: [FeedbackType.REPORT, FeedbackType.FEEDBACK, "any"],
    })
    @IsOptional()
    @IsEnum(FeedbackType)
    type?: FeedbackType | "any";

    @ApiProperty({
        description: "Sort by creation date",
        required: false,
        enum: SortType,
    })
    @IsOptional()
    @IsEnum(SortType)
    sort?: SortType;
}
