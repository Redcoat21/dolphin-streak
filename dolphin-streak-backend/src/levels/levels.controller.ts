import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { LevelsService } from "./levels.service";
import { CreateLevelDto } from "./dto/create-level.dto";
import { UpdateLevelDto } from "./dto/update-level.dto";
import { FindAllLevelsQuery } from "./dto/find-all-query.dto";
import { FindByIdParam } from "src/lib/dto/find-by-id-param.dto";
import { RoleGuard } from "src/lib/guard/role.guard";
import { checkIfExist, formatGetAllMessages } from "src/lib/utils/response";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { HasRoles } from "src/lib/decorators/has-role.decorator";
import { Role } from "src/users/schemas/user.schema";
import { BearerTokenGuard } from "src/auth/guard/bearer-token.guard";
import { DateTime } from 'luxon';
import { Request } from '@nestjs/common'
import { Request as ExpressRequest } from "express";

@Controller("/api/levels")
@UseGuards(BearerTokenGuard, RoleGuard)
@HasRoles(Role.ADMIN)
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
@ApiBearerAuth()
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new level",
    description: "Create a new level with the data provided in the body",
  })
  @ApiCreatedResponse({
    description: "The level has been successfully created.",
    example: {
      message: "Level created successfully",
      data: {
        name: "Level 3",
        language: "6732299a3b7d4ef48a34278c",
        _id: "673229a43b7d4ef48a34278e",
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Happen when the request body is not valid",
    example: {
      messages: [
        "name must be a string",
        "language must be a mongodb id",
      ],
      data: null,
    },
  })
  async create(@Body() createLevelDto: CreateLevelDto) {
    return {
      messages: "Level created successfully",
      data: await this.levelsService.create(createLevelDto),
    };
  }

  @ApiOperation({
    summary: "Get all levels",
    description: "Get all levels with the option to filter by language",
  })
  @ApiOkResponse({
    description: "Levels found",
    example: {
      messages: "2 levels found",
      data: [
        {
          _id: "671afc7bc0a7ef4e76079383",
          name: "Level 1",
          language: null,
          __v: 0,
        },
        {
          _id: "673229813b7d4ef48a342788",
          name: "Level 2",
          language: null,
          __v: 0,
        },
      ],
    },
  })
  @Get()
  @HasRoles(Role.ADMIN, Role.USER)
  async findAll(@Query() query: FindAllLevelsQuery) {
    const foundedLevels = await this.levelsService.findAll(
      query.language ? { language: query.language } : undefined,
    )
      .populate(
        "language",
      );

    return {
      messages: formatGetAllMessages(foundedLevels.length, "level"),
      data: foundedLevels,
    };
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get a level by id",
    description: "Get a level by the id provided in the parameter along with its questions",
  })
  @ApiBadRequestResponse({
    description: "Happen when the id parameter is not a valid mongodb id",
    example: {
      messages: [
        "id must be a mongodb id",
      ],
      data: null,
    },

  })
  @ApiOkResponse({
    description: "Level and related questions retrieved successfully",
    example: {
      messages: "Level and questions retrieved successfully",
      data: {
        level: {
          _id: "671afc7bc0a7ef4e76079383",
          name: "Level 1",
          // other level fields...
        },
        questions: [
          {
            _id: "67361a7345664a2c0ba35041",
            type: 0,
            // other question fields...
          },
          // more questions...
        ],
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Happen when the level is not found",
    example: {
      messages: "Level not found",
      data: null,
    },
  })
  @HasRoles(Role.USER, Role.ADMIN)
  async findOne(@Param() findByIdParam: FindByIdParam) {
    const foundedLevel = checkIfExist(
      await this.levelsService.findOneLevelsAndGetQuestions(findByIdParam.id),
      "Level not found",
    );

    return { messages: "Level founded", data: foundedLevel };
  }

  @ApiOperation({
    summary: "Update a level",
    description: "Update a level with the data provided in the body",
  })
  @ApiOkResponse({
    description: "Level updated successfully",
    example: {
      messages: "Level updated successfully",
      data: {
        _id: "671afc7bc0a7ef4e76079383",
        name: "Level 1",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Happen when the id parameter is not a valid mongodb id",
    example: {
      messages: [
        "id must be a mongodb id",
      ],
    },
  })
  @ApiNotFoundResponse({
    description: "Happen when the level is not found",
    example: {
      messages: "Level not found",
      data: null,
    },
  })
  @Patch(":id")
  async update(
    @Param() findByIdParam: FindByIdParam,
    @Body() updateLevelDto: UpdateLevelDto,
  ) {
    const updatedLevel = checkIfExist(
      await this.levelsService.update(
        findByIdParam.id,
        updateLevelDto,
      ),
      "Level not found",
    );

    return { messages: "Level updated successfully", data: updatedLevel };
  }

  @ApiOperation({
    summary: "Delete a level",
    description: "Delete a level by the id provided in the parameter",
  })
  @ApiOkResponse({
    description: "Level deleted successfully",
    example: {
      messages: "Level deleted successfully",
      data: {
        _id: "671afc7bc0a7ef4e76079383",
        name: "Level 1",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Happen when the id parameter is not a valid mongodb id",
    example: {
      messages: [
        "id must be a mongodb id",
      ],
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description: "Happen when the level is not found",
    example: {
      messages: "Level not found",
      data: null,
    },
  })
  @Delete(":id")
  async remove(@Param() findByIdParam: FindByIdParam) {
    const deletedLevel = checkIfExist(
      await this.levelsService.remove(findByIdParam.id),
      "Level not found",
    );

    return { messages: "Level deleted successfully", data: deletedLevel };
  }


  @Post(":id/start-session")
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenGuard, RoleGuard)
  @HasRoles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: "Start a question session for a specific level" })
  @ApiOkResponse({
    description: "Session started successfully",
    schema: {
      example: {
        messages: "Session started",
        data: {
          sessionId: "session-1691138855",
          expiresAt: "2024-11-25T15:47:01.890Z",
          totalQuestions: 10, // Added totalQuestions to the response
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized",
    schema: { example: { messages: "Unauthorized", data: null } }
  })
  @ApiBearerAuth()
  async startQuestionSession(
    @Param("id") levelId: string,
    @Request() request: ExpressRequest,
  ) {
    const userId = request.user._id.toString();
    const questions = await this.levelsService.findQuestionsForLevel(levelId);
    const totalQuestions = questions.length; // Calculate total questions

    const sessionId = `session-${Date.now()}`;
    const expiresAt = DateTime.now().plus({ minutes: 30 }).toJSDate();

    this.levelsService.addSession({
      sessionId,
      userId,
      levelId,
      questions,
      expiresAt,
    });

    return {
      messages: "Session started",
      data: {
        sessionId,
        expiresAt,
        totalQuestions, // Include totalQuestions in the response
      },
    };
  }

  @Get(":id/question/:questionIndex")
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenGuard, RoleGuard)
  @HasRoles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: "Get a question by index and session ID" })
  @ApiOkResponse({
    description: "Question retrieved successfully",
    schema: {
      example: {
        messages: "Question retrieved",
        data: {
          question: {
            _id: "question-123",
            text: "What is the capital of France?",
            type: "MULTIPLE_CHOICE",
            answerOptions: ["Paris", "London", "Berlin", "Madrid"],
            correctAnswer: "Paris",
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Question not found",
    schema: { example: { messages: "Question not found", data: null } },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized",
    schema: { example: { messages: "Unauthorized", data: null } },
  })
  @ApiBearerAuth()
  async getQuestionById(
    @Param("id") levelId: string,
    @Param("questionIndex") questionIndex: number,
    @Query("sessionId") sessionId: string,
    @Request() request: ExpressRequest,
  ) {
    console.log({ levelId, questionIndex, sessionId });
    const userId = request.user._id.toString();
    const session = this.levelsService.getSession(sessionId);
    if (!session || session.userId !== userId || session.levelId !== levelId) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    const question = session.questions[questionIndex];
    console.log({ question })
    if (!question) {
      throw new HttpException("Question not found", HttpStatus.NOT_FOUND);
    }

    return {
      messages: "Question retrieved",
      data: { question },
    };
  }
  
  @Post(":id/question/:questionIndex/submit")
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenGuard, RoleGuard)
  @HasRoles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Submit an answer for a question' })
  async submitAnswer(
    @Param("id") levelId: string,
    @Param("questionIndex") questionIndex: number,
    @Query("sessionId") sessionId: string,
    @Body("answer") answer: string,
    @Request() request: ExpressRequest,
  ) {
    const userId = request.user._id.toString();
    const session = this.levelsService.getSession(sessionId);

    if (!session || session.userId !== userId || session.levelId !== levelId) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    // Call levelsService.submitAnswer and receive the results
    const submissionResult = this.levelsService.submitAnswer(
      sessionId,
      parseInt(questionIndex.toString()),
      answer
    );
    
    // Check if result is defined, otherwise throw error
    if (!submissionResult) {
      throw new HttpException("Error submitting answer", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    // Destructure the returned object
    const { isCorrect, score, totalScore } = submissionResult;


    return {
      messages: "Answer submitted",
      data: {
        isCorrect,
        score,
        totalScore,
      },
    };
  }

  @Post("next-question")
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenGuard, RoleGuard)
  @HasRoles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Get the next question in a session' })
  async getNextQuestion(
    @Query("sessionId") sessionId: string,
    @Body("currentQuestionIndex") currentQuestionIndex: number,
    @Request() request: ExpressRequest,
  ) {
    const userId = request.user._id.toString();
    const session = this.levelsService.getSession(sessionId);

    if (!session || session.userId !== userId) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    const { nextQuestionIndex, nextQuestion } = this.levelsService.getNextQuestion(
      sessionId,
      currentQuestionIndex
    );

    return {
      messages: "Next question retrieved",
      data: { nextQuestionIndex, nextQuestion },
    };
  }
}
