import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get, // Import the Get decorator
  HttpCode,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { ApiResponse } from "src/lib/types/response.type";
import { BaseCreateUserDto } from "src/lib/dto/base-create-user.dto";
import { Provider, Role, User } from "src/users/schemas/user.schema";
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
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { Request } from "express";
import mongoose from "mongoose";
import { RefreshTokenDto } from "./session/dto/refresh-token.dto";
import { BearerTokenGuard } from "./guard/bearer-token.guard";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { SessionService } from "./session/session.service";
import { HasRoles } from "src/lib/decorators/has-role.decorator";
import { extractPassword } from "src/lib/utils/user";
import { UsersService } from "src/users/users.service";
import { UpdateUserByTokenDto } from "./session/dto/update-by-token.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FindByIdParam } from "src/lib/dto/find-by-id-param.dto";
import { CloudinaryService } from "src/upload/cloudinary.service";

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
    private readonly sessionService: SessionService,
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
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
          "4c0f56ce318b455b8e6d50411448f8f25b9e5b2d010d895095a7de3fd09f39eb50c90c95dc4a20f1fd38694a23b6ab3298ba56e6d74bb95d634980948321e362",
        refreshToken:
          "c43d6350daa4f8c4b6bdd8d8b58836516f97a03bbae9ee17a21a5d117efc110ee70817cad05b37b249b3569842be021e318490f897d07966ff73267b1d5cae13",
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
  async login(
    @Req() req: Request & {
      user: Omit<User, "password"> & { _id: mongoose.Types.ObjectId };
    },
    @Body("rememberMe") rememberMe?: boolean,
  ): Promise<ApiResponse> {
    console.log({ rememberMe });
    const data = await this.authService.login(req, rememberMe);
    return {
      messages: "Logged in succesfully",
      data: data,
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
    const registrationData = {
      ...createUserDto,
      provider: Provider.LOCAL,
    } satisfies CreateUserDto & { provider: Provider.LOCAL };

    const registeredUser = await this.authService.register(registrationData);
    const { provider, role, ...result } = registeredUser;

    return {
      messages: "User registered succesfully",
      data: result,
    };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Request for a new access token using a refresh token",
    description:
      "This endpoint will return a new access token using a refresh token. Refresh token should be included in the body",
  })
  @ApiUnauthorizedResponse({
    description: "Happen when the provided refresh token is invalid",
    example: {
      messages: "Invalid token",
      data: null,
    },
  })
  @ApiOkResponse({
    description: "Return a new access token",
    example: {
      messages: "New Access Token Generated",
      data: {
        accessToken:
          "08834bfeac5691a6cbf3a505f1e38773a36889d2b7324fb206aa55dc194b08fd718b411fc419fa5ef95febe160a6c202c482490df755bf64fa6fefe3f6c47ff2",
      },
    },
  })
  @ApiBearerAuth()
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return {
      messages: "New Access Token Generated",
      data: await this.authService.refreshToken(refreshToken.refreshToken),
    };
  }

  @ApiOperation({
    summary: "Request for a password reset",
    description:
      "This endpoint will send a password reset instructions to the provided email",
  })
  @ApiOkResponse({
    description: "Return a success message",
    example: {
      messages: "Password reset instructions have been sent to your email",
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description: "Happen when the user with this email is not found",
    example: {
      messages: "User not found",
      data: null,
    },
  })
  @Post("forgot-password")
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ApiResponse> {
    await this.authService.sendPasswordResetEmail(forgotPasswordDto.email);
    return {
      messages: "Password reset instructions have been sent to your email",
      data: null,
    };
  }

  @ApiOperation({
    summary: "Reset the password",
    description:
      "This endpoint will reset the password using the provided token and new password",
  })
  @ApiUnauthorizedResponse({
    description: "Happen when the provided token is invalid",
    example: {
      messages: "Invalid token! Token doesn't match",
      data: null,
    },
  })
  @ApiOkResponse({
    description: "Return a success message",
    example: {
      messages: "Password resetted successfully",
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description: "Happen when the user with this token is not found",
    example: {
      messages: "Invalid token given! User not found",
      data: null,
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post("reset-password")
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ApiResponse> {
    await this.authService.resetPassword(
      resetPasswordDto.encryptedPayload,
      resetPasswordDto.iv,
      resetPasswordDto.newPassword,
    );

    return {
      messages: "Password resetted successfully",
      data: null,
    };
  }

  @ApiOperation({
    summary: "Logout the user",
    description:
      "This endpoint will logout the user. Note that this route will also delete the refresh token to prevent reuse.",
  })
  @ApiOkResponse({
    description: "Logged out succesfully",
    example: {
      messages: "Logged out successfully",
      data: null,
    },
  })
  @ApiUnauthorizedResponse({
    description: "Happen when the access token is no longer valid.",
    example: {
      messages: "Invalid or expired token",
      data: null,
    },
  })
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerTokenGuard)
  async logout(@Req() req: Request): Promise<ApiResponse> {
    //@ts-ignore
    await this.authService.logout(req.user._id.toString());
    return {
      messages: "Logged out successfully",
      data: null,
    };
  }

  @Get("profile")
  @ApiOperation({
    summary: "Get user profile information using access token",
    description:
      "This endpoint retrieves the user's profile information based on the provided valid access token.",
  })
  @ApiOkResponse({
    description: "Successfully retrieved user profile",
    // You might want to define a specific DTO for the user profile to avoid exposing sensitive information
    // and provide a more accurate response structure.
    // Example:
    // type: UserProfileResponseDto,
    // isArray: false,
    example: {
      messages: "User profile retrieved successfully",
      data: {
        _id: "672f307741eee3baefa94958",
        firstName: "John",
        lastName: "Doe",
        email: "john0@email.com",
        birthDate: "1996-01-01T00:00:00.000Z",
        loginHistories: [],
        languages: [],
        completedCourses: [],
        createdAt: "2024-11-09T09:50:47.034Z",
        updatedAt: "2024-11-09T09:50:47.034Z",
        __v: 0,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Happen when the access token is invalid or expired.",
    example: {
      messages: "Invalid or expired token",
      data: null,
    },
  })
  @UseGuards(BearerTokenGuard)
  async getProfile(@Req() req: Request): Promise<ApiResponse> {
    //@ts-ignore
    const userId = req.user._id.toString();
    const user = await this.authService.getUserProfile(userId);
    return {
      messages: "User profile retrieved successfully",
      data: user,
    };
  }

  @Put("users")
  @UseGuards(BearerTokenGuard)
  async update(
    @Body() updateUserByTokenDto: UpdateUserByTokenDto,
  ): Promise<ApiResponse> {
    // Extracted the password and role since this two should'have never been updated directly.
    const { password, role, ...newUpdateUserDto } = updateUserByTokenDto;

    const { user } = await this.sessionService.findOne({
      "accessToken.token": updateUserByTokenDto.accessToken,
    });

    if (!user) {
      throw new HttpException("User not founded", 404);
    }

    const updatedUser = await this.usersService.update(
      //@ts-ignore
      user._id,
      newUpdateUserDto,
    );

    const userResponse = extractPassword(updatedUser);

    return {
      messages: "User updated successfully",
      data: userResponse,
    };
  }

  @Put("users/profile-picture")
  @UseInterceptors(FileInterceptor("profilePicture"))
  @UseGuards(BearerTokenGuard)
  async uploadProfilePicture(
    @Body("accessToken") accessToken: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 5 MB
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        errorHttpStatusCode: 400,
        exceptionFactory: (errors) => {
          throw new HttpException(errors, 400);
        },
      }),
    ) file: Express.Multer.File,
  ): Promise<ApiResponse> {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    const { user } = await this.sessionService.findOne({
      "accessToken.token": accessToken,
    });

    if (!user) {
      throw new HttpException("User not founded", 404);
    }

    //@ts-ignore
    const userId = user._id;

    try {
      const imageUrl = await this.cloudinaryService.uploadImage(
        file,
        userId,
      );

      await this.usersService.update(userId, { profilePicture: imageUrl });
      return {
        messages: "Profile picture uploaded successfully",
        data: {
          imageUrl,
        },
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Failed to upload image to Cloudinary",
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
