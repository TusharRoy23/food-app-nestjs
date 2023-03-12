import { RegisterDto } from "../../src/modules/restaurant/dto/register.dto";
import { ItemReponse, RestaurantResponse } from "../../src/modules/shared/utils/response.utils";
import { IPublicService } from "../../src/modules/public/interfaces/IPublic.service";
import { getItemList, getRestaurantList } from "./generate";

export const restaurants = getRestaurantList(4);
export const items = getItemList(4);
export const restaurantRegistrationMsg = 'Restaurant Successfully Created!';
export class FakePublicService implements IPublicService {
    restaurantRegistration(registerDto: RegisterDto): Promise<string> {
        return Promise.resolve(restaurantRegistrationMsg);
    }
    getRestaurantList(): Promise<RestaurantResponse[]> {
        return Promise.resolve(restaurants);
    }
    getItemList(restaurantId: string): Promise<ItemReponse[]> {
        return Promise.resolve(items);
    }
    searchRestaurant(keyword: string): Promise<RestaurantResponse[]> {
        return Promise.resolve(restaurants);
    }

}