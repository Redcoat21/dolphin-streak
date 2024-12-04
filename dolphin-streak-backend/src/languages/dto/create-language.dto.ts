import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty({
    description: 'The name of the language.',
    example: 'English',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description:
      'The URL of an image representing the language. Image can be uploaded through URL or through PATCH :id/thumbnail',
    example:
      'https://cdn.countryflags.com/thumbs/united-states-of-america/flag-3d-round-250.png',
  })
  @IsUrl()
  image: string;
}
