import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { LanguagesService } from 'src/languages/languages.service';

@Controller()
@ApiExcludeController()
export class ViewController {
  constructor(private readonly languagesService: LanguagesService) {}
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
  async getLanguages(): {
    const languages = await this.languagesService.findAll(); // Fetch languages data
    return { languages };
  }
}
