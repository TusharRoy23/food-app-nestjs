import { faker } from '@faker-js/faker';
import mongoose from "mongoose";
import { CurrentStatus } from '../../src/modules/shared/utils/enum';
import { User } from "../../src/modules/user/schemas/user.schema";

export const generateUser = (object: any = {}) => {
    return {
        _id: new mongoose.Types.ObjectId(faker.database.mongodbObjectId()),
        email: faker.internet.email(),
        name: faker.name.fullName(),
        current_status: CurrentStatus.ACTIVE,
        ...object
    } as User
};

export const generateUserList = (n = 1, object = {}) => {
    return Array.from(
        { length: n },
        (_, __) => generateUser({ ...object })
    ) as Array<User>;
}