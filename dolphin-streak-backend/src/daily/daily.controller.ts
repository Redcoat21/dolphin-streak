import { Controller, Get, Post, HttpCode, HttpStatus, Body, Req, Param, ForbiddenException, BadRequestException, NotFoundException, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DailyService } from './daily.service';
import { ApiBody, ApiOperation, ApiOkResponse, ApiUnauthorizedResponse, ApiBearerAuth, ApiBadRequestResponse, ApiNotFoundResponse, ApiConsumes } from '@nestjs/swagger';
import { StartDailyDto } from './dto/start-daily.dto';
import { CoursesService } from 'src/courses/courses.service';
import { DateTime } from 'luxon';
import { RoleGuard } from 'src/lib/guard/role.guard';
import { BearerTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { HasRoles } from 'src/lib/decorators/has-role.decorator';
import { Role } from 'src/users/schemas/user.schema';
import { QuestionsService } from 'src/questions/questions.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/daily')
export class DailyController {
    constructor(
        private readonly dailyService: DailyService,
        private readonly coursesService: CoursesService,
        private readonly questionsService: QuestionsService
    ) { }

    @Post('start')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Start a daily challenge" })
    @UseGuards(BearerTokenGuard, RoleGuard)
    @HasRoles(Role.USER, Role.ADMIN)
    @ApiBody({ type: StartDailyDto })
    @ApiOkResponse({
        description: "Daily challenge started successfully",
        schema: {
            example: {
                messages: "Daily started",
                data: {
                    dailyId: "daily-123",
                    expiresAt: new Date(),
                },
            },
        },
    })
    @ApiBearerAuth()
    async startDaily(@Body() startDailyDto: StartDailyDto,
        @Req() request: Request,
    ) {
        console.log({ request, requestUser: request.user })
        const userId = request.user._id.toString();
        // Fetch daily challenge questions based on language ID
        const dailyChallenge = await this.dailyService.getDailyChallenge(startDailyDto.languageId);

        // Get the first course ID from the daily challenge
        const courseId = dailyChallenge.courseId;

        // Get the questions for the course
        const questions = await this.questionsService.getQuestionsByCourse(courseId);
        const totalQuestions = questions.length;

        // Set the session expiration time
        const expiresAt = DateTime.now().plus({ minutes: 30 }).toJSDate();

        // Create a new session
        const session = await this.coursesService.addSession({
            user: userId, // Use a default user ID for daily challenges
            course: courseId,
            questions: questions,
            expiresAt: expiresAt,
            score: 0
        });

        // Return the session details
        return {
            messages: "Daily started",
            data: {
                dailyId: session._id,
                expiresAt,
                totalQuestions,
                dailyChallenge
            }
        }
    }

