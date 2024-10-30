import {
    IsDate,
    IsDefined,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword,
    IsUrl,
    MaxDate,
} from "class-validator";
import { Provider, Role } from "../schemas/user.schema";
import { Type } from "class-transformer";
import { DateTime } from "luxon";

export class CreateUserDto {
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

    @IsEnum(Provider)
    provider: string;

    @IsOptional()
    @IsString()
    sub?: string;

    @IsUrl()
    profilePicture: string;

    @IsOptional()
    @IsEnum(Role)
    role?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @MaxDate(() => DateTime.now().minus({ year: 5 }).toJSDate())
    birthDate?: Date;
}
