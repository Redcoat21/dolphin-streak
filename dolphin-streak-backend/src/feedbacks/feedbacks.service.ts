import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback } from './schemas/feedback.schema';
import { FilterQuery, Model, SortOrder } from 'mongoose';

@Injectable()
export class FeedbacksService {
  constructor(@InjectModel(Feedback.name) private feedbackModel: Model<Feedback>) { };

  create(createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackModel.create(createFeedbackDto);
  }
  findAll(filter: FilterQuery<Feedback> = {}, sortOptions: { createdAt?: SortOrder } = {}) {
    return this.feedbackModel.find(filter).populate({
      path: 'user',
      select: 'email'
    }).sort(sortOptions);
  }

  findOne(id: string) {
    return this.feedbackModel.findById(id).populate({
      path: 'user',
      select: 'email'
    });
  }

  update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackModel.findByIdAndUpdate(id, { new: true });
  }

  remove(id: string) {
    return this.feedbackModel.findByIdAndDelete(id);
  }
}
