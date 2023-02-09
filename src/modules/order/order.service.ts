import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CartStatus, connectionName } from '../shared/utils/enum';
import { throwException } from '../shared/errors/all.exception';
import { OrderResponse } from '../shared/utils/response.utils';
import { IOrderService } from './interfaces/IOrder.service';
import { Order, OrderDocument, OrderItem, OrderItemDocument } from './schemas';
import { Model } from 'mongoose';
import { Cart } from '../cart/schemas';
import { SHARED_SERVICE, ISharedService } from '../shared/interfaces/IShared.service';
import { User } from '../user/schemas/user.schema';
import { Item } from '../item/schemas/item.schema';
import { RatingDto } from '../restaurant/dto/rating.dto';

@Injectable()
export class OrderService implements IOrderService {
    constructor(
        @InjectModel(Order.name, connectionName.MAIN_DB) private orderModel: Model<OrderDocument>,
        @InjectModel(OrderItem.name, connectionName.MAIN_DB) private orderItemModel: Model<OrderItemDocument>,
        @Inject(SHARED_SERVICE) private readonly sharedService: ISharedService,
    ) { }

    async submitOrder(cartId: string, user: User): Promise<OrderResponse> {
        try {
            const cart: Cart = await this.sharedService.getCartInfo(cartId, user);
            const cartItems: { item: Item, amount: number, qty: number, total_amount: number }[] = [];
            const orderItems: OrderItem[] = [];
            let orderAmount: number = 0.0;

            cart?.cart_items.forEach((cartItem) => {
                const discountRate = cartItem.item.discount_rate > 0 ? cartItem.item.discount_rate / 100 : 1;
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
            if (discountInfo.discount_rate > 0 && orderAmount <= discountInfo.max_amount && orderAmount >= discountInfo.min_amount) {
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

            const orderInfo: Order = await new this.orderModel(order).save();
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
                discount_rate: discountInfo.discount_rate,
                order_date: orderInfo.order_date,
                order_status: orderInfo.order_status,
                paid_by: orderInfo.paid_by,
                order_item: []
            };

            await Promise.all(
                cartItems.map(async (cartItem) => {
                    const orderItem: OrderItem = await new this.orderItemModel({
                        item: cartItem.item,
                        amount: cartItem.amount,
                        qty: cartItem.qty,
                        total_amount: cartItem.total_amount,
                        order: orderInfo
                    }).save();

                    orderItems.push(orderItem);
                    orderResponse.order_item.push({
                        qty: orderItem.qty,
                        amount: orderItem.amount,
                        total_amount: orderItem.total_amount,
                        item: {
                            id: orderItem.item._id,
                            item_type: orderItem.item.item_type,
                            meal_flavor: orderItem.item.meal_flavor,
                            meal_state: orderItem.item.meal_state,
                            meal_type: orderItem.item.meal_type,
                            name: orderItem.item.name,
                            price: orderItem.item.price,
                        },
                        id: orderItem._id
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

    async getOrdersByUser(user: User): Promise<OrderResponse[]> {
        try {
            const orders: Order[] = await this.orderModel.find({ user: user._id })
                .populate('restaurant')
                .populate({ path: 'order_items', populate: 'item' })
                .populate('order_discount')
                .exec();

            const orderResponses: OrderResponse[] = [];
            orders.forEach((order) => {
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
                            id: orderItem.item._id,
                            item_type: orderItem.item.item_type,
                            meal_flavor: orderItem.item.meal_flavor,
                            meal_state: orderItem.item.meal_state,
                            meal_type: orderItem.item.meal_type,
                            name: orderItem.item.name,
                            price: orderItem.item.price,
                        }
                    }))
                });
            });

            return orderResponses;
        } catch (error: any) {
            return throwException(error);
        }
    }

    async giveRating(user: User, ratingDto: RatingDto): Promise<String> {
        try {
            const rating = await this.sharedService.giveRating(user, ratingDto);
            if (rating == null) {
                throw new InternalServerErrorException('Failed');
            }
            return rating;
        } catch (error) {
            return throwException(error);
        }
    }
}
