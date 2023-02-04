import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { CartItemDto } from "./cart-item.dto";

export class CartDto {
    @IsArray()
    @Type(() => CartItemDto)
    @ValidateNested({ each: true })
    cart_item: CartItemDto[];
}