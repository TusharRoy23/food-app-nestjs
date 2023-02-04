import { PartialType } from "@nestjs/swagger";
import { CreateOrderDiscountDto } from "./create-order-discount.dto";

export class UpdateOrderDiscountDto extends PartialType(CreateOrderDiscountDto) { }