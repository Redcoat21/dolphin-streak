import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { expect, vi } from "vitest";
import { ExpectedUser } from "src/lib/types/test.type";
import { CreateUserDto } from "./dto/create-user.dto";
import { Provider, Role } from "./schemas/user.schema";
import argon2 from "argon2";
import { DateTime } from "luxon";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

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

  describe("Create User", () => {
    // Only contain the necessary fields, can be expanded again later.
    const createUserDto: CreateUserDto = {
      firstName: "John",
      email: "johndoe@email.com",
      password: "PassWord123@!",
      profilePicture: "https://www.google.com",
      provider: Provider.LOCAL,
    };

    const expectedUser: ExpectedUser = {
      firstName: createUserDto.firstName,
      email: createUserDto.email,
      profilePicture: createUserDto.profilePicture,
      provider: Provider.LOCAL,
      password: "$argon2d$v=19$m=12,t=3,p=1$NW95bmNkZ2R1ZmUwMDAwMA$0qyAwJ1vN5+fQhB/OWnGbg",
      _id: "64fb3f8a7b8c5e001f4c5c5b",
      __v: 0,
      createdAt: DateTime.fromObject({ year: 2024, month: 11, day: 2 }).toJSDate(),
      updatedAt: DateTime.fromObject({ year: 2024, month: 11, day: 2 }).toJSDate(),
      loginHistories: [],
      role: Role.USER,
      completedCourses: [],
      languages: [],
    }

    beforeEach(() => {
      // Before each test, we are going to mock the create service.
      userService.create.mockResolvedValueOnce(expectedUser);
    })



    it("should create a user", async () => {
      // Spy on the hashing function.
      const hashSpy = vi.spyOn(argon2, 'hash').mockResolvedValueOnce(expectedUser.password);

      // Call the create function.
      const createdUser = await controller.create(createUserDto);

      // Expect that the hasing function was called.
      expect(hashSpy).toHaveBeenCalled();
      
      // It might be called, but does it called with the correct arguments?
      expect(hashSpy).toHaveBeenCalledWith(createUserDto.password);

      // Compare the expected user with the created user.
      expect(createdUser).toEqual(expectedUser);
    });

    it("Shouldn't create a user, if any error occured", async () => {
      userService.create.mockRejectedValueOnce(new Error("Error"));

      expect(controller.create({} as CreateUserDto)).rejects.toThrow();
    });

    it("Validation should fail, if required fields are missing", async () => {
      const tempDto = { ...createUserDto, firstName: undefined };
      const input = plainToInstance(CreateUserDto, tempDto);
      const errors = await validate(input);

      // If there's an error, the length should be greater than 0.
      expect(errors.length).toBeGreaterThan(0);
    })

    it("Validation shouldn't fail, if optional fields are missing", async () => {
      const tempDto = { ...createUserDto };
      const input = plainToInstance(CreateUserDto, tempDto);
      const errors = await validate(input);

      // Length should be 0 because no error ever happened.
      expect(errors.length).toBe(0);
    })
  })
});
