import { Module } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { LanguagesController } from './languages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LanguageSchema } from './schemas/language.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: "Language", schema: LanguageSchema }])],
  controllers: [LanguagesController],
  providers: [LanguagesService],
  exports: [LanguagesService],
})
export class LanguagesModule {}
