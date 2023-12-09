import mongoose from 'mongoose';
import { IUser } from '../../user/interfaces/IUser.model';
import { OrderStatus, PaidBy } from '../../shared/utils/enum';
import { IRestaurant } from '../../restaurant/interfaces/IRestaurant.model';

export interface IOrderDiscount {
  _id: mongoose.Types.ObjectId;
  restaurant: IRestaurant;
  max_amount: number;
  min_amount: number;
  discount_rate: number;
  start_date: Date;
  end_date: Date;
  created_date?: string;
}

export interface IOrderItem {
  _id: mongoose.Types.ObjectId;
  item_id: mongoose.Types.ObjectId;
  name: string;
  icon: string;
  image: string;
  item_type: string;
  meal_type: string;
  meal_state: string;
  meal_flavor: string;
  price: number;
  discount_rate?: number;
  order: IOrder;
  qty: number;
  amount: number;
  total_amount: number;
}

export interface IOrder {
  _id: mongoose.Types.ObjectId;
  user: IUser;
  restaurant: IRestaurant;
  order_items: IOrderItem[];
  order_discount: IOrderDiscount;
  serial_number: string;
  order_amount: number;
  rebate_amount: number;
  total_amount: number;
  order_date: Date;
  order_status: OrderStatus;
  paid_by: PaidBy;
}
