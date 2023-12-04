import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt-strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh-strategy';
import { AUTH_SERVICE } from './interfaces/IAuth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserVerificationLogger, UserVerificationLoggerSchema } from './schemas/user-verification-logger.schema';
import { connectionName } from '../shared/utils/enum';

@Module({
  imports: [
    UserModule,
    RestaurantModule,
    JwtModule.register({}),
    PassportModule.register({}),
    MongooseModule.forFeature(
      [{ name: UserVerificationLogger.name, schema: UserVerificationLoggerSchema }],
      connectionName.MAIN_DB
    ),
  ],
  providers: [
    { useClass: AuthService, provide: AUTH_SERVICE },
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  controllers: [AuthController],
  exports: [MongooseModule]
})
export class AuthModule { }
