import { IsEmail, IsOptional, IsString } from 'class-validator';

export class FindUserQuery {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
