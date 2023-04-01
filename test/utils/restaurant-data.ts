import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { UserType } from '../../src/modules/shared/utils/enum';
import { Restaurant } from '../../src/modules/restaurant/schemas';
import { RestaurantResponse } from '../../src/modules/shared/utils/response.utils';
import { generateUserList } from './user-data';

const generateRestaurant = (object: any = {}) => {
  return {
    id: new mongoose.Types.ObjectId(faker.database.mongodbObjectId()),
    address: `${
      (faker.address.street(), faker.address.zipCode(), faker.address.state())
    }`,
    name: faker.name.middleName(),
    opening_time: '08:08:08',
    closing_time: '12:00:00',
    current_status: 'active',
    ...object,
  } as RestaurantResponse;
};

export const generateRestaurantList = (n = 1, object = {}) => {
  return Array.from(
    {
      length: n,
    },
    (_, __) => generateRestaurant({ ...object }),
  ) as RestaurantResponse[];
};

export const generateRawRestaurant = (object: any = {}) => {
  return {
    _id: new mongoose.Types.ObjectId(faker.database.mongodbObjectId()),
    address: `${
      (faker.address.street(), faker.address.zipCode(), faker.address.state())
    }`,
    name: faker.name.middleName(),
    opening_time: '08:08:08',
    closing_time: '12:00:00',
    current_status: 'active',
    profile_img: '',
    users: generateUserList(2, { user_type: UserType.VISITOR }),
  } as Restaurant;
};
