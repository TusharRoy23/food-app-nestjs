import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { connectionName } from '../shared/utils/enum';
import { UserSchema, User } from './schemas/user.schema';
import { UserService } from './user.service';
import { Adminuser, AdminuserSchema } from './schemas/adminuser.schema';

@Module({
  providers: [UserService],
  imports: [
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Adminuser.name, schema: AdminuserSchema }
      ],
      connectionName.MAIN_DB,
    ),
  ],
  exports: [MongooseModule],
})
export class UserModule { }
