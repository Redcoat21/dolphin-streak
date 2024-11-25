import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';
import { PromptDto } from './dto/prompt-ai.dto';

@Controller('/api/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  async getGeminiData(@Body() promptDto: PromptDto) {
    // Pass the DTO to the service
    const {modelName, res} = await this.aiService.fetchGeminiData(promptDto);

    return {
      message: `Data fetched successfully from ${modelName}`,
      res,
    };
  }
}