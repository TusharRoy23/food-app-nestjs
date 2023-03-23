import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { throwException } from '../shared/errors/all.exception';
import { CartItemResponse, CartReponse } from '../shared/utils/response.utils';
import { CartStatus, connectionName } from '../shared/utils/enum';
import { Item } from '../item/schemas/item.schema';
import { Restaurant } from '../restaurant/schemas';
import { CartItemDto } from './dto/cart-item.dto';
import { ICartService } from './interfaces/ICart.interface';
import { Cart, CartDocument, CartItem, CartItemDocument } from './schemas';
import { User } from '../user/schemas/user.schema';
import { IRequestService, REQUEST_SERVICE, ISharedService, SHARED_SERVICE } from '../shared/interfaces';

@Injectable()
export class CartService implements ICartService {
    constructor(
        @InjectModel(Cart.name, connectionName.MAIN_DB) private cartModel: Model<CartDocument>,
        @InjectModel(CartItem.name, connectionName.MAIN_DB) private cartItemModel: Model<CartItemDocument>,
        @Inject(SHARED_SERVICE) private readonly sharedService: ISharedService,
        @Inject(REQUEST_SERVICE) private readonly requestService: IRequestService,
    ) { }

    async create(cartItemDto: CartItemDto, restaurantId: string): Promise<CartReponse> {
        try {
            const user: User = this.getUserDetailsFromRequest();
            const restaurantInfo: Restaurant = await this.sharedService.getRestaurantInfo(restaurantId);
            const itemInfo: Item = await this.sharedService.getItemInfo(cartItemDto.id, restaurantId);

            if (
                (typeof itemInfo.max_order_qty === 'number' && itemInfo.max_order_qty < cartItemDto.qty) ||
                (typeof itemInfo.min_order_qty === 'number' && itemInfo.min_order_qty > cartItemDto.qty)
            ) {
                throw new BadRequestException(`order qty should be between ${itemInfo.min_order_qty} To ${itemInfo.max_order_qty}`)
            }

            const cart = new Cart();
            cart.restaurant = restaurantInfo;
            cart.user = user;
            cart.rebate_amount = 0.0;

            let discountRate = itemInfo.discount_rate > 0 ? itemInfo.discount_rate / 100 : 1;
            let cartAmount = cartItemDto.qty * itemInfo.price;
            let itemTotalAmount = cartItemDto.qty * (itemInfo.price * discountRate);
            cart.total_amount = itemTotalAmount;

            const discountInfo = await this.sharedService.getOrderDiscount(restaurantId);
            if (discountInfo && discountInfo.discount_rate > 0 && cart.total_amount <= discountInfo.max_amount && cart.total_amount >= discountInfo.min_amount) {
                cart.rebate_amount = cart.total_amount * discountInfo.discount_rate;
                cart.total_amount = cart.total_amount - cart.rebate_amount;
                cart.order_discount = discountInfo;
            }

            cart.cart_amount = cartAmount;
            const cart_info = await this.cartModel.create(cart);

            const result: CartReponse = {
                id: cart_info._id,
                cart_amount: cart_info.cart_amount,
                total_amount: cart_info.total_amount,
                rebate_amount: cart_info.rebate_amount,
                discount_rate: itemInfo.discount_rate,
                cart_date: cart_info.cart_date,
                cart_status: cart_info.cart_status,
                cart_item: []
            };

            const cartItem: CartItem = await this.cartItemModel.create({
                item: itemInfo,
                qty: cartItemDto.qty,
                amount: cartAmount,
                total_amount: itemTotalAmount,
                cart: cart_info
            });

            await this.cartModel.findOneAndUpdate({ _id: cart_info._id }, { cart_items: [cartItem] }, { new: true }).exec();

            result['cart_item'].push({
                id: cartItem._id,
                qty: cartItem.qty,
                amount: cartItem.amount,
                total_amount: cartItem.total_amount,
                item: {
                    id: itemInfo._id,
                    discount_rate: itemInfo.discount_rate,
                    item_type: itemInfo.item_type,
                    meal_flavor: itemInfo.meal_flavor,
                    meal_state: itemInfo.meal_state,
                    meal_type: itemInfo.meal_state,
                    name: itemInfo.name,
                    price: itemInfo.price,
                    restaurant: {
                        id: itemInfo.restaurant._id,
                        name: itemInfo.restaurant.name,
                        address: itemInfo.restaurant.address
                    }
                },
            });
            return result as CartReponse;
        } catch (error: any) {
            return throwException(error);
        }
    }
    async retrieve(cartId: string): Promise<CartReponse> {
        try {
            const user: User = this.getUserDetailsFromRequest();
            const cart: Cart = await this.getCartInfo(cartId, user);
            const result: CartReponse = {
                id: cart._id,
                cart_amount: cart.cart_amount,
                total_amount: cart.total_amount,
                rebate_amount: cart.rebate_amount,
                discount_rate: cart?.order_discount?.discount_rate || 0.0,
                cart_date: new Date(cart.cart_date),
                cart_status: cart.cart_status,
                cart_item: cart.cart_items.map((cartItem) => ({
                    amount: cartItem.amount,
                    id: cartItem._id,
                    qty: cartItem.qty,
                    total_amount: cartItem.total_amount,
                    item: {
                        id: cartItem.item._id,
                        discount_rate: cartItem?.item?.discount_rate || 0.0,
                        item_type: cartItem.item.item_type,
                        meal_flavor: cartItem.item.meal_flavor,
                        meal_state: cartItem.item.meal_state,
                        meal_type: cartItem.item.meal_state,
                        name: cartItem.item.name,
                        price: cartItem.item.price
                    }
                }))
            };
            this.getCartResponse(cartId, user);
            return result;
        } catch (error: any) {
            return throwException(error);
        }
    }

