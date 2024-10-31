import { Test, TestingModule } from "@nestjs/testing";
import { LanguagesService } from "./languages.service";
import { expect } from "vitest";

describe("LanguagesService", () => {
  let service: LanguagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LanguagesService],
    }).compile();

    service = module.get<LanguagesService>(LanguagesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
