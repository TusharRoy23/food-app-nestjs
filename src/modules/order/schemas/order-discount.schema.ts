import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Restaurant } from "../../restaurant/schemas";

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
export class OrderDiscount {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
    restaurant: Restaurant;

    @Prop({ type: 'Number', required: true })
    max_amount: number;

    @Prop({ type: 'Number', default: 1 })
    min_amount: number;

    @Prop({ type: 'Number', default: 0.0 })
    discount_rate: number;

    @Prop({ type: 'Date', required: true })
    start_date: string;

    @Prop({ type: 'Date', required: true })
    end_date: string;

    @Prop({ type: 'Date', default: Date.now() })
    created_date?: string;
}
export const OrderDiscountSchema = SchemaFactory.createForClass(OrderDiscount);
export type OrderDiscountDocument = HydratedDocument<OrderDiscount>;