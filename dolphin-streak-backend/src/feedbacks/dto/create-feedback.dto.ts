import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { FeedbackType } from "../schemas/feedback.schema";

export class CreateFeedbackDto {
    @IsMongoId()
    @IsNotEmpty()
    user: string;
    
    @IsEnum(FeedbackType)
    @IsNotEmpty()
    type: FeedbackType;
    
    @IsString()
    @IsNotEmpty()
    content: string;
}
