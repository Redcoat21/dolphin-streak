import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserQuery } from './dto/find-user.query';
import { ApiResponse } from 'src/lib/types/response.type';
import { extractPassword } from 'src/lib/utils/user';
import { HasRoles } from 'src/lib/decorators/has-role.decorator';
import { Provider, Role } from './schemas/user.schema';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindByIdParam } from 'src/lib/dto/find-by-id-param.dto';
import { RoleGuard } from 'src/lib/guard/role.guard';
import { formatGetAllMessages } from 'src/lib/utils/response';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/upload/cloudinary.service';
import { BearerTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { SessionService } from 'src/auth/session/session.service';

//TODO: Implement some kind of IP checker, so admin can only access this route from authorized IP.
// If no role are listed, meaning everyone can access it. But just to be safe, write the role that can access the route.
@UseGuards(BearerTokenGuard, RoleGuard)
@Controller('/api/users')
@ApiInternalServerErrorResponse({
  description:
    'Happen when something went wrong, that is not handled by this API, e.g. database error',
  example: {
    message: 'Internal Server Error',
    data: null,
  },
})
@ApiBadRequestResponse({
  description: 'Happen when the provided data is not valid',
  example: {
    message: [
      'firstName should not be null or undefined',
      'firstName must be a string',
      'firstName should not be empty',
    ],
    data: null,
  },
})
@ApiUnauthorizedResponse({
  description:
    'Happen when the user is not authorized, it can either be no bearer token or the role is not allowed',
  example: {
    message: 'Unauthorized',
    data: null,
  },
})
@ApiForbiddenResponse({
  description:
    "Happen because the user doesn't have the right role to access this endpoint",
  example: {
    message: 'Forbidden resource',
    data: null,
  },
})
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly sessionService: SessionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @HasRoles(Role.ADMIN)
  @ApiOperation({
    summary: 'Create a new user using the local strategy',
    description:
      'This endpoint will create a new user. Note that for now it only supports local strategy, as using other strategy will require additional steps. Requires admin role',
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    example: {
      messages: 'User created successfully',
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john0@email.com',
        birthDate: '1996-01-01T00:00:00.000Z',
        profilePicture:
          'https://docs.nestjs.com/assets/logo-small-gradient.svg',
        loginHistories: [],
        languages: [],
        completedCourses: [],
        _id: '672f307741eee3baefa94958',
        createdAt: '2024-11-09T09:50:47.034Z',
        updatedAt: '2024-11-09T09:50:47.034Z',
        provider: Provider.LOCAL,
        role: Role.USER,
        __v: 0,
      },
    },
  })
  @ApiConflictResponse({
    description: 'Happen when the user already exists',
    example: {
      messages: 'User already exists',
      data: null,
    },
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse> {
    console.log({ createUserDto });
    const createdUser = await this.usersService.create({
      ...createUserDto,
      provider: Provider.LOCAL,
    });

    const userResponse = extractPassword(createdUser);

    return {
      messages: 'User created successfully',
      data: userResponse,
    };
  }

  @Get()
  @HasRoles(Role.ADMIN)
  @ApiOperation({
    summary:
      'Find all registered users with the ability to filter it based on firstName or lastName or provider. Requires admin role',
    description: 'Is used to find all users',
  })
  @ApiOkResponse({
    description: 'Return all users',
    example: {
      messages: '2 users founded',
      data: [
        {
          _id: '67230cbd0b53c9081bc2b1c8',
          firstName: 'Johnson',
          lastName: 'Doe',
          email: 'johnsondoe@email.com',
          provider: 0,
          profilePicture: 'https://placehold.jp/150x150.png',
          loginHistories: [],
          role: 1,
          languages: [],
          completedCourses: [],
          createdAt: '2024-10-31T04:51:09.436Z',
          updatedAt: '2024-10-31T04:51:09.436Z',
          __v: 0,
        },
        {
          _id: '67243a4a7507ac0c0d0b56c2',
          firstName: 'Jonathan',
          email: 'joken.e22@mhs.istts.ac.id',
          provider: 0,
          profilePicture: 'https://placehold.jp/150x150.png',
          loginHistories: [],
          role: 1,
          languages: [],
          completedCourses: [],
          createdAt: '2024-11-01T02:17:46.343Z',
          updatedAt: '2024-11-01T02:17:46.343Z',
          __v: 0,
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

    // If both firstName and lastName exist then do an $and query.
    const filter =
      filterConditions.length > 1
        ? { $and: filterConditions }
        : filterConditions[0] || {};

    const foundedUsers = (
      await this.usersService.findAll({ ...filter, role: Role.USER })
    ).map((user) => extractPassword(user));

    const foundedUsersLength = foundedUsers.length;

    return {
      messages: formatGetAllMessages(foundedUsersLength, 'user'),
      data: foundedUsers,
    };
  }

  @Get('active')
  @HasRoles(Role.ADMIN)
  @ApiOperation({
    summary: "Get the active user's session",
    description: 'This can be used to get the number of active users.',
  })
  @ApiOkResponse({
    example: {
      messages: '2 active users found',
      data: [
        {
          _id: '6744990dfe670457cdab5fb5',
          user: {
            _id: '67436ff03081ffddd696a86d',
            email: 'john90@email.com',
          },
          accessToken: {
            token:
              'eb2d6eaeed2dafc8a78def078ee79fea23f87732cdbe4c23db2f9c81c6ca44e85bcb236b3d5caf92c908f289d4ca8c38493a2d615074183ba2a3af1b70ec91fa',
            expires: '2024-11-25T16:04:37.378Z',
            _id: '6744990dfe670457cdab5fb6',
          },
          refreshToken: {
            token:
              '0edcd40f34a30c25b2083d874aa2d3d59fc0525463e83015df955f7d774910891609ced391dc9e0784b9ea5f3f8d39983e354ccc4b9bec51c1a8220349867765',
            expires: '2024-11-26T15:34:37.380Z',
            _id: '6744990dfe670457cdab5fb7',
          },
          isActive: true,
          deviceInfo: {
            userAgent: 'bruno-runtime/1.33.1',
            ip: '::1',
            _id: '6744990dfe670457cdab5fb8',
          },
          lastActive: '2024-11-25T15:34:37.483Z',
          createdAt: '2024-11-25T15:34:37.493Z',
          updatedAt: '2024-11-25T15:34:37.493Z',
          __v: 0,
        },
        {
          _id: '6746d1b3b7af28a58743e4df',
          user: {
            _id: '672f0d291a890f507777cb0e',
            email: 'admin1234@email.com',
          },
          accessToken: {
            token:
              'c628417e90d06bab93a8d6161fae47e807e085f56a6de62b276cf7a15aa3780151b6fbd6194513c5f2c4c03356a599bb8c1c828be03607469492522cf61c406d',
            expires: '2024-11-27T08:30:51.543Z',
            _id: '6746d1b3b7af28a58743e4e0',
          },
          refreshToken: {
            token:
              '2e204bf83569f8b6057a9dcdbd714f7a344e75d4c46fc2b98df9cb540d5c0a2842c990365f9c6a0758fdf61a0ee04f5170611677a64f5a777e1ecb062cd359ec',
            expires: '2024-11-28T08:00:51.545Z',
            _id: '6746d1b3b7af28a58743e4e1',
          },
          isActive: true,
          deviceInfo: {
            userAgent: 'bruno-runtime/1.33.1',
            ip: '::1',
            _id: '6746d1b3b7af28a58743e4e2',
          },
          lastActive: '2024-11-27T08:00:51.654Z',
          createdAt: '2024-11-27T08:00:51.661Z',
          updatedAt: '2024-11-27T08:00:51.661Z',
          __v: 0,
        },
      ],
    },
  })
  async getActiveUsers(): Promise<ApiResponse> {
    // We get the active users count from the number of active token.
    const users = await this.sessionService.find({
      isActive: true,
    });

    return {
      messages: formatGetAllMessages(users.length, 'active user'),
      data: users,
    };
  }

  @Get(':id')
  @HasRoles(Role.ADMIN, Role.USER)
  @ApiOperation({
    summary: 'Find a user by id',
    description: 'Is used to find a user by id',
  })
  @ApiOkResponse({
    description: 'Return the user',
    example: {
      messages: 'User founded',
      data: {
        _id: '67230cbd0b53c9081bc2b1c8',
        firstName: 'Johnson',
        lastName: 'Doe',
        email: 'johnsondoe@email.com',
        provider: 0,
        profilePicture: 'https://placehold.jp/150x150.png',
        loginHistories: [],
        role: 1,
        languages: [],
        completedCourses: [],
        createdAt: '2024-10-31T04:51:09.436Z',
        updatedAt: '2024-10-31T04:51:09.436Z',
        __v: 0,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Happen when the user is not found',
    example: {
      messages: 'User not founded',
      data: null,
    },
  })
  @ApiBadRequestResponse({
    description: 'Happen when the given id is not a valid mongodb id',
    example: {
      messages: ['id must be a mongodb id'],
      data: null,
    },
  })
  async findOne(@Param() findOneParam: FindByIdParam): Promise<ApiResponse> {
    const foundedUser = await this.usersService.findOne({
      _id: findOneParam.id,
    });

    if (!foundedUser) {
      throw new HttpException('User not founded', 404);
    }

    const userResponse = extractPassword(foundedUser);

    return {
      messages: 'User founded',
      data: userResponse,
    };
  }

  // get the current user lives
  @Get('/user/lives')
  @HasRoles(Role.USER)
  async getLives(
    @Req() request: Request
  ): Promise<any> {
    const userId = request.user._id.toString();
    const user = await this.usersService.findOne({
      _id: userId
    })

    return user.lives;
  }


  //TODO: Will need review here, if given null or empty will it still update?
  @Patch(':id')
  @HasRoles(Role.ADMIN, Role.USER)
  @ApiOperation({
    summary: 'Update a user by id',
    description:
      'Is used to update a user by id, note that the body is optional. If given nothing, then it will update nothing.',
  })
  @ApiOkResponse({
    description: 'Return the updated user',
    example: {
      messages: 'User updated successfully',
      data: {
        _id: '67230cbd0b53c9081bc2b1c8',
        firstName: 'Billie Jean',
        lastName: 'Doe',
        email: 'johnsondoe@email.com',
        provider: 0,
        profilePicture: 'https://placehold.jp/150x150.png',
        loginHistories: [],
        role: 1,
        languages: [],
        completedCourses: [],
        createdAt: '2024-10-31T04:51:09.436Z',
        updatedAt: '2024-11-09T10:51:46.119Z',
        __v: 0,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Happen when the user is not found',
    example: {
      messages: 'User not founded',
      data: null,
    },
  })
  @ApiBadRequestResponse({
    description: 'Happen when the given id is not a valid mongodb id',
    example: {
      messages: ['id must be a mongodb id'],
      data: null,
    },
  })
  async update(
    @Param() findOneParam: FindByIdParam,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse> {
    // Extracted the password and role since this two should'have never been updated directly.
    const { password, role, ...newUpdateUserDto } = updateUserDto;
    const updatedUser = await this.usersService.update(
      findOneParam.id,
      newUpdateUserDto,
    );

    if (!updatedUser) {
      throw new HttpException('User not founded', 404);
    }

    const userResponse = extractPassword(updatedUser);

    return {
      messages: 'User updated successfully',
      data: userResponse,
    };
  }

  @Delete(':id')
  @HasRoles(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete a user by id',
    description: 'Is used to delete a user by id',
  })
  @ApiOkResponse({
    description: 'Return the deleted user',
    example: {
      messages: 'User updated successfully',
      data: {
        _id: '67230cbd0b53c9081bc2b1c8',
        firstName: 'Billie Jean',
        lastName: 'Doe',
        email: 'johnsondoe@email.com',
        provider: 0,
        profilePicture: 'https://placehold.jp/150x150.png',
        loginHistories: [],
        role: 1,
        languages: [],
        completedCourses: [],
        createdAt: '2024-10-31T04:51:09.436Z',
        updatedAt: '2024-11-09T10:51:46.119Z',
        __v: 0,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Happen when the user is not found',
    example: {
      messages: 'User not founded',
      data: null,
    },
  })
  @ApiBadRequestResponse({
    description: 'Happen when the given id is not a valid mongodb id',
    example: {
      messages: ['id must be a mongodb id'],
      data: null,
    },
  })
  async remove(@Param() deleteUserParam: FindByIdParam): Promise<ApiResponse> {
    const deletedUser = await this.usersService.remove(deleteUserParam.id);

    if (!deletedUser) {
      throw new HttpException('User not founded', 404);
    }

    const userResponse = extractPassword(deletedUser);

    return {
      messages: 'User deleted successfully',
      data: userResponse,
    };
  }

  @ApiOperation({
    summary: "Upload a user's profile picture",
    description:
      "Is used to upload a user's profile picture. Sorry that no body example in here, i don't know how",
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profilePicture: {
          type: 'string',
          format: 'binary',
          description: 'The profile picture to upload',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Return the uploaded profile picture',
    example: {
      messages: 'Profile picture uploaded successfully',
      data: {
        imageUrl: 'https://placehold.jp/150x150.png',
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      "Happen when the user doesn't upload a file or the file MIME type is not allowed",
    example: {
      messages: 'Validation failed (expected type is /(jpg|jpeg|png|webp)$/)',
      data: null,
    },
  })
  @ApiBadGatewayResponse({
    description:
      'Happen when the image failed to upload to Cloudinary, it can be because of the network or the image itself',
    example: {
      messages: 'Failed to upload image to Cloudinary',
      data: null,
    },
  })
  @Patch(':id/profile-picture')
  @UseInterceptors(FileInterceptor('profilePicture'))
  @HasRoles(Role.ADMIN, Role.USER)
  async uploadProfilePicture(
    @Param() findOneParam: FindByIdParam,
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
    )
    file: Express.Multer.File,
  ): Promise<ApiResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const imageUrl = await this.cloudinaryService.uploadImage(
        file,
        findOneParam.id,
        'profile_pictures',
      );

      await this.update(findOneParam, { profilePicture: imageUrl });
      return {
        messages: 'Profile picture uploaded successfully',
        data: {
          imageUrl,
        },
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to upload image to Cloudinary',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
