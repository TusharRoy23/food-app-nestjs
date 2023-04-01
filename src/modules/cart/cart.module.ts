import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { connectionName } from '../shared/utils/enum';
import { Cart, CartItem, CartItemSchema, CartSchema } from './schemas';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CART_SERVICE } from './interfaces/ICart.interface';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Cart.name, schema: CartSchema },
        { name: CartItem.name, schema: CartItemSchema },
      ],
      connectionName.MAIN_DB,
    ),
  ],
  controllers: [CartController],
  providers: [{ useClass: CartService, provide: CART_SERVICE }],
  exports: [MongooseModule],
})
export class CartModule {}
