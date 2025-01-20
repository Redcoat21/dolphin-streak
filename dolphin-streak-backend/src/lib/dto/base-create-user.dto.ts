import {
    IsDate,
    IsDefined,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword,
    IsUrl,
    MaxDate, ValidateIf,
} from "class-validator";
import { Type } from "class-transformer";
import { DateTime } from "luxon";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class BaseCreateUserDto {
    @ApiProperty({
        description: "The user's first name",
        example: "John",
        nullable: false,
        required: true,
    })
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    firstName: string;

    @ApiPropertyOptional({
        description: "The user's last name",
        example: "Doe",
    })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({
        description: "The user's email",
        example: "john@email.com",
        nullable: false,
        required: true,
    })
    @IsNotEmpty()
    @IsDefined()
    @IsEmail()
    email: string;

    @ApiProperty({
        description:
            "The user's password, it should be a strong password, meaning it should contain at least 8 characters, 2 lowercase letters, 2 uppercase letters, 2 numbers, and 2 symbols",
        example: "Password123!@",
        nullable: false,
        required: true,
    })
    @IsNotEmpty()
    @IsDefined()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 2,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 2,
    })
    password: string;

    @ApiProperty({
        description: "The user's profile picture, it should be a valid URL",
        example: "https://example.com/profile-picture.jpg",
        nullable: true,
        required: false,
    })
    @IsOptional()
    @IsUrl()
    profilePicture?: string;

    @ApiProperty({
        description: "The user's lives count",
        example: 3,
        default: 3,
        nullable: false,
        required: false,
    })
    lives: number = 3;
}
