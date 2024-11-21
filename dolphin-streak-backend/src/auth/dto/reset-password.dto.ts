import {
    IsDefined,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
} from "class-validator";

export class ResetPasswordDto {
    @IsString()
    encryptedPayload: string;

    @IsString()
    iv: string;

    @IsNotEmpty()
    @IsDefined()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 2,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 2,
    })
    newPassword: string;
}
