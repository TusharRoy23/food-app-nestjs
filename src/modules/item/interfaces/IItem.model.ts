import mongoose from "mongoose";
import { Restaurant } from "../../restaurant/schemas";

export interface IItem {
    _id: number | mongoose.Types.ObjectId;
    icon: string;
    image: string;
    item_type: string;
    meal_type: string;
    meal_state: string;
    meal_flavor: string;
    restaurant: Restaurant;
    price: number;
    max_order_qty?: number;
    min_order_qty?: number;
    discount_rate?: number;
    created_date: Date;
    item_status: string;
}