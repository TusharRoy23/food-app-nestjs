import { User } from '../../user/schemas/user.schema';
import { RatingDto } from '../../restaurant/dto/index.dto';
import { IItem, IRestaurant, IUser, IOrderDiscount, ICart } from "./shared.model";

export const SHARED_SERVICE = 'SHARED_SERVICE';
export interface ISharedService {
  getRestaurantInfo(restaurantId: string): Promise<IRestaurant>;
  getUserInfo(email: string): Promise<IUser>;
  isValidRefreshToken(
    token: string,
    hashedRefreshToken: string,
  ): Promise<boolean>;
  getItemInfo(itemId: string, restaurantId: any): Promise<IItem>;
  getItemList(restaurantId: string): Promise<IItem[]>;
  getOrderDiscount(restaurantId: any): Promise<IOrderDiscount>;
  getCartInfo(cartId: string): Promise<ICart>;
  updateCartInfo(conditions: any, payload: any): Promise<ICart>;
  giveRating(user: User, ratingDto: RatingDto): Promise<string>;
}
