import { Injectable } from "@nestjs/common";
import { CreateForumDto } from "./dto/create-forum.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Forum, ForumDocument, ForumReply } from "./schemas/forum.schema";
import { Model } from "mongoose";
import { CreateForumReplyDto } from "./dto/create-forum-reply.dto";
import { UsersService } from "src/users/users.service";
import { UserDocument } from "src/users/schemas/user.schema";

@Injectable()
export class ForumsService {
  constructor(
    @InjectModel(Forum.name) private forumModel: Model<Forum>,
    @InjectModel(ForumReply.name) private forumReplyModel: Model<ForumReply>,
    private usersService: UsersService,
  ) { }

  async createForum(createForumDto: CreateForumDto) {
    const user: UserDocument = await this.usersService.getUserByEmail(createForumDto.user);
    createForumDto.user = user._id.toString();
    return this.forumModel.create(createForumDto);
  }

  async createReply(forumId: string, createForumReplyDto: CreateForumReplyDto) {
    const user: UserDocument = await this.usersService.getUserByEmail(createForumReplyDto.user);
    createForumReplyDto.user = user._id.toString();
    const forumReply = await this.forumReplyModel.create(createForumReplyDto);
    // Attach the reply to the forum.
    const forum = await this.forumModel.findByIdAndUpdate(forumId, {
      $push: { replies: forumReply },
    }, { new: true });

    return forumReply;
  }

  findAll() {
    return this.forumModel.find().populate({
      path: "user",
      select: "email username profilePicture",
    });
  }

  async findOneForum(id: string): Promise<ForumDocument | null> {
    const forum = await this.forumModel.findById(id).populate([
      {
        path: "user",
        select: "email profilePicture",
      },
      {
        path: "replies",
        populate: {
          path: "user",
          select: "email profilePicture",
        },
      },
    ]);

    return forum;
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

  searchForums(searchTerm: string) {
    return this.forumModel.find({ $text: { $search: searchTerm } }).populate({
      path: "user",
      select: "email username profilePicture",
    });
  }
}
