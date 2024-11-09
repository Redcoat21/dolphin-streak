import { IsEnum, IsOptional, IsString } from "class-validator";
import { Provider, Role } from "../schemas/user.schema";
import { BaseCreateUserDto } from "src/lib/dto/base-create-user.dto";

export class CreateUserDto extends BaseCreateUserDto {
    @IsEnum(Provider)
    provider: Provider;

    @IsOptional()
    @IsString()
    sub?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
