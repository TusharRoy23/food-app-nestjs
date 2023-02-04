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
import { JwtAuthGuard, RolesGuard } from './modules/shared/guards/index';
import { APP_GUARD } from '@nestjs/core';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGODB_URL}`, {
      connectionName: connectionName.MAIN_DB
    }),
    UserModule,
    RestaurantModule,
    OrderModule,
    ItemModule,
    CartModule,
    AuthModule,
    PublicModule,
    SharedModule
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ]
})
export class AppModule { }
