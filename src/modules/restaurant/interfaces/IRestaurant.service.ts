import { PaginationParams } from '../../shared/dto/pagination-params';
import { OrderDiscount } from '../../../modules/order/schemas';
import {
  IPaginatedOrderResponse,
  IRestaurantResponse,
} from '../../shared/utils/response.utils';
import {
  CreateOrderDiscountDto,
  RegisterDto,
  UpdateOrderDiscountDto,
} from '../dto/index.dto';

export const RESTAURANT_SERVICE = 'RESTAURANT_SERVICE';

export interface IRestaurantService {
  register(registerDto: RegisterDto): Promise<string>;
  getRestaurantList(): Promise<IRestaurantResponse[]>;
  getOrderList(
    paginationParams: PaginationParams,
  ): Promise<IPaginatedOrderResponse>;
  releaseOrder(orderId: string): Promise<string>;
  completeOrder(orderId: string): Promise<string>;
  getOrderDiscount(): Promise<OrderDiscount[]>;
  createOrderDiscount(
    orderDiscountDto: CreateOrderDiscountDto,
  ): Promise<OrderDiscount>;
  updateOrderDiscount(
    orderDiscountDto: UpdateOrderDiscountDto,
    discountId: string,
  ): Promise<OrderDiscount>;
  deleteOrderDiscount(discountId: string): Promise<boolean>;
  searchRestaurant(keyword: string): Promise<IRestaurantResponse[]>;
}
