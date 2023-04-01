import * as request from 'supertest';
import { APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { RestaurantController } from '../src/modules/restaurant/restaurant.controller';
import { RESTAURANT_SERVICE } from '../src/modules/restaurant/interfaces/IRestaurant.service';
import {
  FakeJwtService,
  FakeRestaurantService,
  OrderReleaseMsg,
} from './utils/fake.service';
import {
  JwtAuthGuard,
  RolesGuard,
  UserTypeGuard,
} from '../src/modules/shared/guards';
import { JwtStrategy } from '../src/modules/auth/strategy/jwt-strategy';
import { FakeJwtStrategy } from './utils/fake-jwt-strategy';
import {
  getRawOrderResponseList,
  getRestaurantList,
  getUserInfo,
} from './utils/generate';
import {
  CurrentStatus,
  UserRole,
  UserType,
} from '../src/modules/shared/utils/enum';
import {
  ValidationException,
  ValidationFilter,
} from '../src/modules/shared/filters/validation.filter';

describe('Restaurant Controller (e2e)', () => {
  let app: INestApplication;
  let agent: any;
  let bearerToken: string;
  const userInfo = {
    _id: getUserInfo()._id,
    email: getUserInfo().email,
    name: getUserInfo().name,
    current_status: CurrentStatus.ACTIVE,
    role: UserRole.EMPLOYEE,
    user_type: UserType.RESTAURANT_USER,
    restaurant: getRestaurantList()[0],
    login_status: true,
  };
  const orderInfo = getRawOrderResponseList()[0];

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [RestaurantController],
      providers: [
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
        { provide: APP_GUARD, useClass: UserTypeGuard },
        { provide: JwtStrategy, useClass: FakeJwtStrategy },
        { provide: RESTAURANT_SERVICE, useClass: FakeRestaurantService },
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new ValidationFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        skipMissingProperties: false,
        exceptionFactory: (errors: ValidationError[]) => {
          const errMsg = {};
          errors.forEach((err) => {
            errMsg[err.property] = [...Object.values(err.constraints)];
          });
          return new ValidationException(errMsg);
        },
      }),
    );
    await app.init();
    agent = request(app.getHttpServer());
    const fakeJwtService: FakeJwtService = new FakeJwtService();
    bearerToken = await fakeJwtService.getAccessToken(userInfo as any);
    bearerToken = `Bearer ${bearerToken}`;
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('Order list GET 200', () => {
    return agent
      .get(`/restaurant/orders?page=1&pageSize=10`)
      .set('Authorization', bearerToken)
      .expect(200);
  });

  it('Return valid order list', () => {
    return agent
      .get(`/restaurant/orders?page=1&pageSize=10`)
      .set('Authorization', bearerToken)
      .then((response) => {
        expect(response.body).toHaveProperty('orders');
      });
  });

  it('Order release POST 201', () => {
    return agent
      .post(`/restaurant/order/${orderInfo._id}/release/`)
      .set('Authorization', bearerToken)
      .expect(201);
  });

  it('Order successfully released', () => {
    return agent
      .post(`/restaurant/order/${orderInfo._id}/release/`)
      .set('Authorization', bearerToken)
      .then((response) => {
        expect(response.text).toStrictEqual(OrderReleaseMsg);
      });
  });

  it('Status code 400 on Order release', () => {
    return agent
      .post(`/restaurant/order/InvalidId/release/`)
      .set('Authorization', bearerToken)
      .then((response) => {
        expect(response.statusCode).toStrictEqual(400);
      });
  });
});
