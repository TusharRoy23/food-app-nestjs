import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { OrderDiscount } from "../../order/schemas";
import { CartStatus } from "../../shared/utils/enum";
import { Restaurant } from "../../restaurant/schemas";
import { User } from "../../user/schemas/user.schema";
import { CartItem } from "./cart-item.schema";

@Schema({
    toJSON: {
        getters: true,
        transform(doc, ret, options) {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
})
export class Cart {
    _id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
    restaurant: Restaurant;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem' }] })
    cart_item: CartItem[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'OrderDiscount' })
    order_discount: OrderDiscount;

    @Prop({ type: 'Number', default: 0.0 })
    cart_amount: number;

    @Prop({ type: 'Number', default: 0.0 })
    total_amount: number;

    @Prop({ type: 'Number', default: 0.0 })
    rebate_amount: number;

    @Prop({ type: 'Date', default: Date.now() })
    cart_date: string;

    @Prop({
        type: 'String',
        enum: CartStatus,
        default: CartStatus.SAVED
    })
    cart_status: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
export type CartDocument = HydratedDocument<Cart>;