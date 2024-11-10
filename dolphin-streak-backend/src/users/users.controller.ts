import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import argon2 from "argon2";
import { FindOneByIdParam } from "./dto/find-one-by-id.param";
import { FindUserQuery } from "./dto/find-user.query";
import { ApiResponse } from "src/lib/types/response.type";
import { extractPassword } from "src/utils/user";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { RoleGuard } from "./guard/role.guard";
import { HasRoles } from "src/lib/decorators/has-role.decorator";
import { Provider, Role } from "./schemas/user.schema";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UpdateUserDto } from "./dto/update-user.dto";

//TODO: Implement some kind of IP checker, so admin can only access this route from authorized IP.
@UseGuards(JwtAuthGuard, RoleGuard)
// If no role are listed, meaning everyone can access it. But just to be safe, write the role that can access the route.
@Controller("users")
@ApiInternalServerErrorResponse({
  description:
    "Happen when something went wrong, that is not handled by this API, e.g. database error",
  example: {
    message: "Internal Server Error",
    data: null,
  },
})
@ApiBadRequestResponse({
  description: "Happen when the provided data is not valid",
  example: {
    message: [
      "firstName should not be null or undefined",
      "firstName must be a string",
      "firstName should not be empty",
    ],
    data: null,
  },
})
@ApiUnauthorizedResponse({
  description:
    "Happen when the user is not authorized, it can either be no bearer token or the role is not allowed",
  example: {
    message: "Unauthorized",
    data: null,
  },
})
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @HasRoles(Role.ADMIN)
  @ApiOperation({
    summary: "Create a new user using the local strategy",
    description:
      "This endpoint will create a new user. Note that for now it only supports local strategy, as using other strategy will require additional steps. Requires admin role",
  })
  @ApiCreatedResponse({
    description: "User created successfully",
    example: {
      messages: "User created successfully",
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john0@email.com",
        birthDate: "1996-01-01T00:00:00.000Z",
        profilePicture:
          "https://docs.nestjs.com/assets/logo-small-gradient.svg",
        loginHistories: [],
        languages: [],
        completedCourses: [],
        _id: "672f307741eee3baefa94958",
        createdAt: "2024-11-09T09:50:47.034Z",
        updatedAt: "2024-11-09T09:50:47.034Z",
        provider: Provider.LOCAL,
        role: Role.USER,
        __v: 0,
      },
    },
  })
  @ApiConflictResponse({
    description: "Happen when the user already exists",
    example: {
      messages: "User already exists",
      data: null,
    },
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse> {
    const hashedPassword = await argon2.hash(createUserDto.password);
    const createdUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
      provider: Provider.LOCAL,
    });

    const userResponse = extractPassword(createdUser);

    return {
      messages: "User created successfully",
      data: userResponse,
    };
  }

  @Get()
  @HasRoles(Role.ADMIN)
  @ApiOperation({
    summary:
      "Find all registered users with the ability to filter it based on firstName or lastName or provider. Requires admin role",
    description: "Is used to find all users",
  })
  @ApiOkResponse({
    description: "Return all users",
    example: {
      messages: "2 users founded",
      data: [
        {
          "_id": "67230cbd0b53c9081bc2b1c8",
          "firstName": "Johnson",
          "lastName": "Doe",
          "email": "johnsondoe@email.com",
          "provider": 0,
          "profilePicture": "https://placehold.jp/150x150.png",
          "loginHistories": [],
          "role": 1,
          "languages": [],
          "completedCourses": [],
          "createdAt": "2024-10-31T04:51:09.436Z",
          "updatedAt": "2024-10-31T04:51:09.436Z",
          "__v": 0,
        },
        {
          "_id": "67243a4a7507ac0c0d0b56c2",
          "firstName": "Jonathan",
          "email": "joken.e22@mhs.istts.ac.id",
          "provider": 0,
          "profilePicture": "https://placehold.jp/150x150.png",
          "loginHistories": [],
          "role": 1,
          "languages": [],
          "completedCourses": [],
          "createdAt": "2024-11-01T02:17:46.343Z",
          "updatedAt": "2024-11-01T02:17:46.343Z",
          "__v": 0,
        },
      ],
    },
  })
  async findAll(@Query() queryParam: FindUserQuery): Promise<ApiResponse> {
    const filterConditions = [];

    if (queryParam.firstName) {
      filterConditions.push({ firstName: queryParam.firstName });
    }
    if (queryParam.lastName) {
      filterConditions.push({ lastName: queryParam.lastName });
    }
    if (queryParam.provider) {
      filterConditions.push({ provider: queryParam.provider });
    }

    // If both firstName and lastName exist then do a $and query.
    const filter = filterConditions.length > 1
      ? { $and: filterConditions }
      : filterConditions[0] || {};

    const foundedUsers = (await this.usersService.findAll(filter)).map((
      user,
    ) => extractPassword(user));

    const foundedUsersLength = foundedUsers.length;

    return {
      messages: `${foundedUsersLength} user${
        foundedUsersLength > 1 ? "s" : ""
      } founded`,
      data: foundedUsers,
    };
  }

  @Get(":id")
  @HasRoles(Role.ADMIN, Role.USER)
  @ApiOperation({
    summary: "Find a user by id",
    description: "Is used to find a user by id",
  })
  @ApiOkResponse({
    description: "Return the user",
    example: {
      messages: "User founded",
      data: {
        "_id": "67230cbd0b53c9081bc2b1c8",
        "firstName": "Johnson",
        "lastName": "Doe",
        "email": "johnsondoe@email.com",
        "provider": 0,
        "profilePicture": "https://placehold.jp/150x150.png",
        "loginHistories": [],
        "role": 1,
        "languages": [],
        "completedCourses": [],
        "createdAt": "2024-10-31T04:51:09.436Z",
        "updatedAt": "2024-10-31T04:51:09.436Z",
        "__v": 0,
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Happen when the user is not found",
    example: {
      messages: "User not founded",
      data: null,
    },
  })
  async findOne(@Param() findOneParam: FindOneByIdParam): Promise<ApiResponse> {
    const foundedUser = await this.usersService.findOne({
      _id: findOneParam.id,
    });

    if (!foundedUser) {
      throw new HttpException("User not founded", 404);
    }

    const userResponse = extractPassword(foundedUser);

    return {
      messages: "User founded",
      data: userResponse,
    };
  }

  //TODO: Will need review here, if given null or empty will it still update?
  @Patch(":id")
  @HasRoles(Role.ADMIN, Role.USER)
  @ApiOperation({
    summary: "Update a user by id",
    description:
      "Is used to update a user by id, note that the body is optional. If given nothing, then it will update nothing.",
  })
  @ApiOkResponse({
    description: "Return the updated user",
    example: {
      messages: "User updated successfully",
      data: {
        _id: "67230cbd0b53c9081bc2b1c8",
        firstName: "Billie Jean",
        lastName: "Doe",
        email: "johnsondoe@email.com",
        provider: 0,
        profilePicture: "https://placehold.jp/150x150.png",
        loginHistories: [],
        role: 1,
        languages: [],
        completedCourses: [],
        createdAt: "2024-10-31T04:51:09.436Z",
        updatedAt: "2024-11-09T10:51:46.119Z",
        __v: 0,
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Happen when the user is not found",
    example: {
      messages: "User not founded",
      data: null,
    },
  })
  async update(
    @Param() findOneParam: FindOneByIdParam,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse> {
    const updatedUser = await this.usersService.update(
      findOneParam.id,
      updateUserDto,
    );

    if (!updatedUser) {
      throw new HttpException("User not founded", 404);
    }

    const userResponse = extractPassword(updatedUser);

    return {
      messages: "User updated successfully",
      data: userResponse,
    };
  }

  @Delete(":id")
  @HasRoles(Role.ADMIN)
  @ApiOperation({
    summary: "Delete a user by id",
    description: "Is used to delete a user by id",
  })
  @ApiOkResponse({
    description: "Return the deleted user",
    example: {
      messages: "User updated successfully",
      data: {
        _id: "67230cbd0b53c9081bc2b1c8",
        firstName: "Billie Jean",
        lastName: "Doe",
        email: "johnsondoe@email.com",
        provider: 0,
        profilePicture: "https://placehold.jp/150x150.png",
        loginHistories: [],
        role: 1,
        languages: [],
        completedCourses: [],
        createdAt: "2024-10-31T04:51:09.436Z",
        updatedAt: "2024-11-09T10:51:46.119Z",
        __v: 0,
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Happen when the user is not found",
    example: {
      messages: "User not founded",
      data: null,
    },
  })
  async remove(
    @Param() deleteUserParam: FindOneByIdParam,
  ): Promise<ApiResponse> {
    const deletedUser = await this.usersService.remove(deleteUserParam.id);

    if (!deletedUser) {
      throw new HttpException("User not founded", 404);
    }

    const userResponse = extractPassword(deletedUser);

    return {
      messages: "User deleted successfully",
      data: userResponse,
    };
  }
}
