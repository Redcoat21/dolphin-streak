import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

// @Controller('/api/subscriptions')
// export class SubscriptionsController {
//   constructor(private readonly subscriptionsService: SubscriptionsService) {}

//   @Post()
//   create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
//     return this.subscriptionsService.create(createSubscriptionDto);
//   }

//   @Get()
//   findAll() {
//     return this.subscriptionsService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.subscriptionsService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
//     return this.subscriptionsService.update(+id, updateSubscriptionDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.subscriptionsService.remove(+id);
//   }
// }

@Controller('/api/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  async create(@Body() cardDetails: {
    card_number: string;
    card_exp_month: string;
    card_exp_year: string;
    card_cvv: string;
  }){
    const data = await this.subscriptionsService.createSubscription(cardDetails);

    return {
      messages: `New subscription created successfully`,
      data
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string){
    const data = await this.subscriptionsService.findOne(id);

    return {
      messages:  `Subscription with ID ${id} fetched succesfully`,
      data
    }
  }

  @Post(':id/enable')
  async enableSubs(@Param('id') id: string){

    const data = await this.subscriptionsService.enableSubs(id)
    return {
      messages: `Subscription with ID ${id} enabled successfully`,
      data
    }
  }

  @Post(':id/disable')
  async disableSubs(@Param('id') id: string){
    const data = await this.subscriptionsService.disableSubs(id)
    return {
      messages: `Subscription with ID ${id} is disabled successfully`,
      data
    }
  }
}