import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CartStatus } from '../../shared/utils/enum';
import { ICart, ICartItem } from '../interfaces/ICart.model';
import { IUser } from '../../user/interfaces/IUser.model';
import { IOrderDiscount } from '../../order/interfaces/IOrder.model';
import { IRestaurant } from '../../restaurant/interfaces/IRestaurant.model';

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class Cart implements ICart {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: IUser;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: IRestaurant;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem' }] })
  cart_items: ICartItem[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'OrderDiscount' })
  order_discount: IOrderDiscount;

  @Prop({ type: 'Number', default: 0.0 })
  cart_amount: number;

  @Prop({ type: 'Number', default: 0.0 })
  total_amount: number;

  @Prop({ type: 'Number', default: 0.0 })
  rebate_amount: number;

  @Prop({ type: 'Date', default: Date.now() })
  cart_date: Date;

  @Prop({
    type: 'String',
    enum: CartStatus,
    default: CartStatus.SAVED,
  })
  cart_status: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
export type CartDocument = HydratedDocument<Cart>;
