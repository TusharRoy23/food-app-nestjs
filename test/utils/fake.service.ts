import { RegisterDto } from '../../src/modules/restaurant/dto/register.dto';
import {
  IItemReponse,
  IPaginatedOrderResponse,
  IRestaurantResponse,
} from '../../src/modules/shared/utils/response.utils';
import { IPublicService } from '../../src/modules/public/interfaces/IPublic.service';
import {
  getItemList,
  getPaginatedOrderResponse,
  getRawRestaurantList,
  getRestaurantList,
} from './generate';
import { IRestaurantService } from '../../src/modules/restaurant/interfaces/IRestaurant.service';
import { OrderDiscount } from '../../src/modules/order/schemas';
import { CreateOrderDiscountDto } from '../../src/modules/restaurant/dto/create-order-discount.dto';
import { UpdateOrderDiscountDto } from '../../src/modules/restaurant/dto/update-order-discount.dto';
import { PaginationParams } from '../../src/modules/shared/dto/pagination-params';
import {
  IElasticsearchService,
  ISharedService,
} from '../../src/modules/shared/interfaces';
import { Cart } from '../../src/modules/cart/schemas';
import { Item } from '../../src/modules/item/schemas/item.schema';
import { RatingDto } from '../../src/modules/restaurant/dto/rating.dto';
import { Restaurant } from '../../src/modules/restaurant/schemas/restaurant.schema';
import { User } from '../../src/modules/user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { IItem } from '../../src/modules/item/interfaces/IItem.model';

export const restaurants = getRestaurantList(4);
export const items = getItemList(4);
export const restaurantRegistrationMsg = 'Restaurant Successfully Created!';
export class FakePublicService implements IPublicService {
  restaurantRegistration(registerDto: RegisterDto): Promise<string> {
    return Promise.resolve(restaurantRegistrationMsg);
  }
  getRestaurantList(): Promise<IRestaurantResponse[]> {
    return Promise.resolve(restaurants);
  }
  getItemList(restaurantId: string): Promise<IItemReponse[]> {
    return Promise.resolve(items);
  }
  searchRestaurant(keyword: string): Promise<IRestaurantResponse[]> {
    return Promise.resolve(restaurants);
  }
}

export const paginatedOrderResponse = getPaginatedOrderResponse(
  {},
  { count: 10, currentPage: 1, nextPage: 0, totalPages: 1 },
);
export const OrderReleaseMsg = 'Order Released successfully';
export const OrderCompletemsg = 'Order completed';
export class FakeRestaurantService implements IRestaurantService {
  register(registerDto: RegisterDto): Promise<string> {
    return Promise.resolve(restaurantRegistrationMsg);
  }
  getRestaurantList(): Promise<IRestaurantResponse[]> {
    return Promise.resolve(restaurants);
  }
  getOrderList(
    paginationParams: PaginationParams,
  ): Promise<IPaginatedOrderResponse> {
    return Promise.resolve(paginatedOrderResponse);
  }
  releaseOrder(orderId: string): Promise<string> {
    return Promise.resolve(OrderReleaseMsg);
  }
  completeOrder(orderId: string): Promise<string> {
    return Promise.resolve(OrderCompletemsg);
  }
  getOrderDiscount(): Promise<OrderDiscount[]> {
    throw new Error('Method not implemented.');
  }
  createOrderDiscount(
    orderDiscountDto: CreateOrderDiscountDto,
  ): Promise<OrderDiscount> {
    throw new Error('Method not implemented.');
  }
  updateOrderDiscount(
    orderDiscountDto: UpdateOrderDiscountDto,
    discountId: string,
  ): Promise<OrderDiscount> {
    throw new Error('Method not implemented.');
  }
  deleteOrderDiscount(discountId: string): Promise<boolean> {
    return Promise.resolve(true);
  }
  searchRestaurant(keyword: string): Promise<IRestaurantResponse[]> {
    return Promise.resolve(restaurants);
  }
}

export const rawRestaurants = getRawRestaurantList();
export class FakeSharedService implements ISharedService {
  getRestaurantInfo(restaurantId: string): Promise<Restaurant> {
    return Promise.resolve(rawRestaurants[0]);
  }
  getUserInfo(email: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  isValidRefreshToken(
    token: string,
    hashedRefreshToken: string,
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  getItemInfo(itemId: string, restaurantId: any): Promise<Item> {
    throw new Error('Method not implemented.');
  }
  getItemList(restaurantId: string): Promise<IItem[]> {
    return Promise.resolve(items);
  }
  getOrderDiscount(restaurantId: any): Promise<OrderDiscount> {
    throw new Error('Method not implemented.');
  }
  getCartInfo(cartId: string): Promise<Cart> {
    throw new Error('Method not implemented.');
  }
  updateCartInfo(conditions: any, payload: any): Promise<Cart> {
    throw new Error('Method not implemented.');
  }
  giveRating(user: User, ratingDto: RatingDto): Promise<string> {
    throw new Error('Method not implemented.');
  }
}

export class FakeElasticsearchService implements IElasticsearchService {
  getRestaurantList(): Promise<IRestaurantResponse[]> {
    return Promise.resolve(restaurants);
  }
  searchRestaurant(keyword: string): Promise<IRestaurantResponse[]> {
    return Promise.resolve(restaurants);
  }
  indexRestaurant(restaurant: Restaurant): Promise<boolean> {
    return Promise.resolve(true);
  }
}

export class FakeJwtService {
  public async getAccessToken(payload: User): Promise<string> {
    const jwt = new JwtService();
    const accessToken = await jwt.sign(
      {
        email: payload.email,
        name: payload.name,
        user_type: payload.user_type,
        role: payload.role,
        current_status: payload.current_status,
        restaurant: payload.restaurant,
      },
      {
        secret: 'JWT_access_Token',
        expiresIn: '30m',
      },
    );
    return accessToken;
  }
}
