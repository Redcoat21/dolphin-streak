import { Controller, Post, Body, BadRequestException, UseInterceptors, UploadedFile, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { VoiceaiService } from './voiceai.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecognizeSpeechDto } from './dto/recognizeSpeech.dto';
import { ApiConsumes, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { BearerTokenGuard } from 'src/auth/guard/bearer-token.guard';

@Controller('/api/voiceai')
export class VoiceaiController {
  constructor(private readonly voiceaiService: VoiceaiService) {}

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data') 
  async recognize(
    @Body() RecognizeSpeechDto: RecognizeSpeechDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const { format } = RecognizeSpeechDto;

    if (!file) {
      throw new BadRequestException('Audio file is required.');
    }

    return this.voiceaiService.recognizeSpeech(file.buffer, format);
  }
}
