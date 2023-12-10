import { IsEmail } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { IUserVerificationLogger } from '../interfaces/IUser-verification-logger.model';
import { hashString, isStringMatched } from '../../shared/utils/hashing.utils';

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class UserVerificationLogger implements IUserVerificationLogger {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: 'String', required: true, unique: true, lowercase: true })
  @IsEmail()
  email: string;

  @Prop({ type: 'Number', required: true, default: 0 })
  attempt: number;

  @Prop({ type: 'String', required: true })
  email_verify_token: string;

  @Prop({ type: 'String' })
  verified_email_token: string;

  @Prop({ type: 'String' })
  verified_email_uuid: string;

  @Prop({ type: 'Date', default: Date.now() })
  created_date: Date;

  async doHashing(token: string): Promise<string> {
    return await hashString(token);
  }

  async verifyHashing(hashedToken: string, token: string): Promise<boolean> {
    return await isStringMatched(hashedToken, token);
  }
}

export const UserVerificationLoggerSchema = SchemaFactory.createForClass(
  UserVerificationLogger,
);
export type UserVerificationLoggerDocuement =
  HydratedDocument<UserVerificationLogger>;
