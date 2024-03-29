import { Test, TestingModule } from '@nestjs/testing';
import { getRestaurantList } from '../../../../test/utils/generate';
import { FakePublicService } from '../../../../test/utils/fake.service';
import { PUBLIC_SERVICE } from '../interfaces/IPublic.service';
import { PublicController } from '../public.controller';

describe('PublicController', () => {
  let controller: PublicController;
  const restaurants = getRestaurantList(4);
  const restaurant = restaurants[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicController],
      providers: [{ provide: PUBLIC_SERVICE, useClass: FakePublicService }],
    }).compile();

    controller = module.get<PublicController>(PublicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Restaurant registration', async () => {
    expect(
      await controller.register({
        address: restaurant.address,
        email: 'tushar@gm.com',
        closing_time: restaurant.closing_time || '00:00:00',
        opening_time: restaurant.opening_time || '08:08:08',
        password: 'tushar',
        restaurant_name: restaurant.name,
        name: restaurant.name,
      }),
    ).toBe('Restaurant Successfully Created!');
  });

  it('should get Restaurant List', async () => {
    expect(await controller.getRestaurantList()).toBeInstanceOf(Array);
  });

  it('should get Item List', async () => {
    expect(
      await controller.getItemList(restaurant.id.toString()),
    ).toBeInstanceOf(Array);
  });

  it('should get searched Restaurant List', async () => {
    expect(await controller.searchRestaurant('westin')).toBeInstanceOf(Array);
  });
});
