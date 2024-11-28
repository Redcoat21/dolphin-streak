import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
