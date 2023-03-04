import { generateItemList } from "./item-data";
import { generateRestaurantList } from "./restaurant-data";

export const getRestaurantList = (n = 1, ...object) => generateRestaurantList(n, object);
export const getItemList = (n = 1, ...object) => generateItemList(n, object);