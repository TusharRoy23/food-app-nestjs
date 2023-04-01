import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { Order } from '../../src/modules/order/schemas';
import {
  OrderStatus,
  PaidBy,
  UserType,
} from '../../src/modules/shared/utils/enum';
import {
  OrderItemResponse,
  OrderResponse,
  PaginatedOrderResponse,
} from '../../src/modules/shared/utils/response.utils';
import { PaginatedData } from './generate';
import { generateItemList } from './item-data';
import { generateRestaurantList } from './restaurant-data';
import { generateUserList } from './user-data';

const getItemList = (n = 1, ...object) => generateItemList(n, object);
const getRestaurantList = (n = 1, ...object) =>
  generateRestaurantList(n, object);

const generateOrderItem = (object: any = {}) => {
  return {
    id: new mongoose.Types.ObjectId(faker.database.mongodbObjectId()),
    qty: +faker.datatype.number({ min: 1, max: 50 }),
    amount: +faker.commerce.price(),
    total_amount: +faker.commerce.price(),
    item: getItemList[0],
    ...object,
  } as OrderItemResponse;
};

const generateOrderItemList = (n = 1, object = {}) => {
  return Array.from({ length: n }, () =>
    generateOrderItem({ ...object }),
  ) as OrderItemResponse[];
};

const generateOrderResponse = (object: any = {}) => {
  return {
    id: new mongoose.Types.ObjectId(faker.database.mongodbObjectId()),
    order_amount: +faker.commerce.price(),
    total_amount: +faker.commerce.price(),
    serial_number: `FA-${Date.now()}`,
    rebate_amount: 0,
    discount_rate: 0.0,
    order_date: faker.date.between(
      '2020-01-01T00:00:00.000Z',
      '2030-01-01T00:00:00.000Z',
    ),
    restaurant: getRestaurantList()[0],
    order_status: OrderStatus.PAID,
    paid_by: PaidBy.CASH_ON_DELIVERY,
    order_item: generateOrderItemList(3),
    ...object,
  } as OrderResponse;
};

const generateOrderResponseList = (n = 1, object: any = {}) => {
  return Array.from({ length: n }, () =>
    generateOrderResponse({ ...object }),
  ) as OrderResponse[];
};

export const generatePaginatedOrderResponse = (
  Itemobject: any = {},
  { count = 20, currentPage = 1, nextPage = 2, totalPages = 2 }: PaginatedData,
) => {
  return {
    orders: generateOrderResponseList(count, Itemobject),
    count: count,
    currentPage: currentPage,
    nextPage: nextPage,
    totalPages: totalPages,
  } as PaginatedOrderResponse;
};

const generateRawOrderResponse = (object: any = {}) => {
  return {
    _id: new mongoose.Types.ObjectId(faker.database.mongodbObjectId()),
    order_amount: +faker.commerce.price(),
    total_amount: +faker.commerce.price(),
    serial_number: `FA-${Date.now()}`,
    rebate_amount: 0,
    discount_rate: 0.0,
    order_date: faker.date.between(
      '2020-01-01T00:00:00.000Z',
      '2030-01-01T00:00:00.000Z',
    ),
    restaurant: getRestaurantList()[0],
    order_status: OrderStatus.PAID,
    paid_by: PaidBy.CASH_ON_DELIVERY,
    order_items: generateOrderItemList(3),
    user: generateUserList(1, { user_type: UserType.VISITOR })[0],
    order_discount: {},
    ...object,
  };
};

export const generateRawOrderResponseList = (n = 1, object: any = {}) => {
  return Array.from({ length: n }, () =>
    generateRawOrderResponse({ ...object }),
  ) as Order[];
};
