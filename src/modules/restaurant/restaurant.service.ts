import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { throwException } from '../shared/errors/all.exception';
import {
  connectionName,
  OrderStatus,
  UserRole,
  UserType,
} from '../shared/utils/enum';
import {
  PaginationPayload,
  PaginatedOrderResponse,
  OrderResponse,
  RestaurantResponse,
} from '../shared/utils/response.utils';
import {
  Order,
  OrderDiscount,
  OrderDiscountDocument,
  OrderDocument,
} from '../order/schemas';
import { User, UserDocument } from '../user/schemas/user.schema';
import { CreateOrderDiscountDto } from './dto/create-order-discount.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateOrderDiscountDto } from './dto/update-order-discount.dto';
import { IRestaurantService } from './interfaces/IRestaurant.service';
import {
  Restaurant,
  RestaurantDocument,
  RestaurantItem,
  RestaurantItemDocument,
} from './schemas';
import { Item } from '../item/schemas/item.schema';
import { PaginationParams } from '../shared/dto/pagination-params';
import {
  getPaginationData,
  pagination,
} from '../shared/utils/pagination.utils';
import {
  IRequestService,
  REQUEST_SERVICE,
  ISharedService,
  SHARED_SERVICE,
  IElasticsearchService,
  ELASTICSEARCH_SERVICE,
} from '../shared/interfaces';

@Injectable()
export class RestaurantService implements IRestaurantService {
  constructor(
    @InjectModel(Restaurant.name, connectionName.MAIN_DB)
    private restaurantModel: Model<RestaurantDocument>,
    @InjectModel(Order.name, connectionName.MAIN_DB)
    private orderModel: Model<OrderDocument>,
    @InjectModel(User.name, connectionName.MAIN_DB)
    private userModel: Model<UserDocument>,
    @InjectModel(RestaurantItem.name, connectionName.MAIN_DB)
    private restaurantItemModel: Model<RestaurantItemDocument>,
    @InjectModel(OrderDiscount.name, connectionName.MAIN_DB)
    private orderDiscountModel: Model<OrderDiscountDocument>,
    @Inject(SHARED_SERVICE) private readonly sharedService: ISharedService,
    @Inject(REQUEST_SERVICE) private readonly requestService: IRequestService,
    @Inject(ELASTICSEARCH_SERVICE)
    private readonly elasticSearchService: IElasticsearchService,
  ) { }

