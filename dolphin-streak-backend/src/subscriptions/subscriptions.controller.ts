import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ConflictException, NotFoundException, BadRequestException, BadGatewayException } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { BearerTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Controller('/api/subscriptions')
@UseGuards(BearerTokenGuard)
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
export class SubscriptionsController {
  constructor(
    private readonly userService: UsersService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Post()
  async create(@Body() cardDetails: CreateSubscriptionDto,
  @Req() req: Request & { user: User },
  ){
    const user = req.user;
    if(!user.subscriptionId){
      const {subscriptionId} = await this.subscriptionsService.createSubscription(cardDetails, user);
      console.log(subscriptionId);
      
      if(subscriptionId === null){
        throw new BadRequestException('your credit card information is not valid. Please try another credit card.')
      }
  
      await this.userService.updateUserSubscription(user._id, subscriptionId);
  
      return {
        messages: `New subscription created successfully`,
        data: subscriptionId
      }
    }
    else {
      throw new ConflictException(
        'User already has a subscription record, even if it is deactivated. If you want to reactivate the subscription, please use the /api/subscriptions/:id/enable endpoint.',
      );
    }
  }

  @Post('enable')
  async enableSubs(@Req() req: Request & { user: User }){
    const user = req.user;

    if(user.subscriptionId){
      const subs = await this.subscriptionsService.enableSubs(user.subscriptionId);
      console.log(subs);
      if(subs === null){
        throw new BadRequestException('Your subscription is already active and does not need to be enabled.');

      }
      else{
        return {
          messages: `Your subscription was successfully enabled`,
          data: null as any
        }
      }
    }
    else{
      throw new NotFoundException('No subscription found for this user. Please create a new subscription first before enabling it.');
    }
  }

  @Delete('disable')
  async disableSubs(@Req() req: Request & { user: User }){
    const user = req.user;

    if(user.subscriptionId){
      const subs = await this.subscriptionsService.disableSubs(user.subscriptionId);
      if(subs === null){
        throw new BadRequestException('Your subscription is already inactive and cannot be disabled again.');
      }
      else{
        return {
          messages: `Your subscription was successfully disabled`,
          data: null as any
        }
      }
    }
    else{
      throw new NotFoundException('No subscription found for this user. Please create a new subscription first before enabling it.');
    }
  }
}