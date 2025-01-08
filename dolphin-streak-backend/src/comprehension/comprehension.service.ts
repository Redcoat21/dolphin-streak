import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CoursesService } from 'src/courses/courses.service';
import { QuestionsService } from 'src/questions/questions.service';
import { DateTime } from 'luxon';
import { Course } from 'src/courses/schemas/course.schema';
import { Question } from 'src/questions/schemas/question.schema';
import { CourseSession } from 'src/courses/schemas/course-session.schema';
import { FilterQuery } from 'mongoose';

@Injectable()
export class ComprehensionService {
    constructor(
        private readonly coursesService: CoursesService,
        private readonly questionsService: QuestionsService,
    ) { }

    async startComprehension(languageId: string, userId: string) {
        const courses = await this.coursesService.findAll({ language: languageId, type: 1 });

        if (!courses || courses.length === 0) {
            throw new NotFoundException(`No courses found for language ID: ${languageId}`);
        }

        const filteredCourses = courses.filter(course => !course.name.toUpperCase().includes("ESSAY"));

        if (filteredCourses.length === 0) {
            throw new NotFoundException(`No courses found (excluding ESSAY courses) for language ID: ${languageId}`);
        }

        const randomIndex = Math.floor(Math.random() * filteredCourses.length);
        const selectedCourse: Course = filteredCourses[randomIndex];

        const questions = await this.questionsService.getQuestionsByCourse(selectedCourse._id);
        const totalQuestions = questions.length;

        const expiresAt = DateTime.now().plus({ minutes: 30 }).toJSDate();

        const session = await this.coursesService.addSession({
            user: userId,
            course: selectedCourse._id,
            questions: questions,
            expiresAt: expiresAt,
            score: 0
        });

        return {
            comprehensionId: session._id,
            expiresAt,
            totalQuestions,
        };
    }

    async getQuestionBySessionId(comprehensionSessionId: string, userId: string) {
        const session = await this.coursesService.getOneSession(comprehensionSessionId);

        if (session.user.toString() !== userId) {
            throw new ForbiddenException();
        }

        if (session.questions.length === 0) {
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
            question: newQuestion,
            totalQuestion: session.questions.length,
            questionIndex,
            score: session.score
        }
    }

    async submitAnswer(comprehensionSessionId: string, answer: string, userId: string, accessToken: string) {
        const session = await this.coursesService.getOneSession(comprehensionSessionId);

        if (session.user.toString() !== userId) {
            throw new ForbiddenException();
        }

        if (!answer) {
            throw new NotFoundException('Answer is required');
        }

        const questionId = session.questions[session.answeredQuestions.length];
        const question = await this.questionsService.findOne(questionId.toString());


        const { suggestion, isCorrect } = await this.coursesService.assessAnswer(question, answer, accessToken);

        if (isCorrect) {
            await this.coursesService.addAnsweredQuestion(
                comprehensionSessionId,
                questionId.toString(),
            );
        }

        const newSession = await this.coursesService.getOneSession(comprehensionSessionId);
        const course = await this.coursesService.findOne(newSession.course.toString());


        const isLatest = (newSession.answeredQuestions.length === newSession.questions.length);

        return {
            suggestion,
            isCorrect,
            isLatest,
        };
    }

    async findAllComprehension(languageId: string) {
        const filter: FilterQuery<Course> = { language: languageId };
        const courses = await this.coursesService.findAll(filter);
        return courses

    }
}