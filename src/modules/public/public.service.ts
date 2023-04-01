import { Inject, Injectable } from '@nestjs/common';
import { Item } from '../item/schemas/item.schema';
import { RegisterDto } from '../restaurant/dto/index.dto';
import {
  RESTAURANT_SERVICE,
  IRestaurantService,
} from '../restaurant/interfaces/IRestaurant.service';
import { throwException } from '../shared/errors/all.exception';
import { ISharedService, SHARED_SERVICE } from '../shared/interfaces';
import {
  ItemReponse,
  RestaurantResponse,
} from '../shared/utils/response.utils';
import { IPublicService } from './interfaces/IPublic.service';

@Injectable()
export class PublicService implements IPublicService {
  constructor(
    @Inject(RESTAURANT_SERVICE)
    private readonly restaurantService: IRestaurantService,
    @Inject(SHARED_SERVICE) private readonly sharedService: ISharedService,
  ) {}

  async getItemList(restaurantId: string): Promise<ItemReponse[]> {
    try {
      await this.sharedService.getRestaurantInfo(restaurantId);
      const items: Item[] = await this.sharedService.getItemList(restaurantId);
      const list: ItemReponse[] = items.map((item) => ({
        meal_state: item.meal_state,
        name: item.name,
        item_type: item.item_type,
        meal_flavor: item.meal_flavor,
        meal_type: item.meal_type,
        price: item.price,
        discount_rate: item.discount_rate,
        id: item._id,
      }));
      return list;
    } catch (error: any) {
      return throwException(error);
    }
  }

  async restaurantRegistration(registerDto: RegisterDto): Promise<string> {
    return this.restaurantService.register(registerDto);
  }

  async getRestaurantList(): Promise<RestaurantResponse[]> {
    return this.restaurantService.getRestaurantList();
  }

  async searchRestaurant(keyword: string): Promise<RestaurantResponse[]> {
    return this.restaurantService.searchRestaurant(keyword);
  }
}
