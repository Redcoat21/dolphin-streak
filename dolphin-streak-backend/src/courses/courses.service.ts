import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, ProjectionType, QueryOptions, Types } from "mongoose";
import { Course, CourseDocument } from "./schemas/course.schema";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import {
  CourseSession,
  CourseSessionDocument,
} from "./schemas/course-session.schema";
import { QuestionsService } from "src/questions/questions.service";
import { Question, QuestionType } from "src/questions/schemas/question.schema";
import axios from "axios";
import FormData from "form-data";

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(CourseSession.name) private courseSessionModel: Model<
      CourseSessionDocument
    >,
    private readonly questionService: QuestionsService,
  ) { }

  /**
   * Creates a new course.
   * @param {CreateCourseDto} createCourseDto - Data transfer object for creating a course.
   * @returns {Promise<Course>} The created course.
   */
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const createdCourse = new this.courseModel(createCourseDto);
    return createdCourse.save();
  }

  /**
   * Finds all courses that match the given filter.
   * @param {FilterQuery<Course>} [filter={}] - The filter query to apply.
   * @returns {Promise<Course[]>} The list of matching courses.
   */
  async findAll(filter: FilterQuery<Course> = {}): Promise<Course[]> {
    console.log('Filter in service:', filter);

    const result = await this.courseModel
      .find(filter)
      .populate("language")
      .exec();

    console.log('Query Result:', result);

    return result;
  }

  /**
   * Finds a course by its ID.
   * @param {string} id - The ID of the course to find.
   * @returns {Promise<Course>} The found course.
   * @throws {NotFoundException} If no course is found with the given ID.
   */
  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel
      .findById(id)
      .populate("language")
      .exec();

    if (!course) {
      throw new NotFoundException("Course not found");
    }
    return course;
  }

  /**
   * Updates a course by its ID.
   * @param {string} id - The ID of the course to update.
   * @param {UpdateCourseDto} updateCourseDto - Data transfer object for updating a course.
   * @returns {Promise<Course>} The updated course.
   * @throws {NotFoundException} If no course is found with the given ID.
   */
  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const updatedCourse = await this.courseModel
      .findByIdAndUpdate(id, updateCourseDto, { new: true })
      .populate("language")
      .exec();

    if (!updatedCourse) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return updatedCourse;
  }

  /**
   * Removes a course by its ID.
   * @param {string} id - The ID of the course to remove.
   * @returns {Promise<void>}
   * @throws {NotFoundException} If no course is found with the given ID.
   */
  async remove(id: string): Promise<unknown> {
    const result = await this.courseModel.findByIdAndDelete(id).exec();
    return result;
  }

  async addSession(data: any): Promise<CourseSession> {
    const courseSession = await this.courseSessionModel.create(data);
    return courseSession;
  }

  async getOneSession(id: String): Promise<CourseSession> {
    const courseSession = await this.courseSessionModel.findById(id);
    return courseSession;
  }

  async addAnsweredQuestion(sessionId: string, questionId: string): Promise<CourseSession> {
    const courseSession = await this.courseSessionModel.findById(sessionId);
    const question = await this.questionService.findOne(questionId);
    courseSession.answeredQuestions.push(question);
    courseSession.score += 10;

    return courseSession.save();
  }

  async assessAnswer(question: Question, answer: string, accessToken: string, file: Express.Multer.File): Promise<any> {
    const qtype = QuestionType[question.type]
    console.log(file);

    if (qtype == "MULTIPLE_CHOICE") {
      const answerIdx = parseInt(question.correctAnswer as string, 10)
      if (answer.toLowerCase() == question.answerOptions[answerIdx].toLowerCase()) {
        return { suggestion: null, isCorrect: true };
      }
    }
    else if (qtype == "FILL_IN") {
      var correctOne = "";

      if (Array.isArray(question.correctAnswer)) {
        correctOne = question.correctAnswer[0]
      }
      else {
        correctOne = (question.correctAnswer as string)
      }

      const questionAnswer = correctOne.toLowerCase()
      if (answer.toLowerCase() == questionAnswer) {
        return { suggestion: null, isCorrect: true };
      }
    }
    else if (qtype == "ESSAY") {
      const appHost = process.env.APP_HOST
      const appPort = process.env.APP_PORT

      const data = {
        theme: question.question.text,
        essay: answer
      }

      const url = `http://${appHost}:${appPort}/api/ai`
      // console.log(url);
      // console.log(question);

      try {
        const response = await axios.post(
          url,                   // API endpoint
          data,                  // Request body
          {                      // Config (e.g., headers)
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json', // Optional, default is application/json
            },
          }
        );

        // console.log(response.data);

        const result = response.data.data
        const suggestion = result.suggestion

        if (result.score >= 70) {
          return { suggestion: suggestion, isCorrect: true };
        }
        return { suggestion: suggestion, isCorrect: false };
      } catch (error) {
        console.error('Error calling API:', error.response?.data || error.message);
        throw new Error('Failed to call API');
      }

    }
    else if (qtype == "VOICE") {
      const format = file.originalname.split(".")[1]
      console.log({ format, originalName: file.originalname });
      const formData = new FormData();
      formData.append('file', Buffer.from(file.buffer), {
        filename: file.originalname,
        contentType: file.mimetype
      });
      formData.append('format', format);

      const appHost = process.env.APP_HOST
      const appPort = process.env.APP_PORT

      console.log(formData);

      const questionQuestion = question.question.text.replace(/[^a-zA-Z]/g, '');

      const url = `http://${appHost}:${appPort}/api/voiceai/transcribe`

      try {
        const response = await axios.post(
          url,                   // API endpoint
          formData,                  // Request body
          {                      // Config (e.g., headers)
            headers: {
              ...formData.getHeaders(),
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log(response.data);

        const transcript = response.data?.data?.transcript;
        const confidence = response.data?.data?.confidence;

        if (confidence < 0.6) {
          return {
            suggestion: "Please speak more clearly and try again",
            isCorrect: false
          };
        }

        if (transcript.replace(/[^a-zA-Z]/g, '') == questionQuestion) {
          return { suggestion: null, isCorrect: true }
        }

        return { suggestion: "Your pronunciation is wrong. Try again!", isCorrect: false };
      } catch (error) {
        console.error('Error calling API:', error.response?.data || error.message);
        throw new Error('Failed to call API');
      }
    }
    else if (qtype == "WRITING") {
      return { suggestion: null, isCorrect: true }
    }

    return { suggestion: null, isCorrect: false };
  }
}
