import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Item } from '../../item/schemas/item.schema';
import { Cart } from './cart.schema';
import { ICartItem } from '../interfaces/ICart.model';

@Schema({
  toJSON: {
    virtuals: true
  }
})
export class CartItem implements ICartItem {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item' })
  item: Item;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' })
  cart: Cart;

  @Prop({ type: 'Number', default: 0.0 })
  qty: number;

  @Prop({ type: 'Number', default: 0.0 })
  amount: number;

  @Prop({ type: 'Number', default: 0.0 })
  total_amount: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
export type CartItemDocument = HydratedDocument<CartItem>;
