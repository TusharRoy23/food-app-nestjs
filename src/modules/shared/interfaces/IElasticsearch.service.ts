import { Restaurant } from '../../restaurant/schemas/restaurant.schema';
import { IRestaurantResponse } from '../utils/response.utils';

export const ELASTICSEARCH_SERVICE = 'ELASTICSEARCH_SERVICE';
export interface IElasticsearchService {
  getRestaurantList(): Promise<IRestaurantResponse[]>;
  searchRestaurant(keyword: string): Promise<IRestaurantResponse[]>;
  indexRestaurant(restaurant: Restaurant): Promise<boolean>;
}
