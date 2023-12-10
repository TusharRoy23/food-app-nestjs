import mongoose from 'mongoose';
import { IUser } from "../interfaces/shared.model";

export interface IUserResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ICartResponse {
  id: mongoose.Types.ObjectId;
  cart_amount: number;
  total_amount: number;
  rebate_amount: number;
  discount_rate: number;
  cart_date: Date;
  cart_status: string;
  cart_item: ICartItemResponse[];
}

export interface ICartItemResponse {
  id: mongoose.Types.ObjectId;
  qty: number;
  amount: number;
  total_amount: number;
  item: IItemReponse;
}

export interface IOrderResponse {
  id: mongoose.Types.ObjectId;
  order_amount: number;
  total_amount: number;
  restaurant?: IRestaurantResponse;
  serial_number: string;
  rebate_amount: number;
  discount_rate: number;
  order_date: Date;
  order_status: string;
  paid_by: string;
  order_item: IOrderItemResponse[];
  user?: IUser;
}

export interface IOrderItemResponse {
  id: mongoose.Types.ObjectId;
  qty: number;
  amount: number;
  total_amount: number;
  item: IItemReponse;
}

export interface IPaginatedOrderResponse {
  orders: IOrderResponse[];
  count: number;
  currentPage: number;
  totalPages: number;
  nextPage: number;
}

export interface IPaginationPayload {
  limit: number;
  offset: number;
  currentPage: number;
}
export interface IPaginationDataResponse {
  count: number;
  currentPage: number;
  totalPages: number;
  nextPage: number;
}

export interface IItemReponse {
  id?: mongoose.Types.ObjectId;
  meal_state: string;
  name: string;
  icon?: string;
  image?: string;
  item_type: string;
  meal_type: string;
  meal_flavor: string;
  restaurant?: IRestaurantResponse;
  price: number;
  discount_rate: number;
}

export interface IRestaurantResponse {
  id: mongoose.Types.ObjectId;
  name: string;
  address: string;
  opening_time?: string;
  closing_time?: string;
  current_status?: string;
}
