import { User } from "../../user/schemas/user.schema";
import { Restaurant } from "../../restaurant/schemas";
import { Item } from "../../item/schemas/item.schema";
import { OrderDiscount } from "../../order/schemas";

export const SHARED_SERVICE = 'SHARED_SERVICE';
export interface ISharedService {
    getRestaurantInfo(restaurantUuid: string): Promise<Restaurant>;
    getUserInfo(email: string): Promise<User>;
    isValidRefreshToken(token: string, hashedRefreshToken: string): Promise<boolean>;
    getItemInfo(itemId: string, restaurantId: string): Promise<Item>;
    getItemList(restaurantId: string): Promise<Item[]>;
    getOrderDiscount(restaurantId: string): Promise<OrderDiscount>;
}