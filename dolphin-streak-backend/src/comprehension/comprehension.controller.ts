import { Controller, Post, HttpCode, HttpStatus, Body, Req, Param, UseGuards, Get, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ComprehensionService } from './comprehension.service';
import { ApiBody, ApiOperation, ApiOkResponse, ApiUnauthorizedResponse, ApiBearerAuth, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { Role } from 'src/users/schemas/user.schema';
import { BearerTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { RoleGuard } from 'src/lib/guard/role.guard';
import { HasRoles } from 'src/lib/decorators/has-role.decorator';
import { StartComprehensionDto } from './dto/start-comprehension.dto';
import { CoursesService } from 'src/courses/courses.service';
import { DateTime } from 'luxon';
import { QuestionsService } from 'src/questions/questions.service';


@Controller('/api/comprehension')
export class ComprehensionController {
    constructor(
        private readonly comprehensionService: ComprehensionService,
        private readonly coursesService: CoursesService,
        private readonly questionsService: QuestionsService
    ) { }

    @Post(':id/start')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Start a comprehension challenge" })
    @UseGuards(BearerTokenGuard, RoleGuard)
    @HasRoles(Role.USER, Role.ADMIN)
    @ApiBody({ type: StartComprehensionDto })
    @ApiOkResponse({
        description: "Comprehension challenge started successfully",
        schema: {
            example: {
                messages: "Comprehension started",
                data: {
                    comprehensionId: "comprehension-123",
                    expiresAt: new Date(),
                    totalQuestions: 10,
                },
            },
        },
    })
    @ApiBearerAuth()
    async startComprehension(
        @Param("id") comprehensionId: string,
        @Req() request: Request,
    ) {
        const userId = request.user._id.toString();
        // Fetch comprehension challenge questions based on language ID
        const comprehensionChallenge = await this.comprehensionService.startComprehension(comprehensionId, userId);
        // Get the first course ID from the comprehension challenge
        // const courseId = comprehensionChallenge.courseId;
        
        // Get the questions for the course
        // const questions = await this.questionsService.getQuestionsByCourse(courseId);
        const questions = await this.questionsService.getQuestionsByCourse(comprehensionId);
        const totalQuestions = questions.length;
        // Set the session expiration time
        // const expiresAt = DateTime.now().plus({ minutes: 30 }).toJSDate();
        const expiresAt = DateTime.now().plus({ minutes: 30 }).toJSDate();
        // Create a new session
        // const session = await this.coursesService.addSession({
        const session = await this.coursesService.addSession({
            user: userId,
            course: comprehensionId,
            questions: questions,
            expiresAt: expiresAt,
            score: 0
        });
        // Return the session details
        return {
            messages: "Comprehension started",
            data: {
                comprehensionId: session._id,
                expiresAt,
                totalQuestions,
            }
        }
    }

    @Get('session/:comprehensionSessionId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(BearerTokenGuard, RoleGuard)
    @HasRoles(Role.USER, Role.ADMIN)
    @ApiOperation({
        summary: 'get the current question',
        description: 'get the current question based on the comprehension session ID',
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
                        "questionType": 1,
                        "comprehension": {
                            "passage": "This is a passage about something.",
                            "questions": [
                                {
                                    "text": "What is the main idea?",
                                    "correctAnswer": "The main idea"
                                },
                                {
                                    "text": "What is the second idea?",
                                    "correctAnswer": "The second idea"
                                }
                            ]
                        }
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
        @Param('comprehensionSessionId') comprehensionSessionId: string,
        @Req() request: Request
    ) {
        const session = await this.coursesService.getOneSession(comprehensionSessionId);

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
            questionType: question.type,
            comprehension: question.comprehension
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

    @Post('session/:comprehensionSessionId/submit-answer')
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
                    score: 10,
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
    async submitAnswer(
        @Param('comprehensionSessionId') comprehensionSessionId: string,
        @Body('answer') answer: string,
        @Req() request: Request
    ) {
        const session = await this.coursesService.getOneSession(comprehensionSessionId);

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

        const accessToken = request.headers.authorization?.split(' ')[1]

        const { suggestion, isCorrect } = await this.coursesService.assessAnswer(question, answer, accessToken)

        if (isCorrect) {
            const updatedSession = await this.coursesService.addAnsweredQuestion(
                comprehensionSessionId,
                questionId.toString(),
            );
        }

        const newSession = await this.coursesService.getOneSession(comprehensionSessionId);
        const isLatest = (newSession.answeredQuestions.length == newSession.questions.length);

        return {
            messages: "Successfully Assessed the Answer",
            data: {
                suggestion,
                isCorrect,
                isLatest,
                score: newSession.score
            }
        }
    }

    @Get('language/:languageId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(BearerTokenGuard, RoleGuard)
    @HasRoles(Role.USER, Role.ADMIN)
    @ApiOperation({ summary: "Get all comprehensions by language ID" })
    @ApiOkResponse({
        description: "Successfully retrieved comprehensions",
        schema: {
            example: {
                messages: "Comprehensions retrieved successfully",
                data: [
                    {
                        comprehensionId: "comprehension-123",
                        expiresAt: new Date(),
                        totalQuestions: 10,
                    },
                    {
                        comprehensionId: "comprehension-456",
                        expiresAt: new Date(),
                        totalQuestions: 15,
                    },
                ],
            },
        },
    })
    @ApiBearerAuth()
    async findAllComprehension(
        @Param('languageId') languageId: string,
    ) {
        const comprehensions = await this.comprehensionService.findAllComprehension(languageId);
        return {
            messages: "Comprehensions retrieved successfully",
            data: comprehensions,
        };
    }
}
