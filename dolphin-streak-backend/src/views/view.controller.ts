import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@Controller()
@ApiExcludeController()
export class ViewController {
  private readonly backendUrl: string;
  constructor(private readonly configService: ConfigService) {
    this.backendUrl = this.configService.get<string>('BACKEND_URL');
  }

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

  @Get('/users/add-user')
  @Render('users/add-user/index')
  getAddUser(): void {
    // console.log({ backendUrl: this.backendUrl })
    // return { backendUrl: this.backendUrl };
    return;
  }

  @Get('/users')
  @Render('users/index')
  getUsers(): void {
    // console.log({ backendUrl: this.backendUrl })
    // return { backendUrl: this.backendUrl };
    return;
  }

  @Get('/languages')
  @Render('languages/index')
  getLanguages(): { backendUrl: string } {
    return { backendUrl: this.backendUrl };
  }

  @Get('/courses')
  @Render('courses/index')
  getCourses(): { backendUrl: string } {
    return { backendUrl: this.backendUrl };
  }

  @Get('/questions')
  @Render('questions/index')
  getQuestions(): { backendUrl: string } {
    return { backendUrl: this.backendUrl };
  }
}
