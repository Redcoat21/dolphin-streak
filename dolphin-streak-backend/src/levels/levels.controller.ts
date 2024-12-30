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
import { LevelsService } from "./levels.service";
import { CreateLevelDto } from "./dto/create-level.dto";
import { UpdateLevelDto } from "./dto/update-level.dto";
import { FindAllLevelsQuery } from "./dto/find-all-query.dto";
import { FindByIdParam } from "src/lib/dto/find-by-id-param.dto";
import { RoleGuard } from "src/lib/guard/role.guard";
import { checkIfExist, formatGetAllMessages } from "src/lib/utils/response";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { HasRoles } from "src/lib/decorators/has-role.decorator";
import { Role } from "src/users/schemas/user.schema";
import { BearerTokenGuard } from "src/auth/guard/bearer-token.guard";

@Controller("/api/levels")
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
@ApiBearerAuth()
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new level",
    description: "Create a new level with the data provided in the body",
  })
  @ApiCreatedResponse({
    description: "The level has been successfully created.",
    example: {
      message: "Level created successfully",
      data: {
        name: "Level 3",
        language: "6732299a3b7d4ef48a34278c",
        _id: "673229a43b7d4ef48a34278e",
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Happen when the request body is not valid",
    example: {
      messages: [
        "name must be a string",
        "language must be a mongodb id",
      ],
      data: null,
    },
  })
  async create(@Body() createLevelDto: CreateLevelDto) {
    return {
      messages: "Level created successfully",
      data: await this.levelsService.create(createLevelDto),
    };
  }

  @ApiOperation({
    summary: "Get all levels",
    description: "Get all levels with the option to filter by language",
  })
  @ApiOkResponse({
    description: "Levels found",
    example: {
      messages: "2 levels found",
      data: [
        {
          _id: "671afc7bc0a7ef4e76079383",
          name: "Level 1",
          language: null,
          __v: 0,
        },
        {
          _id: "673229813b7d4ef48a342788",
          name: "Level 2",
          language: null,
          __v: 0,
        },
      ],
    },
  })
  @Get()
  async findAll(@Query() query: FindAllLevelsQuery) {
    const foundedLevels = await this.levelsService.findAll(
      query.language ? { language: query.language } : undefined,
    )
      .populate(
        "language",
      );

    return {
      messages: formatGetAllMessages(foundedLevels.length, "level"),
      data: foundedLevels,
    };
  }
  
  @Get(":id")
  @ApiOperation({
    summary: "Get a level by id",
    description: "Get a level by the id provided in the parameter along with its questions",
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
  @ApiOkResponse({
    description: "Level and related questions retrieved successfully",
    example: {
      messages: "Level and questions retrieved successfully",
      data: {
        level: {
          _id: "671afc7bc0a7ef4e76079383",
          name: "Level 1",
          // other level fields...
        },
        questions: [
          {
            _id: "67361a7345664a2c0ba35041",
            type: 0,
            // other question fields...
          },
          // more questions...
        ],
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Happen when the level is not found",
    example: {
      messages: "Level not found",
      data: null,
    },
  })
  async findOne(@Param() findByIdParam: FindByIdParam) {
    const foundedLevel = checkIfExist(
      await this.levelsService.findOneLevelsAndGetQuestions(findByIdParam.id),
      "Level not found",
    );

    return { messages: "Level founded", data: foundedLevel };
  }

  @ApiOperation({
    summary: "Update a level",
    description: "Update a level with the data provided in the body",
  })
  @ApiOkResponse({
    description: "Level updated successfully",
    example: {
      messages: "Level updated successfully",
      data: {
        _id: "671afc7bc0a7ef4e76079383",
        name: "Level 1",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Happen when the id parameter is not a valid mongodb id",
    example: {
      messages: [
        "id must be a mongodb id",
      ],
    },
  })
  @ApiNotFoundResponse({
    description: "Happen when the level is not found",
    example: {
      messages: "Level not found",
      data: null,
    },
  })
  @Patch(":id")
  async update(
    @Param() findByIdParam: FindByIdParam,
    @Body() updateLevelDto: UpdateLevelDto,
  ) {
    const updatedLevel = checkIfExist(
      await this.levelsService.update(
        findByIdParam.id,
        updateLevelDto,
      ),
      "Level not found",
    );

    return { messages: "Level updated successfully", data: updatedLevel };
  }

  @ApiOperation({
    summary: "Delete a level",
    description: "Delete a level by the id provided in the parameter",
  })
  @ApiOkResponse({
    description: "Level deleted successfully",
    example: {
      messages: "Level deleted successfully",
      data: {
        _id: "671afc7bc0a7ef4e76079383",
        name: "Level 1",
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
    description: "Happen when the level is not found",
    example: {
      messages: "Level not found",
      data: null,
    },
  })
  @Delete(":id")
  async remove(@Param() findByIdParam: FindByIdParam) {
    const deletedLevel = checkIfExist(
      await this.levelsService.remove(findByIdParam.id),
      "Level not found",
    );

    return { messages: "Level deleted successfully", data: deletedLevel };
  }
}
