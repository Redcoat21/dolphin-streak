import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { FeedbackType } from "../schemas/feedback.schema";
import { ApiProcessingResponse, ApiProperty } from "@nestjs/swagger";

export class CreateFeedbackDto {
    // @ApiProperty({
    //     description: "The user who created this feedback",
    //     example: "612a4b7e8c4e2c001f1f8c5a",
    // })
    // @IsMongoId()
    // @IsNotEmpty()
    // user: string;
    
    @ApiProperty({
        description: "The type of this feedback",
        example: 0,
        enum: FeedbackType,
    })
    @IsEnum(FeedbackType)
    @IsNotEmpty()
    type: FeedbackType;
    
    @ApiProperty({
        description: "The content of this feedback",
        example: "Test",
    })
    @IsString()
    @IsNotEmpty()
    content: string;
}
