import mongoose from 'mongoose';

export interface IUserVerificationLogger {
  _id: mongoose.Types.ObjectId;
  email: string;
  attempt: number;
  email_verify_token: string;
  verified_email_token: string;
  verified_email_uuid: string;
  created_date: Date;
}
