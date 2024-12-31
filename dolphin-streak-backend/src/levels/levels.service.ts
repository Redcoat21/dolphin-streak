import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateLevelDto } from "./dto/create-level.dto";
import { UpdateLevelDto } from "./dto/update-level.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Level } from "./schemas/level.schema";
import { FilterQuery, Model, ProjectionType, QueryOptions } from "mongoose";
import { Language } from "src/languages/schemas/language.schema";
import { QuestionsService } from "src/questions/questions.service"; // Add import
import { Question } from "src/questions/schemas/question.schema"; // Add import if needed
import { LevelSessionDto } from "./dto/level-session.dto";


/**
 * Service dealing with operations related to levels.
 */
@Injectable()
export class LevelsService {
  private levelsSession: Map<string, LevelSessionDto> = new Map();
  /**
   * Creates an instance of LevelsService.
   * @param levelModel - The level model injected by Mongoose.
   * @param questionsService - The questions service to fetch related questions.
   */
  constructor(
    @InjectModel(Level.name) private levelModel: Model<Language>,
    private readonly questionsService: QuestionsService, // Inject QuestionsService
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
    // Use the questionsService to find all questions associated with the levelId
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
}
