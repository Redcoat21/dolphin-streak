import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { expect, vi } from "vitest";
import { getModelToken } from "@nestjs/mongoose";
import { Provider, Role, User } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { DateTime } from "luxon";

// Unit test for user CRUD.
describe("UsersService", () => {
  let service: UsersService;

  // Mock the User Model.
  const userModel = {
    create: vi.fn(),
  };

  // Before each test, initialize the module with the UsersService and the mocked User Model.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
        provide: getModelToken(User.name),
        useValue: userModel,
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  // Test that service is defined, i.e. it is not null.
  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // Test the create method.
  describe("Create User", () => {
    type ExpectedCreatedUser = {
      _id: string;
      firstName: string;
      password: string;
      email: string;
      provider: Provider;
      profilePicture: string;
      loginHistories: [];
      role: Role;
      languages: [];
      completedCourses: [];
      __v: number;
      createdAt: Date;
      updatedAt: Date;
    };

    let expectedCreatedUser: ExpectedCreatedUser;
    let createdUserDto: CreateUserDto;
    beforeEach(() => {
      // Define the expected create input. Can be extended again later to include additional properties.
      createdUserDto = {
        email: "johndoe@email.com",
        password: "JohnDoe123@#",
        firstName: "John",
        provider: Provider.LOCAL.toString(),
        profilePicture: "https://test.com",
      };

      // Define the expected created user. Can be extended again later to include additional properties.
      expectedCreatedUser = {
        _id: "672307c4e1218b524c54e826",
        firstName: createdUserDto.firstName,
        password:
          "$argon2d$v=19$m=12,t=3,p=1$emQ3bXIxMndtbG8wMDAwMA$sk4u/aJwOGJaOp8tWTOfhg",
        email: createdUserDto.email,
        provider: 0,
        profilePicture: createdUserDto.profilePicture,
        loginHistories: [],
        role: 1,
        languages: [],
        completedCourses: [],
        __v: 0,
        createdAt: DateTime.fromObject({
          year: 2024,
          month: 11,
          day: 1,
        }).toJSDate(),
        updatedAt: DateTime.fromObject({
          year: 2024,
          month: 11,
          day: 1,
        }).toJSDate(),
      };
    });

    // Test the create method to be succesful.
    it("Should create a single user succesfully", async () => {
      userModel.create.mockImplementationOnce(() => expectedCreatedUser);
      const createdUser = await service.create(createdUserDto);
      expect(createdUser).toEqual(expectedCreatedUser);
    });

    it("Should failed to create a single user because email already exists", async () => {
      userModel.create.mockImplementationOnce(() => {
        throw new Error("Email already exists");
      });
      try {
        await service.create(createdUserDto);
      } catch (error) {
        expect(error.message).toBe("Email already exists");
      }
    });

    it("Should throw an error when database throw an error", async () => {
      userModel.create.mockImplementationOnce(() => {
        throw new Error("Database Error");
      });

      try {
        await service.create(createdUserDto);
      } catch (error) {
        expect(error.message).toBe("Database Error");
      }
    });
  });
});
