import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import { QuestionsModule } from "./questions/questions.module";
import { CoursesModule } from "./courses/courses.module";
import { LanguagesModule } from "./languages/languages.module";
import { LevelsModule } from "./levels/levels.module";
import { ViewController } from "./views/view.controller"; // Import the new views controller
import { MailController } from "./mail/mail.controller";
import { MailService } from "./mail/mail.service";
import { MailModule } from "./mail/mail.module";
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("DB_URI"),
      }),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    SubscriptionsModule,
    QuestionsModule,
    CoursesModule,
    LanguagesModule,
    LevelsModule,
    MailModule,
    AiModule,
  ],
  controllers: [AppController, ViewController],
  providers: [AppService],
})
export class AppModule {}
