import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { IItemReponse } from '../../src/modules/shared/utils/response.utils';

const generateItem = (object: any = {}) => {
  return {
    id: new mongoose.Types.ObjectId(faker.database.mongodbObjectId()),
    name: faker.commerce.product(),
    price: +faker.commerce.price({ min: 80, max: 200 }),
    meal_state: 'hot',
    meal_flavor: '',
    item_type: '',
    meal_type: '',
    discount_rate: 0,
    ...object,
  } as IItemReponse as any;
};

export const generateItemList = (n = 1, object = {}) => {
  return Array.from({ length: n }, () =>
    generateItem({ ...object }),
  ) as IItemReponse[] as any[];
};
