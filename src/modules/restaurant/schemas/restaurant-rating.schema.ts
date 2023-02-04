import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "../../user/schemas/user.schema";
import { Restaurant } from "./restaurant.schema";

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
export class RestaurantRating {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
    restaurant: Restaurant;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

    @Prop({ type: 'Number', default: 0.0 })
    star: number;

    @Prop({ type: 'Date', default: Date.now() })
    rating_date: string;
}

export const RestaurantRatingSchema = SchemaFactory.createForClass(RestaurantRating);
export type RestaurantRatingDocument = HydratedDocument<RestaurantRating>;