import * as request from 'supertest';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import { RestaurantController } from '../src/modules/restaurant/restaurant.controller';
import { RESTAURANT_SERVICE } from '../src/modules/restaurant/interfaces/IRestaurant.service';
import { FakeRestaurantService } from './utils/fake.service';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from '../src/modules/shared/guards';
import { FakeJwtAuthGuard, FakeRoleGuard } from './utils/fake.guard';
import { ResponseInterceptor } from '../src/modules/shared/interceptors/response.interceptor';

describe("Restaurant Controller (e2e)", () => {
    let app: INestApplication;
    let agent: any;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [],
            controllers: [RestaurantController],
            providers: [
                { provide: RESTAURANT_SERVICE, useExisting: FakeRestaurantService },
                FakeRestaurantService,
                // { provide: APP_GUARD, useExisting: JwtAuthGuard },
                // JwtAuthGuard
                { provide: APP_GUARD, useExisting: RolesGuard },
                RolesGuard
            ]
        })
            .overrideGuard(RolesGuard)
            .useClass(FakeRoleGuard)
            .compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
        await app.init();
        agent = request(app.getHttpServer());
    });

    it('Order list GET 200', () => {
        return agent.get(`/restaurant/orders`).expect(200);
    })
})