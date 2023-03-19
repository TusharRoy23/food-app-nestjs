import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { connectionName } from '../../shared/utils/enum';
import { FakeSharedService, restaurantRegistrationMsg } from '../../../../test/utils/fake.service';
import { REQUEST_SERVICE, SHARED_SERVICE } from '../../shared/interfaces';
import { RequestService } from '../../shared/service';
import { RestaurantService } from '../restaurant.service';
import { Restaurant, RestaurantDocument, RestaurantItem } from '../schemas';
import { Order, OrderDiscount, OrderDiscountDocument, OrderDocument } from '../../order/schemas';
import { User, UserDocument } from '../../user/schemas/user.schema';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Model, Query } from 'mongoose';
import { getRestaurantList, getUserList } from '../../../../test/utils/generate';
import { RegisterDto } from '../dto/register.dto';
import { createMock } from "@golevelup/ts-jest";

describe('RestaurantService', () => {
  let restaurantService: RestaurantService;
  const restaurentDoc = getModelToken(Restaurant.name, connectionName.MAIN_DB);
  const orderDoc = getModelToken(Order.name, connectionName.MAIN_DB);
  const userDoc = getModelToken(User.name, connectionName.MAIN_DB);
  const restuarantItemDoc = getModelToken(RestaurantItem.name, connectionName.MAIN_DB);
  const orderDiscountDoc = getModelToken(OrderDiscount.name, connectionName.MAIN_DB);

  let restaurantModel: Model<RestaurantDocument>;
  let orderModel: Model<OrderDocument>;
  let userModel: Model<UserDocument>;
  let restuarantItemModel: Model<RestaurantDocument>;
  let orderDiscountModel: Model<OrderDiscountDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        ElasticsearchService,
        { provide: SHARED_SERVICE, useExisting: FakeSharedService },
        FakeSharedService,
        { provide: REQUEST_SERVICE, useExisting: RequestService },
        RequestService,
        {
          provide: restaurentDoc,
          useValue: {
            create: jest.fn(),
          }
        },
        {
          provide: orderDoc,
          useValue: {}
        },
        {
          provide: userDoc,
          useValue: {
            create: jest.fn(),
            findOneAndUpdate: jest.fn()
          }
        },
        {
          provide: restuarantItemDoc,
          useValue: {}
        },
        {
          provide: orderDiscountDoc,
          useValue: {}
        },
        {
          provide: ElasticsearchService, useValue: {}
        }
      ],
    }).compile();

    restaurantService = module.get<RestaurantService>(RestaurantService);
    restaurantModel = module.get(restaurentDoc);
    orderModel = module.get(orderDoc);
    userModel = module.get<Model<UserDocument>>(userDoc);
    restuarantItemModel = module.get(restuarantItemDoc);
    orderDiscountModel = module.get(orderDiscountDoc);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(restaurantService).toBeDefined();
  });

  it('should register a restaurant', async () => {
    const user = getUserList()[0];
    const restaurant = getRestaurantList()[0];
    const registerDto: RegisterDto = {
      address: 'asdasd',
      closing_time: '08:08:08',
      opening_time: '12:00:00',
      email: 'tusha@ggm.com',
      name: 'tusar',
      password: 'asdasdas',
      restaurant_name: 'aasd'
    };
    jest.spyOn(userModel, 'create').mockImplementationOnce(() => Promise.resolve(user));
    jest.spyOn(restaurantModel, 'create').mockImplementationOnce(() => Promise.resolve(restaurant));
    jest.spyOn(userModel, 'findOneAndUpdate').mockReturnValueOnce(createMock<Query<UserDocument, UserDocument>>({
      exec: jest.fn().mockResolvedValueOnce(restaurant)
    }) as any);

    const createdUser = await restaurantService.register(registerDto);
    expect(createdUser).toEqual(restaurantRegistrationMsg);
  });
});
