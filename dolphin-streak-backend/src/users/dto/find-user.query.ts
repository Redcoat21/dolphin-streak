import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { Provider } from "../schemas/user.schema";
import { ApiProperty } from "@nestjs/swagger";

export class FindUserQuery {
  @ApiProperty({
    description: "The users's first name",
    required: false,
    nullable: true,
    example: "John",
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: "The users's last name",
    required: false,
    nullable: true,
    example: "Doe",
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: "The users's provider",
    required: false,
    nullable: true,
    example: Provider.LOCAL,
  })
  @IsOptional()
  @IsEnum(Provider)
  provider?: Provider;
}
