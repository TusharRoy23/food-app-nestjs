import mongoose from "mongoose";
import { User } from "../../user/schemas/user.schema";
import { Restaurant } from "../schemas";
import { Item } from "../../item/schemas/item.schema";

export interface IRestaurantItem {
    _id: mongoose.Types.ObjectId;
    restaurant: Restaurant;
    item: Item;
    sell_count: number;
}

export interface IRestaurant {
    _id: mongoose.Types.ObjectId;
    name: string;
    address: string;
    users: User[];
    profile_img: string;
    opening_time: string;
    closing_time: string;
    current_status: string;
}

export interface IRestaurantRating {
    _id: mongoose.Types.ObjectId;
    restaurant: Restaurant;
    user: User;
    star: number;
    rating_date: Date;
}