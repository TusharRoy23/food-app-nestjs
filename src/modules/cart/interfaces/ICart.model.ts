import mongoose from "mongoose";
import { OrderDiscount } from "../../order/schemas";
import { Restaurant } from "../../restaurant/schemas";
import { User } from "../../user/schemas/user.schema";
import { Cart, CartItem } from "../schemas";
import { Item } from "../../item/schemas/item.schema";

export interface ICart {
    _id: mongoose.Types.ObjectId;
    user: User;
    restaurant: Restaurant;
    cart_items: CartItem[];
    order_discount: OrderDiscount;
    cart_amount: number;
    total_amount: number;
    rebate_amount: number;
    cart_date: Date;
    cart_status: string;
}

export interface ICartItem {
    _id: mongoose.Types.ObjectId;
    item: Item;
    cart: Cart;
    qty: number;
    amount: number;
    total_amount: number;
}