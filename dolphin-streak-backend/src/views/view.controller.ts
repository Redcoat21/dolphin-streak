import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class ViewController {
  @Get('/')
  @Render('index')
  getHome() {
    return { message: 'Hello from the ViewControllerINDEX!' };
  }

  @Get('/login')
  @Render('login/index')
  getLogin() {
    return {};
  }
}