    async update(cartItemDto: CartItemDto, cartId: string): Promise<CartReponse> {
        try {
            const user: User = this.getUserDetailsFromRequest();
            const cart: Cart = await this.getCartInfo(cartId, user);
            const itemInfo: Item = await this.sharedService.getItemInfo(cartItemDto.id, cart.restaurant._id);
            if (itemInfo == null) {
                throw new NotFoundException('Item not found');
            }

            if (
                (typeof itemInfo.max_order_qty === 'number' && itemInfo.max_order_qty < cartItemDto.qty) ||
                (typeof itemInfo.min_order_qty === 'number' && itemInfo.min_order_qty > cartItemDto.qty)
            ) {
                throw new BadRequestException(`order qty should be between ${itemInfo.min_order_qty} To ${itemInfo.max_order_qty}`);
            }

            const cartItemInfo: CartItem = await this.cartItemModel.findOne({ item: cartItemDto.id, cart: cart._id }).populate('item').exec();
            const discountRate = itemInfo.discount_rate > 0 ? itemInfo.discount_rate / 100 : 1;
            const itemTotalAmount = cartItemDto.qty * (itemInfo.price * discountRate);
            const itemAmount = cartItemDto.qty * itemInfo.price;

            if (cartItemInfo) {
                await this.cartItemModel.findOneAndUpdate(
                    { _id: cartItemInfo._id },
                    { qty: cartItemDto.qty, amount: itemAmount, total_amount: itemTotalAmount }
                ).exec();
            } else {
                await new this.cartItemModel({
                    item: itemInfo,
                    qty: cartItemDto.qty,
                    amount: itemAmount,
                    total_amount: itemTotalAmount,
                    cart: cart
                }).save();
            }
            return this.getCartResponse(cartId, user);
        } catch (error: any) {
            return throwException(error);
        }
    }

    async delete(cartItemId: string, cartId: string): Promise<CartReponse> {
        try {
            const user: User = this.getUserDetailsFromRequest();
            const cartItem: CartItem = await this.cartItemModel.findOneAndDelete({ cart: cartId, _id: cartItemId }, { new: true }).exec();
            if (cartItem == null) {
                throw new NotFoundException('Cart Item not found');
            }
            return await this.getCartResponse(cartId, user);
        } catch (error: any) {
            return throwException(error);
        }
    }

    private async getCartInfo(cartId: string, user: User): Promise<Cart> {
        try {
            const cart: Cart = await this.cartModel.findOne({ _id: cartId, cart_status: CartStatus.SAVED, user: user })
                .populate('order_discount')
                .populate({ path: 'cart_items', populate: 'item' }).exec();

            if (!cart) {
                throw new NotFoundException('Cart not found');
            }
            return cart;
        } catch (error: any) {
            return throwException(error);
        }
    }

    private async getCartResponse(cartId: string, user: User): Promise<CartReponse> {
        try {
            const cart: Cart = await this.cartModel.findOne({ _id: cartId, cart_status: CartStatus.SAVED, user: user });
            const cartItems: CartItem[] = await this.cartItemModel.find({ cart: cartId }).populate('item').exec();

            const cartItemResponse: CartItemResponse[] = [];
            let cartAmount = 0;
            let totalAmount = 0;

            cartItems?.forEach(cartItem => {
                cartAmount += cartItem.amount;
                totalAmount += cartItem.total_amount;
                cartItemResponse.push({
                    id: cartItem._id,
                    amount: cartItem.amount,
                    qty: cartItem.qty,
                    total_amount: cartItem.total_amount,
                    item: {
                        id: cartItem.item._id,
                        discount_rate: cartItem?.item?.discount_rate || 0.0,
                        item_type: cartItem.item.item_type,
                        meal_flavor: cartItem.item.meal_flavor,
                        meal_state: cartItem.item.meal_state,
                        meal_type: cartItem.item.meal_state,
                        name: cartItem.item.name,
                        price: cartItem.item.price
                    }
                })
            });

            let rebate_amount = 0;

            const discountInfo = await this.sharedService.getOrderDiscount(cart.restaurant._id);
            if (discountInfo && discountInfo?.discount_rate > 0 && totalAmount <= discountInfo.max_amount && totalAmount >= discountInfo.min_amount) {
                rebate_amount = totalAmount * discountInfo.discount_rate;
                totalAmount = totalAmount - rebate_amount;
            }

            const payload: any = {
                cart_amount: cartAmount,
                rebate_amount: rebate_amount,
                total_amount: totalAmount,
                order_discount: null,
                cart_items: cartItems
            };

            if (rebate_amount > 0) {
                payload['order_discount'] = discountInfo;
            }

            const updatedCart: Cart = await this.cartModel.findOneAndUpdate({ _id: cart._id, user: user }, payload, { new: true }).exec();

            const result: CartReponse = {
                id: cart._id,
                cart_amount: updatedCart.cart_amount,
                total_amount: updatedCart.total_amount,
                rebate_amount: updatedCart.rebate_amount,
                discount_rate: discountInfo?.discount_rate || 0,
                cart_date: cart.cart_date,
                cart_status: cart.cart_status,
                cart_item: cartItemResponse
            };

            return result;
        } catch (error: any) {
            return throwException(error);
        }
    }

    private getUserDetailsFromRequest(): User {
        return this.requestService.getUserInfo();
    }
}
