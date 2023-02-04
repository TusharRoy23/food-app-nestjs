import { Restaurant } from "../../../modules/restaurant/schemas";
import { RegisterDto } from "../../../modules/restaurant/dto/register.dto";

export const PUBLIC_SERVICE = 'PUBLIC_SERVICE';

export interface IPublicService {
    restaurantRegistration(registerDto: RegisterDto): Promise<string>;
    getRestaurantList(): Promise<Restaurant[]>;
}