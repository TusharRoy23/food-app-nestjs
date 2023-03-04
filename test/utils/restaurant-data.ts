import { faker } from '@faker-js/faker';
import mongoose from "mongoose";
import { RestaurantResponse } from "../../src/modules/shared/utils/response.utils";

const generateRestaurant = (object: any = {}) => {
    return {
        id: new mongoose.Types.ObjectId(faker.database.mongodbObjectId()),
        address: `${faker.address.street(), faker.address.zipCode(), faker.address.state()}`,
        name: faker.company.name(),
        opening_time: '08:08:08',
        closing_time: '12:00:00',
        current_status: 'active',
        ...object
    } as RestaurantResponse
}

export const generateRestaurantList = (n = 1, object = {}) => {
    return Array.from(
        {
            length: n
        },
        (_, __) => generateRestaurant({ ...object })
    ) as RestaurantResponse[]
}