import { RegisterDto } from '../../restaurant/dto/register.dto';
import {
  IItemReponse,
  IRestaurantResponse,
} from '../../shared/utils/response.utils';

export const PUBLIC_SERVICE = 'PUBLIC_SERVICE';

export interface IPublicService {
  restaurantRegistration(registerDto: RegisterDto): Promise<string>;
  getRestaurantList(): Promise<IRestaurantResponse[]>;
  getItemList(restaurantId: string): Promise<IItemReponse[]>;
  searchRestaurant(keyword: string): Promise<IRestaurantResponse[]>;
}
