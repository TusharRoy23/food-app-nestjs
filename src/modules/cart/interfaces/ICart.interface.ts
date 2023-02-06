import { User } from "../../user/schemas/user.schema";
import { CartReponse } from "../../shared/utils/response.utils";
import { CartItemDto } from "../dto/index.dto";

export const CART_SERVICE = 'CART_SERVICE';

export interface ICartService {
    create(cartItemDto: CartItemDto, user: User, restaurantId: string): Promise<CartReponse>;
    retrieve(cartId: string, user: User): Promise<CartReponse>;
    update(cartItemDto: CartItemDto, user: User, cartId: string): Promise<CartReponse>;
    delete(cartItemId: string, cartId: string, user: User): Promise<CartReponse>;
}