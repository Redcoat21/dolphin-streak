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
  Query,
  UseGuards,
} from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { checkIfExist, formatGetAllMessages } from "src/lib/utils/response";
import { FindByIdParam } from "src/lib/dto/find-by-id-param.dto";
import { FilterQuery } from "mongoose";
import { Course } from "./schemas/course.schema";
import { FindAllCourseQuery } from "./dto/find-all-query.dto";
import { RoleGuard } from "src/lib/guard/role.guard";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { HasRoles } from "src/lib/decorators/has-role.decorator";
import { Role } from "src/users/schemas/user.schema";

@Controller("/api/courses")
@UseGuards(JwtAuthGuard, RoleGuard)
@HasRoles(Role.ADMIN)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCourseDto: CreateCourseDto) {
    return {
      messages: "Course created succesfully",
      data: await this.coursesService.create(createCourseDto),
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() findAllQuery: FindAllCourseQuery,
  ) {
    const filter: FilterQuery<Course> = {};

    if (findAllQuery.language) {
      filter.language = findAllQuery.language;
    }

    if (findAllQuery.type) {
      filter.type = findAllQuery.type;
    }

    const foundedCourses = await this.coursesService.findAll(filter);

    return {
      messages: formatGetAllMessages(foundedCourses.length, "course"),
      data: foundedCourses,
    };
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param() findByIdParam: FindByIdParam) {
    const foundedLanguage = checkIfExist(
      await this.coursesService.findOne(findByIdParam.id),
      "Course not found",
    );
    return {
      messages: "Course found",
      data: foundedLanguage,
    };
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  async update(
    @Param() findByIdParam: FindByIdParam,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const updatedCourse = checkIfExist(
      await this.coursesService.update(findByIdParam.id, updateCourseDto),
      "Course not found",
    );
    return {
      messages: "Course updated succesfully",
      data: updatedCourse,
    };
  }

  @Delete(":id")
  async remove(@Param() findByIdParam: FindByIdParam) {
    const deletedCourse = checkIfExist(
      await this.coursesService.remove(findByIdParam.id),
      "Course not found",
    );

    return {
      messages: "Course deleted succesfully",
      data: deletedCourse,
    };
  }
}
