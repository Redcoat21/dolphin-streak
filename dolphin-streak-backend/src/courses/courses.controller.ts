import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  ForbiddenException,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { checkIfExist, formatGetAllMessages } from 'src/lib/utils/response';
import { FindByIdParam } from 'src/lib/dto/find-by-id-param.dto';
import { FilterQuery } from 'mongoose';
import { Course } from './schemas/course.schema';
import { FindAllCoursesQuery } from './dto/find-all-query.dto';
import { RoleGuard } from 'src/lib/guard/role.guard';
import { HasRoles } from 'src/lib/decorators/has-role.decorator';
import { Role } from 'src/users/schemas/user.schema';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BearerTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { QuestionsService } from 'src/questions/questions.service';
import { DateTime } from 'luxon';
import { QuestionType } from 'src/questions/schemas/question.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from 'src/lib/types/response.type';
import { CloudinaryService } from 'src/upload/cloudinary.service';
import { UsersService } from 'src/users/users.service';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';

@Controller('/api/courses')
@UseGuards(BearerTokenGuard, RoleGuard)
@HasRoles(Role.ADMIN)
@ApiUnauthorizedResponse({
  description:
    "Happen because the user is not authorized (doesn't have a valid access token)",
  example: {
    message: 'Unauthorized',
    data: null,
  },
})
@ApiForbiddenResponse({
  description:
    "Happen because the user doesn't have the right role to access this endpoint",
  example: {
    message: 'Forbidden resource',
    data: null,
  },
})
@ApiInternalServerErrorResponse({
  description:
    'Happen when something went wrong, that is not handled by this API, e.g. database error',
  example: {
    message: 'Internal Server Error',
    data: null,
  },
})
@ApiBearerAuth()
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly questionsService: QuestionsService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly usersService: UsersService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new course',
    description: 'Create a new course with the provided data.',
  })
  @ApiCreatedResponse({
    description: 'The course has been successfully created.',
    example: {
      messages: 'Course created succesfully',
      data: {
        name: 'Course 2',
        levels: [],
        language: '6732299a3b7d4ef48a34278c',
        type: 0,
        thumbnail: 'https://ivansantosokeren.webp',
        _id: '6733798b5197083383500fdf',
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request, e.g. missing required fields',
    example: {
      messages: [
        'name must be a string',
        'language must be a mongodb id',
        'type must be one of the following values: 0, 1',
        'thumbnail must be a URL address',
      ],
      data: null,
    },
  })
  async create(@Body() createCourseDto: CreateCourseDto) {
    return {
      messages: 'Course created succesfully',
      data: await this.coursesService.create(createCourseDto),
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Find all courses',
    description: 'Find all courses that match the given filter.',
  })
  @ApiOkResponse({
    description: 'The courses have been successfully retrieved.',
    example: {
      messages: '3 courses found',
      data: [
        {
          _id: '67337d95efc0db11932081fb',
          name: 'Course 2',
          levels: [],
          language: {
            _id: '6732299a3b7d4ef48a34278c',
            name: 'Chineese',
            image: 'https://test.com.png',
            __v: 0,
          },
          type: 0,
          thumbnail: 'https://joken.webp',
          __v: 0,
        },
        {
          _id: '67337db4efc0db1193208204',
          name: 'Course 2',
          levels: [],
          language: {
            _id: '6732299a3b7d4ef48a34278c',
            name: 'Chineese',
            image: 'https://test.com.png',
            __v: 0,
          },
          type: 0,
          thumbnail: 'https://joken.webp',
          __v: 0,
        },
        {
          _id: '67337dc0efc0db1193208206',
          name: 'Course 3',
          levels: [],
          language: {
            _id: '6732299a3b7d4ef48a34278c',
            name: 'Chineese',
            image: 'https://test.com.png',
            __v: 0,
          },
          type: 1,
          thumbnail: 'https://joken2.webp',
          __v: 0,
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request, e.g. invalid query parameters',
    example: {
      messages: ['language must be a mongodb id'],
      data: null,
    },
  })
  @HasRoles(Role.USER, Role.ADMIN)
  async findAll(@Query() findAllQuery: FindAllCoursesQuery) {
    const filter: FilterQuery<Course> = {};
    if (findAllQuery.language) {
      filter.language = findAllQuery.language;
    }
    filter.name = { $not: { $regex: 'ESSAY', $options: 'i' } };

    // if (findAllQuery.type) {
    //   filter.type = findAllQuery.type;
    // }
    console.log('findAllQuery:', findAllQuery);
    console.log(filter);

    const foundedCourses = await this.coursesService.findAll(filter);

    return {
      messages: formatGetAllMessages(foundedCourses.length, 'course'),
      data: foundedCourses,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Find a course by its ID',
    description: 'Find a course by its ID.',
  })
  @ApiOkResponse({
    description: 'The course has been successfully retrieved.',
    example: {
      messages: 'Course found',
      data: {
        _id: '67337d95efc0db11932081fb',
        name: 'Course 2',
        levels: [],
        language: {
          _id: '6732299a3b7d4ef48a34278c',
          name: 'Chineese',
          image: 'https://test.com.png',
          __v: 0,
        },
        type: 0,
        thumbnail: 'https://joken.webp',
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request, e.g. invalid course ID',
    example: {
      messages: 'Course not found',
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description: 'Course not found',
    example: {
      messages: 'Course not found',
      data: null,
    },
  })
  @HasRoles(Role.USER, Role.ADMIN)
  async findOne(@Param() findByIdParam: FindByIdParam) {
    const foundedLanguage = checkIfExist(
      await this.coursesService.findOne(findByIdParam.id),
      'Course not found',
    );
    return {
      messages: 'Course found',
      data: foundedLanguage,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a course by its ID',
    description: 'Update a course by its ID with the provided data.',
  })
  @ApiOkResponse({
    description: 'The course has been successfully updated.',
    example: {
      messages: 'Course updated succesfully',
      data: {
        _id: '67337d95efc0db11932081fb',
        name: 'Course 2 - Updated',
        levels: [],
        language: {
          _id: '6732299a3b7d4ef48a34278c',
          name: 'Chineese',
          image: 'https://test.com.png',
          __v: 0,
        },
        type: 0,
        thumbnail: 'https://joken.webp',
        __v: 0,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Course not found',
    example: {
      messages: 'Course not found',
      data: null,
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request, e.g. invalid course ID',
    example: {
      messages: ['id must be a valid mongodb id'],
    },
  })
  async update(
    @Param() findByIdParam: FindByIdParam,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const updatedCourse = checkIfExist(
      await this.coursesService.update(findByIdParam.id, updateCourseDto),
      'Course not found',
    );
    return {
      messages: 'Course updated succesfully',
      data: updatedCourse,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a course by its ID',
    description: 'Delete a course by its ID.',
  })
  @ApiOkResponse({
    description:
      'The course has been successfully deleted, it will return the deleted course.',
    example: {
      messages: 'Course deleted succesfully',
      data: {
        _id: '67337d95efc0db11932081fb',
        name: 'Course 2 - Updated',
        levels: [],
        language: {
          _id: '6732299a3b7d4ef48a34278c',
          name: 'Chineese',
          image: 'https://test.com.png',
          __v: 0,
        },
        type: 0,
        thumbnail: 'https://joken.webp',
        __v: 0,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Course not found',
    example: {
      messages: 'Course not found',
      data: null,
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request, e.g. invalid course ID',
    example: {
      messages: ['id must be a valid mongodb id'],
    },
  })
  async remove(@Param() findByIdParam: FindByIdParam) {
    const deletedCourse = checkIfExist(
      await this.coursesService.remove(findByIdParam.id),
      'Course not found',
    );

    return {
      messages: 'Course deleted succesfully',
      data: deletedCourse,
    };
  }

  @Post(':id/start-session')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenGuard, RoleGuard)
  @HasRoles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Start a question session for a specific course' })
  @ApiOkResponse({
    description: 'Session started successfully',
    schema: {
      example: {
        messages: 'Session started',
        data: {
          sessionId: 'session-1691138855',
          expiresAt: '2024-11-25T15:47:01.890Z',
          totalQuestions: 10, // Added totalQuestions to the response
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: { example: { messages: 'Unauthorized', data: null } },
  })
  @ApiBearerAuth()
  async startQuestionSession(
    @Param('id') courseId: string,
    @Req() request: Request,
  ) {
    const userId = request.user._id.toString();
    const questions =
      await this.questionsService.getQuestionsByCourse(courseId);
    const totalQuestions = questions.length; // Calculate total questions

    console.log(userId);
    console.log(totalQuestions);

    const expiresAt = DateTime.now().plus({ minutes: 30 }).toJSDate();

    // bagian pengecekan

    const payed = await this.usersService.decLive(userId);
    const activeSubscription = await this.subscriptionsService.isActiveUser(userId);
    
    if(!payed && !activeSubscription){
      throw new ForbiddenException('Session failed to be created! Your lives are 0 and you do not have an active subscription.');
    }

    const session = await this.coursesService.addSession({
      user: userId,
      course: courseId,
      questions: questions,
      expiresAt: expiresAt,
      score: 0,
    });

    console.log(session);

    return {
      messages: 'Session started',
      data: {
        sessionId: session._id,
        expiresAt,
        totalQuestions, // Include totalQuestions in the response
      },
    };
  }

  @Patch(':id/:sessionId/answer')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenGuard, RoleGuard)
  @HasRoles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Mark a question to be answered' })
  @ApiOkResponse({
    description: 'Session started successfully',
    schema: {
      example: {
        messages: 'Session started',
        data: {
          sessionId: 'session-1691138855',
          expiresAt: '2024-11-25T15:47:01.890Z',
          totalQuestions: 10, // Added totalQuestions to the response
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: { example: { messages: 'Unauthorized', data: null } },
  })
  @ApiBearerAuth()
  async addAnsweredQuestion(
    @Param('id') courseId: string,
    @Param('sessionId') sessionId: string,
    @Body('questionId') questionId: string,
  ) {
    const updatedSession = await this.coursesService.addAnsweredQuestion(
      sessionId,
      questionId,
    );

    return {
      messages: 'Added answered question',
      data: {
        session: updatedSession,
      },
    };
  }

  @Get('session/:courseSessionId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenGuard, RoleGuard)
  @HasRoles(Role.USER, Role.ADMIN)
  @ApiOperation({
    summary: 'get the current question',
    description: 'get the current question based on the course session ID',
  })
  @ApiOkResponse({
    description: 'Next question is acquired successfully',
    schema: {
      example: {
        messages: 'Successfully get the next question',
        data: {
          question: {
            question: {
              type: 'text',
              text: 'Explain the impact of technology on society.',
            },
            answerOptions: null,
            questionType: 1,
          },
          totalQuestion: 74,
          questionIndex: 3,
          score: 30,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Happen when the id parameter is not a valid mongodb id',
    example: {
      messages: ['id must be a mongodb id'],
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description:
      'Happen when the session unexpectedly do not have any question',
    example: {
      messages: ['No questions available for this session.'],
      data: null,
    },
  })
  async getQuestionBySessionId(
    @Param('courseSessionId') courseSessionId: string,
    @Req() request: Request,
  ) {
    console.log({ courseSessionId });
    const session = await this.coursesService.getOneSession(courseSessionId);
    console.log({ session });
    // checking if the owner or not
    const userId = request.user._id.toString();
    console.log({ userId, userSession: session.user.toString() });
    const userSession = session.user.toString();

    if (userId !== userSession) {
      throw new ForbiddenException();
    }

    if (session.questions.length == 0) {
      throw new NotFoundException('No questions available for this session.');
    }

    const questionIndex = session.answeredQuestions.length;
    if (questionIndex == session.questions.length) {
      return {
        messages: 'All questions are answered',
        data: {
          question: null,
          totalQuestion: session.questions.length,
          questionIndex,
          score: session.score,
        },
      };
    }

    const questionId = session.questions[session.answeredQuestions.length];
    if (!questionId) {
      throw new NotFoundException('No questions available for this session.');
    }
    const question = await this.questionsService.findOne(questionId.toString());

    const newQuestion = {
      question: question.question,
      answerOptions: question.answerOptions,
      questionType: question.type,
    };

    return {
      messages: 'Successfully get the next question',
      data: {
        question: newQuestion,
        totalQuestion: session.questions.length,
        questionIndex,
        score: session.score,
      },
    };
  }

  @Post('session/:courseSessionId/submit-answer')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenGuard, RoleGuard)
  @HasRoles(Role.USER, Role.ADMIN)
  @ApiOperation({
    summary: 'submit answer based on the current question',
    description: 'submitting the answer based on the current question',
  })
  @ApiBody({
    description: 'Answer to the current question',
    schema: {
      type: 'object',
      properties: {
        answer: {
          type: 'string',
          example: 'Your answer here',
          description: 'The answer to the current question',
        },
      },
      required: ['answer'],
    },
  })
  @ApiOkResponse({
    description: 'Answer is assessed successfully',
    schema: {
      example: {
        messages: 'Successfully Assessed the Answer',
        data: {
          suggestion: null,
          isCorrect: true,
          isLatest: false,
          score: 10,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request, e.g. missing required fields',
    schema: {
      example: {
        messages: 'answer must be a string',
        data: null,
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async submitAnswer(
    @Param('courseSessionId') courseSessionId: string,
    @Body('answer') answer: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    const session = await this.coursesService.getOneSession(courseSessionId);

    // checking if the owner or not
    const userId = request.user._id.toString();
    const userSession = session.user.toString();

    if (userId !== userSession) {
      throw new ForbiddenException();
    }

    const questionId = session.questions[session.answeredQuestions.length];
    const question = await this.questionsService.findOne(questionId.toString());

    // console.log(question);
    const qtype = QuestionType[question.type];

    if (!answer && qtype != 'VOICE') {
      throw new BadRequestException('answer must be a string');
    }

    if (!file && qtype == 'VOICE') {
      throw new BadRequestException('file must be passed');
    }

    const accessToken = request.headers.authorization.split(' ')[1];

    const { suggestion, isCorrect } = await this.coursesService.assessAnswer(
      question,
      answer,
      accessToken,
      file,
    );

    if (isCorrect) {
      const updatedSession = await this.coursesService.addAnsweredQuestion(
        courseSessionId,
        questionId.toString(),
      );
    }

    const newSession = await this.coursesService.getOneSession(courseSessionId);

    const isLatest =
      newSession.answeredQuestions.length == newSession.questions.length;
    const score = newSession.score;
    return {
      messages: 'Successfully Assessed the Answer',
      data: {
        suggestion,
        isCorrect,
        isLatest,
        score,
      },
    };
  }

  @ApiOperation({
    summary: "Upload a course's thumbnail",
    description:
      "Is used to upload a course's thumbnail. Sorry that no body example in here, i don't know how",
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        thumbnail: {
          type: 'string',
          format: 'binary',
          description: 'The thumbnail to upload, maximum size should be 5MB',
        },
      },
    },
  })
  @ApiOkResponse({
    description: "Return the uploaded course's thumbnail URL",
    example: {
      messages: 'Course Thumbnail uploaded successfully',
      data: {
        imageUrl: 'https://placehold.jp/150x150.png',
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      "Happen when the admin doesn't upload a file or the file MIME type is not allowed",
    example: {
      messages: 'Validation failed (expected type is /(jpg|jpeg|png|webp)$/)',
      data: null,
    },
  })
  @ApiBadGatewayResponse({
    description:
      'Happen when the image failed to upload to Cloudinary, it can be because of the network or the image itself',
    example: {
      messages: 'Failed to upload image to Cloudinary',
      data: null,
    },
  })
  @Patch(':id/thumbnail')
  @UseInterceptors(FileInterceptor('thumbnail'))
  @HasRoles(Role.ADMIN)
  async uploadCourseThumbnail(
    @Param() findOneParam: FindByIdParam,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 5 MB
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        errorHttpStatusCode: 400,
        exceptionFactory: (errors) => {
          throw new HttpException(errors, 400);
        },
      }),
    )
    file: Express.Multer.File,
  ): Promise<ApiResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const imageUrl = await this.cloudinaryService.uploadImage(
        file,
        findOneParam.id,
        'courses',
      );

      await this.update(findOneParam, { thumbnail: imageUrl });
      return {
        messages: 'Course thumbnail uploaded successfully',
        data: {
          imageUrl,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Failed to upload image to Cloudinary',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
