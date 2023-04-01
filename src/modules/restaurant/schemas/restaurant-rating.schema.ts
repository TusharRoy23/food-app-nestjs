import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Restaurant } from './restaurant.schema';

@Schema({
  toJSON: {
    getters: true,
    transform(_, ret, __) {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class RestaurantRating {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: Restaurant;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: 'Number', default: 0.0 })
  star: number;

  @Prop({ type: 'Date', default: Date.now() })
  rating_date: Date;
}

export const RestaurantRatingSchema =
  SchemaFactory.createForClass(RestaurantRating);
export type RestaurantRatingDocument = HydratedDocument<RestaurantRating>;
