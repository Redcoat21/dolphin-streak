import { Module } from "@nestjs/common";
import { ForumsService } from "./forums.service";
import { ForumsController } from "./forums.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ForumReplySchema, ForumSchema } from "./schemas/forum.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Forum", schema: ForumSchema }]),
    MongooseModule.forFeature([{
      name: "ForumReply",
      schema: ForumReplySchema,
    }]),
  ],
  controllers: [ForumsController],
  providers: [ForumsService],
})
export class ForumsModule {}
