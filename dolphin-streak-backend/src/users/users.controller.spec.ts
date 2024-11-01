import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { expect, vi } from "vitest";

describe("UsersController", () => {
  let controller: UsersController;

  const userService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    remove: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: userService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
