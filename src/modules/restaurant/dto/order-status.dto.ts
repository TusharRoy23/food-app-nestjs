import { ApiProperty } from "@nestjs/swagger";
import { IsDefined } from "class-validator";
import { isValidEnum } from "../../shared/dto/custom.validators";
import { OrderStatus } from "../../shared/utils/enum";

export class OrderStatusDto {
    @ApiProperty()
    @IsDefined()
    @isValidEnum('order_status', OrderStatus)
    order_status: string;
}