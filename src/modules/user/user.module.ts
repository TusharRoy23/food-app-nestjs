import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { connectionName } from '../shared/utils/enum';
import { UserSchema, User } from './schemas/user.schema';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      connectionName.MAIN_DB,
    ),
  ],
  exports: [MongooseModule],
})
export class UserModule {}
