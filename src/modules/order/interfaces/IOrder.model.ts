import mongoose from "mongoose";
import { Restaurant } from "../../restaurant/schemas/restaurant.schema";
import { User } from "../../user/schemas/user.schema";
import { OrderStatus, PaidBy } from "../../shared/utils/enum";
import { Order } from "../schemas/order.schema";
import { OrderItem } from "../schemas/order-item.schemas";
import { OrderDiscount } from "../schemas/order-discount.schema";

export interface IOrderDiscount {
    _id: mongoose.Types.ObjectId;
    restaurant: Restaurant;
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
    order: Order;
    qty: number;
    amount: number;
    total_amount: number;
}

export interface IOrder {
    _id: mongoose.Types.ObjectId;
    user: User;
    restaurant: Restaurant;
    order_items: OrderItem[];
    order_discount: OrderDiscount;
    serial_number: string;
    order_amount: number;
    rebate_amount: number;
    total_amount: number;
    order_date: Date;
    order_status: OrderStatus;
    paid_by: PaidBy;
}