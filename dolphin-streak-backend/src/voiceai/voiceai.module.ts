import { Module } from '@nestjs/common';
import { VoiceaiService } from './voiceai.service';
import { VoiceaiController } from './voiceai.controller';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [VoiceaiController],
  providers: [VoiceaiService],
})
export class VoiceaiModule {}