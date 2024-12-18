import { Injectable } from "@nestjs/common";
import { CreateLevelDto } from "./dto/create-level.dto";
import { UpdateLevelDto } from "./dto/update-level.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Level } from "./schemas/level.schema";
import { FilterQuery, Model, ProjectionType, QueryOptions } from "mongoose";
import { Language } from "src/languages/schemas/language.schema";

/**
 * Service dealing with operations related to levels.
 */
@Injectable()
export class LevelsService {
  /**
   * Creates an instance of LevelsService.
   * @param levelModel - The level model injected by Mongoose.
   */
  constructor(@InjectModel(Level.name) private levelModel: Model<Language>) {}

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
}
