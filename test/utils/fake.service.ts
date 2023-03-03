import { RegisterDto } from "src/modules/restaurant/dto/register.dto";
import { Restaurant } from "src/modules/restaurant/schemas";
import { ItemReponse, RestaurantResponse } from "src/modules/shared/utils/response.utils";
import { IPublicService } from "../../src/modules/public/interfaces/IPublic.service";

export class FakePublicService implements IPublicService {
    restaurantRegistration(registerDto: RegisterDto): Promise<string> {
        return Promise.resolve('Restaurant Successfully Created!');
    }
    getRestaurantList(): Promise<Restaurant[]> {
        return Promise.resolve([]);
    }
    getItemList(restaurantId: string): Promise<ItemReponse[]> {
        return Promise.resolve([]);
    }
    searchRestaurant(keyword: string): Promise<RestaurantResponse[]> {
        return Promise.resolve([]);
    }

}