import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import { QuestionsModule } from "./questions/questions.module";
import { CoursesModule } from "./courses/courses.module";
import { LanguagesModule } from "./languages/languages.module";
import { LevelsModule } from "./levels/levels.module";
import { MailModule } from "./mail/mail.module";
import { FeedbacksModule } from "./feedbacks/feedbacks.module";
import { ForumsModule } from "./forums/forums.module";
import { AiModule } from "./ai/ai.module";
import { ViewController } from "./views/view.controller";
import { VoiceaiModule } from './voiceai/voiceai.module';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
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
    FeedbacksModule,
    ForumsModule,
    AiModule,
    VoiceaiModule,
  ],
  controllers: [AppController, ViewController],
  providers: [AppService],
})
export class AppModule {}