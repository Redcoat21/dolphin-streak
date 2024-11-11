import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
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
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { checkIfExist, formatGetAllMessages } from "src/utils/response";

@Controller("/api/languages")
@UseGuards(JwtAuthGuard, RoleGuard)
@HasRoles(Role.ADMIN)
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  async create(@Body() createLanguageDto: CreateLanguageDto) {
    return {
      messages: "Language created succesfully",
      data: await this.languagesService.create(createLanguageDto),
    };
  }

  @Get()
  async findAll() {
    const foundedLanguages = await this.languagesService.findAll();
    return {
      messages: formatGetAllMessages(foundedLanguages.length, "language"),
      data: await this.languagesService.findAll(),
    };
  }

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
