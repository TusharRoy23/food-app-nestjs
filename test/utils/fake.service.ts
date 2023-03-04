import { RegisterDto } from "../../src/modules/restaurant/dto/register.dto";
import { ItemReponse, RestaurantResponse } from "../../src/modules/shared/utils/response.utils";
import { IPublicService } from "../../src/modules/public/interfaces/IPublic.service";
import { getItemList, getRestaurantList } from "./generate";

const restaurants = getRestaurantList();
const items = getItemList(4);
export class FakePublicService implements IPublicService {
    restaurantRegistration(registerDto: RegisterDto): Promise<string> {
        return Promise.resolve('Restaurant Successfully Created!');
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