import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurant } from '../../restaurant/schemas/restaurant.schema';
import { IOrderDiscount } from '../interfaces/IOrder.model';

@Schema({
  toJSON: {
    virtuals: true
  }
})
export class OrderDiscount implements IOrderDiscount {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: Restaurant;

  @Prop({ type: 'Number', required: true })
  max_amount: number;

  @Prop({ type: 'Number', default: 1 })
  min_amount: number;

  @Prop({ type: 'Number', default: 0.0 })
  discount_rate: number;

  @Prop({ type: 'Date', required: true })
  start_date: Date;

  @Prop({ type: 'Date', required: true })
  end_date: Date;

  @Prop({ type: 'Date', default: Date.now() })
  created_date?: string;
}
export const OrderDiscountSchema = SchemaFactory.createForClass(OrderDiscount);
export type OrderDiscountDocument = HydratedDocument<OrderDiscount>;
