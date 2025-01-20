import { Controller, Get, Param, Render, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { LanguagesService } from 'src/languages/languages.service';
import { CourseDocument, CourseType } from 'src/courses/schemas/course.schema';
import {CoursesService} from "src/courses/courses.service";

@Controller()
@ApiExcludeController()
export class ViewController {
  private readonly backendUrl: string;
  private readonly isAdmin: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly languagesService: LanguagesService,
    private readonly coursesService: CoursesService,
  ) {
    this.backendUrl = this.configService.get<string>('BACKEND_URL');
    this.isAdmin = this.configService.get<boolean>('IS_ADMIN');
    console.log('IS_ADMIN:', this.isAdmin); // Log the IS_ADMIN value
  }

  @Get(['/', '/homepage'])
  getHome(@Res() res: Response): void {
    this.handleAdminAccess(res, 'index');
  }

  @Get('/login')
  getLogin(@Res() res: Response): void {
    this.handleAdminAccess(res, 'login/index');
  }

  @Get('/users/add-user')
  getAddUser(@Res() res: Response): void {
    this.handleAdminAccess(res, 'users/add-user/index');
  }

  @Get('/users')
  getUsers(@Res() res: Response): void {
    this.handleAdminAccess(res, 'users/index');
  }

  @Get('/users/:id')
  async getUserById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    this.handleAdminAccess(res, 'users/id');
  }

  @Get('/languages')
  getLanguages(@Res() res: Response): void {
    this.handleAdminAccess(res, 'languages/index', {
      backendUrl: this.backendUrl,
    });
  }

  @Get('/languages/add')
  getAddLanguage(@Res() res: Response): void {
    this.handleAdminAccess(res, 'languages/add');
  }

  @Get('/languages/:id')
  getEditLanguage(@Param('id') id: string, @Res() res: Response): void {
    this.handleAdminAccess(res, 'languages/edit', { id });
  }

  @Get('/courses')
  async getCourses(@Res() res: Response): Promise<void> {
    this.handleAdminAccess(res, 'courses/index', {
      backendUrl: this.backendUrl,
    });
  }

  @Get('/courses/add')
  async getAddCourse(@Res() res: Response): Promise<void> {
    const languages = await this.languagesService.findAll({}, { name: 1 });

    const types = Object.keys(CourseType)
      .filter((key) => isNaN(Number(key))) // Filter out numeric keys
      .map((key) => ({
        key: key, // Stringify the key
        value: CourseType[key as keyof typeof CourseType], // Enum value
      }));

    this.handleAdminAccess(res, 'courses/add-course', {
      languages: languages.map((language) => ({
        id: language.id,
        name: language.name,
      })),
      types: types,
    });
  }

  @Get('/courses/edit/:id')
  async getEditCourse(@Param('id') id: string, @Res() res: Response) {
    const course = await this.coursesService.findOne(id);
    this.handleAdminAccess(res, 'courses/edit-course', {
      name: course.name,
      thumbnail: course.thumbnail,
      id: id,
    });
  }
  @Get('/questions')
  getQuestions(@Res() res: Response): void {
    this.handleAdminAccess(res, 'questions/index', {
      backendUrl: this.backendUrl,
    });
  }

  @Get('/questions/add')
  getAddQuestion(@Res() res: Response): void {
    this.handleAdminAccess(res, 'questions/add');
  }

  @Get('/questions/edit/:id')
  getEditQuestion(@Param('id') id: string, @Res() res: Response): void {
    this.handleAdminAccess(res, 'questions/edit', { id });
  }

  private handleAdminAccess(
    res: Response,
    view: string,
    locals?: Record<string, any>,
  ): void {
    if (this.isAdmin) {
      res.render(view, locals);
    } else {
      console.log('ululullu');
      console.log(this.isAdmin);
      console.log(`Access Forbidden for ${view}`); // Log the forbidden access
      res.status(403).send('Access Forbidden');
      res.end(); // Ensure the response is ended
    }
  }
}
