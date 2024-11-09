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
import { Role } from "./schemas/user.schema";

//TODO: Implement some kind of IP checker, so admin can only access this route from authorized IP.
@UseGuards(JwtAuthGuard, RoleGuard)
// If no role are listed, meaning everyone can access it. But just to be safe, write the role that can access the route.
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @HasRoles(Role.ADMIN)
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
  @HasRoles(Role.ADMIN)
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
  @HasRoles(Role.ADMIN)
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
  @HasRoles(Role.ADMIN, Role.USER)
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
  @HasRoles(Role.ADMIN)
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
