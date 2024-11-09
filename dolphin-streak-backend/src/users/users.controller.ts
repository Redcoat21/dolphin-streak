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
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import argon2 from "argon2";
import { FindOneByIdParam } from "./dto/find-one-by-id.param";
import { FindUserQuery } from "./dto/find-user.query";
import { ApiResponse } from "src/lib/types/response.type";
import { extractPassword } from "src/utils/user";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse> {
    const hashedPassword = await argon2.hash(createUserDto.password);
    const createdUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const userResponse = extractPassword(createdUser);

    return {
      message: "User created successfully",
      data: userResponse,
    };
  }

  @Get()
  async findAll(@Query() queryParam: FindUserQuery): Promise<ApiResponse> {
    const filterConditions = [];

    if (queryParam.firstName) {
      filterConditions.push({ firstName: queryParam.firstName });
    }
    if (queryParam.lastName) {
      filterConditions.push({ lastName: queryParam.lastName });
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
      message: `${foundedUsersLength} user${
        foundedUsersLength > 1 ? "s" : ""
      } founded`,
      data: foundedUsers,
    };
  }

  @Get(":id")
  async findOne(@Param() findOneParam: FindOneByIdParam): Promise<ApiResponse> {
    const foundedUser = await this.usersService.findOne({});

    if (!foundedUser) {
      throw new HttpException("User not founded", 404);
    }

    const userResponse = extractPassword(foundedUser);

    return {
      message: "User founded",
      data: userResponse,
    };
  }

  @Patch(":id")
  async update(
    @Param() findOneParam: FindOneByIdParam,
    @Body() updateUserDto: Partial<CreateUserDto>,
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
      message: "User updated successfully",
      data: userResponse,
    };
  }

  @Delete(":id")
  async remove(
    @Param() deleteUserParam: FindOneByIdParam,
  ): Promise<ApiResponse> {
    const deletedUser = await this.usersService.remove(deleteUserParam.id);

    if (!deletedUser) {
      throw new HttpException("User not founded", 404);
    }

    const userResponse = extractPassword(deletedUser);

    return {
      message: "User deleted successfully",
      data: userResponse,
    };
  }
}
