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
import { FindAllQuery } from "./dto/find-all-query.dto";
import { FindByIdParam } from "src/lib/dto/find-by-id-param.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { RoleGuard } from "src/lib/guard/role.guard";
import { checkIfExist, formatGetAllMessages } from "src/utils/response";

@Controller("/api/levels")
@UseGuards(JwtAuthGuard, RoleGuard)
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLevelDto: CreateLevelDto) {
    return {
      messages: "Level created successfully",
      data: await this.levelsService.create(createLevelDto),
    };
  }

  @Get()
  async findAll(@Query() query: FindAllQuery) {
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
  async findOne(@Param() findByIdParam: FindByIdParam) {
    const foundedLevel = checkIfExist(
      await this.levelsService.findOne(findByIdParam.id),
      "Level not found",
    );

    return { messages: "Level founded", data: foundedLevel };
  }

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

  @Delete(":id")
  async remove(@Param() findByIdParam: FindByIdParam) {
    const deletedLevel = checkIfExist(
      await this.levelsService.remove(findByIdParam.id),
      "Level not found",
    );

    return { messages: "Level deleted successfully", data: deletedLevel };
  }
}
