import { Module } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { LanguagesController } from './languages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LanguageSchema } from './schemas/language.schema';
import { CloudinaryModule } from 'src/upload/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Language', schema: LanguageSchema }]),
    CloudinaryModule,
  ],
  controllers: [LanguagesController],
  providers: [LanguagesService],
  exports: [LanguagesService],
})
export class LanguagesModule {}
