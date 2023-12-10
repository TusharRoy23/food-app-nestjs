import mongoose from "mongoose";
import { OrderStatus, PaidBy } from "../utils/enum";

/*
    USER
*/
export interface IUser {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    name: string;
    user_type: string;
    role: string;
    current_status: string;
    restaurant: IRestaurant;
    hashedRefreshToken: string;
    login_status: boolean;
    doPasswordHashing(password: string): Promise<string>;
    validatePasswords(hashedPassword: string, password: string): Promise<boolean>;
    validateRefreshToken(hashedToken: string, token: string): Promise<boolean>;
}

/*
    ITEM
*/
export interface IItem {
    _id: mongoose.Types.ObjectId;
    name: string;
    icon: string;
    image: string;
    item_type: string;
    meal_type: string;
    meal_state: string;
    meal_flavor: string;
    restaurant: IRestaurant;
    price: number;
    max_order_qty?: number;
    min_order_qty?: number;
    discount_rate?: number;
    created_date: Date;
    item_status: string;
}

export interface IRestaurantItem {
    _id: mongoose.Types.ObjectId;
    restaurant: IRestaurant;
    item: IItem;
    sell_count: number;
}

export interface IRestaurant {
    _id: mongoose.Types.ObjectId;
    name: string;
    address: string;
    users: IUser[];
    profile_img: string;
    opening_time: string;
    closing_time: string;
    current_status: string;
}

export interface IRestaurantRating {
    _id: mongoose.Types.ObjectId;
    restaurant: IRestaurant;
    user: IUser;
    star: number;
    rating_date: Date;
}

/*
    CART
*/

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

/*
    ORDER 
*/
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

