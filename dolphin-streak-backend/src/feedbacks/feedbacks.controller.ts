import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FindFeedbacksQuery } from './dto/find-feedbacks.param';
import { BearerTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { RoleGuard } from 'src/lib/guard/role.guard';
import { HasRoles } from 'src/lib/decorators/has-role.decorator';
import { Role } from 'src/users/schemas/user.schema';
import { FindByIdParam } from 'src/lib/dto/find-by-id-param.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiResponse } from 'src/lib/types/response.type';
import { checkIfExist, formatGetAllMessages } from 'src/lib/utils/response';
import { FeedbackType } from './schemas/feedback.schema';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FindFeedbacksUserQuery, SortType } from './schemas/find-feedbacks-user-query';
import { SortOrder } from 'mongoose';

@UseGuards(BearerTokenGuard, RoleGuard)
@Controller('api/feedbacks')
@ApiInternalServerErrorResponse({
  description:
    "Happen when something went wrong, that is not handled by this API, e.g. database error",
  example: {
    message: "Internal Server Error",
    data: null,
  },
})
@ApiUnauthorizedResponse({
  description:
    "Happen when the user is not authorized, it can either be no bearer token or the role is not allowed",
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
@ApiBearerAuth()
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) { }

  @ApiOperation({
    summary: 'Create a new feedback',
    description: 'Create a new feedback with the provided data, Note that only user can create feedbacks',
  })
  @ApiCreatedResponse({
    description: "The feedback has been succesfully created",
    example: {
      messages: "Feedback has been created successfully",
      data: {
        messages: "Feedback has been created successfully",
        data: {
          user: "6744262d52a2392a69fa49c3",
          type: 0,
          content: "Test",
          _id: "674427b72cacb2d5c21f68cb",
          createdAt: "2024-11-25T07:31:03.055Z",
          updatedAt: "2024-11-25T07:31:03.055Z",
          __v: 0
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    example: {
      messages: [
        "user should not be empty",
        "user must be a mongodb id",
        "type should not be empty",
        "type must be one of the following values: 0, 1",
        "content should not be empty",
        "content must be a string"
      ],
      data: null
    }
  })
  @HasRoles(Role.USER)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Req() request: Request
  ): Promise<ApiResponse> {
    const data = {
      user: request.user._id,
      ...createFeedbackDto
    }

    return {
      messages: "Feedback has been created successfully",
      data: await this.feedbacksService.create(data)
    }
  }

  @ApiOperation({
    summary: 'Find all feedbacks',
    description: 'Find all feedbacks with the provided query, Note that only admin can access this endpoint',
  })
  @ApiOkResponse({
    description: "The feedbacks has been succesfully found",
    example: {
      messages: "1 feedback found",
      data: [
        {
          _id: "674427b72cacb2d5c21f68cb",
          user: {
            _id: "6744262d52a2392a69fa49c3",
            email: "joken.e23@mhs.istts.ac.id"
          },
          type: 0,
          content: "Test",
          createdAt: "2024-11-25T07:31:03.055Z",
          updatedAt: "2024-11-25T07:31:03.055Z",
          __v: 0
        }
      ]
    }
  })
  @HasRoles(Role.ADMIN)
  @Get()
  async findAll(@Query() findFeedbacksQuery: FindFeedbacksQuery): Promise<ApiResponse> {
    const results = await this.feedbacksService.findAll(findFeedbacksQuery);
    return {
      messages: formatGetAllMessages(results.length, "feedback"),
      data: results
    }
  }

  @ApiOperation({
    summary: "Find a feedback by its ID",
    description: "Find a feedback by its ID.",
  })
  @ApiOkResponse({
    description:
      "The feedback has been successfully retrieved.",
    example: {
      messages: "Feedback founded succesfully",
      data: {
        _id: "674427b72cacb2d5c21f68cb",
        user: {
          _id: "6744262d52a2392a69fa49c3",
          email: "joken.e23@mhs.istts.ac.id"
        },
        type: 0,
        content: "Test",
        createdAt: "2024-11-25T07:31:03.055Z",
        updatedAt: "2024-11-25T07:31:03.055Z",
        __v: 0
      }
    },
  })
  @ApiNotFoundResponse({
    description: "Feedback not found",
    example: {
      messages: "Feedback not found",
      data: null,
    },
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. invalid feedback ID",
    example: {
      messages: [
        "id must be a valid mongodb id",
      ],
    },
  })

  @HasRoles(Role.ADMIN, Role.USER)
  @Get(':id')
  async findOne(@Param() findByIdParam: FindByIdParam): Promise<ApiResponse> {
    const result = checkIfExist(await this.feedbacksService.findOne(findByIdParam.id), "Feedback not found");
    return {
      messages: "Feedback found",
      data: result
    }
  }

  @ApiOperation({
    summary: "Delete a feedback by its ID",
    description: "Delete a feedback by its ID.",
  })
  @ApiOkResponse({
    description:
      "The feedback has been successfully deleted, it will return the deleted feedback.",
    example: {
      messages: "Feedback deleted succesfully",
      data: {
        _id: "674427b72cacb2d5c21f68cb",
        user: {
          _id: "6744262d52a2392a69fa49c3",
          email: "joken.e23@mhs.istts.ac.id"
        },
        type: 0,
        content: "Test",
        createdAt: "2024-11-25T07:31:03.055Z",
        updatedAt: "2024-11-25T07:31:03.055Z",
        __v: 0
      }
    },
  })
  @ApiNotFoundResponse({
    description: "Feedback not found",
    example: {
      messages: "Feedback not found",
      data: null,
    },
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. invalid feedback ID",
    example: {
      messages: [
        "id must be a valid mongodb id",
      ],
    },
  })
  @HasRoles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param() findByIdParam: FindByIdParam): Promise<ApiResponse> {
    const deletedFeedback = checkIfExist(await this.feedbacksService.remove(findByIdParam.id), "Feedback not found");
    return {
      messages: "Feedback deleted succesfully",
      data: deletedFeedback
    }
  }

  @ApiOperation({
    summary: 'Find all feedbacks for user',
    description: 'Find all feedbacks with the provided query, Note that only user can access this endpoint',
  })
  @ApiOkResponse({
    description: "The feedbacks has been succesfully found",
    example: {
      messages: "1 feedback found",
      data: [
        {
          _id: "674427b72cacb2d5c21f68cb",
          user: {
            _id: "6744262d52a2392a69fa49c3",
            email: "joken.e23@mhs.gmail.com"
          },
          type: 0,
          content: "Test",
          createdAt: "2024-11-25T07:31:03.055Z",
          updatedAt: "2024-11-25T07:31:03.055Z",
          __v: 0
        }
      ]
    }
  })
  @HasRoles(Role.USER)
  @Get('user')
  async findAllForUser(@Query() findFeedbacksUserQuery: FindFeedbacksUserQuery): Promise<ApiResponse> {
    const { search, type, sort } = findFeedbacksUserQuery;
    const filter: any = {};
    if (search) {
      filter.content = { $regex: search, $options: 'i' };
    }
    if (type && type !== 'any') {
      filter.type = FeedbackType[type];
    }

    const sortOptions: { createdAt?: SortOrder } = sort === SortType.NEWEST ? { createdAt: -1 as SortOrder } :
      sort === SortType.OLDEST ? { createdAt: 1 as SortOrder } : {};


    const results = await this.feedbacksService.findAll(filter, sortOptions);
    return {
      messages: formatGetAllMessages(results.length, "feedback"),
      data: results
    }
  }
}
