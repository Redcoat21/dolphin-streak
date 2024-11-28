import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { MidtransService } from '@ruraim/nestjs-midtrans';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

// @Injectable()
// export class SubscriptionsService {
//   create(createSubscriptionDto: CreateSubscriptionDto) {
//     return 'This action adds a new subscription';
//   }

//   findAll() {
//     return `This action returns all subscriptions`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} subscription`;
//   }

//   update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
//     return `This action updates a #${id} subscription`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} subscription`;
//   }
  
// }

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly midtransService: MidtransService
  ) {}

  async createSubscription(cardDetails:CreateSubscriptionDto): Promise<any> {

    const serverKey = this.configService.get<string>('MIDTRANS_SERVER_KEY');
      if (!serverKey) {
        throw new Error('MIDTRANS_SERVER_KEY is not configured in .env');
      }

      // Encode the Server Key to Base64
      const basicAuth = Buffer.from(`${serverKey}:`).toString('base64');
      const authorizationHeader = `Basic ${basicAuth}`;

      const payload = {
        ...cardDetails,
        client_key: this.configService.get<string>('MIDTRANS_CLIENT_KEY'),
      };


      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.sandbox.midtrans.com/v2/token',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: authorizationHeader,
            },
          },
        ),
      );

    const token = response.data.token_id;
    // console.log(response.data);

    const now = new Date();
    const futureTime = new Date(now.getTime() +  (7 * 60 + 2) * 60 * 1000); // Add 15 minutes to current time
    const formattedStartTime = futureTime.toISOString()
      .replace('T', ' ')
      .split('.')[0] + ' +0700';

      console.log(formattedStartTime);
      

    const result = await this.midtransService.createSubscription({
      name: 'Langganan bulanan',
      amount: 10000,
      currency: 'IDR',
      payment_type: 'credit_card',
      token: token,
      schedule: {
        interval: 1,
        interval_unit: 'month',
        max_interval: 12,
        start_time: formattedStartTime
      },
    })
    // console.log(result)
    return result
  }

  async findOne(id: string): Promise<any> {
    const result = await this.midtransService.getSubscription(id);
    console.log(result)
    return result
  }

  async enableSubs(id: string): Promise<any> {
    const result = await this.midtransService.enableSubscription(id);
    console.log(result)
    return result
  }

  async disableSubs(id: string): Promise<any> {
    const result = await this.midtransService.disableSubscription(id);
    console.log(result)
    return result
  }
}