  async register(registerDto: RegisterDto): Promise<string> {
    try {
      // Create User
      const user = new User();
      user.email = registerDto.email;
      user.name = registerDto.name;
      user.password = await user.doPasswordHashing(registerDto.password);
      user.user_type = UserType.RESTAURANT_USER;
      user.role = UserRole.OWNER;
      user.hashedRefreshToken = '';
      const createdUser = await this.userModel.create(user);

      // Create Restaurant
      const restaurant = new Restaurant();
      restaurant.users = [createdUser.id];
      restaurant.name = registerDto.restaurant_name;
      restaurant.address = registerDto.address;
      restaurant.opening_time = registerDto.opening_time;
      restaurant.closing_time = registerDto.closing_time;
      const createdRestaurant = await this.restaurantModel.create(restaurant);

      await this.userModel
        .findOneAndUpdate(
          { email: createdUser.email },
          { restaurant: createdRestaurant.id },
          { new: true },
        )
        .exec();
      this.indexRestaurant(createdRestaurant);
      return Promise.resolve('Restaurant Successfully Created!');
    } catch (error: any) {
      return throwException(error);
    }
  }
  async getRestaurantList(): Promise<RestaurantResponse[]> {
    try {
      return await this.elasticSearchService.getRestaurantList();
    } catch (error) {
      return throwException(error);
    }
  }
  async getOrderList(
    paginationParams: PaginationParams,
  ): Promise<PaginatedOrderResponse> {
    try {
      const user: User = this.getUserDetailsFromRequest();
      const paginationPayload: PaginationPayload = pagination({
        page: paginationParams.page,
        size: paginationParams.pageSize,
      });
      const query = this.orderModel
        .find()
        .and([{ restaurant: user.restaurant._id }])
        .populate('order_items')
        .populate('order_discount')
        .sort({ _id: -1 })
        .limit(paginationPayload.limit);

      if (paginationParams.startId && paginationParams.page > 1) {
        query.and([{ _id: { $lt: paginationParams.startId } }]);
      } else {
        query.skip(paginationPayload.offset);
      }

      const orders: Order[] = await query.exec();

      const orderResponses: OrderResponse[] = [];
      orders?.forEach((order) => {
        orderResponses.push({
          id: order._id,
          order_amount: order.order_amount,
          order_date: new Date(order.order_date),
          order_status: order.order_status,
          paid_by: order.paid_by,
          rebate_amount: order.rebate_amount,
          discount_rate: order?.order_discount?.discount_rate,
          serial_number: order.serial_number,
          total_amount: order.total_amount,
          order_item: order.order_items.map((orderItem) => ({
            id: orderItem._id,
            amount: orderItem.amount,
            qty: orderItem.qty,
            total_amount: orderItem.total_amount,
            item: {
              id: orderItem.item_id,
              item_type: orderItem.item_type,
              meal_flavor: orderItem.meal_flavor,
              meal_state: orderItem.meal_state,
              meal_type: orderItem.meal_type,
              name: orderItem.name,
              price: orderItem.price,
              discount_rate: orderItem.discount_rate,
              icon: orderItem.icon,
              image: orderItem.image,
            },
          })),
        });
      });

      const total = await this.orderModel
        .count()
        .and([{ restaurant: user.restaurant._id }])
        .exec();

      const paginatedData = getPaginationData({
        total,
        page: +paginationPayload.currentPage,
        limit: +paginationPayload.limit,
      });

      const paginatedOrderResponse: PaginatedOrderResponse = {
        orders: orderResponses,
        count: total,
        currentPage: paginatedData.currentPage,
        nextPage: paginatedData.nextPage,
        totalPages: paginatedData.totalPages,
      };

      return paginatedOrderResponse;
    } catch (error: any) {
      return throwException(error);
    }
  }

  async releaseOrder(orderId: string): Promise<string> {
    try {
      const user: User = this.getUserDetailsFromRequest();
      const order: Order = await this.orderModel
        .findOneAndUpdate(
          {
            _id: orderId,
            restaurant: user.restaurant,
            order_status: OrderStatus.PENDING,
          },
          { order_status: OrderStatus.RELEASED },
          { new: true },
        )
        .exec();
      if (order == null) {
        throw new NotFoundException('Order not found');
      }
      return 'Order Released successfully';
    } catch (error: any) {
      return throwException(error);
    }
  }

  async completeOrder(orderId: string): Promise<string> {
    try {
      const user: User = this.getUserDetailsFromRequest();
      const order: Order = await this.orderModel
        .findOneAndUpdate(
          {
            _id: orderId,
            restaurant: user.restaurant,
            order_status: OrderStatus.RELEASED,
          },
          { order_status: OrderStatus.PAID },
          { new: true },
        )
        .populate({ path: 'order_items', populate: 'item' })
        .populate('order_discount')
        .exec();

      if (order == null) {
        throw new NotFoundException('Order not found');
      }

      await Promise.all(
        order.order_items.map(async (orderItem) => {
          const restaurantItem: RestaurantItem = await this.restaurantItemModel
            .findOne({ item: orderItem.item_id })
            .exec();
          if (restaurantItem) {
            await this.restaurantItemModel
              .findOneAndUpdate(
                { _id: restaurantItem._id },
                { sell_count: restaurantItem.sell_count + orderItem.qty },
                { new: true },
              )
              .exec();
          } else {
            const item: Item = await this.sharedService.getItemInfo(
              orderItem.item_id.toString(),
              user.restaurant._id,
            );
            const resItem = new RestaurantItem();
            resItem.restaurant = user.restaurant;
            resItem.sell_count = orderItem.qty;
            resItem.item = item;
            await this.restaurantItemModel.create(resItem);
          }
        }),
      );
      return 'Order completed';
    } catch (error: any) {
      return throwException(error);
    }
  }

