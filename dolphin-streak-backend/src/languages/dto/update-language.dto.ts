import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLanguageDto } from './create-language.dto';
import { IsUrl } from 'class-validator';

export class UpdateLanguageDto extends PartialType(CreateLanguageDto) {}
