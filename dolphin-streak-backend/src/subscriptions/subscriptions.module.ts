import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { MidtransModule } from '@ruraim/nestjs-midtrans';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UserSchema } from 'src/users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';

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
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), // Import Mongoose models
    ConfigModule, // For environment variables
    HttpModule,
    UsersModule
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
