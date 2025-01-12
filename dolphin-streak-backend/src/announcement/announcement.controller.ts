import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { BearerTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { RoleGuard } from 'src/lib/guard/role.guard';
import { Role } from 'src/users/schemas/user.schema';
import { HasRoles } from 'src/lib/decorators/has-role.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('/api/announcements')
@UseGuards(BearerTokenGuard, RoleGuard)
@HasRoles(Role.ADMIN)
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
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
      summary: "Create a new announcement",
      description: "Create a new announcement with the provided data.",
    })
    @ApiCreatedResponse({
      description: "The Announcement has been successfully created.",
      example: {
        messages: "Announcement created successfully",
        data: {
          "content": "New English Course!",
          "time": "2025-01-12T13:02:12.908Z",
          "_id": "6783bd545d130d724efbc470",
          "__v": 0
        },
      },
    })
    @ApiBadRequestResponse({
      description: "Bad request, e.g. missing required fields",
      example: {
        messages: [
          "content must be a string"
        ],
        data: null,
      },
    })
  async create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return {
      messages: "Announcement created successfully",
      data: await this.announcementService.create(createAnnouncementDto)
    }
  }

  @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
      summary: "Find all announcements",
      description: "Find all announcements.",
    })
    @ApiOkResponse({
      description: "The Announcement have been successfully retrieved.",
      example: {
        "messages": "Announcements successfully found",
        "data": [
          {
            "_id": "6783bd545d130d724efbc470",
            "content": "wah ternyata bisa!",
            "time": "2025-01-12T13:02:12.908Z",
            "__v": 0
          },
          {
            "_id": "6783beddafb35525d350d78b",
            "content": "wah ternyata sudah ada",
            "time": "2025-01-12T13:08:45.865Z",
            "__v": 0
          },
          {
            "_id": "6783bf10769ff355a38ec082",
            "content": "wah ternyata sudah ada lagi",
            "time": "2025-01-12T13:09:36.275Z",
            "__v": 0
          }
        ]
      },
    })
    @HasRoles(Role.USER, Role.ADMIN)
  async findAll() {
    return {
      messages: "Announcements successfully found",
      data: await this.announcementService.findAll()
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.announcementService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAnnouncementDto: UpdateAnnouncementDto) {
  //   return this.announcementService.update(+id, updateAnnouncementDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.announcementService.remove(+id);
  // }
}
