import { IsMongoId, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateForumReplyDto {
    @IsMongoId()
    @IsNotEmpty()
    user: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 765)
    content: string;
}
