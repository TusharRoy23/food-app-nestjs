import { Test, TestingModule } from '@nestjs/testing';
import { getRestaurantList } from '../../../../test/utils/generate';
import { FakePublicService } from '../../../../test/utils/fake.service';
import { RESTAURANT_SERVICE } from '../../restaurant/interfaces/IRestaurant.service';
import { SHARED_SERVICE } from '../../shared/interfaces';
import { IPublicService, PUBLIC_SERVICE } from '../interfaces/IPublic.service';

describe('PublicService', () => {
  let service: IPublicService;
  const restaurants = getRestaurantList(4);
  const restaurant = restaurants[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: PUBLIC_SERVICE, useExisting: FakePublicService },
        FakePublicService
      ],
    })
      .useMocker((token) => {
        if (token === RESTAURANT_SERVICE) {
          return {};
        }
        if (token === SHARED_SERVICE) {
          return {};
        }
      })
      .compile();

    service = module.get<IPublicService>(FakePublicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a restaurant', async () => {
    expect(await service.restaurantRegistration({
      address: restaurant.address,
      email: 'tushar@gm.com',
      closing_time: restaurant.closing_time,
      opening_time: restaurant.opening_time,
      password: 'tushar',
      restaurant_name: restaurant.name,
      name: restaurant.name
    })).toStrictEqual('Restaurant Successfully Created!')
  });

  it('should get Restaurant List', async () => {
    expect(await service.getRestaurantList()).toBeInstanceOf(Array);
  });

  it('should get Item List', async () => {
    expect(await service.getItemList(restaurant.id.toString())).toBeInstanceOf(Array);
  });

  it('should get searched Restaurant List', async () => {
    expect(await service.searchRestaurant('westin')).toBeInstanceOf(Array);
  });
});
