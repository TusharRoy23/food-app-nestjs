import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OrderStatus, PaidBy } from '../../shared/utils/enum';
import { IUser, IRestaurant, IOrder, IOrderDiscount, IOrderItem } from "../../shared/interfaces/shared.model";

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class Order implements IOrder {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: IUser;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: IRestaurant;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }] })
  order_items: IOrderItem[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'OrderDiscount' })
  order_discount: IOrderDiscount;

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
