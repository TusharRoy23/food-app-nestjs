import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { connectionName } from './modules/shared/utils/enum';
import { UserModule } from './modules/user/user.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { OrderModule } from './modules/order/order.module';
import { ItemModule } from './modules/item/item.module';
import { CartModule } from './modules/cart/cart.module';
import { AuthModule } from './modules/auth/auth.module';
import { PublicModule } from './modules/public/public.module';
import {
  JwtAuthGuard,
  RolesGuard,
  UserTypeGuard,
} from './modules/shared/guards/index';
import { APP_GUARD } from '@nestjs/core';
import { SharedModule } from './modules/shared/shared.module';
import { MailModule } from './modules/mail/mail.module';
import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from './modules/shared/guards/rate-limiter.guard';

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGODB_URL}`, {
      connectionName: connectionName.MAIN_DB,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => [
        {
          name: 'medium',
          ttl: seconds(+process.env.MEDIUM_THROTTLE_TTL),
          limit: +process.env.MEDIUM_THROTTLE_LIMIT
        },
        {
          name: 'long',
          ttl: seconds(+process.env.LONG_THROTTLE_TTL),
          limit: +process.env.LONG_THROTTLE_LIMIT
        }
      ]
    }),
    UserModule,
    RestaurantModule,
    OrderModule,
    ItemModule,
    CartModule,
    AuthModule,
    PublicModule,
    MailModule,
    SharedModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: UserTypeGuard },
    { provide: APP_GUARD, useClass: ThrottlerBehindProxyGuard }
  ],
})
export class AppModule { }
