import { Injectable } from "@nestjs/common";
import { CreateLanguageDto } from "./dto/create-language.dto";
import { UpdateLanguageDto } from "./dto/update-language.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Language } from "./schemas/language.schema";
import { FilterQuery, Model, ProjectionType, QueryOptions } from "mongoose";

@Injectable()
/**
 * Service for managing languages.
 */
export class LanguagesService {
  /**
   * Constructs the LanguagesService.
   * @param languageModel - The language model injected by Mongoose.
   */
  constructor(
    @InjectModel(Language.name) private languageModel: Model<Language>,
  ) {}

  /**
   * Creates a new language document.
   * @param createLanguageDto - Data transfer object for creating a language.
   * @returns The created language document.
   */
  create(createLanguageDto: CreateLanguageDto) {
    return this.languageModel.create(createLanguageDto);
  }

  /**
   * Finds all language documents matching the query.
   * @param query - The filter query to match documents.
   * @param projection - Optional projection to specify which fields to include or exclude.
   * @param options - Optional query options.
   * @returns An array of language documents.
   */
  findAll(
    query?: FilterQuery<Language>,
    projection?: ProjectionType<Language>,
    options?: QueryOptions<Language>,
  ) {
    return this.languageModel.find(query, projection, options);
  }

  /**
   * Finds a single language document by its ID.
   * @param id - The ID of the language document to find.
   * @returns The found language document, or null if no document matches the ID.
   */
  findOne(id: string) {
    return this.languageModel.findById(id);
  }

  /**
   * Updates a language document by its ID.
   * @param id - The ID of the language document to update.
   * @param updateLanguageDto - Data transfer object for updating a language.
   * @returns The updated language document.
   */
  update(id: string, updateLanguageDto: UpdateLanguageDto) {
    return this.languageModel.findByIdAndUpdate(id, updateLanguageDto, {
      new: true,
    });
  }

  /**
   * Removes a language document by its ID.
   * @param id - The ID of the language document to remove.
   * @returns The removed language document.
   */
  remove(id: string) {
    return this.languageModel.findByIdAndDelete(id);
  }
}
