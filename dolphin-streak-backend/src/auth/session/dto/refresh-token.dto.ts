import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshTokenDto {
    @ApiProperty({
        description: "The refresh token",
        example:
            "943b3f3f2cd8bb8f1dd174a57d02f322cf66fd42e39897171981006ee7d2d657dd25028c70ad12f3df7d844a0877414c605c5ffaa759bb253734d3c96fadf965",
    })
    @IsString()
    refreshToken: string;
}