    @Post(':dailyId/answer')
    @HttpCode(HttpStatus.OK)
    @UseGuards(BearerTokenGuard, RoleGuard)
    @HasRoles(Role.USER, Role.ADMIN)
    @ApiOperation({ summary: "Mark a question to be answered" })
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
        @Param("dailyId") dailyId: string,
        @Body("questionId") questionId: string,
    ) {
        const updatedSession = await this.coursesService.addAnsweredQuestion(
            dailyId,
            questionId,
        );

        return {
            messages: "Added answered question",
            data: {
                session: updatedSession,
            },
        };
    }

    @Get('session/:dailySessionId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(BearerTokenGuard, RoleGuard)
    @HasRoles(Role.USER, Role.ADMIN)
    @ApiOperation({
        summary: 'get the current question',
        description: 'get the current question based on the daily session ID',
    })
    @ApiOkResponse({
        description: "Next question is acquired successfully",
        schema: {
            example: {
                "messages": "Successfully get the next question",
                "data": {
                    "question": {
                        "question": {
                            "type": "text",
                            "text": "Explain the impact of technology on society."
                        },
                        "answerOptions": null,
                        "questionType": 1
                    },
                    "totalQuestion": 74,
                    "questionIndex": 3,
                    "score": 30
                }
            }
        },
    })
    @ApiBadRequestResponse({
        description: 'Happen when the id parameter is not a valid mongodb id',
        example: {
            "messages": [
                "id must be a mongodb id"
            ],
            "data": null
        }
    })
    @ApiNotFoundResponse({
        description: 'Happen when the session unexpectedly do not have any question',
        example: {
            "messages": ['No questions available for this session.'],
            "data": null
        }
    })
    @ApiBearerAuth()
    async getQuestionBySessionId(
        @Param('dailySessionId') dailySessionId: string,
        @Req() request: Request
    ) {
        const session = await this.coursesService.getOneSession(dailySessionId);

        // checking if the owner or not
        const userId = request.user._id.toString();
        const userSession = session.user.toString();

        if (userId !== userSession) {
            throw new ForbiddenException();
        }

        if (session.questions.length == 0) {
            throw new NotFoundException('No questions available for this session.');
        }

        const questionIndex = session.answeredQuestions.length
        const questionId = session.questions[session.answeredQuestions.length];
        const question = await this.questionsService.findOne(questionId.toString())

        const newQuestion = {
            question: question.question,
            answerOptions: question.answerOptions,
            questionType: question.type
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

    @Post('session/:dailySessionId/submit-answer')
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
        description: "Answer is assessed successfully",
        schema: {
            example: {
                messages: "Successfully Assessed the Answer",
                data: {
                    suggestion: null,
                    isCorrect: true,
                    isLatest: false,
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: "Bad request, e.g. missing required fields",
        schema: {
            example: {
                "messages": "answer must be a string",
                "data": null
            }
        },
    })
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    async submitAnswer(
        @Param('dailySessionId') dailySessionId: string,
        @Body('answer') answer: string,
        @UploadedFile() file: Express.Multer.File,
        @Req() request: Request
    ) {
        const session = await this.coursesService.getOneSession(dailySessionId);

        // checking if the owner or not
        const userId = request.user._id.toString();
        const userSession = session.user.toString();

        if (userId !== userSession) {
            throw new ForbiddenException();
        }

        if (!answer) {
            throw new BadRequestException('answer must be a string')
        }

        const questionId = session.questions[session.answeredQuestions.length];
        const question = await this.questionsService.findOne(questionId.toString());

        // console.log(question);

        const accessToken = request.headers.authorization?.split(' ')[1]

        const { suggestion, isCorrect } = await this.coursesService.assessAnswer(question, answer, accessToken, file)

        let updatedSession;
        if (isCorrect) {
            updatedSession = await this.coursesService.addAnsweredQuestion(
                dailySessionId,
                questionId.toString(),
            );
        }

        const newSession = await this.coursesService.getOneSession(dailySessionId);

        const isLatest = (newSession.answeredQuestions.length == newSession.questions.length);
        const score = newSession.score;

        return {
            messages: "Successfully Assessed the Answer",
            data: {
                suggestion,
                isCorrect,
                isLatest,
                score
            }
        }
    }

    @Get('language/:language')
    @HttpCode(HttpStatus.OK)
    @UseGuards(BearerTokenGuard, RoleGuard)
    @HasRoles(Role.USER, Role.ADMIN)
    @ApiOperation({
        summary: 'get the daily challenge based on the language',
        description: 'get the daily challenge based on the language',
    })
    @ApiOkResponse({
        description: "Successfully get the daily challenge based on the language",
        schema: {
            example: {
                "messages": "Successfully get the daily challenge based on the language",
                "data": {
                    "dailyChallenge": {
                        "courseId": "656199111111111111111111",
                        "expiresAt": "2024-11-25T15:47:01.890Z"
                    },
                    "course": {
                        "_id": "656199111111111111111111",
                        "name": "Daily English",
                        "language": "en",
                        "level": 1,
                        "description": "This is a daily english course",
                        "createdAt": "2024-11-25T15:47:01.890Z",
                        "updatedAt": "2024-11-25T15:47:01.890Z",
                        "__v": 0
                    }
                }
            }
        },
    })
    async getDailyFromLanguage(
        @Param('language') language: string,
    ) {
        const dailyChallenge = await this.dailyService.getDailyChallenge(language);
        const course = await this.coursesService.findOne(dailyChallenge.courseId);
        return {
            messages: "Successfully get the daily challenge based on the language",
            data: {
                dailyChallenge,
                course
            }
        }
    }
}