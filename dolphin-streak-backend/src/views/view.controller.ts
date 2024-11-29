import { Controller, Get, Param, Render, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UsersService } from '../users/users.service';

@Controller()
@ApiExcludeController()
export class ViewController {
  private readonly backendUrl: string;
  private readonly isAdmin: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
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
  async getUserById(@Param('id') id: string, @Res() res: Response): Promise<void> {
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

  @Get('/languages/edit/:id')
  getEditLanguage(@Param('id') id: string, @Res() res: Response): void {
    this.handleAdminAccess(res, 'languages/edit', { id });
  }


  @Get('/courses')
  getCourses(@Res() res: Response): void {
    this.handleAdminAccess(res, 'courses/index', {
      backendUrl: this.backendUrl,
    });
  }

  @Get('/questions')
  getQuestions(@Res() res: Response): void {
    this.handleAdminAccess(res, 'questions/index', {
      backendUrl: this.backendUrl,
    });
  }

  private handleAdminAccess(
    res: Response,
    view: string,
    locals?: Record<string, any>,
  ): void {
    if (this.isAdmin) {
      res.render(view, locals);
    } else {
      console.log(`Access Forbidden for ${view}`); // Log the forbidden access
      res.status(403).send('Access Forbidden');
      res.end(); // Ensure the response is ended
    }
  }
}
