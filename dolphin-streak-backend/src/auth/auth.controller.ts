import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { ApiResponse } from "src/lib/types/response.type";
import { BaseCreateUserDto } from "src/lib/dto/base-create-user.dto";
import { Provider, Role } from "src/users/schemas/user.schema";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { RefreshTokenGuard } from "./guard/refresh-jwt-auth.guard";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import * as argon2 from "argon2";

@Controller("/api/auth")
@ApiInternalServerErrorResponse({
  description:
    "Happen when something went wrong, that is not handled by this API, e.g. database error",
  example: {
    messages: "Internal Server Error",
    data: null,
  },
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiOperation({
    summary:
      "Request for a access token and a refresh token using local strategy (email and password)",
    description:
      "This endpoint will return a access token and a refresh token if the email and password is correct, note that it will return a error 500 if the password is wrong and email not found",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          example: "johndoe@example.com",
          description: "User email",
        },
        password: {
          type: "string",
          example: "Password123!@",
          description: "User password",
        },
      },
    },
  })
  @ApiOkResponse({
    description: "Return a access token and a refresh token",
    example: {
      messages: "Logged in succesfully",
      data: {
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG43QGVtYWlsLmNvbSIsInN1YiI6IjY3MjY2OTY0NzcxZTc2MTM4Mzk5ZGQ4MCIsInJvbGUiOjEsImlhdCI6MTczMTEzODA2NiwiZXhwIjoxNzMxMTM4MzY2fQ.VtUQAhDTeyB0c3N7ewOOOBlUMWKH9mRwLRTLuXWyvN0",
        refreshToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG43QGVtYWlsLmNvbSIsInN1YiI6IjY3MjY2OTY0NzcxZTc2MTM4Mzk5ZGQ4MCIsInJvbGUiOjEsImlhdCI6MTczMTEzODA2NiwiZXhwIjoxNzMxMjI0NDY2fQ.SqxxKMqDxGaCM5uRUR5Gg13oV09kWyBv32C5bO6Mtjw",
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Happen when the user with this email is not found",
    example: {
      messages: "User not found",
      data: null,
    },
  })
  @ApiInternalServerErrorResponse({
    description:
      "Happen when something went wrong, that is not handled by this API, e.g. database error or wrong password",
    example: {
      messages: "Internal Server Error",
      data: null,
    },
  })
  @ApiBadRequestResponse({
    description: "Happen when the provided data is not valid",
    example: {
      messages: [
        "firstName should not be null or undefined",
        "firstName must be a string",
        "firstName should not be empty",
      ],
      data: null,
    },
  })
  async login(@Request() req): Promise<ApiResponse> {
    // Where does req.user came from? It came from the LocalAuthGuard or specifically from the LocalStrategy.
    return {
      messages: "Logged in succesfully",
      data: this.authService.login(req.user),
    };
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Register a new user",
    description:
      "This endpoint will register a new user with the provided data",
  })
  @ApiCreatedResponse({
    description: "Return the registered user",
    example: {
      messages: "User registered succesfully",
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
  @ApiBadRequestResponse({
    description: "Happen when the provided data is not valid",
    example: {
      messages: [
        "firstName should not be null or undefined",
        "firstName must be a string",
        "firstName should not be empty",
      ],
      data: null,
    },
  })
  async register(@Body() createUserDto: BaseCreateUserDto) {
    const hashedPassword = await argon2.hash(createUserDto.password);
    const registrationData = {
      ...createUserDto,
      provider: Provider.LOCAL,
      password: hashedPassword,
    } satisfies CreateUserDto & { provider: Provider.LOCAL };

    const registeredUser = await this.authService.register(registrationData);
    const { provider, role, ...result } = registeredUser;

    return {
      messages: "User registered succesfully",
      data: result,
    };
  }

  @Post("/refresh")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary: "Request for a new access token using a refresh token",
    description:
      "This endpoint will return a new access token using a refresh token. Refresh token should be included in the Authorization header with the Bearer scheme",
  })
  @ApiUnauthorizedResponse({
    description: "Happen when the provided refresh token is invalid",
    example: {
      messages: "Invalid token",
      data: null,
    },
  })
  @ApiBearerAuth()
  async refreshToken(@Request() req) {
    return {
      messages: "New Access Token Generated",
      data: this.authService.refreshToken(req.user),
    };
  }
}
