import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty({
    description: 'The name of the language.',
    example: 'English',
  })
  @IsString()
  name: string;
}
