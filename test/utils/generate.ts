import { generateItemList } from './item-data';
import {
  generatePaginatedOrderResponse,
  generateRawOrderResponseList,
} from './order-data';
import {
  generateRawRestaurant,
  generateRestaurantList,
} from './restaurant-data';
import { generateUser, generateUserList } from './user-data';

export class PaginatedData {
  count: number;
  currentPage: number;
  nextPage: number;
  totalPages: number;
}

export const getRestaurantList = (n = 1, ...object) =>
  generateRestaurantList(n, object);
export const getItemList = (n = 1, ...object) => generateItemList(n, object);
export const getPaginatedOrderResponse = (
  itemObject: any = {},
  paginatedData: PaginatedData,
) => generatePaginatedOrderResponse(itemObject, paginatedData);
export const getUserList = (n = 1, ...object) => generateUserList(n, object);
export const getUserInfo = (...object) => generateUser(object);
export const getRawRestaurantList = (...object) =>
  generateRawRestaurant(object);
export const getRawOrderResponseList = (n = 1, ...object) =>
  generateRawOrderResponseList(n, object);
