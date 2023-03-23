import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CartStatus, connectionName } from '../shared/utils/enum';
import { throwException } from '../shared/errors/all.exception';
import { OrderResponse, PaginatedOrderResponse, PaginationPayload } from '../shared/utils/response.utils';
import { IOrderService } from './interfaces/IOrder.service';
import { Order, OrderDocument, OrderItem, OrderItemDocument } from './schemas';
import { Model } from 'mongoose';
import { Cart } from '../cart/schemas';
import { User } from '../user/schemas/user.schema';
import { Item } from '../item/schemas/item.schema';
import { RatingDto } from '../restaurant/dto/rating.dto';
import { PaginationParams } from '../shared/dto/pagination-params';
import { getPaginationData, pagination } from '../shared/utils/pagination.utils';
import { IRequestService, REQUEST_SERVICE, SHARED_SERVICE, ISharedService } from '../shared/interfaces';

@Injectable()
export class OrderService implements IOrderService {
    constructor(
        @InjectModel(Order.name, connectionName.MAIN_DB) private orderModel: Model<OrderDocument>,
        @InjectModel(OrderItem.name, connectionName.MAIN_DB) private orderItemModel: Model<OrderItemDocument>,
        @Inject(SHARED_SERVICE) private readonly sharedService: ISharedService,
        @Inject(REQUEST_SERVICE) private readonly requestService: IRequestService,
    ) { }

    async submitOrder(cartId: string): Promise<OrderResponse> {
        try {
            const user: User = this.getUserDetailsFromRequest();
            const cart: Cart = await this.sharedService.getCartInfo(cartId, user);
            const cartItems: { item: Item, amount: number, qty: number, total_amount: number }[] = [];
            const orderItems: OrderItem[] = [];
            let orderAmount: number = 0.0;

            cart?.cart_items?.forEach((cartItem) => {
                const discountRate = cartItem.item?.discount_rate > 0 ? cartItem.item.discount_rate / 100 : 1;
                const amount = cartItem.qty * (cartItem.item.price * discountRate);
                orderAmount += amount;
                cartItems.push({
                    amount: cartItem.item.price * cartItem.qty,
                    qty: cartItem.qty,
                    total_amount: amount,
                    item: cartItem.item,
                });
            });

            let rebate_amount = 0; let total_amount = orderAmount;
            const discountInfo = await this.sharedService.getOrderDiscount(cart.restaurant._id);
            if (discountInfo?.discount_rate > 0 && orderAmount <= discountInfo.max_amount && orderAmount >= discountInfo.min_amount) {
                rebate_amount = orderAmount * discountInfo.discount_rate;
                total_amount = orderAmount - rebate_amount;
            }

            const order = new Order();
            order.user = user;
            order.order_amount = orderAmount;
            order.total_amount = total_amount;
            order.rebate_amount = rebate_amount;
            order.restaurant = cart.restaurant;
            order.serial_number = `F-${Date.now()}`;
            if (rebate_amount > 0) {
                order.order_discount = discountInfo;
            }

            const orderInfo: Order = await this.orderModel.create(order);
            const orderResponse: OrderResponse = {
                id: orderInfo._id,
                order_amount: orderInfo.order_amount,
                total_amount: orderInfo.total_amount,
                restaurant: {
                    id: orderInfo.restaurant._id,
                    name: orderInfo.restaurant.name,
                    address: orderInfo.restaurant.address,
                },
                serial_number: orderInfo.serial_number,
                rebate_amount: orderInfo.rebate_amount,
                discount_rate: discountInfo?.discount_rate || 0,
                order_date: orderInfo.order_date,
                order_status: orderInfo.order_status,
                paid_by: orderInfo.paid_by,
                order_item: []
            };

            await Promise.all(
                cartItems.map(async (cartItem) => {
                    const orderItem: OrderItem = await this.orderItemModel.create({
                        item_id: cartItem.item._id,
                        name: cartItem.item.name,
                        icon: cartItem.item.icon,
                        image: cartItem.item.image,
                        item_type: cartItem.item.item_type,
                        item_status: cartItem.item.item_status,
                        meal_type: cartItem.item.meal_type,
                        meal_state: cartItem.item.meal_state,
                        meal_flavor: cartItem.item.meal_flavor,
                        price: cartItem.item.price,
                        discount_rate: cartItem.item?.discount_rate || 0,
                        amount: cartItem.amount,
                        qty: cartItem.qty,
                        total_amount: cartItem.total_amount,
                        order: orderInfo
                    });

                    orderItems.push(orderItem);
                    orderResponse.order_item.push({
                        id: orderItem._id,
                        qty: orderItem.qty,
                        amount: orderItem.amount,
                        total_amount: orderItem.total_amount,
                        item: {
                            id: orderItem.item_id,
                            item_type: orderItem.item_type,
                            meal_flavor: orderItem.meal_flavor,
                            meal_state: orderItem.meal_state,
                            meal_type: orderItem.meal_type,
                            name: orderItem.name,
                            price: orderItem.price,
                            discount_rate: orderItem?.discount_rate || 0,
                            icon: orderItem.icon,
                            image: orderItem.image
                        }
                    })
                })
            );

            await this.orderModel.findOneAndUpdate({ _id: orderInfo._id, user: user._id }, { order_items: orderItems }, { new: true }).exec();

            await this.sharedService.updateCartInfo({ _id: cart._id, user: user._id, cart_status: CartStatus.SAVED }, { cart_status: CartStatus.APPROVED });
            return orderResponse;
        } catch (error: any) {
            return throwException(error);
        }
    }

