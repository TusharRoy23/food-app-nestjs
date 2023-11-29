import mongoose from "mongoose";
import { Restaurant } from "../../restaurant/schemas";

export interface IUser {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    name: string;
    user_type: string;
    role: string;
    current_status: string;
    restaurant: Restaurant;
    hashedRefreshToken: string;
    login_status: boolean;
}