import { PartialType } from '@nestjs/swagger';
import { CreateVoiceaiDto } from './create-voiceai.dto';

export class UpdateVoiceaiDto extends PartialType(CreateVoiceaiDto) {}
