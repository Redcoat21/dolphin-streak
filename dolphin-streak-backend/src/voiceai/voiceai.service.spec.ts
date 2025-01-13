import { Test, TestingModule } from '@nestjs/testing';
import { VoiceaiService } from './voiceai.service';

describe('VoiceaiService', () => {
  let service: VoiceaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoiceaiService],
    }).compile();

    service = module.get<VoiceaiService>(VoiceaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
