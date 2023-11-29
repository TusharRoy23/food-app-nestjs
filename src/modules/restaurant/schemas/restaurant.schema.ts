import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { CurrentStatus } from '../../shared/utils/enum';
import { IRestaurant } from '../interfaces/IRestaurant.model';

@Schema({
  toJSON: {
    getters: true,
    versionKey: false,
    transform(_, ret) {
      delete ret.user;
      return ret;
    },
  },
  id: false
})
export class Restaurant implements IRestaurant {
  _id: mongoose.Types.ObjectId;

  @Prop({
    type: 'String',
    maxlength: 13,
    minlength: 1,
    required: true,
    lowercase: true,
  })
  name: string;

  @Prop({ type: 'String', maxlength: 100, minlength: 5, required: true })
  address: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: User[];

  @Prop({ type: 'String' })
  profile_img: string;

  @Prop({ type: 'String', required: true })
  opening_time: string;

  @Prop({ type: 'String', required: true })
  closing_time: string;

  @Prop({
    type: 'String',
    required: true,
    enum: CurrentStatus,
    default: CurrentStatus.NOT_VERIFIED,
  })
  current_status: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
export type RestaurantDocument = HydratedDocument<Restaurant>;
