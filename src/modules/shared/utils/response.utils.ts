import mongoose from "mongoose";
import { OrderDiscount } from "../../order/schemas";
import { User } from "../../user/schemas/user.schema";

export class UserResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export class TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export class CartReponse {
    id: mongoose.Types.ObjectId;
    cart_amount: number;
    total_amount: number;
    rebate_amount: number;
    discount_rate: number;
    cart_date: Date;
    cart_status: string;
    cart_item: CartItemResponse[]
}

export class CartItemResponse {
    id: mongoose.Types.ObjectId;
    qty: number;
    amount: number;
    total_amount: number;
    item: ItemReponse;
}

export class OrderResponse {
    id: mongoose.Types.ObjectId;
    order_amount: number;
    total_amount: number;
    restaurant?: RestaurantResponse;
    serial_number: string;
    rebate_amount: number;
    discount_rate: number;
    order_date: Date;
    order_status: string;
    paid_by: string;
    order_item: OrderItemResponse[];
    user?: User;
}

export class OrderItemResponse {
    id: mongoose.Types.ObjectId;
    qty: number;
    amount: number;
    total_amount: number;
    item: ItemReponse;
}

export class PaginatedOrderResponse {
    orders: OrderResponse[];
    count: number;
    currentPage: number;
    totalPages: number;
    nextPage: number;
}

export class PaginationPayload {
    limit: number;
    offset: number;
    currentPage: number;
}
export class PaginationDataResponse {
    count: number;
    currentPage: number;
    totalPages: number;
    nextPage: number;
}

export class ItemReponse {
    id: mongoose.Types.ObjectId;
    meal_state: string;
    name: string;
    item_type: string;
    meal_type: string;
    meal_flavor: string;
    restaurant?: RestaurantResponse;
    price: number;
    discount_rate?: number;
}

export class RestaurantResponse {
    id: mongoose.Types.ObjectId;
    name: string;
    address: string;
    opening_time?: string;
    closing_time?: string;
    current_status?: string;
}