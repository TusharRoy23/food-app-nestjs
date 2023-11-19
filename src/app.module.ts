import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
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
import AdminJs from "adminjs";
import { AdminModule } from '@adminjs/nestjs';
import * as AdminJsMongoose from '@adminjs/mongoose';
import { Item } from './modules/item/schemas/item.schema';
import { Restaurant } from './modules/restaurant/schemas';
import { User } from './modules/user/schemas/user.schema';
import { Order, OrderDiscount, OrderItem } from './modules/order/schemas';
import { Cart, CartItem } from './modules/cart/schemas';

const default_admin = {
  email: 'tushar',
  password: 'Binate789&&'
}

const authenticate = async (email: string, password: string) => {
  if (email === default_admin.email && password === default_admin.password) {
    return Promise.resolve(default_admin)
  }
  return null;
}

AdminJs.registerAdapter({
  Resource: AdminJsMongoose.Resource,
  Database: AdminJsMongoose.Database
})

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGODB_URL}`, {
      connectionName: connectionName.MAIN_DB,
    }),
    AdminModule.createAdminAsync({
      useFactory: async (itemModel, restaurentModel, userModel, cartModel, cartItemModel, orderModel, orderItemModel, orderDiscountModel) => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            // { resource: itemModel }
            itemModel,
            restaurentModel,
            userModel,
            cartModel,
            cartItemModel,
            orderModel,
            orderItemModel,
            orderDiscountModel
          ],
        },
        auth: {
          authenticate,
          cookieName: 'adminjs',
          cookiePassword: 'secret'
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: 'secret'
        },
      }),
      imports: [
        UserModule,
        ItemModule,
        RestaurantModule,
        OrderModule,
        CartModule
      ],
      inject: [
        getModelToken(Item.name, connectionName.MAIN_DB),
        getModelToken(Restaurant.name, connectionName.MAIN_DB),
        getModelToken(User.name, connectionName.MAIN_DB),
        getModelToken(Cart.name, connectionName.MAIN_DB),
        getModelToken(CartItem.name, connectionName.MAIN_DB),
        getModelToken(Order.name, connectionName.MAIN_DB),
        getModelToken(OrderItem.name, connectionName.MAIN_DB),
        getModelToken(OrderDiscount.name, connectionName.MAIN_DB),
      ],
    }),
    UserModule,
    RestaurantModule,
    OrderModule,
    ItemModule,
    CartModule,
    AuthModule,
    PublicModule,
    SharedModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: UserTypeGuard },
  ],
})
export class AppModule { }
