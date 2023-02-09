import { User } from "../../user/schemas/user.schema";
import { Restaurant } from "../../restaurant/schemas";
import { Item } from "../../item/schemas/item.schema";
import { OrderDiscount } from "../../order/schemas";
import { Cart } from "../../cart/schemas";
import { RatingDto } from "../../restaurant/dto/index.dto";

export const SHARED_SERVICE = 'SHARED_SERVICE';
export interface ISharedService {
    getRestaurantInfo(restaurantId: string): Promise<Restaurant>;
    getUserInfo(email: string): Promise<User>;
    isValidRefreshToken(token: string, hashedRefreshToken: string): Promise<boolean>;
    getItemInfo(itemId: string, restaurantId: any): Promise<Item>;
    getItemList(restaurantId: string): Promise<Item[]>;
    getOrderDiscount(restaurantId: any): Promise<OrderDiscount>;
    getCartInfo(cartId: string, user: User): Promise<Cart>;
    updateCartInfo(conditions: any, payload: any): Promise<Cart>;
    giveRating(user: User, ratingDto: RatingDto): Promise<String>;
}