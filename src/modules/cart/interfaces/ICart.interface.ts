import { ICartResponse } from '../../shared/utils/response.utils';
import { CartItemDto } from '../dto/index.dto';

export const CART_SERVICE = 'CART_SERVICE';

export interface ICartService {
  create(
    cartItemDto: CartItemDto,
    restaurantId: string,
  ): Promise<ICartResponse>;
  retrieve(cartId: string): Promise<ICartResponse>;
  update(cartItemDto: CartItemDto, cartId: string): Promise<ICartResponse>;
  delete(cartItemId: string, cartId: string): Promise<ICartResponse>;
}
