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
  UseGuards,
} from "@nestjs/common";
import { QuestionsService } from "./questions.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { QueryQuestionDto } from "./dto/query-question.dto";
import { checkIfExist, formatGetAllMessages } from "src/lib/utils/response";
import { RoleGuard } from "src/lib/guard/role.guard";
import { HasRoles } from "src/lib/decorators/has-role.decorator";
import { Role } from "src/users/schemas/user.schema";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { BearerTokenGuard } from "src/auth/guard/bearer-token.guard";

@Controller("api/questions")
@UseGuards(BearerTokenGuard, RoleGuard)
@HasRoles(Role.ADMIN)
@ApiUnauthorizedResponse({
  description:
    "Happen because the user is not authorized (doesn't have a valid access token)",
  example: {
    messages: "Unauthorized",
    data: null,
  },
})
@ApiForbiddenResponse({
  description:
    "Happen because the user doesn't have the right role to access this endpoint",
  example: {
    messages: "Forbidden resource",
    data: null,
  },
})
@ApiInternalServerErrorResponse({
  description:
    "Happen when something went wrong, that is not handled by this API, e.g. database error",
  example: {
    messages: "Internal Server Error",
    data: null,
  },
})
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new question",
    description: "Create a new question with the provided data.",
  })
  @ApiCreatedResponse({
    description: "The question has been successfully created.",
    example: {
      messages: "Question created successfully",
      data: {
        type: 0,
        answerOptions: [
          "Germany",
          "Deutschland",
          "Dokuritsu",
          "Russia With Love",
        ],
        correctAnswer: [
          "1",
        ],
        useAi: false,
        courses: [],
        _id: "67361b1b46e9744a73e38da6",
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. missing required fields",
    example: {
      messagess: [
        "type should not be empty",
        "type must be one of the following values: 0, 1, 2, 3, 4",
        "answerOptions should not be empty",
        "answerOptions must be an array",
        "Correct answer must be a string for this question type",
        "correctAnswer should not be empty",
        "useAi should not be empty",
        "useAi must be a boolean value",
        "each value in courses must be a mongodb id",
        "courses must be an array",
      ],
      data: null,
    },
  })
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return {
      messages: "Question created successfully",
      data: await this.questionsService.create(createQuestionDto),
    };
  }

  @Get()
  @ApiOperation({
    summary: "Find all questions",
    description: "Find all questions that match the given filter.",
  })
  @ApiOkResponse({
    description: "The questions have been successfully retrieved.",
    example: {
      "messages": "3 questions found",
      "data": [
        {
          _id: "67361a7345664a2c0ba35041",
          type: 0,
          answerOptions: [
            "Germany",
            "Deutschland",
            "Dokuritsu",
            "Russia With Love",
          ],
          correctAnswer: [
            "1",
          ],
          useAi: false,
          courses: [],
          __v: 0,
        },
        {
          _id: "67361b0ecb06bc00cc5cf457",
          type: 0,
          answerOptions: [
            "Germany",
            "Deutschland",
            "Dokuritsu",
            "Russia With Love",
          ],
          correctAnswer: [
            "1",
          ],
          useAi: false,
          courses: [],
          __v: 0,
        },
        {
          _id: "67361b1b46e9744a73e38da6",
          type: 0,
          answerOptions: [
            "Germany",
            "Deutschland",
            "Dokuritsu",
            "Russia With Love",
          ],
          correctAnswer: [
            "1",
          ],
          useAi: false,
          courses: [],
          __v: 0,
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. invalid query parameters",
    example: {
      messagess: ["course must be a mongodb id"],
      data: null,
    },
  })
  async findAll(@Query() query: QueryQuestionDto) {
    const foundedQuestions = await this.questionsService.findAll(query);
    return {
      messages: formatGetAllMessages(foundedQuestions.length, "question"),
      data: foundedQuestions,
    };
  }

  @Get(":id")
  @ApiOperation({
    summary: "Find a question by its ID",
    description: "Find a question by its ID.",
  })
  @ApiOkResponse({
    description: "The question has been successfully retrieved.",
    example: {
      messages: "Question found",
      data: {
        _id: "67361a7345664a2c0ba35041",
        type: 0,
        answerOptions: [
          "Germany",
          "Deutschland",
          "Dokuritsu",
          "Russia With Love",
        ],
        correctAnswer: [
          "1",
        ],
        useAi: false,
        courses: [],
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. invalid course ID",
    example: {
      messagess: "Question not found",
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description: "Question not found",
    example: {
      messagess: "Question not found",
      data: null,
    },
  })
  async findOne(@Param("id") id: string) {
    return {
      messages: "Question found",
      data: checkIfExist(
        await this.questionsService.findOne(id),
        "Question not found",
      ),
    };
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update a question by its ID",
    description: "Update a question by its ID with the provided data.",
  })
  @ApiOkResponse({
    description: "The question has been successfully updated.",
    example: {
      messages: "Question updated successfully",
      data: {
        type: 0,
        answerOptions: [
          "France",
          "Frankreich",
          "Dokuritsu",
          "Russia With Love",
        ],
        correctAnswer: [
          "1",
        ],
        useAi: false,
        courses: [],
        _id: "67361b1b46e9744a73e38da6",
        __v: 0,
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Question not found",
    example: {
      messages: "Question not found",
      data: null,
    },
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. invalid course ID",
    example: {
      messages: [
        "id must be a valid mongodb id",
      ],
    },
  })
  async update(
    @Param("id") id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return {
      messages: "Question updated successfully",
      data: checkIfExist(
        await this.questionsService.update(id, updateQuestionDto),
        "Question not found",
      ),
    };
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete a question by its ID",
    description: "Delete a question by its ID.",
  })
  @ApiOkResponse({
    description:
      "The question has been successfully deleted, it will return the deleted question.",
    example: {
      messages: "Question deleted successfully",
      data: {
        type: 0,
        answerOptions: [
          "France",
          "Frankreich",
          "Dokuritsu",
          "Russia With Love",
        ],
        correctAnswer: [
          "1",
        ],
        useAi: false,
        courses: [],
        _id: "67361b1b46e9744a73e38da6",
        __v: 0,
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Question not found",
    example: {
      messages: "Question not found",
      data: null,
    },
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. invalid course ID",
    example: {
      messages: [
        "id must be a valid mongodb id",
      ],
    },
  })
  async remove(@Param("id") id: string) {
    return {
      messages: "Question deleted successfully",
      data: checkIfExist(
        await this.questionsService.remove(id),
        "Question not found",
      ),
    };
  }
}
