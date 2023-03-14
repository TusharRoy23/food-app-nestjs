import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Item } from "../../item/schemas/item.schema";
import { Cart } from "./cart.schema";

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
export class CartItem {
    _id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item' })
    item: Item;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' })
    cart: Cart;

    @Prop({ type: 'Number', default: 0.0 })
    qty: number;

    @Prop({ type: 'Number', default: 0.0 })
    amount: number;

    @Prop({ type: 'Number', default: 0.0 })
    total_amount: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
export type CartItemDocument = HydratedDocument<CartItem>;