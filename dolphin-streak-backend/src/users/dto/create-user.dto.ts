import { IsEnum, IsOptional, IsString } from "class-validator";
import { Provider, Role } from "../schemas/user.schema";
import { BaseCreateUserDto } from "src/lib/dto/base-create-user.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto extends BaseCreateUserDto {
    @ApiProperty({
        description:
            "The role of the user. Can be either USER or ADMIN. If left empty, the default role will be USER",
        enum: Role,
        example: Role.USER,
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