  async getOrderDiscount(): Promise<OrderDiscount[]> {
    try {
      const user: User = this.getUserDetailsFromRequest();
      return await this.orderDiscountModel
        .find({ restaurant: user.restaurant })
        .exec();
    } catch (error: any) {
      return throwException(error);
    }
  }

  async createOrderDiscount(
    orderDiscountDto: CreateOrderDiscountDto,
  ): Promise<OrderDiscount> {
    try {
      const user: User = this.getUserDetailsFromRequest();
      const orderDis: OrderDiscount[] = await this.orderDiscountModel
        .find()
        .and([
          { restaurant: user.restaurant._id },
          { start_date: { $lte: new Date(orderDiscountDto.start_date) } },
          { end_date: { $gte: new Date(orderDiscountDto.end_date) } },
        ])
        .exec();

      if (orderDis.length) {
        throw new BadRequestException('Already exists.');
      }

      const orderDiscount = new OrderDiscount();
      orderDiscount.restaurant = user.restaurant;
      orderDiscount.discount_rate = orderDiscountDto.discount_rate;
      orderDiscount.max_amount = orderDiscountDto.max_amount;
      orderDiscount.min_amount = orderDiscountDto.min_amount;
      orderDiscount.start_date = new Date(orderDiscountDto.start_date);
      orderDiscount.end_date = new Date(orderDiscountDto.end_date);

      const newResult = await this.orderDiscountModel.create(orderDiscount);
      return newResult;
    } catch (error: any) {
      return throwException(error);
    }
  }

  async updateOrderDiscount(
    orderDiscountDto: UpdateOrderDiscountDto,
    discountId: string,
  ): Promise<OrderDiscount> {
    try {
      const user: User = this.getUserDetailsFromRequest();
      const isUsed: boolean = await this.isUsedOrderDiscount(discountId);
      if (isUsed) {
        throw new BadRequestException('Discount has been used already');
      }
      const orderDiscount: OrderDiscount = await this.orderDiscountModel
        .findOneAndUpdate(
          { _id: discountId, restaurant: user.restaurant },
          orderDiscountDto,
          { new: true },
        )
        .exec();
      if (orderDiscount == null) {
        throw new BadRequestException('Failed');
      }
      return orderDiscount;
    } catch (error: any) {
      return throwException(error);
    }
  }

  async deleteOrderDiscount(discountId: string): Promise<boolean> {
    try {
      const user: User = this.getUserDetailsFromRequest();
      const isUsed: boolean = await this.isUsedOrderDiscount(discountId);
      if (isUsed) {
        throw new BadRequestException('Discount has been used already');
      }
      const isDeleted = await this.orderDiscountModel
        .findOneAndDelete({ _id: discountId, restaurant: user.restaurant })
        .exec();
      if (isDeleted == null) {
        throw new NotFoundException('Not found');
      }
      return true;
    } catch (error: any) {
      return throwException(error);
    }
  }

  async searchRestaurant(keyword: string): Promise<RestaurantResponse[]> {
    try {
      return await this.elasticSearchService.searchRestaurant(keyword);
    } catch (error: any) {
      return throwException(error);
    }
  }

  private async isUsedOrderDiscount(discountId: string): Promise<boolean> {
    try {
      const order: Order = await this.orderModel
        .findOne({ order_discount: discountId })
        .exec();
      return order == null ? false : true;
    } catch (error: any) {
      return throwException(error);
    }
  }

  private async indexRestaurant(restaurant: Restaurant): Promise<boolean> {
    try {
      return this.elasticSearchService.indexRestaurant(restaurant);
    } catch (error: any) {
      return throwException(error);
    }
  }

  private getUserDetailsFromRequest(): User {
    return this.requestService.getUserInfo();
  }
}
