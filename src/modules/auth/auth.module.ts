import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt-strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh-strategy';
import { AUTH_SERVICE } from './interfaces/IAuth.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserVerificationLogger,
  UserVerificationLoggerSchema,
} from './schemas/user-verification-logger.schema';
import { connectionName } from '../shared/utils/enum';
import { TokenModule } from '../token/token.module';

const authService = { useClass: AuthService, provide: AUTH_SERVICE };
@Module({
  imports: [
    UserModule,
    PassportModule,
    TokenModule,
    MongooseModule.forFeature(
      [
        {
          name: UserVerificationLogger.name,
          schema: UserVerificationLoggerSchema,
        },
      ],
      connectionName.MAIN_DB,
    ),
  ],
  providers: [authService, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
  exports: [authService, MongooseModule],
})
export class AuthModule {}
