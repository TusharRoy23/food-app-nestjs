import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { UserType } from '../../src/modules/shared/utils/enum';
import { Restaurant } from '../../src/modules/restaurant/schemas';
import { IRestaurantResponse } from '../../src/modules/shared/utils/response.utils';
import { generateUserList } from './user-data';

const generateRestaurant = (object: any = {}) => {
  return {
    id: new mongoose.Types.ObjectId(faker.database.mongodbObjectId()),
    address: `${(faker.location.street(), faker.location.zipCode(), faker.location.state())
      }`,
    name: faker.person.middleName(),
    opening_time: '08:08:08',
    closing_time: '12:00:00',
    current_status: 'active',
    ...object,
  } as IRestaurantResponse;
};

export const generateRestaurantList = (n = 1, object = {}) => {
  return Array.from(
    {
      length: n,
    },
    () => generateRestaurant({ ...object }),
  ) as IRestaurantResponse[];
};

export const generateRawRestaurant = (object: any = {}) => {
  return {
    _id: new mongoose.Types.ObjectId(faker.database.mongodbObjectId()),
    address: `${(faker.location.street(), faker.location.zipCode(), faker.location.state())}`,
    name: faker.person.middleName(),
    opening_time: '08:08:08',
    closing_time: '12:00:00',
    current_status: 'active',
    profile_img: '',
    users: generateUserList(2, { user_type: UserType.VISITOR }),
    ...object,
  } as Restaurant;
};
