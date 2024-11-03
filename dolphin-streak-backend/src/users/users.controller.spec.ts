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
import { FindOneByIdParam } from "./dto/find-one-by-id.param";
import { FindUserQuery } from "./dto/find-user.query";

vi.mock("src/utils/user", () => ({
  extractPassword: (user) => {
    const { password, ...rest } = user;
    return rest;
  },
}));

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

  const userInputTemplate = {
    firstName: "John",
    email: "johndoe@email.com",
    password: "PassWord123@!",
    profilePicture: "https://www.google.com",
    provider: Provider.LOCAL,
  };

  // The user object that will be returned by the service.
  const expectedUser: ExpectedUser = {
    firstName: userInputTemplate.firstName,
    email: userInputTemplate.email,
    profilePicture: userInputTemplate.profilePicture,
    provider: Provider.LOCAL,
    _id: "64fb3f8a7b8c5e001f4c5c5b",
    __v: 0,
    createdAt: DateTime.fromObject({ year: 2024, month: 11, day: 2 })
      .toJSDate(),
    updatedAt: DateTime.fromObject({ year: 2024, month: 11, day: 2 })
      .toJSDate(),
    loginHistories: [],
    role: Role.USER,
    completedCourses: [],
    languages: [],
  };

  describe("Create User", () => {
    // Only contain the necessary fields, can be expanded again later.
    const createUserDto: CreateUserDto = userInputTemplate;

    beforeEach(() => {
      // Before each test, we are going to mock the create service.
      userService.create.mockResolvedValueOnce(expectedUser);
    });

    it("should create a user", async () => {
      // Spy on the hashing function.
      const hashSpy = vi.spyOn(argon2, "hash").mockResolvedValueOnce(
        "$argon2d$v=19$m=12,t=3,p=1$NW95bmNkZ2R1ZmUwMDAwMA$0qyAwJ1vN5+fQhB/OWnGbg",
      );

      // Call the create function.
      const createdUser = await controller.create(createUserDto);

      // Expect that the hasing function was called.
      expect(hashSpy).toHaveBeenCalled();

      // It might be called, but does it called with the correct arguments?
      expect(hashSpy).toHaveBeenCalledWith(createUserDto.password);

      // Compare the expected user with the created user.
      expect(createdUser.data).toEqual(expectedUser);
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
    });

    it("Validation shouldn't fail, if optional fields are missing", async () => {
      const tempDto = { ...createUserDto };
      const input = plainToInstance(CreateUserDto, tempDto);
      const errors = await validate(input);

      // Length should be 0 because no error ever happened.
      expect(errors.length).toBe(0);
    });
  });

  describe("Delete User", () => {
    beforeEach(() => {
      userService.remove.mockResolvedValueOnce(expectedUser);
    });

    it("Should delete a user", async () => {
      const id = "64fb3f8a7b8c5e001f4c5c5b";

      // Mock the remove function.
      const deletedUser = await controller.remove({ id: id });

      expect(deletedUser.data).toEqual(expectedUser);
    });

    it("Should throw an exception if no user is founded", async () => {
      userService.remove.mockReset();
      const id = "64fb3f8a7b8c5e001f4c5c5b";

      userService.remove.mockResolvedValueOnce(undefined);

      const deletedUser = controller.remove({ id: id });

      expect(deletedUser).rejects.toThrow();
    });

    it("Validation should fail if no input is given", async () => {
      const errors = await validate(plainToInstance(FindOneByIdParam, {}));

      expect(errors.length).toBeGreaterThan(0);
    });

    it("Validation should fail if the given input is not a valid mongo id", async () => {
      const errors = await validate(
        plainToInstance(FindOneByIdParam, { id: "123" }),
      );

      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("Update User", () => {
    // Ensure that the updated user updatedAt is always greater than the original object.
    let expectedUpdatedUser;

    beforeEach(() => {
      expectedUpdatedUser = {
        ...expectedUser,
        updatedAt: DateTime.fromObject({
          year: expectedUser.updatedAt.getFullYear() + 1,
          month: expectedUser.updatedAt.getMonth() + 1,
          day: expectedUser.updatedAt.getDate() + 1,
        }).toJSDate(),
      };

      userService.update.mockResolvedValueOnce(expectedUpdatedUser);
    });

    it("Should succesfully update a user", async () => {
      expectedUpdatedUser = { ...expectedUpdatedUser, firstName: "Jane" };

      userService.update.mockReset();

      userService.update.mockResolvedValue(expectedUpdatedUser);

      const b = await userService.update(
        { id: "64fb3f8a7b8c5e001f4c5c5b" },
        {},
      );

      const id = "64fb3f8a7b8c5e001f4c5c5b";

      const updatedUser = await controller.update({ id }, {
        firstName: "Jane",
      });

      expect(updatedUser.data).toEqual(expectedUpdatedUser);
    });

    it("Should throw an exception, if the user doesn't exist", async () => {
      userService.update.mockReset();
      userService.update.mockResolvedValueOnce(undefined);

      const id = "64fb3f8a7b8c5e001f4c5c5b";

      const updatedUser = controller.update({ id }, {
        firstName: "Jane",
      });

      expect(updatedUser).rejects.toThrow();
    });

    it("Validation should only fail if the given id is not a valid mongo id", async () => {
      const id = "invalid id";
      const errors = await validate(plainToInstance(FindOneByIdParam, { id }));

      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("Find Users", () => {
    it("Return type should be an array", async () => {
      userService.findAll.mockResolvedValueOnce([expectedUser]);

      const users = await controller.findAll({});

      expect(users.data).toBeInstanceOf(Array);
    });

    it("Validation shouldnt fail, if no input is given", async () => {
      const errors = await validate(plainToInstance(FindUserQuery, {}));

      expect(errors.length).toBe(0);
    });
  });

  describe("Find User", () => {
    it("Should return a user", async () => {
      userService.findOne.mockResolvedValueOnce(expectedUser);

      const user = await controller.findOne({ id: "64fb3f8a7b8c5e001f4c5c5b" });

      expect(user.data).toEqual(expectedUser);
    });

    it("Validation should fail, if no input is given", async () => {
      const errors = await validate(plainToInstance(FindOneByIdParam, {}));

      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
