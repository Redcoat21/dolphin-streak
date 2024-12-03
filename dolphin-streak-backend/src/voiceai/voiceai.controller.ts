import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { VoiceaiService } from './voiceai.service';
import { CreateVoiceaiDto } from './dto/create-voiceai.dto';
import { UpdateVoiceaiDto } from './dto/update-voiceai.dto';

// @Controller('voiceai')
// export class VoiceaiController {
//   constructor(private readonly voiceaiService: VoiceaiService) {}

//   @Post()
//   create(@Body() createVoiceaiDto: CreateVoiceaiDto) {
//     return this.voiceaiService.create(createVoiceaiDto);
//   }

//   @Get()
//   findAll() {
//     return this.voiceaiService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.voiceaiService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateVoiceaiDto: UpdateVoiceaiDto) {
//     return this.voiceaiService.update(+id, updateVoiceaiDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.voiceaiService.remove(+id);
//   }
// }

@Controller('/api/voiceai')
export class VoiceaiController {
  constructor(private readonly voiceaiService: VoiceaiService) {}

  /**
   * Endpoint to recognize speech from an audio file.
   * @param {string} audioFilePath - Path to the audio file for speech-to-text conversion.
   * @returns {Promise<any>} Transcription result from the audio file.
   */
  @Post('transcribe')
  async recognize(@Query('audioFilePath') audioFilePath: string): Promise<any> {
    if (!audioFilePath) {
      throw new BadRequestException('The "audioFilePath" query parameter is required.');
    }

    return this.voiceaiService.recognizeSpeech(audioFilePath);
  }
}
