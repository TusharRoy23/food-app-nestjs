import { Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from '../restaurant/dto/index.dto';
import { RESTAURANT_SERVICE, IRestaurantService } from '../restaurant/interfaces/IRestaurant.service';
import { Restaurant } from '../restaurant/schemas';
import { IPublicService } from './interfaces/IPublic.service';

@Injectable()
export class PublicService implements IPublicService {
    constructor(
        @Inject(RESTAURANT_SERVICE) private readonly restaurantService: IRestaurantService
    ) { }

    async restaurantRegistration(registerDto: RegisterDto): Promise<string> {
        return this.restaurantService.register(registerDto);
    }

    async getRestaurantList(): Promise<Restaurant[]> {
        return this.restaurantService.getRestaurantList();
    }
}
