import mongoose from 'mongoose';
import { IRestaurant } from '../../restaurant/interfaces/IRestaurant.model';

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
