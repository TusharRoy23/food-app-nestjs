import { Test, TestingModule } from '@nestjs/testing';
import { RESTAURANT_SERVICE } from '../interfaces/IRestaurant.service';
import { RestaurantController } from '../restaurant.controller';
import { RestaurantService } from '../restaurant.service';
import { PaginationParams } from '../../shared/dto/pagination-params';
import {
  FakeRestaurantService,
  OrderCompletemsg,
  OrderReleaseMsg,
} from '../../../../test/utils/fake.service';
import { getRawOrderResponseList } from '../../../../test/utils/generate';

describe('RestaurantController', () => {
  let controller: RestaurantController;
  let restaurantService: RestaurantService;
  const orderInfo = getRawOrderResponseList()[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        {
          provide: RESTAURANT_SERVICE,
          useClass: FakeRestaurantService,
        },
      ],
    }).compile();

    controller = module.get<RestaurantController>(RestaurantController);
    restaurantService = module.get<RestaurantService>(RESTAURANT_SERVICE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get the list of orders', async () => {
    const paginationParams: PaginationParams = {
      startId: '',
      page: 1,
      pageSize: 10,
    };

    const orders = await controller.getOrderList(paginationParams);
    expect(orders).toHaveProperty('orders');
  });

  it('should release a order', async () => {
    const release = await controller.releaseOrder(orderInfo._id.toString());
    expect(release).toEqual(OrderReleaseMsg);
  });

  it('should complete a order', async () => {
    jest
      .spyOn(restaurantService, 'completeOrder')
      .mockResolvedValueOnce(OrderCompletemsg);
    const complete = await controller.completeOrder(orderInfo._id.toString());
    expect(complete).toStrictEqual(OrderCompletemsg);
  });
});
