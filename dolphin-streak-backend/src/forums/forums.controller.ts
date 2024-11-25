import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ForumsService } from "./forums.service";
import { CreateForumDto } from "./dto/create-forum.dto";
import { CreateForumReplyDto } from "./dto/create-forum-reply.dto";
import { FindByIdParam } from "src/lib/dto/find-by-id-param.dto";
import { RemoveReplyParam } from "./dto/remove-reply.param";
import { BearerTokenGuard } from "src/auth/guard/bearer-token.guard";
import { RoleGuard } from "src/lib/guard/role.guard";
import { HasRoles } from "src/lib/decorators/has-role.decorator";
import { Role } from "src/users/schemas/user.schema";
import { ApiResponse } from "src/lib/types/response.type";
import { checkIfExist, formatGetAllMessages } from "src/lib/utils/response";

@UseGuards(BearerTokenGuard, RoleGuard)
@Controller("api/forums")
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @HasRoles(Role.ADMIN, Role.USER)
  @Post()
  async createForum(@Body() createForumDto: CreateForumDto) {
    return {
      messages: "Forum created successfully",
      data: await this.forumsService.createForum(createForumDto),
    };
  }

  @HasRoles(Role.ADMIN, Role.USER)
  @Post(":id/replies")
  async createForumReply(
    @Param() forumId: FindByIdParam,
    @Body() createForumReplyDto: CreateForumReplyDto,
  ): Promise<ApiResponse> {
    return {
      messages: "Reply created succesfully",
      data: await this.forumsService.createReply(
        forumId.id,
        createForumReplyDto,
      ),
    };
  }

  @HasRoles(Role.ADMIN)
  @Get()
  async findAll(): Promise<ApiResponse> {
    const forums = await this.forumsService.findAll();
    return {
      messages: formatGetAllMessages(forums.length, "forum"),
      data: forums,
    };
  }

  @HasRoles(Role.ADMIN)
  @Get(":id")
  async findOneForum(@Param() id: FindByIdParam) {
    const forum = checkIfExist(
      await this.forumsService.findOneForum(id.id),
      "Forum not found",
    );
    return {
      messages: "Forum retrieved successfully",
      data: forum,
    };
  }

  @HasRoles(Role.ADMIN)
  @Delete(":id")
  async removeForum(@Param() id: FindByIdParam) {
    const deletedForum = checkIfExist(
      await this.forumsService.removeForum(id.id),
      "Forum not found",
    );
    return {
      messages: "Forum deleted successfully",
      data: deletedForum,
    };
  }

  @Delete(":forumId/replies/:replyId")
  async removeReply(@Param() params: RemoveReplyParam) {
    const deletedReply = checkIfExist(
      await this.forumsService.removeReply(params.replyId),
      "Reply not found",
    );
    return {
      messages: "Reply deleted successfully",
      data: deletedReply,
    };
  }
}
