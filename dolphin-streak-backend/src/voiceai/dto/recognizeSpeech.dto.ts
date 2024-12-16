import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RecognizeSpeechDto {
  /**
   * The uploaded audio file.
   */
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The uploaded audio file (e.g., mp3, wav).',
  })
  file: Express.Multer.File;

  /**
   * The format of the uploaded file (e.g., 'mp3', 'm4a').
   */
  @ApiProperty({
    type: 'string',
    description: 'The format of the uploaded audio file.',
    example: 'mp3',
  })
  @IsString()
  format: string;
}
