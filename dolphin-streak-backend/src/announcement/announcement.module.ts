import { Module } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnouncementSchema } from './schemas/announcement.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Announcement', schema: AnnouncementSchema }])],
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
})
export class AnnouncementModule {}
