import { PaginationParams } from '../../shared/dto/pagination-params';
import {
  IPaginatedOrderResponse,
  IRestaurantResponse,
} from '../../shared/utils/response.utils';
import {
  CreateOrderDiscountDto,
  RegisterDto,
  UpdateOrderDiscountDto,
} from '../dto/index.dto';
import { IOrderDiscount } from '../../shared/interfaces/shared.model';

export const RESTAURANT_SERVICE = 'RESTAURANT_SERVICE';

export interface IRestaurantService {
  register(registerDto: RegisterDto): Promise<string>;
  getRestaurantList(): Promise<IRestaurantResponse[]>;
  getOrderList(
    paginationParams: PaginationParams,
  ): Promise<IPaginatedOrderResponse>;
  releaseOrder(orderId: string): Promise<string>;
  completeOrder(orderId: string): Promise<string>;
  getOrderDiscount(): Promise<IOrderDiscount[]>;
  createOrderDiscount(
    orderDiscountDto: CreateOrderDiscountDto,
  ): Promise<IOrderDiscount>;
  updateOrderDiscount(
    orderDiscountDto: UpdateOrderDiscountDto,
    discountId: string,
  ): Promise<IOrderDiscount>;
  deleteOrderDiscount(discountId: string): Promise<boolean>;
  searchRestaurant(keyword: string): Promise<IRestaurantResponse[]>;
}
