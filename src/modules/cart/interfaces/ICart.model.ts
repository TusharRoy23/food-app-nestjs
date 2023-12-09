import mongoose from 'mongoose';
import { IUser } from '../../user/interfaces/IUser.model';
import { IRestaurant } from '../../restaurant/interfaces/IRestaurant.model';
import { IOrderDiscount } from '../../order/interfaces/IOrder.model';
import { IItem } from '../../item/interfaces/IItem.model';

export interface ICart {
  _id: mongoose.Types.ObjectId;
  user: IUser;
  restaurant: IRestaurant;
  cart_items: ICartItem[];
  order_discount: IOrderDiscount;
  cart_amount: number;
  total_amount: number;
  rebate_amount: number;
  cart_date: Date;
  cart_status: string;
}

export interface ICartItem {
  _id: mongoose.Types.ObjectId;
  item: IItem;
  cart: ICart;
  qty: number;
  amount: number;
  total_amount: number;
}
