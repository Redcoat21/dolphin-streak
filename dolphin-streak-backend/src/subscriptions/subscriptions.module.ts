import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { MidtransModule } from '@ruraim/nestjs-midtrans';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MidtransModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        clientKey: config.get<string>('MIDTRANS_CLIENT_KEY'),
        serverKey: config.get<string>('MIDTRANS_SERVER_KEY'),
        merchantId: config.get<string>('MIDTRANS_MERCHANT_ID'),
        sandbox: config.get<string>('MIDTRANS_MODE') === 'sandbox',
      }),
        // using ConfigService from @nestjs/config to get .env value
        inject: [ConfigService],
        imports: [ConfigModule],
        isGlobal: true // default: false, register module globally
    }),
    ConfigModule, // For environment variables
    HttpModule,  
    // MidtransModule.register({
    //   clientKey: 'client-key',
    //   serverKey: 'server-key',
    //   merchantId: 'merchant-id',
    //   sandbox: true, // default: false,
    //   isGlobal: true // default: false, register module globally
    // })
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
