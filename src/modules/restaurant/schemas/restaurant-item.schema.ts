import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Item } from '../../item/schemas/item.schema';
import { Restaurant } from './restaurant.schema';
import { IRestaurantItem } from '../interfaces/IRestaurant.model';

@Schema({
  toJSON: {
    virtuals: true
  }
})
export class RestaurantItem implements IRestaurantItem {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: Restaurant;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item' })
  item: Item;

  @Prop({ type: 'Number', default: 0 })
  sell_count: number;
}

export const RestaurantItemSchema =
  SchemaFactory.createForClass(RestaurantItem);
export type RestaurantItemDocument = HydratedDocument<RestaurantItem>;
