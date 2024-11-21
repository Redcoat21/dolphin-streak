import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty({
        description: "User's email",
        example: "john@email.com",
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
