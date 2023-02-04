import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../../../modules/user/schemas/user.schema";
import { Restaurant, RestaurantDocument } from "../../restaurant/schemas";
import { throwException } from "../errors/all.exception";
import { ISharedService } from "../interfaces/IShared.service";
import { connectionName } from "../utils/enum";

@Injectable()
export class SharedService implements ISharedService {
    constructor(
        @InjectModel(Restaurant.name, connectionName.MAIN_DB) private readonly restaurantModel: Model<RestaurantDocument>,
        @InjectModel(User.name, connectionName.MAIN_DB) private readonly userModel: Model<UserDocument>
    ) { }

    async getUserInfo(email: string): Promise<User> {
        try {
            const user = await this.userModel.findOne({ email: email }).populate('restaurant').exec();
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

    async getRestaurantInfo(restaurantUuid: string): Promise<Restaurant> {
        try {
            const restaurant = await this.restaurantModel.findById(restaurantUuid);
            if (!Object.keys(restaurant).length) {
                throw new NotFoundException('Restaurant not found');
            }
            return restaurant;
        } catch (error: any) {
            return throwException(error);
        }
    }
}