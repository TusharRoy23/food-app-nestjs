import { User } from "../../user/schemas/user.schema";
import { OrderResponse, PaginatedOrderResponse } from "../../shared/utils/response.utils";
import { OrderDto } from "../dto/order.dto";
import { RatingDto } from "../../restaurant/dto/index.dto";
import { PaginationParams } from "../../shared/dto/pagination-params";

export const ORDER_SERVICE = 'ORDER_SERVICE';
export interface IOrderService {
    submitOrder(cartId: string): Promise<OrderResponse>;
    getOrdersByUser(paginationParams: PaginationParams): Promise<PaginatedOrderResponse>;
    giveRating(ratingDto: RatingDto): Promise<String>;
}