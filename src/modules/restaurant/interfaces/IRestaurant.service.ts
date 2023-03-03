import { PaginationParams } from "../../shared/dto/pagination-params";
import { OrderDiscount } from "../../../modules/order/schemas";
import { PaginatedOrderResponse, RestaurantResponse } from "../../shared/utils/response.utils";
import { CreateOrderDiscountDto, RegisterDto, UpdateOrderDiscountDto } from "../dto/index.dto";
import { Restaurant } from "../schemas";

export const RESTAURANT_SERVICE = 'RESTAURANT_SERVICE';

export interface IRestaurantService {
    register(registerDto: RegisterDto): Promise<string>;
    getRestaurantList(): Promise<Restaurant[]>;
    getOrderList(paginationParams: PaginationParams): Promise<PaginatedOrderResponse>;
    releaseOrder(orderId: String): Promise<String>;
    completeOrder(orderId: String): Promise<String>;
    getOrderDiscount(): Promise<OrderDiscount[]>;
    createOrderDiscount(orderDiscountDto: CreateOrderDiscountDto): Promise<OrderDiscount>;
    updateOrderDiscount(orderDiscountDto: UpdateOrderDiscountDto, discountId: string): Promise<OrderDiscount>;
    deleteOrderDiscount(discountId: string): Promise<boolean>;
    searchRestaurant(keyword: string): Promise<RestaurantResponse[]>;
}