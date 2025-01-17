import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ConflictException, NotFoundException, BadRequestException, BadGatewayException, HttpStatus, HttpCode } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { BearerTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
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
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Request to creating a new subscription for user",
    description: "Requesting to midtrans API to creating a new subscription for user that never make a subscription before",
  })
  @ApiCreatedResponse({
    description: "The subscription is successfully created and saved to the user.",
    example: {
      messages: "New subscription created successfully",
      data: "bf23287f-498d-4c9c-9e24-345ca8edbf63"
    }
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. missing required fields",
    example: {
      messages: [
        "your credit card information is not valid. Please try another credit card.",
        "Card number must be exactly 16 digits.",
        "Card number must be a number string",
        "Card expiration month must be exactly 2 digits (MM).",
        "Card expiration month must be a number string",
        "Card expiration year must be exactly 2 digits (YY).",
        "Card expiration year must be a number string",
        "Card CVV must be exactly 3 digits.",
        "Card CVV must be a number string"
      ],
      data: null
    }
  })
  @ApiConflictResponse({
    description: "The request could not be completed due to a conflict with the current state of the target resource. In our case, the user already have a subscription",
    example: {
      messages: "User already has a subscription record, even if it is deactivated. If you want to re-enable the subscription, please use the /api/subscriptions/:id/enable endpoint.",
      data: null
    }
  })
  async create(@Body() cardDetails: CreateSubscriptionDto,
  @Req() req: Request & { user: User },
  ){
    const user = req.user;
    if(!user.subscriptionId){
      const {subscriptionId} = await this.subscriptionsService.createSubscription(cardDetails);
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
        'User already has a subscription record, even if it is deactivated. If you want to re-enable the subscription, please use the /api/subscriptions/:id/enable endpoint.',
      );
    }
  }

  @Post('enable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Request to enable user's disabled subscription",
    description: "Requesting to midtrans to enable user's disabled subscription",
  })
  @ApiOkResponse({
    description: "The response was successfully re-enable user's disabled subscription.",
    example: {
      messages: "Your subscription was successfully enabled",
      data: null
    }
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. missing required fields",
    example: {
      messages: "Your subscription is already active and does not need to be enabled.",
      data: null
    }
  })
  @ApiNotFoundResponse({
    description: "User's subscription was not found.",
    example: {
      messages: "No subscription found for this user. Please create a new subscription first before enabling it.",
      data: null
    }
  })
  async enableSubs(@Req() req: Request & { user: User }){
    const user = req.user;

    if(user.subscriptionId){
      const subs = await this.subscriptionsService.enableSubs(user.subscriptionId);
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Request to disable user's enabled subscription",
    description: "Requesting to midtrans to disable user's enabled subscription",
  })
  @ApiOkResponse({
    description: "The response was successfully re-enable user's disabled subscription.",
    example: {
      messages: "Your subscription was successfully disabled",
      data: null
    }
  })
  @ApiBadRequestResponse({
    description: "Bad request, e.g. missing required fields",
    example: {
      messages: "Your subscription is already inactive and cannot be disabled again.",
      data: null
    }
  })
  @ApiNotFoundResponse({
    description: "User's subscription was not found.",
    example: {
      messages: "No subscription found for this user. Please create a new subscription first before enabling it.",
      data: null
    }
  })
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