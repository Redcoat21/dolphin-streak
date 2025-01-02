import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateLevelDto } from "./dto/create-level.dto";
import { UpdateLevelDto } from "./dto/update-level.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Level } from "./schemas/level.schema";
import { FilterQuery, Model, ProjectionType, QueryOptions } from "mongoose";
import { Language } from "src/languages/schemas/language.schema";
import { QuestionsService } from "src/questions/questions.service";
import { Question } from "src/questions/schemas/question.schema";
import { LevelSessionDto } from "./dto/level-session.dto";

@Injectable()
export class LevelsService {
  private levelsSession: Map<string, LevelSessionDto> = new Map();

  constructor(
    @InjectModel(Level.name) private levelModel: Model<Language>,
    private readonly questionsService: QuestionsService,
  ) { }

  /**
   * Creates a new level.
   * @param createLevelDto - Data transfer object containing the details of the level to create.
   * @returns The created level.
   */
  create(createLevelDto: CreateLevelDto) {
    return this.levelModel.create(createLevelDto);
  }

  /**
   * Finds all levels matching the given filter.
   * @param filter - Optional filter query to match levels.
   * @param projection - Optional projection to specify which fields to include or exclude.
   * @param options - Optional query options.
   * @returns A promise that resolves to an array of levels.
   */
  findAll(
    filter?: FilterQuery<Language>,
    projection?: ProjectionType<Language>,
    options?: QueryOptions<Language>,
  ) {
    return this.levelModel.find(filter, projection, options);
  }

  /**
   * Finds a level by its ID.
   * @param id - The ID of the level to find.
   * @returns A promise that resolves to the found level, or null if no level is found.
   */
  findOne(id: string) {
    return this.levelModel.findById(id);
  }

  /**
   * Updates a level by its ID.
   * @param id - The ID of the level to update.
   * @param updateLevelDto - Data transfer object containing the updated details of the level.
   * @returns A promise that resolves to the updated level, or null if no level is found.
   */
  update(id: string, updateLevelDto: UpdateLevelDto) {
    return this.levelModel.findByIdAndUpdate(id, updateLevelDto);
  }

  /**
   * Removes a level by its ID.
   * @param id - The ID of the level to remove.
   * @returns A promise that resolves to the removed level, or null if no level is found.
   */
  remove(id: string) {
    return this.levelModel.findByIdAndDelete(id);
  }

  /**
   * Finds a level by its ID and retrieves associated questions.
   * @param id - The ID of the level.
   * @returns An object containing the level and its questions.
   */
  async findOneLevelsAndGetQuestions(id: string) {
    const level = await this.findOne(id);
    if (!level) {
      throw new NotFoundException("Level not found");
    }

    const questions = await this.questionsService.findAll({ levelId: id });

    return { level, questions };
  }

  /**
   * Finds all questions associated with a specific level.
   * @param levelId - The ID of the level.
   * @returns A promise that resolves to an array of questions.
   */
  async findQuestionsForLevel(levelId: string): Promise<Question[]> {
    const questions = await this.questionsService.findAll({ level: levelId });
    return questions;
  }

  /**
   * Adds a new level session to the in-memory store.
   * @param levelSessionDto - Data transfer object containing the details of the session.
   */
  async addSession(levelSessionDto: LevelSessionDto) {
    this.levelsSession.set(levelSessionDto.sessionId, levelSessionDto);
  }

  /**
   * Finds a level session by its ID.
   * @param sessionId - The ID of the session to retrieve.
   * @returns The level session corresponding to the provided ID, or undefined if not found.
   */
  getSession(sessionId: string): LevelSessionDto | undefined {
    return this.levelsSession.get(sessionId);
  }

  /**
   * Get the next question in a session.
   * @param sessionId - The session ID.
   * @param currentQuestionIndex - The current question index.
   * @returns The next question and its index.
   */
  getNextQuestion(sessionId: string, currentQuestionIndex: number): { nextQuestionIndex: number; nextQuestion: Question } {
    const session = this.levelsSession.get(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const nextQuestionIndex = currentQuestionIndex + 1;
    const nextQuestion = session.questions[nextQuestionIndex];

    if (!nextQuestion) {
      throw new NotFoundException('No more questions');
    }

    return { nextQuestionIndex, nextQuestion };
  }

  /**
   * Submit an answer for a question.
   * @param sessionId - The session ID.
   * @param questionIndex - The question index.
   * @param answer - The user's answer.
   * @returns Whether the answer is correct.
   */
  submitAnswer(sessionId: string, questionIndex: number, answer: string): { isCorrect: boolean } {
    const session = this.levelsSession.get(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const question = session.questions[questionIndex];
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const isCorrect = question.correctAnswer.includes(answer);
    return { isCorrect };
  }

  /**
   * Get the total number of questions for a level.
   * @param levelId - The ID of the level.
   * @returns The total number of questions.
   */
  async getTotalQuestionsForLevel(levelId: string): Promise<number> {
    const questions = await this.questionsService.findAll({ level: levelId });
    return questions.length;
  }
}