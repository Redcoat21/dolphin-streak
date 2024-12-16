import { Test, TestingModule } from '@nestjs/testing';
import { VoiceaiController } from './voiceai.controller';
import { VoiceaiService } from './voiceai.service';

describe('VoiceaiController', () => {
  let controller: VoiceaiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoiceaiController],
      providers: [VoiceaiService],
    }).compile();

    controller = module.get<VoiceaiController>(VoiceaiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
