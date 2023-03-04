import { Test, TestingModule } from '@nestjs/testing';
import { getRestaurantList } from '../../../../test/utils/generate';
import { FakePublicService } from '../../../../test/utils/fake.service';
import { RESTAURANT_SERVICE } from '../../restaurant/interfaces/IRestaurant.service';
import { SHARED_SERVICE } from '../../shared/interfaces/IShared.service';
import { PUBLIC_SERVICE } from '../interfaces/IPublic.service';
import { PublicController } from '../public.controller';

describe('PublicController', () => {
  let controller: PublicController;
  const restaurants = getRestaurantList(4);
  const restaurant = restaurants[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicController],
      providers: [
        { provide: PUBLIC_SERVICE, useExisting: FakePublicService },
        FakePublicService
      ]
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

    controller = module.get<PublicController>(PublicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Restaurant registration', async () => {
    expect(await controller.register({
      address: restaurant.address,
      email: 'tushar@gm.com',
      closing_time: restaurant.closing_time,
      opening_time: restaurant.opening_time,
      password: 'tushar',
      restaurant_name: restaurant.name,
      name: restaurant.name
    })).toBe('Restaurant Successfully Created!');
  });

  it('should get Restaurant List', async () => {
    expect(await controller.getRestaurantList()).toBeInstanceOf(Array);
  });

  it('should get Item List', async () => {
    expect(await controller.getItemList(restaurant.id.toString())).toBeInstanceOf(Array);
  });

  it('should get searched Restaurant List', async () => {
    expect(await controller.searchRestaurant({ keyword: 'westin' })).toBeInstanceOf(Array);
  });
});
