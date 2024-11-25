import { IsMongoId, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateForumDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    title: string;

    @IsMongoId()
    @IsNotEmpty()
    user: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 765)
    content: string;
}
