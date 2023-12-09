import mongoose from 'mongoose';
import { IUser } from '../../user/interfaces/IUser.model';
import { IItem } from '../../item/interfaces/IItem.model';

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
