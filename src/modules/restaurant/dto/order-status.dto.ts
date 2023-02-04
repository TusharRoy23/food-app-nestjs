import { isValidEnum } from "../../shared/dto/custom.validators";
import { OrderStatus } from "../../shared/utils/enum";

export class OrderStatusDto {
    @isValidEnum('order_status', OrderStatus)
    order_status: string;
}