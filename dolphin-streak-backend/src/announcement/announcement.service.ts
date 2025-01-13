import { Injectable } from '@nestjs/common';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Announcement, AnnouncementDocument } from './schemas/announcement.schema';
import { Model } from 'mongoose';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectModel(Announcement.name) private announcementModel: Model<AnnouncementDocument>,
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto) {
    const data = {
      ...createAnnouncementDto,
      time: new Date()
    }
    const createdAnnounce = new this.announcementModel(data);
    return createdAnnounce.save();
    // return 'This action adds a new announcement';
  }

  async findAll() {
    const result = await this.announcementModel
      .find()
      .exec();
    return result;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} announcement`;
  // }

  // update(id: number, updateAnnouncementDto: UpdateAnnouncementDto) {
  //   return `This action updates a #${id} announcement`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} announcement`;
  // }
}
