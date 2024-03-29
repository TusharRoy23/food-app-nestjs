import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { connectionName } from '../../shared/utils/enum';
import {
  FakeAuthService,
  FakeElasticsearchService,
  FakeSharedService,
  restaurantRegistrationMsg,
} from '../../../../test/utils/fake.service';
import {
  ELASTICSEARCH_SERVICE,
  IElasticsearchService,
  IRequestService,
  REQUEST_SERVICE,
  SHARED_SERVICE,
} from '../../shared/interfaces';
import { RequestService } from '../../shared/service';
import { RestaurantService } from '../restaurant.service';
import { Restaurant, RestaurantDocument } from "../schemas/restaurant.schema";
import { RestaurantItem } from "../schemas/restaurant-item.schema";
import { Order, OrderDiscount, OrderDocument } from '../../order/schemas';
import { User, UserDocument } from '../../user/schemas/user.schema';
import { Model } from 'mongoose';
import {
  getRawOrderResponseList,
  getRawRestaurantList,
  getRestaurantList,
  getUserInfo,
  getUserList,
} from '../../../../test/utils/generate';
import { RegisterDto } from '../dto/register.dto';
import { PaginationParams } from '../../shared/dto/pagination-params';
import { IPaginatedOrderResponse } from '../../shared/utils/response.utils';
import { NotFoundException } from '@nestjs/common';
import { IRestaurantService } from '../interfaces/IRestaurant.service';
import { AUTH_SERVICE, IAuthService } from '../../auth/interfaces/IAuth.service';

describe('RestaurantService', () => {
  let restaurantService: IRestaurantService;
  let requestService: IRequestService;
  let authService: IAuthService;
  let elasticSearchService: IElasticsearchService;

  const restaurentDoc = getModelToken(Restaurant.name, connectionName.MAIN_DB);
  const orderDoc = getModelToken(Order.name, connectionName.MAIN_DB);
  const userDoc = getModelToken(User.name, connectionName.MAIN_DB);
  const restuarantItemDoc = getModelToken(
    RestaurantItem.name,
    connectionName.MAIN_DB,
  );
  const orderDiscountDoc = getModelToken(
    OrderDiscount.name,
    connectionName.MAIN_DB,
  );

  let restaurantModel: Model<RestaurantDocument>;
  let orderModel: Model<OrderDocument>;
  let userModel: Model<UserDocument>;

  const rawOrderList = getRawOrderResponseList(10);
  let userInfo = getUserInfo({ restaurant: getRawRestaurantList() });
  userInfo = {
    ...userInfo,
    ...userInfo[0],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        { provide: SHARED_SERVICE, useExisting: FakeSharedService },
        FakeSharedService,
        { provide: REQUEST_SERVICE, useExisting: RequestService },
        RequestService,
        {
          provide: ELASTICSEARCH_SERVICE,
          useExisting: FakeElasticsearchService,
        },
        FakeElasticsearchService,
        {
          provide: AUTH_SERVICE,
          useExisting: FakeAuthService
        },
        FakeAuthService,
        {
          provide: restaurentDoc,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: orderDoc,
          useValue: {
            find: jest.fn(),
            exec: jest.fn(),
            countDocuments: jest.fn(),
            findOneAndUpdate: jest.fn(),
          },
        },
        {
          provide: userDoc,
          useValue: {
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
          },
        },
        {
          provide: restuarantItemDoc,
          useValue: {},
        },
        {
          provide: orderDiscountDoc,
          useValue: {},
        },
      ],
    }).compile();

    restaurantService = module.get<IRestaurantService>(RestaurantService);
    requestService = module.get<IRequestService>(RequestService);
    elasticSearchService = module.get<IElasticsearchService>(FakeElasticsearchService);
    authService = module.get<IAuthService>(FakeAuthService);

    restaurantModel = module.get<Model<RestaurantDocument>>(restaurentDoc);
    orderModel = module.get<Model<OrderDocument>>(orderDoc);
    userModel = module.get<Model<UserDocument>>(userDoc);

    requestService.setUserInfo(userInfo);
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
      restaurant_name: 'aasd',
    };
    jest
      .spyOn(userModel, 'create')
      .mockImplementationOnce(() => Promise.resolve(user as any));
    jest
      .spyOn(restaurantModel, 'create')
      .mockImplementationOnce(() => Promise.resolve(restaurant as any));
    jest.spyOn(userModel, 'findOneAndUpdate').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(restaurant),
    } as any);

    jest.spyOn(elasticSearchService, 'indexRestaurant').mockImplementationOnce(() => Promise.resolve(true));
    jest.spyOn(authService, 'sendEmailVerificationLink').mockImplementationOnce(() => Promise.resolve('Mail Sent !'));

    const createdUser = await restaurantService.register(registerDto);
    expect(createdUser).toEqual(restaurantRegistrationMsg);
  });

  it('should return restaurant list', async () => {
    const restaurantList = await restaurantService.getRestaurantList();
    expect(restaurantList).toBeInstanceOf(Array);
  });

  it('should return order list', async () => {
    const paginationParams: PaginationParams = {
      startId: '',
      page: 1,
      pageSize: 10,
    };

    jest.spyOn(orderModel, 'find').mockReturnValue({
      and: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                skip: jest.fn().mockReturnValue({}),
                exec: jest.fn().mockResolvedValueOnce(rawOrderList),
              }),
            }),
          }),
        }),
      }),
    } as any);

    jest.spyOn(orderModel, 'countDocuments').mockReturnValue({
      and: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(rawOrderList.length),
      }),
    } as any);

    const orderList: IPaginatedOrderResponse =
      await restaurantService.getOrderList(paginationParams);
    expect(orderList).toHaveProperty('orders');
    expect(orderList.orders[0]).toHaveProperty('id');
  });

  it('should release a order', async () => {
    jest.spyOn(orderModel, 'findOneAndUpdate').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(rawOrderList[0]),
    } as any);

    const release = await restaurantService.releaseOrder(
      rawOrderList[0]._id.toString(),
    );
    expect(release).toEqual('Order Released successfully');
  });

  it('should throw 404 on release order', async () => {
    jest.spyOn(orderModel, 'findOneAndUpdate').mockReturnValueOnce({
      exec: jest.fn(),
    } as any);
    await expect(
      restaurantService.releaseOrder(rawOrderList[0]._id.toString()),
    ).rejects.toThrowError(new NotFoundException('Order not found'));
  });
});
