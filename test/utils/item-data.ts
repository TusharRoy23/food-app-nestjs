import { faker } from '@faker-js/faker';
import mongoose from "mongoose";
import { ItemReponse } from "../../src/modules/shared/utils/response.utils";

const generateItem = (object: any = {}) => {
    return {
        id: new mongoose.Types.ObjectId(faker.database.mongodbObjectId()),
        name: faker.commerce.product(),
        price: +faker.commerce.price(80, 200),
        meal_state: 'hot',
        meal_flavor: '',
        item_type: '',
        meal_type: '',
        discount_rate: 0,
        ...object
    } as ItemReponse as any;
}

export const generateItemList = (n = 1, object = {}) => {
    return Array.from(
        { length: n },
        (_, __) => generateItem({ ...object })
    ) as ItemReponse[] as any[];
}