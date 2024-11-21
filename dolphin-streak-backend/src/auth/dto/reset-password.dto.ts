import { ApiProperty } from "@nestjs/swagger";
import {
    IsDefined,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
} from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({
        description:
            "Encrypted payload gotten from the email. Its should be a base64url encoded string.",
        example:
            "TIKVjZk7_JapQSeIYRx33nKFM5tK3RcTMXzfT4Hv21GYWBySjTbZD66708Z3UMiL17N7pazIF09bKv0cNy53gaA04k99vfqCMqdPHonZTsydU8gkY3s8HVDKXgLCnjvd",
    })
    @IsString()
    encryptedPayload: string;

    @ApiProperty({
        description:
            "Initialization vector gotten from the email. Its should be a base64url encoded string.",
        example: "nCTnlog7cBC07qLkm1n3Zg",
    })
    @IsString()
    iv: string;

    @ApiProperty({
        description:
            "New password for the user. It's should be a strong password.",
        example: "PassWord123!@",
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
    newPassword: string;
}
