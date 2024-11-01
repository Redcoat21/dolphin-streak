import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { expect, vi } from "vitest";
import { getModelToken } from "@nestjs/mongoose";
import { Provider, Role, User } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { DateTime } from "luxon";
import { UpdateUserDto } from "./dto/update-user.dto";

// Unit test for user CRUD.
describe("UsersService", () => {
  let service: UsersService;

  // Mock the User Model.
  const userModel = {
    create: vi.fn(),
    find: vi.fn(),
    findByIdAndDelete: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
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

  // Test the update method.
  describe("Find Users", () => {
    // Test the findAll method to be succesful. It should return an array of users.
    it("Should succesfully return an array of users", async () => {
      userModel.find.mockResolvedValueOnce([expectedUser]);

      const users = await service.findAll({});
      expect(Array.isArray(users)).toBe(true);
    });

    // Test the findAll method to return an empty array if no users found.
    it("Should return an empty array if no users found", async () => {
      userModel.find.mockResolvedValueOnce([]);

      const users = await service.findAll({});
      expect(users.length).toBe(0);
    });

    // Test the findAll method to return an array of users with the same firstName.
    // Testing that it can do filter.
    it("Should return an array of users with the same firstName", async () => {
      userModel.find.mockResolvedValueOnce([expectedUser, {
        ...expectedUser,
        email: "johanhan@gmail.com",
      }]);

      const users = await service.findAll({ firstName: "John" });
      expect(users.length).toBe(2);
    });
  });

  // Test the find one method.
  describe("Find User By Id", () => {
    // Test the findOne method to be succesful. It should return a single user.
    it("Should return a single user by id", async () => {
      userModel.findById.mockResolvedValueOnce(expectedUser);

      const id = "672307c4e1218b524c54e826";

      const user = await service.findOne(id);
      expect(user).toEqual(expectedUser);
    });

    // Test the findOne method to return undefined if no user found.
    it("Should return undefined if user not found", async () => {
      userModel.findById.mockResolvedValueOnce(undefined);

      const id = "672307c4e1218b524c54e826";

      const user = await service.findOne(id);
      expect(user).toBeUndefined();
    });

    // Test the findOne method to throw an error if the given id is an invalid ObjectId.
    it("Should throw an error if given id is an invalid ObjectId", async () => {
      userModel.findById.mockImplementationOnce(() => {
        throw new Error(
          'Cast to ObjectId failed for value "invalidObjectId" at path "_id" for model "User"',
        );
      });

      const id = "invalidObjectId";

      // Call the findOne method with an invalid ObjectId. It should throw an error.
      try {
        await service.findOne(id);
      } catch (error) {
        expect(error.message).toBe(
          'Cast to ObjectId failed for value "invalidObjectId" at path "_id" for model "User"',
        );
      }
    });
  });

  // Test the update method.
  describe("Update User", () => {
    let updateUserDto: UpdateUserDto;

    // Test the update method to be succesful. It should return the updated user.
    it("Should update a single user succesfully", async () => {
      updateUserDto = {
        email: "johndoe@email.com",
      };

      // Define the newly updated user, which includes the updated email.
      const updatedUser = {
        ...expectedUser,
        email: updateUserDto.email,
      };

      userModel.findByIdAndUpdate.mockResolvedValueOnce(updatedUser);

      const id = "672307c4e1218b524c54e826";

      const user = await service.update(id, updateUserDto);

      expect(user).toEqual(updatedUser);
    });

    // Test the update method to throw an error if the given id is an invalid ObjectId.
    it("Should throw an error if given id is an invalid ObjectId", async () => {
      userModel.findByIdAndUpdate.mockImplementationOnce(() => {
        throw new Error(
          'Cast to ObjectId failed for value "invalidObjectId" at path "_id" for model "User"',
        );
      });

      const updateUserDto = {
        email: "",
      };

      const id = "invalidObjectId";

      // Call the update method with an invalid ObjectId. It should throw an error.
      try {
        await service.update(id, updateUserDto);
      } catch (error) {
        expect(error.message).toBe(
          'Cast to ObjectId failed for value "invalidObjectId" at path "_id" for model "User"',
        );
      }
    });

    // Test the update method to return undefined if no user found.
    it("Shouldnt update a single user because user not found", async () => {
      userModel.findByIdAndUpdate.mockResolvedValueOnce(undefined);

      const updateUserDto = {
        email: "",
      };

      const id = "672307c4e1218b524c54e826";

      const user = await service.update(id, updateUserDto);
      expect(user).toBeUndefined();
    });

    // Test the update method to return the user even if the update dto is empty.
    it("Shouldnt throw an error even if update dto is empty", async () => {
      userModel.findByIdAndUpdate.mockResolvedValueOnce(expectedUser);

      const id = "672307c4e1218b524c54e826";

      const user = await service.update(id, {});
      expect(user).toEqual(expectedUser);
    });
  });
});
