import { PaginationParams } from "../../shared/dto/pagination-params";
import { OrderDiscount } from "../../../modules/order/schemas";
import { User } from "../../../modules/user/schemas/user.schema";
import { OrderResponse, PaginatedOrderResponse, PaginationPayload } from "../../shared/utils/response.utils";
import { CreateOrderDiscountDto, RatingDto, RegisterDto, UpdateOrderDiscountDto } from "../dto/index.dto";
import { Restaurant } from "../schemas";

export const RESTAURANT_SERVICE = 'RESTAURANT_SERVICE';

export interface IRestaurantService {
    register(registerDto: RegisterDto): Promise<string>;
    getRestaurantList(): Promise<Restaurant[]>;
    getOrderList(user: User, paginationParams: PaginationParams): Promise<PaginatedOrderResponse>;
    releaseOrder(orderId: String, user: User): Promise<String>;
    completeOrder(orderId: String, user: User): Promise<String>;
    getOrderDiscount(user: User): Promise<OrderDiscount[]>;
    createOrderDiscount(orderDiscountDto: CreateOrderDiscountDto, user: User): Promise<OrderDiscount>;
    updateOrderDiscount(orderDiscountDto: UpdateOrderDiscountDto, user: User, discountId: string): Promise<OrderDiscount>;
    deleteOrderDiscount(user: User, discountId: string): Promise<boolean>;
    searchRestaurant(keyword: string): Promise<Restaurant[]>;
}