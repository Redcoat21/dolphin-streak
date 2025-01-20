import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsMongoId, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateForumReplyDto {
    @ApiProperty({
        description: "The email of the user that created the forum",
        example: "john@email",
    })
    @IsEmail()
    @IsNotEmpty()
    user: string;
    // @ApiProperty({
    //     description: "The user that post this reply",
    //     example: "6744262d52a2392a69fa49c3",
    // })
    // @IsMongoId()
    // @IsNotEmpty()
    // user: string;

    @ApiProperty({
        description: "The content of the reply",
        example: "I dont know, git gud",
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 765)
    content: string;
}
