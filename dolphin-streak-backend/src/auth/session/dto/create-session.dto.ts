import {
    IsBoolean,
    IsDate,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { DeviceInfo, Token } from "../schemas/session.schema";
import { Type } from "class-transformer";

class TokenDto {
    @IsString()
    token: string;

    @IsDate()
    expires: Date;
}

class DeviceInfoDto {
    @IsString()
    userAgent: string;

    @IsOptional()
    @IsString()
    browser: string;

    @IsOptional()
    @IsString()
    cpu: string;

    @IsOptional()
    @IsString()
    device: string;

    @IsOptional()
    @IsString()
    engine: string;

    @IsOptional()
    @IsString()
    os: string;

    @IsString()
    ip: string;
}

export class CreateSessionDto {
    @IsMongoId()
    @IsNotEmpty()
    user: string;

    @ValidateNested()
    @Type(() => TokenDto)
    accessToken: Token;

    @ValidateNested()
    @Type(() => TokenDto)
    refreshToken: Token;

    @IsBoolean()
    isActive: boolean;

    @ValidateNested()
    @Type(() => DeviceInfoDto)
    deviceInfo: DeviceInfo;

    @IsDate()
    lastActive: Date;
}
