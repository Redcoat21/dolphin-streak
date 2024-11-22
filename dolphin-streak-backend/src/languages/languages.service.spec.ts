import { Test, TestingModule } from "@nestjs/testing";
import { LanguagesService } from "./languages.service";
import { expect, vi } from "vitest";
import { getModelToken } from "@nestjs/mongoose";
import { Language } from "./schemas/language.schema";
import { Types } from "mongoose";

describe("LanguagesService", () => {
  let service: LanguagesService;

  const languageModel = {
    create: vi.fn(),
    find: vi.fn(),
    findByIdAndDelete: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LanguagesService, {
        provide: getModelToken(Language.name),
        useValue: languageModel,
      }],
    }).compile();

    service = module.get<LanguagesService>(LanguagesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a new language", async () => {
    const createLanguageDto = { name: "English", image: "https://image.png" };
    languageModel.create.mockResolvedValue(createLanguageDto);
    const result = await service.create(createLanguageDto);
    expect(result).toEqual(createLanguageDto);
    expect(languageModel.create).toHaveBeenCalledWith(createLanguageDto);
  });

  it("should find all languages", async () => {
    const languages = [{ name: "English" }, { name: "Spanish" }];
    languageModel.find.mockResolvedValue(languages);
    const result = await service.findAll();
    expect(result).toEqual(languages);
    expect(languageModel.find).toHaveBeenCalled();
  });

  it("should find a language by ID", async () => {
    const language = { name: "English", image: "https://image.png" };
    const languageId = new Types.ObjectId().toHexString();
    languageModel.findById.mockResolvedValue(language);
    const result = await service.findOne(languageId);
    expect(result).toEqual(language);
    expect(languageModel.findById).toHaveBeenCalledWith(languageId);
  });

  it("should update a language by ID", async () => {
    const updateLanguageDto = { name: "French" };
    const updatedLanguage = { name: "French" };
    const languageId = new Types.ObjectId().toHexString();
    languageModel.findByIdAndUpdate.mockResolvedValue(updatedLanguage);
    const result = await service.update(languageId, updateLanguageDto);
    expect(result).toEqual(updatedLanguage);
    expect(languageModel.findByIdAndUpdate).toHaveBeenCalledWith(
      languageId,
      updateLanguageDto,
      { new: true },
    );
  });

  it("should remove a language by ID", async () => {
    const removedLanguage = { name: "English" };
    const languageId = new Types.ObjectId().toHexString();
    languageModel.findByIdAndDelete.mockResolvedValue(removedLanguage);
    const result = await service.remove(languageId);
    expect(result).toEqual(removedLanguage);
    expect(languageModel.findByIdAndDelete).toHaveBeenCalledWith(languageId);
  });
});
