import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { QuestionsService } from "./questions.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { QueryQuestionDto } from "./dto/query-question.dto";
import { checkIfExist, formatGetAllMessages } from "src/lib/utils/response";

@Controller("api/questions")
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return {
      message: "Question created successfully",
      data: await this.questionsService.create(createQuestionDto),
    };
  }

  @Get()
  async findAll(@Query() query: QueryQuestionDto) {
    const foundedQuestions = await this.questionsService.findAll(query);
    return {
      message: formatGetAllMessages(foundedQuestions.length, "question"),
      data: foundedQuestions,
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return {
      message: "Question found",
      data: checkIfExist(
        await this.questionsService.findOne(id),
        "Question not found",
      ),
    };
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return {
      message: "Question updated successfully",
      data: checkIfExist(
        await this.questionsService.update(id, updateQuestionDto),
        "Question not found",
      ),
    };
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return {
      message: "Question deleted successfully",
      data: checkIfExist(
        await this.questionsService.remove(id),
        "Question not found",
      ),
    };
  }
}
