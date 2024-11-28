import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExceptionFilter } from './lib/utils/filters/api-exception.filter';
import { engine } from 'express-handlebars';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    credentials: true,
    origin: configService.get<string>('FRONTEND_URL'),
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.engine(
    'hbs',
    engine({
      extname: 'hbs',
      defaultLayout: 'main',
      layoutsDir: join(__dirname, '..', 'views', 'layouts'),
      partialsDir: join(__dirname, '..', 'views', 'partials'),
    }),
  );

  // app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ApiExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Dolphin Streak API Endpoint')
    .setDescription('The endpoint for Dolphin Streak API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(configService.get<number>('APP_PORT'));
}
bootstrap();
