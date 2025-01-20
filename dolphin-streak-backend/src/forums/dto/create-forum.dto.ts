import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsMongoId, IsNotEmpty, IsString, Length } from "class-validator";


export class CreateForumDto {
    @ApiProperty({
        description: "The title of the forum",
        example: "This is a title",
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    title: string;

    // @ApiProperty({
    //     description: "The user that created the forum",
    //     example: "6744262d52a2392a69fa49c3",
    // })
    // @IsMongoId()
    // @IsNotEmpty()
    // user: string;
    @ApiProperty({
        description: "The email of the user that created the forum",
        example: "john@email",
    })
    @IsEmail()
    @IsNotEmpty()
    user: string;

    @ApiProperty({
        description: "The content of the forum",
        example: "This is a content",
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 765)
    content: string;
}
