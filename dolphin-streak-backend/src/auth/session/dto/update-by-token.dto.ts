import { PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class UpdateUserByTokenDto extends PartialType(CreateUserDto) {
    @IsString()
    accessToken: string;
}
