import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FakePublicService } from '../../../test/utils/fake.service';
import { RegisterDto } from '../restaurant/dto/index.dto';
import { RESTAURANT_SERVICE } from '../restaurant/interfaces/IRestaurant.service';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { Restaurant, RestaurantItem, RestaurantItemSchema, RestaurantRating, RestaurantRatingSchema, RestaurantSchema } from '../restaurant/schemas';
import { SHARED_SERVICE } from '../shared/interfaces/IShared.service';
import { connectionName } from '../shared/utils/enum';
import { IPublicService, PUBLIC_SERVICE } from './interfaces/IPublic.service';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';

describe('PublicController', () => {
  let controller: PublicController;
  let publicService: IPublicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicController],
      providers: [
        { provide: PUBLIC_SERVICE, useExisting: PublicService },
        PublicService
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
    publicService = module.get<IPublicService>(PublicService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getRestaurantList', async () => {
    const val = await jest.spyOn(publicService, 'restaurantRegistration').mockImplementation(() => Promise.resolve('Restaurant Successfully Created!'));
    expect(await controller.register({
      address: '',
      email: 'tushar@gm.com',
      closing_time: '01:08:08',
      opening_time: '08:08:08',
      password: 'tushar',
      restaurant_name: 'res',
      name: 'tushar'
    })).toBe('Restaurant Successfully Created!');
  })

});
