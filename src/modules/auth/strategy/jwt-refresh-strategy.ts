import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../user/schemas/user.schema';
import { throwException } from '../../shared/errors/all.exception';
import { Request } from 'express';
import {
  IRequestService,
  REQUEST_SERVICE,
  SHARED_SERVICE,
  ISharedService,
} from '../../shared/interfaces';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @Inject(SHARED_SERVICE) private readonly sharedService: ISharedService,
    @Inject(REQUEST_SERVICE) private readonly requestService: IRequestService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, user: User): Promise<User> {
    try {
      const userData: User = await this.sharedService.getUserInfo(user.email);
      if (!userData?.login_status && !userData?.hashedRefreshToken) {
        throw new ForbiddenException('Not allowed');
      }
      const isValid: boolean = await this.sharedService.isValidRefreshToken(
        req.body?.token,
        userData?.hashedRefreshToken,
      );
      if (!isValid) {
        throw new BadRequestException('Invalid Request');
      }
      this.requestService.setUserInfo(userData);
      return userData;
    } catch (error: any) {
      return throwException(error);
    }
  }
}
