import {
    IsDate,
    IsDefined,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword,
    IsUrl,
    MaxDate,
} from "class-validator";
import { Type } from "class-transformer";
import { DateTime } from "luxon";

export class BaseCreateUserDto {
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsNotEmpty()
    @IsDefined()
    @IsEmail()
    email: string;

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

    @IsUrl()
    profilePicture: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @MaxDate(() => DateTime.now().minus({ year: 5 }).toJSDate())
    birthDate?: Date;
}
