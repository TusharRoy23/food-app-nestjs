import { RegisterDto } from '../../restaurant/dto/register.dto';
import {
  ItemReponse,
  RestaurantResponse,
} from '../../shared/utils/response.utils';

export const PUBLIC_SERVICE = 'PUBLIC_SERVICE';

export interface IPublicService {
  restaurantRegistration(registerDto: RegisterDto): Promise<string>;
  getRestaurantList(): Promise<RestaurantResponse[]>;
  getItemList(restaurantId: string): Promise<ItemReponse[]>;
  searchRestaurant(keyword: string): Promise<RestaurantResponse[]>;
}
