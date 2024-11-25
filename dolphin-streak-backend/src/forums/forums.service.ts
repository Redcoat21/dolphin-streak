import { Injectable } from "@nestjs/common";
import { CreateForumDto } from "./dto/create-forum.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Forum, ForumReply } from "./schemas/forum.schema";
import { Model } from "mongoose";
import { CreateForumReplyDto } from "./dto/create-forum-reply.dto";

@Injectable()
export class ForumsService {
  constructor(
    @InjectModel(Forum.name) private forumModel: Model<Forum>,
    @InjectModel(ForumReply.name) private forumReplyModel: Model<ForumReply>,
  ) {}

  createForum(createForumDto: CreateForumDto) {
    return this.forumModel.create(createForumDto);
  }

  async createReply(forumId: string, createForumReplyDto: CreateForumReplyDto) {
    const forumReply = await this.forumReplyModel.create(createForumReplyDto);
    // Attach the reply to the forum.
    const b = await this.forumModel.findByIdAndUpdate(forumId, {
      $push: { replies: forumReply },
    }, { new: true });

    return forumReply;
  }

  findAll() {
    return this.forumModel.find().populate({ path: "user", select: "email" });
  }

  findOneForum(id: string) {
    return this.forumModel.findById(id).populate([{
      path: "user",
      select: "email",
    }, { path: "replies" }]);
  }

  findOneReply(id: string) {
    return this.forumReplyModel.findById(id).populate({
      path: "user",
      select: "email",
    });
  }

  removeForum(id: string) {
    return this.forumModel.findByIdAndDelete(id);
  }

  removeReply(id: string) {
    return this.forumReplyModel.findByIdAndDelete(id);
  }
}
