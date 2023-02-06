import { Restaurant } from "../../restaurant/schemas";
import { RegisterDto } from "../../restaurant/dto/register.dto";
import { ItemReponse } from "../../shared/utils/response.utils";

export const PUBLIC_SERVICE = 'PUBLIC_SERVICE';

export interface IPublicService {
    restaurantRegistration(registerDto: RegisterDto): Promise<string>;
    getRestaurantList(): Promise<Restaurant[]>;
    getItemList(restaurantId: string): Promise<ItemReponse[]>;
}