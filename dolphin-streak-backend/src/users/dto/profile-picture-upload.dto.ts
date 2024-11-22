import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ProfilePictureUploadDto {
    @ApiProperty({
        description: "The user's profile picture",
        type: "string",
        format: "binary",
        required: true,
    })
    @IsNotEmpty()
    profilePicture: Express.Multer.File;
}