    async getOrdersByUser(paginationParams: PaginationParams): Promise<PaginatedOrderResponse> {
        try {
            const user: User = this.getUserDetailsFromRequest();
            const paginationPayload: PaginationPayload = pagination({ page: paginationParams.page, size: paginationParams.pageSize });
            const query = this.orderModel.find({ user: user._id })
                .populate('restaurant')
                .populate('order_items')
                .populate('order_discount')
                .sort({ _id: -1 })
                .limit(paginationPayload.limit);
            if (paginationParams.startId && paginationParams.page > 1) {
                query.and([
                    { _id: { $lt: paginationParams.startId } }
                ]);
            } else {
                query.skip(paginationPayload.offset);
            }
            const orders: Order[] = await query.exec();

            const orderResponses: OrderResponse[] = [];
            orders?.forEach((order) => {
                orderResponses.push({
                    id: order._id,
                    order_amount: order.order_amount,
                    order_date: order.order_date,
                    order_status: order.order_status,
                    paid_by: order.paid_by,
                    rebate_amount: order.rebate_amount,
                    serial_number: order.serial_number,
                    total_amount: order.total_amount,
                    discount_rate: order?.order_discount?.discount_rate,
                    restaurant: {
                        id: order.restaurant._id,
                        name: order.restaurant.name,
                        address: order.restaurant.address
                    },
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
                            image: orderItem.image
                        }
                    }))
                });
            });

            const total = await this.orderModel.count().and([{ user: user._id }]).exec();
            const paginatedData = getPaginationData({ total, page: +paginationPayload.currentPage, limit: +paginationPayload.limit });

            const paginatedOrderResponse: PaginatedOrderResponse = {
                orders: orderResponses,
                count: total,
                currentPage: paginatedData.currentPage,
                nextPage: paginatedData.nextPage,
                totalPages: paginatedData.totalPages
            };

            return paginatedOrderResponse;
        } catch (error: any) {
            return throwException(error);
        }
    }

    async giveRating(ratingDto: RatingDto): Promise<String> {
        try {
            const user: User = this.getUserDetailsFromRequest();
            const rating = await this.sharedService.giveRating(user, ratingDto);
            if (rating == null) {
                throw new InternalServerErrorException('Failed');
            }
            return rating;
        } catch (error) {
            return throwException(error);
        }
    }

    private getUserDetailsFromRequest(): User {
        return this.requestService.getUserInfo();
    }
}
