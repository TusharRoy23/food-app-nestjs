import { User } from "../../user/schemas/user.schema";
import { Restaurant } from "../../restaurant/schemas";

export const SHARED_SERVICE = 'SHARED_SERVICE';
export interface ISharedService {
    getRestaurantInfo(restaurantUuid: string): Promise<Restaurant>;
    getUserInfo(email: string): Promise<User>;
    isValidRefreshToken(token: string, hashedRefreshToken: string): Promise<boolean>;
}