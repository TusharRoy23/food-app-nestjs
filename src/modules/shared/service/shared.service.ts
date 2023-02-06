import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import moment from "moment";
import { Item, ItemDocuement } from "../../item/schemas/item.schema";
import { User, UserDocument } from "../../../modules/user/schemas/user.schema";
import { Restaurant, RestaurantDocument } from "../../restaurant/schemas";
import { throwException } from "../errors/all.exception";
import { ISharedService } from "../interfaces/IShared.service";
import { connectionName, CurrentStatus, ItemStatus } from "../utils/enum";
import { OrderDiscount, OrderDiscountDocument } from "../../order/schemas";

@Injectable()
export class SharedService implements ISharedService {
    constructor(
        @InjectModel(Restaurant.name, connectionName.MAIN_DB) private readonly restaurantModel: Model<RestaurantDocument>,
        @InjectModel(User.name, connectionName.MAIN_DB) private readonly userModel: Model<UserDocument>,
        @InjectModel(Item.name, connectionName.MAIN_DB) private readonly itemModel: Model<ItemDocuement>,
        @InjectModel(OrderDiscount.name, connectionName.MAIN_DB) private readonly orderDiscountModel: Model<OrderDiscountDocument>
    ) { }

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

    async getItemInfo(itemId: string, restaurantId: string): Promise<Item> {
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

    async getOrderDiscount(restaurantId: string): Promise<OrderDiscount> {
        try {
            let currentDate = new Date().toISOString();
            return await this.orderDiscountModel.findOne({
                restaurant: restaurantId,
                start_date: { $gte: currentDate },
                end_date: { $lte: currentDate }
            }).exec();
        } catch (error) {
            return throwException(error);
        }
    }
}