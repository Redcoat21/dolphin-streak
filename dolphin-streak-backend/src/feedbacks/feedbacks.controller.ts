import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FindFeedbacksQuery } from './dto/find-feedbacks.param';
import { BearerTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { RoleGuard } from 'src/lib/guard/role.guard';
import { HasRoles } from 'src/lib/decorators/has-role.decorator';
import { Role } from 'src/users/schemas/user.schema';
import { FindByIdParam } from 'src/lib/dto/find-by-id-param.dto';

@UseGuards(BearerTokenGuard, RoleGuard)
@Controller('api/feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @HasRoles(Role.USER)
  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbacksService.create(createFeedbackDto);
  }

  @HasRoles(Role.ADMIN)
  @Get()
  findAll(@Query() findFeedbacksQuery: FindFeedbacksQuery) {
    return this.feedbacksService.findAll(findFeedbacksQuery);
  }
  
  @HasRoles(Role.ADMIN)
  @Get(':id')
  findOne(@Param() findByIdParam: FindByIdParam) {
    return this.feedbacksService.findOne(findByIdParam.id);
  }

  @HasRoles(Role.ADMIN)
  @Delete(':id')
  remove(@Param() findByIdParam: FindByIdParam) {
    return this.feedbacksService.remove(findByIdParam.id);
  }
}
