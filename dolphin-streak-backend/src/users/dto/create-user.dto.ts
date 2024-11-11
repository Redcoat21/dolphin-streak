import { IsEnum, IsOptional } from "class-validator";
import { Role } from "../schemas/user.schema";
import { BaseCreateUserDto } from "src/lib/dto/base-create-user.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto extends BaseCreateUserDto {
    @ApiPropertyOptional({
        description:
            "The role of the user. Can be either USER or ADMIN. If left empty, the default role will be USER",
        enum: Role,
        example: Role.USER,
    })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
