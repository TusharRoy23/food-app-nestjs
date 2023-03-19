import { generateItemList } from "./item-data";
import { generatePaginatedOrderResponse } from "./order-data";
import { generateRawRestaurant, generateRestaurantList } from "./restaurant-data";
import { generateUserList } from "./user-data";

export class PaginatedData {
    count: number;
    currentPage: number;
    nextPage: number;
    totalPages: number;
}

export const getRestaurantList = (n = 1, ...object) => generateRestaurantList(n, object);
export const getItemList = (n = 1, ...object) => generateItemList(n, object);
export const getPaginatedOrderResponse = (itemObject: any = {}, paginatedData: PaginatedData) => generatePaginatedOrderResponse(itemObject, paginatedData);
export const getUserList = (n = 1, ...object) => generateUserList(n, object);
export const getRawRestaurantList = (n = 1, ...object) => generateRawRestaurant(object); 