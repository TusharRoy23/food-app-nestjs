import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocuement } from '../../item/schemas/item.schema';
import { User, UserDocument } from '../../user/schemas/user.schema';
import { throwException } from '../errors/all.exception';
import { ISharedService } from '../interfaces/IShared.service';
import {
  CartStatus,
  connectionName,
  CurrentStatus,
  ItemStatus,
} from '../utils/enum';
import {
  OrderDiscount,
  OrderDiscountDocument,
} from '../../order/schemas/order-discount.schema';
import { Cart, CartDocument } from '../../cart/schemas/cart.schema';
import { RatingDto } from '../../restaurant/dto/index.dto';
import { IItem, IRestaurant, IUser, ICart, IOrderDiscount } from "../interfaces/shared.model";
import {
  Restaurant,
  RestaurantDocument,
} from '../../restaurant/schemas/restaurant.schema';
import {
  RestaurantRating,
  RestaurantRatingDocument,
} from '../../restaurant/schemas/restaurant-rating.schema';

@Injectable()
export class SharedService implements ISharedService {
  constructor(
    @InjectModel(Restaurant.name, connectionName.MAIN_DB)
    private readonly restaurantModel: Model<RestaurantDocument>,
    @InjectModel(RestaurantRating.name, connectionName.MAIN_DB)
    private restaurantRatingModel: Model<RestaurantRatingDocument>,
    @InjectModel(User.name, connectionName.MAIN_DB)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Item.name, connectionName.MAIN_DB)
    private readonly itemModel: Model<ItemDocuement>,
    @InjectModel(OrderDiscount.name, connectionName.MAIN_DB)
    private readonly orderDiscountModel: Model<OrderDiscountDocument>,
    @InjectModel(Cart.name, connectionName.MAIN_DB)
    private cartModel: Model<CartDocument>,
  ) { }

  async updateCartInfo(conditions: any, payload: any): Promise<ICart> {
    try {
      const cart: Cart = await this.cartModel
        .findOneAndUpdate(conditions, payload, { new: true })
        .exec();
      if (cart == null) {
        throw new NotFoundException('Cart not found');
      }
      return cart;
    } catch (error: any) {
      return throwException(error);
    }
  }

  async getCartInfo(cartId: string): Promise<ICart> {
    try {
      const cart: Cart = await this.cartModel
        .findOne({ _id: cartId, cart_status: CartStatus.SAVED })
        .populate({ path: 'cart_items', populate: 'item' })
        .exec();
      if (cart == null) {
        throw new NotFoundException('Cart not found');
      }
      return cart;
    } catch (error: any) {
      return throwException(error);
    }
  }

  async getUserInfo(email: string): Promise<IUser> {
    try {
      const user = await this.userModel
        .findOne({ email: email })
        .populate('restaurant')
        .exec();
      if (user == null) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error: any) {
      return throwException(error);
    }
  }

  async isValidRefreshToken(
    token: string,
    hashedRefreshToken: string,
  ): Promise<boolean> {
    try {
      const user = new User();
      return await user.validateRefreshToken(hashedRefreshToken, token);
    } catch (error: any) {
      return throwException(error);
    }
  }

  async getRestaurantInfo(restaurantId: string): Promise<IRestaurant> {
    try {
      const restaurant: Restaurant = await this.restaurantModel
        .findOne({ _id: restaurantId, current_status: CurrentStatus.ACTIVE })
        .exec();
      if (restaurant == null) {
        throw new NotFoundException('Restaurant not found');
      }
      return restaurant;
    } catch (error: any) {
      return throwException(error);
    }
  }

  async getItemInfo(itemId: string, restaurantId: any): Promise<IItem> {
    try {
      const item: Item = await this.itemModel
        .findOne({
          _id: itemId,
          restaurant: restaurantId,
          item_status: ItemStatus.ACTIVE,
        })
        .exec();
      if (item == null) {
        throw new NotFoundException('Item not found');
      }
      return item;
    } catch (error: any) {
      return throwException(error);
    }
  }

  async getItemList(restaurantId: string): Promise<IItem[]> {
    try {
      return await this.itemModel
        .find({ restaurant: restaurantId, item_status: ItemStatus.ACTIVE })
        .exec();
    } catch (error: any) {
      return throwException(error);
    }
  }

  async getOrderDiscount(restaurantId: any): Promise<IOrderDiscount> {
    try {
      const currentDate = new Date().toISOString();
      return await this.orderDiscountModel
        .findOne({
          restaurant: restaurantId,
          start_date: { $lte: currentDate },
          end_date: { $gte: currentDate },
        })
        .sort({ start_date: -1 })
        .exec();
    } catch (error) {
      return throwException(error);
    }
  }

  async giveRating(user: User, ratingDto: RatingDto): Promise<string> {
    try {
      const rating: RestaurantRating = await this.restaurantRatingModel
        .findOneAndUpdate(
          { user: user._id, restaurant: ratingDto.restaurant_id },
          { star: ratingDto.star },
          { new: true },
        )
        .exec();
      if (rating == null) {
        const restaurant: Restaurant = await this.getRestaurantInfo(
          ratingDto.restaurant_id,
        );
        const newRating: RestaurantRating =
          await this.restaurantRatingModel.create({
            restaurant: restaurant,
            star: ratingDto.star,
            user,
          });

        if (newRating == null) {
          throw new InternalServerErrorException('Rating unsuccessful');
        }
      }
      return 'Thanks for your rating';
    } catch (error: any) {
      return throwException(error);
    }
  }
}
