import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  ItemType,
  MealType,
  MealState,
  MealFlavor,
} from '../../shared/utils/enum';
import { Order } from './order.schema';
import { IOrderItem } from '../interfaces/IOrder.model';

@Schema({
  toJSON: {
    getters: true,
    versionKey: false
  },
  id: false
})
export class OrderItem implements IOrderItem {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: 'ObjectId', required: true })
  item_id: mongoose.Types.ObjectId;

  @Prop({
    type: 'String',
    maxlength: 13,
    minlength: 1,
    required: true,
    lowercase: true,
  })
  name: string;

  @Prop({ type: 'String' })
  icon: string;

  @Prop({ type: 'String' })
  image: string;

  @Prop({ type: 'String', default: ItemType.FOOD, enum: ItemType })
  item_type: string;

  @Prop({ type: 'String', default: MealType.FASTFOOD, enum: MealType })
  meal_type: string;

  @Prop({ type: 'String', default: MealState.HOT, enum: MealState })
  meal_state: string;

  @Prop({ type: 'String', default: MealFlavor.SWEET, enum: MealFlavor })
  meal_flavor: string;

  @Prop({ type: 'Number', required: true, min: 0.0 })
  price: number;

  @Prop({ type: 'Number', default: 0.0, min: 0.0 })
  discount_rate?: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
  order: Order;

  @Prop({ type: 'Number', required: true })
  qty: number;

  @Prop({ required: true, type: 'Number' })
  amount: number;

  @Prop({ required: true, type: 'Number' })
  total_amount: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
export type OrderItemDocument = HydratedDocument<OrderItem>;
