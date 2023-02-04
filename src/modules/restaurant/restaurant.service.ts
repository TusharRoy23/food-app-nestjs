import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { throwException } from '../shared/errors/all.exception';
import { connectionName, CurrentStatus, UserRole, UserType } from '../shared/utils/enum';
import { PaginationPayload, PaginatedOrderResponse } from '../shared/utils/response.utils';
import { OrderDiscount } from '../order/schemas';
import { User, UserDocument } from '../user/schemas/user.schema';
import { CreateOrderDiscountDto } from './dto/create-order-discount.dto';
import { RatingDto } from './dto/rating.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateOrderDiscountDto } from './dto/update-order-discount.dto';
import { IRestaurantService } from './interfaces/IRestaurant.service';
import { Restaurant, RestaurantDocument } from './schemas';

@Injectable()
export class RestaurantService implements IRestaurantService {
    constructor(
        @InjectModel(Restaurant.name, connectionName.MAIN_DB) private restaurantModel: Model<RestaurantDocument>,
        @InjectModel(User.name, connectionName.MAIN_DB) private userModel: Model<UserDocument>
    ) { }

    async register(registerDto: RegisterDto): Promise<string> {
        try {
            // Create User
            const user = new User();
            user.email = registerDto.email;
            user.name = registerDto.name;
            user.password = await user.doPasswordHashing(registerDto.password);
            user.user_type = UserType.RESTAURANT_USER;
            user.role = UserRole.OWNER;
            user.hashedRefreshToken = '';
            const createdUser = await new this.userModel(user).save();

            // Create Restaurant
            const restaurant = new Restaurant();
            restaurant.user = [createdUser.id];
            restaurant.name = registerDto.restaurant_name;
            restaurant.address = registerDto.address;
            restaurant.opening_time = registerDto.opening_time;
            restaurant.closing_time = registerDto.closing_time;
            const createdRestaurant = await new this.restaurantModel(restaurant).save();
            await this.userModel.findOneAndUpdate({ email: createdUser.email }, { restaurant: createdRestaurant.id });

            return Promise.resolve('Restaurant Successfully Created!');

        } catch (error: any) {
            return throwException(error);
        }
    }
    async getRestaurantList(): Promise<Restaurant[]> {
        try {
            return await this.restaurantModel.find({ current_status: CurrentStatus.ACTIVE }).exec();
        } catch (error) {
            return throwException(error);
        }
    }
    getOrderList(email: string): Promise<string> {
        console.log('email: ', email);
        try {
            return Promise.resolve(email);
            // return {
            //     orders: [{ uuid: order.uuid,
            //         serial_number: order.serial_number,
            //         order_amount: order.order_amount,
            //         total_amount: order.total_amount,
            //         rebate_amount: order.rebate_amount,
            //         order_date: order.order_date,
            //         order_status: order.order_status,
            //         paid_by: order.paid_by,
            //         order_discount: order.order_discount,
            //         user: order.user,
            //         order_item: newOrderItem, }],
            //     count: 0,
            //     currentPage: 0,
            //     totalPages: 0,
            //     nextPage: 0,
            // };
        } catch (error: any) {
            return throwException(error);
        }
    }
    releaseOrder(orderUuid: String, user: User): Promise<String> {
        throw new Error('Method not implemented.');
    }
    completeOrder(orderUuid: String, user: User): Promise<String> {
        throw new Error('Method not implemented.');
    }
    getOrderDiscount(user: User): Promise<OrderDiscount[]> {
        throw new Error('Method not implemented.');
    }
    createOrderDiscount(orderDiscountDto: CreateOrderDiscountDto, user: User): Promise<OrderDiscount> {
        throw new Error('Method not implemented.');
    }
    updateOrderDiscount(orderDiscountDto: UpdateOrderDiscountDto, user: User, uuid: string): Promise<OrderDiscount> {
        throw new Error('Method not implemented.');
    }
    deleteOrderDiscount(user: User, uuid: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    giveRating(user: User, ratingDto: RatingDto): Promise<String> {
        throw new Error('Method not implemented.');
    }
    searchRestaurant(keyword: string): Promise<Restaurant[]> {
        throw new Error('Method not implemented.');
    }
}
