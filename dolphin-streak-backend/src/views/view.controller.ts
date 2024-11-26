import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { LanguagesService } from 'src/languages/languages.service';
import { Language } from 'src/languages/schemas/language.schema';
import { CoursesService } from 'src/courses/courses.service';
import { Course } from 'src/courses/schemas/course.schema';

@Controller()
@ApiExcludeController()
export class ViewController {
  constructor(
    private readonly languagesService: LanguagesService,
    private readonly coursesService: CoursesService,
  ) {}

  @Get(['/', '/homepage'])
  @Render('index')
  getHome(): void {
    return;
  }

  @Get('/login')
  @Render('login/index')
  getLogin(): void {
    return;
  }

  @Get('/users')
  @Render('users/index')
  getUsers(): void {
    return;
  }

  @Get('/languages')
  @Render('languages/index')
  async getLanguages(): Promise<{ languages: Language[] }> {
    const languages: Language[] = await this.languagesService.findAll(); // Fetch languages data
    return { languages };
  }

  @Get('/courses')
  @Render('courses/index')
  async getCourses(): Promise<{ courses: Course[] }> {
    const courses: Course[] = await this.coursesService.findAll(); // Fetch courses data
    return { courses };
  }
}
