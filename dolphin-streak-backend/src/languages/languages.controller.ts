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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { FindByIdParam } from 'src/lib/dto/find-by-id-param.dto';
import { HasRoles } from 'src/lib/decorators/has-role.decorator';
import { Role } from 'src/users/schemas/user.schema';
import { RoleGuard } from 'src/lib/guard/role.guard';
import { checkIfExist, formatGetAllMessages } from 'src/lib/utils/response';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BearerTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from 'src/lib/types/response.type';
import { CloudinaryService } from 'src/upload/cloudinary.service';

@Controller('/api/languages')
@UseGuards(BearerTokenGuard, RoleGuard)
@HasRoles(Role.ADMIN)
@ApiUnauthorizedResponse({
  description:
    "Happen because the user is not authorized (doesn't have a valid access token)",
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
@ApiInternalServerErrorResponse({
  description:
    'Happen when something went wrong, that is not handled by this API, e.g. database error',
  example: {
    message: 'Internal Server Error',
    data: null,
  },
})
@ApiBearerAuth()
export class LanguagesController {
  constructor(
    private readonly languagesService: LanguagesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiOperation({
    summary: 'Create a new language',
    description: 'This endpoint will create a new language',
  })
  @ApiCreatedResponse({
    description: 'Language created successfully',
    example: {
      messages: 'Language created successfully',
      data: {
        _id: '612a4b7e8c4e2c001f1f8c5a',
        name: 'English',
        image:
          'https://cdn.countryflags.com/thumbs/united-states-of-america/flag-3d-round-250.png',
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Happen when the request body is not valid',
    example: {
      messages: [
        'name should not be empty',
        'name must be a string',
        'name must be longer than or equal to 3 characters',
        'image should not be empty',
        'image must be a string',
        'image must be longer than or equal to 3 characters',
      ],
      data: null,
    },
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createLanguageDto: CreateLanguageDto) {
    return {
      messages: 'Language created succesfully',
      data: await this.languagesService.create(createLanguageDto),
    };
  }

  @ApiOperation({
    summary: 'Get all languages',
    description: 'This endpoint will return all languages',
  })
  @ApiOkResponse({
    description: 'Languages founded',
    example: {
      messages: 'Successfully get all languages',
      data: [
        {
          _id: '612a4b7e8c4e2c001f1f8c5a',
          name: 'English',
          image:
            'https://cdn.countryflags.com/thumbs/united-states-of-america/flag-3d-round-250.png',
          __v: 0,
        },
      ],
    },
  })
  @Get()
  async findAll() {
    const foundedLanguages = await this.languagesService.findAll();
    return {
      messages: formatGetAllMessages(foundedLanguages.length, 'language'),
      data: await this.languagesService.findAll(),
    };
  }

  @ApiOperation({
    summary: 'Get one language',
    description: 'This endpoint will return one language',
  })
  @ApiOkResponse({
    description: 'Language founded',
    example: {
      messages: 'Language founded',
      data: {
        _id: '612a4b7e8c4e2c001f1f8c5a',
        name: 'English',
        image:
          'https://cdn.countryflags.com/thumbs/united-states-of-america/flag-3d-round-250.png',
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Happen when the id parameter is not a valid mongodb id',
    example: {
      messages: ['id must be a mongodb id'],
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description: 'Happen when the language is not found',
    example: {
      messages: 'Language not found',
      data: null,
    },
  })
  @Get(':id')
  async findOne(@Param() findByIdParam: FindByIdParam) {
    const foundedLanguage = checkIfExist(
      await this.languagesService.findOne(findByIdParam.id),
      'Language not found',
    );

    return {
      messages: 'Language founded',
      data: foundedLanguage,
    };
  }

  //TODO: Need to check if update is empty, will it still update?
  @ApiOperation({
    summary: 'Update a language',
    description: 'This endpoint will update a language',
  })
  @ApiOkResponse({
    description: 'Language updated successfully',
    example: {
      messages: 'Language updated successfully',
      data: {
        _id: '612a4b7e8c4e2c001f1f8c5a',
        name: 'English',
        image:
          'https://cdn.countryflags.com/thumbs/united-states-of-america/flag-3d-round-250.png',
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Happen when the given id is not a valid mongodb id',
    example: {
      messages: ['id must be a mongodb id'],
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description: 'Happen when the language is not found',
    example: {
      messages: 'Language not found',
      data: null,
    },
  })
  @Patch(':id')
  async update(
    @Param() findByIdParam: FindByIdParam,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ) {
    const updatedLanguage = checkIfExist(
      await this.languagesService.update(findByIdParam.id, updateLanguageDto),
      'Language not found',
    );

    return {
      messages: 'Language updated successfully',
      data: updatedLanguage,
    };
  }

  @ApiOperation({
    summary: 'Delete a language',
    description: 'This endpoint will delete a language',
  })
  @ApiOkResponse({
    description: 'Language deleted successfully',
    example: {
      messages: 'Language deleted successfully',
      data: {
        _id: '612a4b7e8c4e2c001f1f8c5a',
        name: 'English',
        image:
          'https://cdn.countryflags.com/thumbs/united-states-of-america/flag-3d-round-250.png',
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Happen when the given id is not a valid mongodb id',
    example: {
      messages: ['id must be a mongodb id'],
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description: 'Happen when the language is not found',
    example: {
      messages: 'Language not found',
      data: null,
    },
  })
  @Delete(':id')
  async remove(@Param() findByIdParam: FindByIdParam) {
    const deletedLanguage = checkIfExist(
      await this.languagesService.remove(findByIdParam.id),
      'Language not found',
    );

    return {
      messages: 'Language deleted successfully',
      data: deletedLanguage,
    };
  }

  @ApiOperation({
    summary: "Upload a language's thumbnail picture",
    description:
      "Is used to upload a language's thumbnail picture. Sorry that no body example in here, i don't know how",
  })
  @ApiOkResponse({
    description: 'Return the uploaded thumbnail picture',
    example: {
      messages: 'Thumbnail picture uploaded successfully',
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
  @Patch(':id/thumbnail')
  @UseInterceptors(FileInterceptor('thumbnail'))
  @HasRoles(Role.ADMIN)
  async uploadThumbnailPicture(
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
        'languages_thumbnail',
      );

      await this.update(findOneParam, { image: imageUrl });
      return {
        messages: 'Thumbnail picture uploaded successfully',
        data: {
          imageUrl,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Failed to upload image to Cloudinary',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
