import { CartReponse } from "../../shared/utils/response.utils";
import { CartItemDto } from "../dto/index.dto";

export const CART_SERVICE = 'CART_SERVICE';

export interface ICartService {
    create(cartItemDto: CartItemDto, restaurantId: string): Promise<CartReponse>;
    retrieve(cartId: string): Promise<CartReponse>;
    update(cartItemDto: CartItemDto, cartId: string): Promise<CartReponse>;
    delete(cartItemId: string, cartId: string): Promise<CartReponse>;
}