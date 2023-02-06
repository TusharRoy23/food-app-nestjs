import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Item } from "../../item/schemas/item.schema";
import { Order } from "./order.schema";

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
export class OrderItem {
    _id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item' })
    item: Item;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
    order: Order;

    @Prop({ type: 'Number', required: true })
    qty: number;

    @Prop({ required: true, type: 'Number' })
    amount: number;

    @Prop({ required: true, type: 'Number' })
    total_amount: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
export type OrderItemDocument = HydratedDocument<OrderItem>;