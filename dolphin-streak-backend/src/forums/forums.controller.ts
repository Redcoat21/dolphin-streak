import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
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
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@ApiUnauthorizedResponse({
  description:
    "Happen because the user is not authorized (doesn't have a valid access token)",
  example: {
    message: "Unauthorized",
    data: null,
  },
})
@ApiForbiddenResponse({
  description:
    "Happen because the user doesn't have the right role to access this endpoint",
  example: {
    message: "Forbidden resource",
    data: null,
  },
})
@ApiInternalServerErrorResponse({
  description:
    "Happen when something went wrong, that is not handled by this API, e.g. database error",
  example: {
    message: "Internal Server Error",
    data: null,
  },
})
@ApiBearerAuth()
@UseGuards(BearerTokenGuard, RoleGuard)
@Controller("api/forums")
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @ApiOperation({
    summary: "Create a new forum",
    description: "Create a new forum",
  })
  @ApiCreatedResponse({
    description: "Forum created successfully",
    example: {
      messages: "Forum created successfully",
      data: {
        title: "How to learn effectively?",
        user: "67436c361488d1d48b3ee7a7",
        content: "lorem 500",
        replies: [],
        _id: "6744991afe670457cdab5fbc",
        createdAt: "2024-11-25T15:34:50.899Z",
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    example: {
      messages: [
        "title must be longer than or equal to 1 characters",
        "title should not be empty",
        "title must be a string",
        "user should not be empty",
        "user must be a mongodb id",
        "content must be longer than or equal to 1 characters",
        "content should not be empty",
        "content must be a string",
      ],
      data: null,
    },
  })
  @HasRoles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createForum(@Body() createForumDto: CreateForumDto) {
    return {
      messages: "Forum created successfully",
      data: await this.forumsService.createForum(createForumDto),
    };
  }

  @ApiOperation({
    summary: "Create a reply for a forum",
    description: "Create a reply for a forum",
  })
  @ApiOkResponse({
    description: "Reply created successfully",
    example: {
      messages: "Reply created succesfully",
      data: {
        user: "6744262d52a2392a69fa49c3",
        content: "I dont know, git guid",
        _id: "67449bf52e15ed221b072c74",
        createdAt: "2024-11-25T15:47:01.890Z",
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    example: {
      messages: [
        "user should not be empty",
        "user must be a mongodb id",
        "content must be longer than or equal to 1 characters",
        "content should not be empty",
        "content must be a string",
      ],
      data: null,
    },
  })
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

  @ApiOperation({
    description: "Find all forums",
    summary: "Find all forums",
  })
  @ApiOkResponse({
    description: "Forums retrieved successfully",
    example: {
      messages: "1 forum found",
      data: [
        {
          _id: "67449422fd902e05f1248abd",
          title: "How to learn effectively?",
          user: {
            _id: "67436c361488d1d48b3ee7a7",
            email: "john40@email.com",
          },
          content: "lorem 500",
          replies: [
            "67449bf52e15ed221b072c74",
          ],
          createdAt: "2024-11-25T15:13:38.352Z",
          __v: 0,
        },
      ],
    },
  })
  @HasRoles(Role.ADMIN)
  @Get()
  async findAll(@Query("search") searchTerm?: string): Promise<ApiResponse> {
    const forums = searchTerm
      ? await this.forumsService.searchForums(searchTerm)
      : await this.forumsService.findAll();
    return {
      messages: formatGetAllMessages(forums.length, "forum"),
      data: forums,
    };
  }

  @ApiOperation({
    summary: "Find a forum by ID",
    description: "Find a forum by ID",
  })
  @ApiOkResponse({
    description: "Forum retrieved successfully",
    example: {
      messages: "Forum retrieved successfully",
      data: {
        _id: "67449422fd902e05f1248abd",
        title: "How to learn effectively?",
        user: {
          _id: "67436c361488d1d48b3ee7a7",
          email: "john40@email.com",
        },
        content: "lorem 500",
        replies: [
          {
            _id: "67449bf52e15ed221b072c74",
            user: "6744262d52a2392a69fa49c3",
            content: "I dont know, git guid",
            createdAt: "2024-11-25T15:47:01.890Z",
            __v: 0,
          },
        ],
        createdAt: "2024-11-25T15:13:38.352Z",
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. invalid forum ID",
    example: {
      messages: "Forum not found",
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description: "Bad Request",
    example: {
      messages: "Forum not found",
      data: null,
    },
  })
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

  @ApiOperation({
    summary: "Delete a forum",
    description: "Delete a forum and all its replies",
  })
  @ApiOkResponse({
    description: "Forum deleted successfully",
    example: {
      messages: "Forum deleted successfully",
      data: {
        _id: "67449422fd902e05f1248abd",
        title: "How to learn effectively?",
        user: "67436c361488d1d48b3ee7a7",
        content: "lorem 500",
        replies: [
          "67449bf52e15ed221b072c74",
        ],
        createdAt: "2024-11-25T15:13:38.352Z",
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. invalid forum ID (Not a mongo id)",
    example: {
      messages: [
        "id must be a mongodb id",
      ],
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description: "Forum not found, invalid mongo id (Non-existent id)",
    example: {
      messages: "Forum not found",
      data: null,
    },
  })
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

  @ApiOperation({
    summary: "Delete a reply",
    description: "Delete a reply and all its references in the parent forum",
  })
  @ApiOkResponse({
    description: "Reply deleted successfully",
    example: {
      messages: "Reply deleted successfully",
      data: {
        _id: "67449eb36ec1c252b460bcfe",
        user: "67436c361488d1d48b3ee7a7",
        content: "Idk",
        createdAt: "2024-11-25T15:58:43.722Z",
        __v: 0,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. invalid reply ID (Not a mongo id)",
    example: {
      messages: [
        "replyId must be a mongodb id",
      ],
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description: "Invalid reply id (Non-existent id)",
    example: {
      messages: "Reply not found",
      data: null,
    },
  })
  @HasRoles(Role.ADMIN)
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
