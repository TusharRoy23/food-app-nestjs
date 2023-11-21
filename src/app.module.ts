import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { connectionName } from './modules/shared/utils/enum';
import {
  JwtAuthGuard,
  RolesGuard,
  UserTypeGuard,
} from './modules/shared/guards/index';
import { APP_GUARD } from '@nestjs/core';
import { AdminusersModule } from './modules/adminusers/adminusers.module';
import { ALL_MODULES } from './modules/index-module';

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGODB_URL}`, {
      connectionName: connectionName.MAIN_DB,
    }),
    ...ALL_MODULES,
    AdminusersModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: UserTypeGuard },
  ],
})
export class AppModule { }
