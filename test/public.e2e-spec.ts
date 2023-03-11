import * as request from 'supertest';
import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import { FakePublicService } from './utils/fake.service';
import { PUBLIC_SERVICE } from '../src/modules/public/interfaces/IPublic.service';
import { getRestaurantList } from './utils/generate';
import { RESTAURANT_SERVICE } from '../src/modules/restaurant/interfaces/IRestaurant.service';
import { SHARED_SERVICE } from '../src/modules/shared/interfaces';
import { PublicModule } from '../src/modules/public/public.module';
import { AppModule } from '../src/app.module';

describe('Public Controller (e2e)', () => {
    let app: INestApplication;
    // const restaurants = getRestaurantList(4);

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            // .useMocker((token) => {
            //     console.log('token: ', token);
            //     if (token === RESTAURANT_SERVICE) {
            //         return {};
            //     }
            //     if (token === SHARED_SERVICE) {
            //         return {};
            //     }
            // })
            .overrideProvider(FakePublicService)
            .useClass(FakePublicService)
            .compile();
        app = moduleRef.createNestApplication();
        await app.init();
    });

    it('/public/restaurant/list GET', () => {
        return request(app.getHttpServer())
            .get('/api/v1/public/restaurant/list')
            .expect(200)
        //.expect(restaurants);
    })
})