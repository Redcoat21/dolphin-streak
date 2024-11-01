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
    find: vi.fn(),
    findByIdAndDelete: vi.fn(),
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

  type ExpectedUser = {
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

  let expectedUser: ExpectedUser;

  beforeEach(() => {
    // Define the expected created user. Can be extended again later to include additional properties.
    expectedUser = {
      _id: "672307c4e1218b524c54e826",
      password:
        "$argon2d$v=19$m=12,t=3,p=1$emQ3bXIxMndtbG8wMDAwMA$sk4u/aJwOGJaOp8tWTOfhg",
      firstName: null,
      email: null,
      provider: 0,
      profilePicture: null,
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

  // Test the create method.
  describe("Create User", () => {
    let createdUserDto: CreateUserDto;
    let expectedCreatedUser: ExpectedUser;
    beforeEach(() => {
      // Define the expected create input. Can be extended again later to include additional properties.
      createdUserDto = {
        email: "johndoe@email.com",
        password: "JohnDoe123@#",
        firstName: "John",
        provider: Provider.LOCAL.toString(),
        profilePicture: "https://test.com",
      };

      // Define the expected created user. It included the same email, firstName and profilePicture as the createdUserDto.
      expectedCreatedUser = {
        ...expectedUser,
        firstName: createdUserDto.firstName,
        email: createdUserDto.email,
        profilePicture: createdUserDto.profilePicture,
      };
    });

    // Test the create method to be succesful.
    it("Should create a single user succesfully", async () => {
      userModel.create.mockImplementationOnce(() => expectedCreatedUser);
      const createdUser = await service.create(createdUserDto);
      expect(createdUser).toEqual(expectedCreatedUser);
    });

    // Test the create method to fail because the email already exists.
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
  });

  // Test the delete method.
  describe("Delete User", () => {
    let expectedDeletedUser: ExpectedUser;

    // Define the expected deleted user. It included a custom email, firstName and profilePicture.
    beforeEach(() => {
      expectedDeletedUser = {
        ...expectedUser,
        firstName: "John",
        email: "johndoe@email.com",
        profilePicture: "https://test.com",
      };
    });

    // Test the delete method to be succesful.
    it("Should delete a single user succesfully", async () => {
      userModel.findByIdAndDelete.mockResolvedValueOnce(expectedDeletedUser);

      const deletedUser = await service.remove(expectedDeletedUser._id);
      expect(deletedUser).toEqual(expectedDeletedUser);
    });

    // Test the delete method to fail because the user is not found.
    it("Should return undefined because user not found", async () => {
      // Mock the findByIdAndDelete method to return undefined when the user is not found.
      userModel.findByIdAndDelete.mockResolvedValueOnce(undefined);

      // Call the remove method with a valid id but no user associated with that id. It should return undefined.
      const deletedUser = await service.remove("67243a4a7507ac0c0d0b56c4");
      expect(deletedUser).toBeUndefined();
    });

    // Test the delete method to fail because the given id is an invalid ObjectId.
    it("Should throw an error because given id is an invalid ObjectId", async () => {
      // Mock the findByIdAndDelete method to throw an error when the id is invalid.
      userModel.findByIdAndDelete.mockImplementationOnce(() => {
        throw new Error(
          'Cast to ObjectId failed for value "invalidObjectId" at path "_id" for model "User"',
        );
      });

      // Call the remove method with an invalid ObjectId. It should throw an error.
      try {
        await service.remove("invalidObjectId");
      } catch (error) {
        expect(error.message).toBe(
          'Cast to ObjectId failed for value "invalidObjectId" at path "_id" for model "User"',
        );
      }
    });
  });

  describe("Find Users", () => {
    // Test the findAll method to be succesful. It should return an array of users.
    it("Should succesfully return an array of users", async () => {
      userModel.find.mockResolvedValueOnce([expectedUser]);

      const users = await service.findAll({});
      expect(Array.isArray(users)).toBe(true);
    });
  });
});
