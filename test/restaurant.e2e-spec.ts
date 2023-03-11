import * as request from 'supertest';
import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";

describe("Restaurant Controller (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({}).compile();
        app = moduleRef.createNestApplication();
        await app.init();
    });

    it('/ GET', () => {
        return request(app.getHttpServer()).get('/').expect(200).expect('Hello world');
    })
})