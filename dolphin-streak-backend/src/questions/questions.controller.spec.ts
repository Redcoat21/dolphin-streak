import { Test, TestingModule } from "@nestjs/testing";
import { QuestionsController } from "./questions.controller";
import { QuestionsService } from "./questions.service";
import { expect } from "vitest";

describe("QuestionsController", () => {
  let controller: QuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [QuestionsService],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
