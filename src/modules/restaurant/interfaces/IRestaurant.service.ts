import { OrderDiscount } from "../../../modules/order/schemas";
import { User } from "../../../modules/user/schemas/user.schema";
import { PaginatedOrderResponse, PaginationPayload } from "../../shared/utils/response.utils";
import { CreateOrderDiscountDto, RatingDto, RegisterDto, UpdateOrderDiscountDto } from "../dto/index.dto";
import { Restaurant } from "../schemas";

export const RESTAURANT_SERVICE = 'RESTAURANT_SERVICE';

export interface IRestaurantService {
    register(registerDto: RegisterDto): Promise<string>;
    getRestaurantList(): Promise<Restaurant[]>;
    getOrderList(email: string,): Promise<string>;
    releaseOrder(orderUuid: String, user: User): Promise<String>;
    completeOrder(orderUuid: String, user: User): Promise<String>;
    getOrderDiscount(user: User): Promise<OrderDiscount[]>;
    createOrderDiscount(orderDiscountDto: CreateOrderDiscountDto, user: User): Promise<OrderDiscount>;
    updateOrderDiscount(orderDiscountDto: UpdateOrderDiscountDto, user: User, uuid: string): Promise<OrderDiscount>;
    deleteOrderDiscount(user: User, uuid: string): Promise<boolean>;
    giveRating(user: User, ratingDto: RatingDto): Promise<String>;
    searchRestaurant(keyword: string): Promise<Restaurant[]>;
}