import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Item, ItemDocuement } from "../../item/schemas/item.schema";
import { User, UserDocument } from "../../user/schemas/user.schema";
import { Restaurant, RestaurantDocument, RestaurantRating, RestaurantRatingDocument } from "../../restaurant/schemas";
import { throwException } from "../errors/all.exception";
import { ISharedService } from "../interfaces/IShared.service";
import { CartStatus, connectionName, CurrentStatus, ItemStatus } from "../utils/enum";
import { OrderDiscount, OrderDiscountDocument } from "../../order/schemas";
import { Cart, CartDocument } from "../../cart/schemas";
import { RatingDto } from "../../restaurant/dto/index.dto";

@Injectable()
export class SharedService implements ISharedService {
    constructor(
        @InjectModel(Restaurant.name, connectionName.MAIN_DB) private readonly restaurantModel: Model<RestaurantDocument>,
        @InjectModel(RestaurantRating.name, connectionName.MAIN_DB) private restaurantRatingModel: Model<RestaurantRatingDocument>,
        @InjectModel(User.name, connectionName.MAIN_DB) private readonly userModel: Model<UserDocument>,
        @InjectModel(Item.name, connectionName.MAIN_DB) private readonly itemModel: Model<ItemDocuement>,
        @InjectModel(OrderDiscount.name, connectionName.MAIN_DB) private readonly orderDiscountModel: Model<OrderDiscountDocument>,
        @InjectModel(Cart.name, connectionName.MAIN_DB) private cartModel: Model<CartDocument>,
    ) { }

    async updateCartInfo(conditions: any, payload: any): Promise<Cart> {
        try {
            const cart: Cart = await this.cartModel.findOneAndUpdate(conditions, payload, { new: true }).exec();
            if (cart == null) {
                throw new NotFoundException('Cart not found');
            }
            return cart;
        } catch (error: any) {
            return throwException(error);
        }
    }

    async getCartInfo(cartId: string, user: User): Promise<Cart> {
        try {
            const cart: Cart = await this.cartModel.findOne({ _id: cartId, cart_status: CartStatus.SAVED })
                .populate({ path: 'cart_items', populate: 'item' }).exec();
            if (cart == null) {
                throw new NotFoundException('Cart not found');
            }
            return cart;
        } catch (error: any) {
            return throwException(error);
        }
    }

    async getUserInfo(email: string): Promise<User> {
        try {
            const user = await this.userModel.findOne({ email: email }).populate('restaurant').exec();
            if (user == null) {
                throw new NotFoundException('User not found');
            }
            return user;
        } catch (error: any) {
            return throwException(error);
        }
    }

    async isValidRefreshToken(token: string, hashedRefreshToken: string): Promise<boolean> {
        try {
            const user = new User();
            return await user.validateRefreshToken(hashedRefreshToken, token);
        } catch (error: any) {
            return throwException(error);
        }
    }

    async getRestaurantInfo(restaurantId: string): Promise<Restaurant> {
        try {
            const restaurant = await this.restaurantModel.findOne({ _id: restaurantId, current_status: CurrentStatus.ACTIVE }).exec();
            if (restaurant == null) {
                throw new NotFoundException('Restaurant not found');
            }
            return restaurant;
        } catch (error: any) {
            return throwException(error);
        }
    }

    async getItemInfo(itemId: string, restaurantId: any): Promise<Item> {
        try {
            const item: Item = await this.itemModel.findOne({ _id: itemId, restaurant: restaurantId, item_status: ItemStatus.ACTIVE }).exec();
            if (item == null) {
                throw new NotFoundException('Item not found');
            }
            return item;
        } catch (error: any) {
            return throwException(error);
        }
    }

    async getItemList(restaurantId: string): Promise<Item[]> {
        try {
            return await this.itemModel.find({ restaurant: restaurantId, item_status: ItemStatus.ACTIVE }).exec();
        } catch (error: any) {
            return throwException(error);
        }
    }

    async getOrderDiscount(restaurantId: any): Promise<OrderDiscount> {
        try {
            let currentDate = new Date().toISOString();
            return await this.orderDiscountModel.findOne({
                restaurant: restaurantId,
                start_date: { $lte: currentDate },
                end_date: { $gte: currentDate }
            }).sort({ start_date: -1 }).exec();
        } catch (error) {
            return throwException(error);
        }
    }

    async giveRating(user: User, ratingDto: RatingDto): Promise<String> {
        try {
            const rating: RestaurantRating = await this.restaurantRatingModel.findOneAndUpdate(
                { user: user._id, restaurant: ratingDto.restaurant_id },
                { star: ratingDto.star }, { new: true }
            )
                .exec();
            if (rating == null) {
                const restaurant: Restaurant = await this.getRestaurantInfo(ratingDto.restaurant_id);
                const newRating: RestaurantRating = await new this.restaurantRatingModel({
                    restaurant: restaurant,
                    star: ratingDto.star,
                    user
                }).save();

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