import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { LanguagesService } from "./languages.service";
import { CreateLanguageDto } from "./dto/create-language.dto";
import { UpdateLanguageDto } from "./dto/update-language.dto";
import { FindByIdParam } from "src/lib/dto/find-by-id-param.dto";
import { HasRoles } from "src/lib/decorators/has-role.decorator";
import { Role } from "src/users/schemas/user.schema";

@Controller("/api/languages")
@HasRoles(Role.ADMIN)
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languagesService.create(createLanguageDto);
  }

  @Get()
  findAll() {
    return this.languagesService.findAll();
  }

  @Get(":id")
  findOne(@Param() findByIdParam: FindByIdParam) {
    return this.languagesService.findOne(findByIdParam.id);
  }

  @Patch(":id")
  update(
    @Param() findByIdParam: FindByIdParam,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ) {
    return this.languagesService.update(findByIdParam.id, updateLanguageDto);
  }

  @Delete(":id")
  remove(@Param() findByIdParam: FindByIdParam) {
    return this.languagesService.remove(findByIdParam.id);
  }
}
