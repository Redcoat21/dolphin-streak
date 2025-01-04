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
  Req,
  UseGuards,
} from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { checkIfExist, formatGetAllMessages } from "src/lib/utils/response";
import { FindByIdParam } from "src/lib/dto/find-by-id-param.dto";
import { FilterQuery, Types } from "mongoose";
import { Course } from "./schemas/course.schema";
import { FindAllCoursesQuery } from "./dto/find-all-query.dto";
import { RoleGuard } from "src/lib/guard/role.guard";
import { HasRoles } from "src/lib/decorators/has-role.decorator";
import { Role } from "src/users/schemas/user.schema";
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
import { BearerTokenGuard } from "src/auth/guard/bearer-token.guard";
import { QuestionsService } from "src/questions/questions.service";
import { randomUUID } from "crypto";
import { DateTime } from "luxon";
import { QuestionSchema, QuestionType } from "src/questions/schemas/question.schema";

@Controller("/api/courses")
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
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly questionsService: QuestionsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new course",
    description: "Create a new course with the provided data.",
  })
  @ApiCreatedResponse({
    description: "The course has been successfully created.",
    example: {
      messages: "Course created succesfully",
      data: {
        name: "Course 2",
        levels: [],
        language: "6732299a3b7d4ef48a34278c",
        type: 0,
        thumbnail: "https://ivansantosokeren.webp",
        _id: "6733798b5197083383500fdf",
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. missing required fields",
    example: {
      messages: [
        "name must be a string",
        "language must be a mongodb id",
        "type must be one of the following values: 0, 1",
        "thumbnail must be a URL address",
      ],
      data: null,
    },
  })
  async create(@Body() createCourseDto: CreateCourseDto) {
    return {
      messages: "Course created succesfully",
      data: await this.coursesService.create(createCourseDto),
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Find all courses",
    description: "Find all courses that match the given filter.",
  })
  @ApiOkResponse({
    description: "The courses have been successfully retrieved.",
    example: {
      messages: "3 courses found",
      data: [
        {
          _id: "67337d95efc0db11932081fb",
          name: "Course 2",
          levels: [],
          language: {
            _id: "6732299a3b7d4ef48a34278c",
            name: "Chineese",
            image: "https://test.com.png",
            __v: 0,
          },
          type: 0,
          thumbnail: "https://joken.webp",
          __v: 0,
        },
        {
          _id: "67337db4efc0db1193208204",
          name: "Course 2",
          levels: [],
          language: {
            _id: "6732299a3b7d4ef48a34278c",
            name: "Chineese",
            image: "https://test.com.png",
            __v: 0,
          },
          type: 0,
          thumbnail: "https://joken.webp",
          __v: 0,
        },
        {
          _id: "67337dc0efc0db1193208206",
          name: "Course 3",
          levels: [],
          language: {
            _id: "6732299a3b7d4ef48a34278c",
            name: "Chineese",
            image: "https://test.com.png",
            __v: 0,
          },
          type: 1,
          thumbnail: "https://joken2.webp",
          __v: 0,
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. invalid query parameters",
    example: {
      messages: ["language must be a mongodb id"],
      data: null,
    },
  })
  @HasRoles(Role.USER, Role.ADMIN)
  async findAll(
    @Query() findAllQuery: FindAllCoursesQuery,
  ) {
    const filter: FilterQuery<Course> = {};
    if (findAllQuery.language) {
      filter.language = findAllQuery.language;
    }

    if (findAllQuery.type) {
      filter.type = findAllQuery.type;
    }
    console.log('findAllQuery:', findAllQuery);
    console.log(filter);

    const foundedCourses = await this.coursesService.findAll(filter);

    return {
      messages: formatGetAllMessages(foundedCourses.length, "course"),
      data: foundedCourses,
    };
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Find a course by its ID",
    description: "Find a course by its ID.",
  })
  @ApiOkResponse({
    description: "The course has been successfully retrieved.",
    example: {
      messages: "Course found",
      data: {
        _id: "67337d95efc0db11932081fb",
        name: "Course 2",
        levels: [],
        language: {
          _id: "6732299a3b7d4ef48a34278c",
          name: "Chineese",
          image: "https://test.com.png",
          __v: 0,
        },
        type: 0,
        thumbnail: "https://joken.webp",
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. invalid course ID",
    example: {
      messages: "Course not found",
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description: "Course not found",
    example: {
      messages: "Course not found",
      data: null,
    },
  })
  @HasRoles(Role.USER, Role.ADMIN)
  async findOne(@Param() findByIdParam: FindByIdParam) {
    const foundedLanguage = checkIfExist(
      await this.coursesService.findOne(findByIdParam.id),
      "Course not found",
    );
    return {
      messages: "Course found",
      data: foundedLanguage,
    };
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Update a course by its ID",
    description: "Update a course by its ID with the provided data.",
  })
  @ApiOkResponse({
    description: "The course has been successfully updated.",
    example: {
      messages: "Course updated succesfully",
      data: {
        _id: "67337d95efc0db11932081fb",
        name: "Course 2 - Updated",
        levels: [],
        language: {
          _id: "6732299a3b7d4ef48a34278c",
          name: "Chineese",
          image: "https://test.com.png",
          __v: 0,
        },
        type: 0,
        thumbnail: "https://joken.webp",
        __v: 0,
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Course not found",
    example: {
      messages: "Course not found",
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
    @Param() findByIdParam: FindByIdParam,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const updatedCourse = checkIfExist(
      await this.coursesService.update(findByIdParam.id, updateCourseDto),
      "Course not found",
    );
    return {
      messages: "Course updated succesfully",
      data: updatedCourse,
    };
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete a course by its ID",
    description: "Delete a course by its ID.",
  })
  @ApiOkResponse({
    description:
      "The course has been successfully deleted, it will return the deleted course.",
    example: {
      messages: "Course deleted succesfully",
      data: {
        _id: "67337d95efc0db11932081fb",
        name: "Course 2 - Updated",
        levels: [],
        language: {
          _id: "6732299a3b7d4ef48a34278c",
          name: "Chineese",
          image: "https://test.com.png",
          __v: 0,
        },
        type: 0,
        thumbnail: "https://joken.webp",
        __v: 0,
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Course not found",
    example: {
      messages: "Course not found",
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
  async remove(@Param() findByIdParam: FindByIdParam) {
    const deletedCourse = checkIfExist(
      await this.coursesService.remove(findByIdParam.id),
      "Course not found",
    );

    return {
      messages: "Course deleted succesfully",
      data: deletedCourse,
    };
  }

  @Post(":id/start-session")
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenGuard, RoleGuard)
  @HasRoles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: "Start a question session for a specific course" })
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
    schema: { example: { messages: "Unauthorized", data: null } },
  })
  @ApiBearerAuth()
  async startQuestionSession(
    @Param("id") courseId: string,
    @Req() request: Request,
  ) {
    const userId = request.user._id.toString();
    const questions = await this.questionsService.getQuestionsByCourse(
      courseId,
    );
    const totalQuestions = questions.length; // Calculate total questions

    console.log(userId);
    console.log(totalQuestions);
    

    const expiresAt = DateTime.now().plus({ minutes: 30 }).toJSDate();

    const session = await this.coursesService.addSession({
      user: userId,
      course: courseId,
      questions: questions,
      expiresAt: expiresAt,
      score: 0
    });

    console.log(session);

    return {
      messages: "Session started",
      data: {
        sessionId: session._id,
        expiresAt,
        totalQuestions, // Include totalQuestions in the response
      },
    };
  }

  @Patch(":id/:session-id/answer")
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenGuard, RoleGuard)
  @HasRoles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: "Start a question session for a specific course" })
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
    schema: { example: { messages: "Unauthorized", data: null } },
  })
  @ApiBearerAuth()
  async addAnsweredQuestion(
    @Param("id") courseId: string,
    @Param("session-id") sessionId: string,
    @Body("questionId") questionId: string,
    @Req() request: Request,
  ) {
    const updatedSession = await this.coursesService.addAnsweredQuestion(
      sessionId,
      questionId,
    );

    return {
      messages: "Added answered question",
      data: {
        session: updatedSession,
      },
    };
  }

  @Get('session/:courseSessionId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenGuard, RoleGuard)
  @HasRoles(Role.USER, Role.ADMIN)
  async getQuestionBySessionId(
    @Param('courseSessionId') courseSessionId: string,
    @Req() request: Request
  ) {
    const session = await this.coursesService.getOneSession(courseSessionId);
    // console.log(session);

    const questionIndex = session.answeredQuestions.length
    const questionId = session.questions[session.answeredQuestions.length];
    const question = await this.questionsService.findOne(questionId.toString())
    console.log(question);
    console.log(QuestionType[0]);

    const newQuestion = {
      question: question.question,
      answerOptions: question.answerOptions
    }

    return {
      messages: "Successfully get the next question",
      data: {
        question: newQuestion,
        totalQuestion: session.questions.length,
        questionIndex,
        score: session.score
      }
    }
  }

  @Post('session/:courseSessionId/submit-answer')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenGuard, RoleGuard)
  @HasRoles(Role.USER, Role.ADMIN)
  async submitAnswer(
    @Param('courseSessionId') courseSessionId: string,
    @Body('answer') answer: string,
    @Req() request: Request
  ) {
    const session = await this.coursesService.getOneSession(courseSessionId);
    
    const questionId = session.questions[session.answeredQuestions.length];
    const question = await this.questionsService.findOne(questionId.toString());

    console.log(question);
    var isLatest = false;

    const isCorrect = await this.coursesService.assessAnswer(question, answer)

    if(isCorrect){
      const updatedSession = await this.coursesService.addAnsweredQuestion(
        courseSessionId,
        questionId.toString(),
      );
    }

    const newSession = await this.coursesService.getOneSession(courseSessionId);

    if(newSession.answeredQuestions.length == newSession.questions.length){
      isLatest = true
    }

    return {
      messages: "Successfully Assessed the Answer",
      data: {
        isCorrect,
        isLatest
      }
    }
  }
}
