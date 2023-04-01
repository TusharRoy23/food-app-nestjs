import { Restaurant } from '../../restaurant/schemas';
import { RestaurantResponse } from '../utils/response.utils';

export const ELASTICSEARCH_SERVICE = 'ELASTICSEARCH_SERVICE';
export interface IElasticsearchService {
  getRestaurantList(): Promise<RestaurantResponse[]>;
  searchRestaurant(keyword: string): Promise<RestaurantResponse[]>;
  indexRestaurant(restaurant: Restaurant): Promise<boolean>;
}
