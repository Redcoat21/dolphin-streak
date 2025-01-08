import { Controller, Post, Body, BadRequestException, UseInterceptors, UploadedFile, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { VoiceaiService } from './voiceai.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecognizeSpeechDto } from './dto/recognizeSpeech.dto';
import { ApiBadRequestResponse, ApiConsumes, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { BearerTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { RoleGuard } from 'src/lib/guard/role.guard';
import { Role } from 'src/users/schemas/user.schema';
import { HasRoles } from 'src/lib/decorators/has-role.decorator';

@Controller('/api/voiceai')
@UseGuards(BearerTokenGuard, RoleGuard) // TODO: pastiin ini jalan
@HasRoles(Role.USER, Role.ADMIN) // TODO: pastiin ini jalan
@ApiUnauthorizedResponse({
  description:
    "Happen because the user is not authorized (doesn't have a valid access token)",
  example: {
    message: "Unauthorized",
    data: null,
  },
})
@ApiForbiddenResponse({
  description:
    "Happen because the user doesn't have the right role to access this endpoint",
  example: {
    message: "Forbidden resource",
    data: null,
  },
})
@ApiInternalServerErrorResponse({
  description:
    "Happen when something went wrong, that is not handled by this API, e.g. database error",
  example: {
    message: "Internal Server Error",
    data: null,
  },
})
export class VoiceaiController {
  constructor(private readonly voiceaiService: VoiceaiService) {}

  @Post('transcribe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Request transcript from user's voice",
    description: "Requesting a response to transcript user's voice to get what they say using google STT",
  })
  // fix this later forget the result
  @ApiOkResponse({
    description: "The response was successfully transcripted and returned",
    example: {
      "messages": "Audio file successfully transripted",
      "data": {
        "transcript": "hi everyone good morning",
        "confidence": 0.9439936280250549
      }
    }
  })
  @ApiUnprocessableEntityResponse({
    description: "Not enough conversion minutes from convertio.co",
    example: {
      "messages": "No convertion minutes left. Wait for tomorrow for new convertion minutes",
      "data": null
    }
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. missing required fields",
    example: {
      "messages": [
        "Audio file is required.",
        "Multipart: Unexpected end of form",
        "format must be a string"
      ],
      "data": null
    }
  })
  // @UseGuards(BearerTokenGuard, RoleGuard)
  // @HasRoles(Role.USER, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async recognize(
    @Body() RecognizeSpeechDto: RecognizeSpeechDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const { format } = RecognizeSpeechDto; 
    console.log({ format, file });
    if (!file) {
      throw new BadRequestException('Audio file is required.');
    }
    console.log("di voice ai");

    const data = await this.voiceaiService.recognizeSpeech(file.buffer, format);

    return {
      messages: "Audio file successfully transripted",
      data
    }
  }
}
