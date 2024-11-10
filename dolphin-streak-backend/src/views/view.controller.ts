import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class ViewController {
  @Get()
  @Render('index')
  getHome() {
    return { message: 'Hello from the ViewController!' };
  }
  @Get('/2')
  @Render('index')
  getHome() {
    return { message: 'Hello from the ViewController!' };
  }
}
