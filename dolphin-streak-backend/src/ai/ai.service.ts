import { Injectable } from '@nestjs/common';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';
import { PromptDto } from './dto/prompt-ai.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// @Injectable()
// export class AiService {
//   create(createAiDto: CreateAiDto) {
//     return 'This action adds a new ai';
//   }

//   findAll() {
//     return `This action returns all ai`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} ai`;
//   }

//   update(id: number, updateAiDto: UpdateAiDto) {
//     return `This action updates a #${id} ai`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} ai`;
//   }

//   prompting(PromptDto: PromptDto) {
//     return `${PromptDto}`;
//   }
// }

@Injectable()
export class AiService {
  private readonly geminiApiKey: string;
  private readonly genAI;
  private readonly modelName: string;
  private readonly model;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.geminiApiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(this.geminiApiKey);
    this.modelName = "gemini-1.5-flash";
    this.model = this.genAI.getGenerativeModel({model: this.modelName})
  }

  async fetchGeminiData(promptDto: PromptDto): Promise<any> {
    const { theme, essay } = promptDto;
    let basePrompt  = `Gemini, you are a language professor, you are the one who is going to evaluate an essay from a student. You must analyze the grammar and how the student convey their feeling into word, the theme for the essay is ${theme}.
    
    ${essay}

    try to analyze and give a 100 words suggestions and critics based on the essay above. Add the suggestion and critic how to improved their ability from the essay, add overall score from the essay from 0 to 100.

    Make the result into a JSON format with schema like this schema:
      "{
        "suggestion": {
          "type": "string"
        },
        "score": {
          "type": "integer"
        }
      }"

    put the 100 words suggestions and critics in the suggestion field and the score from 0 to 100 into score field.

    Write the response in english'
    `

    try {
      const result = await this.model.generateContent(basePrompt)
      console.log(result);
      
      const geminiRes = result.response.candidates[0].content.parts[0].text

      const cleanedRes = geminiRes.replace(/```json|```/g, '').trim();

      try {
        // Parse the JSON string into a JavaScript object
        const jsonRes = JSON.parse(cleanedRes);
        return {
          modelName: this.modelName,
          res: jsonRes
        };
      } catch (error) {
        console.error('Error parsing AI response to JSON:', error);
        throw new Error('Invalid JSON format in AI response');
      }
    } catch (error) {
      throw new Error(`Failed to fetch data from ${this.modelName}: ${error.message}`);
    }
  }
}