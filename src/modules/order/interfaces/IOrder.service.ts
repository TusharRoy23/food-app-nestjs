import { OrderResponse, PaginatedOrderResponse, PaginationPayload } from "../../shared/utils/response.utils";
import { OrderDto } from "../dto/order.dto";

export const ORDER_SERVICE = 'ORDER_SERVICE';
export interface IOrderService {
    submitOrder(orderDto: OrderDto, userUuid: string): Promise<OrderResponse>;
    getOrdersByUser(userUuid: string, pagination: PaginationPayload): Promise<PaginatedOrderResponse>;
}