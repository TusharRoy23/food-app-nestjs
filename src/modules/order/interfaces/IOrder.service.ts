import { User } from "../../user/schemas/user.schema";
import { OrderResponse, PaginatedOrderResponse, PaginationPayload } from "../../shared/utils/response.utils";
import { OrderDto } from "../dto/order.dto";
import { RatingDto } from "../../restaurant/dto/index.dto";

export const ORDER_SERVICE = 'ORDER_SERVICE';
export interface IOrderService {
    submitOrder(cartId: string, user: User): Promise<OrderResponse>;
    getOrdersByUser(user: User): Promise<OrderResponse[]>;
    giveRating(user: User, ratingDto: RatingDto): Promise<String>;
}