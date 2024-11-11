import { Test, TestingModule } from "@nestjs/testing";
import { LanguagesController } from "./languages.controller";
import { LanguagesService } from "./languages.service";
import { expect, vi } from "vitest";

describe("LanguagesController", () => {
  let controller: LanguagesController;

  const languageService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LanguagesController],
      providers: [{ provide: LanguagesService, useValue: languageService }],
    }).compile();

    controller = module.get<LanguagesController>(LanguagesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
