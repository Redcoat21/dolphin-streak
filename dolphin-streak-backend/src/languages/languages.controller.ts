import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { LanguagesService } from "./languages.service";
import { CreateLanguageDto } from "./dto/create-language.dto";
import { UpdateLanguageDto } from "./dto/update-language.dto";
import { FindByIdParam } from "src/lib/dto/find-by-id-param.dto";
import { HasRoles } from "src/lib/decorators/has-role.decorator";
import { Role } from "src/users/schemas/user.schema";
import { RoleGuard } from "src/lib/guard/role.guard";
import { checkIfExist, formatGetAllMessages } from "src/lib/utils/response";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { BearerTokenGuard } from "src/auth/guard/bearer-token.guard";

@Controller("/api/languages")
@UseGuards(BearerTokenGuard, RoleGuard)
@HasRoles(Role.ADMIN)
@ApiUnauthorizedResponse({
  description:
    "Happen because the user is not authorized (doesn't have a valid access token)",
  example: {
    message: "Unauthorized",
    data: null,
  },
})
@ApiForbiddenResponse({
  description:
    "Happen because the user doesn't have the right role to access this endpoint",
  example: {
    message: "Forbidden resource",
    data: null,
  },
})
@ApiInternalServerErrorResponse({
  description:
    "Happen when something went wrong, that is not handled by this API, e.g. database error",
  example: {
    message: "Internal Server Error",
    data: null,
  },
})
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @ApiOperation({
    summary: "Create a new language",
    description: "This endpoint will create a new language",
  })
  @ApiCreatedResponse({
    description: "Language created successfully",
    example: {
      messages: "Language created successfully",
      data: {
        _id: "612a4b7e8c4e2c001f1f8c5a",
        name: "English",
        image:
          "https://cdn.countryflags.com/thumbs/united-states-of-america/flag-3d-round-250.png",
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Happen when the request body is not valid",
    example: {
      messages: [
        "name should not be empty",
        "name must be a string",
        "name must be longer than or equal to 3 characters",
        "image should not be empty",
        "image must be a string",
        "image must be longer than or equal to 3 characters",
      ],
      data: null,
    },
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createLanguageDto: CreateLanguageDto) {
    return {
      messages: "Language created succesfully",
      data: await this.languagesService.create(createLanguageDto),
    };
  }

  @ApiOperation({
    summary: "Get all languages",
    description: "This endpoint will return all languages",
  })
  @ApiOkResponse({
    description: "Languages founded",
    example: {
      messages: "Successfully get all languages",
      data: [
        {
          _id: "612a4b7e8c4e2c001f1f8c5a",
          name: "English",
          image:
            "https://cdn.countryflags.com/thumbs/united-states-of-america/flag-3d-round-250.png",
          __v: 0,
        },
      ],
    },
  })
  @Get()
  async findAll() {
    const foundedLanguages = await this.languagesService.findAll();
    return {
      messages: formatGetAllMessages(foundedLanguages.length, "language"),
      data: await this.languagesService.findAll(),
    };
  }

  @ApiOperation({
    summary: "Get one language",
    description: "This endpoint will return one language",
  })
  @ApiOkResponse({
    description: "Language founded",
    example: {
      messages: "Language founded",
      data: {
        _id: "612a4b7e8c4e2c001f1f8c5a",
        name: "English",
        image:
          "https://cdn.countryflags.com/thumbs/united-states-of-america/flag-3d-round-250.png",
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Happen when the id parameter is not a valid mongodb id",
    example: {
      messages: [
        "id must be a mongodb id",
      ],
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description: "Happen when the language is not found",
    example: {
      messages: "Language not found",
      data: null,
    },
  })
  @Get(":id")
  async findOne(@Param() findByIdParam: FindByIdParam) {
    const foundedLanguage = checkIfExist(
      await this.languagesService.findOne(
        findByIdParam.id,
      ),
      "Language not found",
    );

    return {
      messages: "Language founded",
      data: foundedLanguage,
    };
  }

  //TODO: Need to check if update is empty, will it still update?
  @ApiOperation({
    summary: "Update a language",
    description: "This endpoint will update a language",
  })
  @ApiOkResponse({
    description: "Language updated successfully",
    example: {
      messages: "Language updated successfully",
      data: {
        _id: "612a4b7e8c4e2c001f1f8c5a",
        name: "English",
        image:
          "https://cdn.countryflags.com/thumbs/united-states-of-america/flag-3d-round-250.png",
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Happen when the given id is not a valid mongodb id",
    example: {
      messages: [
        "id must be a mongodb id",
      ],
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description: "Happen when the language is not found",
    example: {
      messages: "Language not found",
      data: null,
    },
  })
  @Patch(":id")
  async update(
    @Param() findByIdParam: FindByIdParam,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ) {
    const updatedLanguage = checkIfExist(
      await this.languagesService.update(
        findByIdParam.id,
        updateLanguageDto,
      ),
      "Language not found",
    );

    return {
      messages: "Language updated successfully",
      data: updatedLanguage,
    };
  }

  @ApiOperation({
    summary: "Delete a language",
    description: "This endpoint will delete a language",
  })
  @ApiOkResponse({
    description: "Language deleted successfully",
    example: {
      messages: "Language deleted successfully",
      data: {
        _id: "612a4b7e8c4e2c001f1f8c5a",
        name: "English",
        image:
          "https://cdn.countryflags.com/thumbs/united-states-of-america/flag-3d-round-250.png",
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Happen when the given id is not a valid mongodb id",
    example: {
      messages: [
        "id must be a mongodb id",
      ],
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description: "Happen when the language is not found",
    example: {
      messages: "Language not found",
      data: null,
    },
  })
  @Delete(":id")
  async remove(@Param() findByIdParam: FindByIdParam) {
    const deletedLanguage = checkIfExist(
      await this.languagesService.remove(
        findByIdParam.id,
      ),
      "Language not found",
    );

    return {
      messages: "Language deleted successfully",
      data: deletedLanguage,
    };
  }
}
