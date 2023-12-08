import {
  IOrderResponse,
  IPaginatedOrderResponse,
} from '../../shared/utils/response.utils';
import { RatingDto } from '../../restaurant/dto/index.dto';
import { PaginationParams } from '../../shared/dto/pagination-params';

export const ORDER_SERVICE = 'ORDER_SERVICE';
export interface IOrderService {
  submitOrder(cartId: string): Promise<IOrderResponse>;
  getOrdersByUser(
    paginationParams: PaginationParams,
  ): Promise<IPaginatedOrderResponse>;
  giveRating(ratingDto: RatingDto): Promise<string>;
}
