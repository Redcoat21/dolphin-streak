import { Module } from "@nestjs/common";
import { ForumsService } from "./forums.service";
import { ForumsController } from "./forums.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ForumReplySchema, ForumSchema } from "./schemas/forum.schema";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Forum", schema: ForumSchema }]),
    MongooseModule.forFeature([{
      name: "ForumReply",
      schema: ForumReplySchema,
    }]),
    UsersModule,
  ],
  controllers: [ForumsController],
  providers: [ForumsService],
})
export class ForumsModule { }
