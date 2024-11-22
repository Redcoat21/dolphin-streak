import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Question } from "./schemas/question.schema";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { QueryQuestionDto } from "./dto/query-question.dto";

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const createdQuestion = new this.questionModel(createQuestionDto);
    return createdQuestion.save();
  }

  async findAll(query: QueryQuestionDto): Promise<Question[]> {
    const filter: any = {};

    if (query.type) {
      filter.type = query.type;
    }

    if (typeof query.useAi !== "undefined") {
      filter.useAi = query.useAi;
    }

    if (query.courseId) {
      filter.courses = query.courseId;
    }

    return this.questionModel
      .find(filter)
      .populate("courses")
      .exec();
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionModel
      .findById(id)
      .populate("courses")
      .exec();

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const updatedQuestion = await this.questionModel
      .findByIdAndUpdate(id, updateQuestionDto, { new: true })
      .populate("courses")
      .exec();

    if (!updatedQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return updatedQuestion;
  }

  async remove(id: string): Promise<Question> {
    const deletedQuestion = await this.questionModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return deletedQuestion;
  }
}
