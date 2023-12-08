import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurant } from '../../restaurant/schemas';
import {
  ItemStatus,
  ItemType,
  MealFlavor,
  MealState,
  MealType,
} from '../../shared/utils/enum';
import { IItem } from "../interfaces/IItem.model";

@Schema({
  toJSON: {
    virtuals: true
  }
})
export class Item implements IItem {
  _id: mongoose.Types.ObjectId;

  @Prop({
    type: 'String',
    maxlength: 13,
    minlength: 1,
    required: true,
    lowercase: true,
  })
  name: string;

  @Prop({ type: 'String' })
  icon: string;

  @Prop({ type: 'String' })
  image: string;

  @Prop({ type: 'String', default: ItemType.FOOD, enum: ItemType })
  item_type: string;

  @Prop({ type: 'String', default: MealType.FASTFOOD, enum: MealType })
  meal_type: string;

  @Prop({ type: 'String', default: MealState.HOT, enum: MealState })
  meal_state: string;

  @Prop({ type: 'String', default: MealFlavor.SWEET, enum: MealFlavor })
  meal_flavor: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: Restaurant;

  @Prop({ type: 'Number', required: true, min: 0.0 })
  price: number;

  @Prop({ type: 'Number', required: true, min: 0.0 })
  max_order_qty?: number;

  @Prop({ type: 'Number', required: true, min: 0.0 })
  min_order_qty?: number;

  @Prop({ type: 'Number', default: 0.0, min: 0.0 })
  discount_rate?: number;

  @Prop({ type: 'Date', default: Date.now() })
  created_date: Date;

  @Prop({ type: 'String', default: ItemStatus.ACTIVE, enum: ItemStatus })
  item_status: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
export type ItemDocuement = HydratedDocument<Item>;
