import { Test, TestingModule } from "@nestjs/testing";
import { LevelsController } from "./levels.controller";
import { LevelsService } from "./levels.service";
import { expect } from "vitest";

describe("LevelsController", () => {
  let controller: LevelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LevelsController],
      providers: [LevelsService],
    }).compile();

    controller = module.get<LevelsController>(LevelsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
