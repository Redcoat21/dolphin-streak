import { Controller, Get, Render } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";

@Controller()
@ApiExcludeController()
export class ViewController {
  @Get("/")
  @Render("index")
  getHome() {
    return { message: "Hello from the ViewControllerINDEX!" };
  }

  @Get("/login")
  @Render("login/index")
  getLogin() {
    return {};
  }
}
