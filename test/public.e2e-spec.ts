import * as request from 'supertest';
import { INestApplication, ValidationError, ValidationPipe } from "@nestjs/common";
import mongoose from "mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { FakePublicService, restaurants, items, restaurantRegistrationMsg } from './utils/fake.service';
import { PUBLIC_SERVICE } from '../src/modules/public/interfaces/IPublic.service';
import { PublicController } from '../src/modules/public/public.controller';
import { RegisterDto } from '../src/modules/restaurant/dto/register.dto';
import { ValidationException, ValidationFilter } from '../src/modules/shared/filters/validation.filter';

describe('Public Controller (e2e)', () => {
    let app: INestApplication;
    let agent: any;

    const registerDto: RegisterDto = {
        address: restaurants[0].address,
        email: 'tushar@gm.com',
        closing_time: restaurants[0].closing_time,
        opening_time: restaurants[0].opening_time,
        password: 'tushar',
        restaurant_name: restaurants[0].name,
        name: restaurants[0].name
    }

    const searchKey = 'westin';

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [
                PublicController
            ],
            providers: [
                { provide: PUBLIC_SERVICE, useClass: FakePublicService },
            ]
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalFilters(new ValidationFilter());
        app.useGlobalPipes(new ValidationPipe({
            skipMissingProperties: false,
            exceptionFactory: (errors: ValidationError[]) => {
                const errMsg = {};
                errors.forEach(err => {
                    errMsg[err.property] = [...Object.values(err.constraints)];
                });
                return new ValidationException(errMsg);
            }
        }));
        await app.init();
        agent = request(app.getHttpServer());
    });

    it('Restaurant List GET 200', () => {
        return agent
            .get('/public/restaurant/list')
            .expect(200);
    });

    it('Should return valid Restaurant list', async () => {
        return agent.get('/public/restaurant/list')
            .then(response => {
                const restaurantList = response.body;
                expect(restaurantList[0].name).toEqual(restaurants[0].name);
            });
    });

    it('Item List GET 200', () => {
        return agent.get(`/public/restaurant/${restaurants[0].id}/item/list`).expect(200);
    });

    it('Should return valid Item list', () => {
        return agent.get(`/public/restaurant/${restaurants[0].id}/item/list`).then(response => {
            const itemList = response.body;
            expect(new mongoose.Types.ObjectId(itemList[0].id)).toEqual(items[0].id)
        });
    });

    it('Restaurant Registration POST 201', () => {
        return agent.post('/public/restaurant/register').send(registerDto).expect(201);
    });

    it('Restaurant should successfully register', () => {
        return agent.post('/public/restaurant/register').send(registerDto).then(response => {
            const message = response.text;
            expect(restaurantRegistrationMsg).toStrictEqual(message);
        });
    });

    it('Search Restaurant GET 200', () => {
        return agent.get(`/public/restaurant/search?keyword=${searchKey}`).expect(200);
    });

    it('Should return valid Restaurant list on search', async () => {
        return agent.get(`/public/restaurant/search?keyword=${searchKey}`)
            .then(response => {
                const restaurantList = response.body;
                expect(restaurantList).toBeInstanceOf(Array);
            });
    });
});