import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiExceptionFilter } from "./utils/filters/api-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: "http://localhost:3000",
    },
  });

  const configService = app.get(ConfigService);

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ApiExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle("Dolphin Streak API Endpoint")
    .setDescription("The endpoint for Dolphin Streak API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, documentFactory);

  await app.listen(configService.get<number>("APP_PORT"));
}
bootstrap();
