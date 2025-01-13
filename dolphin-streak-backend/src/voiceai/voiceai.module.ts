import { Module } from '@nestjs/common';
import { VoiceaiService } from './voiceai.service';
import { VoiceaiController } from './voiceai.controller';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';


@Module({
  imports: [
    ConfigModule,
    MulterModule.register(),
  ],
  controllers: [VoiceaiController],
  providers: [VoiceaiService],
})
export class VoiceaiModule {}