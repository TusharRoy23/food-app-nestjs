import { Module } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { AdminusersService } from './adminusers.service';
import { AdminusersController } from './adminusers.controller';
import { Adminuser, AdminuserDocument } from '../user/schemas/adminuser.schema';
import { connectionName } from '../shared/utils/enum';
import AdminJs from "adminjs";
import { AdminModule } from '@adminjs/nestjs';
import { Resource, Database, } from '@adminjs/mongoose';
import passwordsFeature from '@adminjs/passwords';
import * as argon2 from 'argon2';
import { Cart, CartDocument, CartItem, CartItemDocument } from '../cart/schemas';
import { Item, ItemDocuement } from '../item/schemas/item.schema';
import { Order, OrderItem, OrderDiscount, OrderDocument, OrderItemDocument, OrderDiscountDocument } from '../order/schemas';
import { Restaurant, RestaurantDocument } from '../restaurant/schemas';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { ALL_MODULES } from '../index-module';

const UserConfigForAdmin = {
  features: [passwordsFeature({
    properties: { encryptedPassword: 'password' },
    hash: argon2.hash,
  })],
  options: {
    properties: {
      hashedRefreshToken: { isVisible: false },
      password: { isRequired: false }
    }
  }
};

const default_admin = {
  email: 'tushar',
  password: 'Binate789&&'
};

const authenticate = async (email: string, password: string) => {
  if (email === default_admin.email && password === default_admin.password) {
    return Promise.resolve(default_admin)
  }
  return null;
};

AdminJs.registerAdapter({
  Resource: Resource,
  Database: Database
});

const adminJS = new AdminJs();
adminJS.watch();

@Module({
  imports: [
    AdminModule.createAdminAsync({
      useFactory: async (
        itemModel: Model<ItemDocuement>,
        restaurentModel: Model<RestaurantDocument>,
        userModel: Model<UserDocument>,
        adminUserModel: Model<AdminuserDocument>,
        cartModel: Model<CartDocument>,
        cartItemModel: Model<CartItemDocument>,
        orderModel: Model<OrderDocument>,
        orderItemModel: Model<OrderItemDocument>,
        orderDiscountModel: Model<OrderDiscountDocument>
      ) => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            itemModel,
            restaurentModel,
            {
              resource: userModel,
              ...UserConfigForAdmin
            },
            cartModel,
            cartItemModel,
            orderModel,
            orderItemModel,
            orderDiscountModel,
            {
              resource: adminUserModel,
              ...UserConfigForAdmin
            }
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
      imports: ALL_MODULES,
      inject: [
        getModelToken(Item.name, connectionName.MAIN_DB),
        getModelToken(Restaurant.name, connectionName.MAIN_DB),
        getModelToken(User.name, connectionName.MAIN_DB),
        getModelToken(Adminuser.name, connectionName.MAIN_DB),
        getModelToken(Cart.name, connectionName.MAIN_DB),
        getModelToken(CartItem.name, connectionName.MAIN_DB),
        getModelToken(Order.name, connectionName.MAIN_DB),
        getModelToken(OrderItem.name, connectionName.MAIN_DB),
        getModelToken(OrderDiscount.name, connectionName.MAIN_DB),
      ],
    }),
  ],
  controllers: [AdminusersController],
  providers: [AdminusersService],
  exports: [AdminModule]
})
export class AdminusersModule { }
