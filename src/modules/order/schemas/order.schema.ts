import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OrderStatus, PaidBy } from '../../shared/utils/enum';
import { Restaurant } from '../../restaurant/schemas';
import { User } from '../../user/schemas/user.schema';
import { OrderDiscount } from './order-discount.schema';
import { OrderItem } from './order-item.schemas';
import { IOrder } from '../interfaces/IOrder.model';

@Schema({
  toJSON: {
    virtuals: true
  }
})
export class Order implements IOrder {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: Restaurant;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }] })
  order_items: OrderItem[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'OrderDiscount' })
  order_discount: OrderDiscount;

  @Prop({ type: 'String', required: true })
  serial_number: string;

  @Prop({ type: 'Number', required: true })
  order_amount: number;

  @Prop({ type: 'Number', default: 0.0 })
  rebate_amount: number;

  @Prop({ type: 'Number', required: true })
  total_amount: number;

  @Prop({ type: 'Date', default: Date.now() })
  order_date: Date;

  @Prop({
    type: 'String',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  order_status: OrderStatus;

  @Prop({
    type: 'String',
    enum: PaidBy,
    default: PaidBy.CASH_ON_DELIVERY,
  })
  paid_by: PaidBy;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
export type OrderDocument = HydratedDocument<Order>;
