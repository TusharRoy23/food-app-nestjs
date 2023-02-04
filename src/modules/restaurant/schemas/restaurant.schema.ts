import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Item } from "../../item/schemas/item.schema";
import { User } from "../../user/schemas/user.schema";
import { CurrentStatus } from "../../shared/utils/enum";

@Schema({
    toJSON: {
        getters: true,
        transform(doc, ret, options) {
            delete ret._id;
            delete ret.__v;
            delete ret.user;
            delete ret.item;
            return ret;
        },
    },
})
export class Restaurant {
    @Prop({ type: 'String', maxlength: 13, minlength: 1, required: true, lowercase: true })
    name: string;

    @Prop({ type: 'String', maxlength: 100, minlength: 5, required: true })
    address: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    user: User[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }] })
    item: Item[];

    @Prop({ type: 'String' })
    profile_img: string;

    @Prop({ type: 'String', required: true })
    opening_time: string;

    @Prop({ type: 'String', required: true })
    closing_time: string;

    @Prop({ type: 'String', required: true, enum: CurrentStatus, default: CurrentStatus.NOT_VERIFIED })
    current_status: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
export type RestaurantDocument = HydratedDocument<Restaurant>;