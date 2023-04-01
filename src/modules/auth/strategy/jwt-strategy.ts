import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { throwException } from '../../shared/errors/all.exception';
import { User } from '../../../modules/user/schemas/user.schema';
import {
  IRequestService,
  REQUEST_SERVICE,
  SHARED_SERVICE,
  ISharedService,
} from '../../shared/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access-jwt') {
  constructor(
    @Inject(SHARED_SERVICE) private readonly sharedService: ISharedService,
    @Inject(REQUEST_SERVICE) private readonly requestService: IRequestService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: User): Promise<User> {
    try {
      const user = payload;
      const userData = await this.sharedService.getUserInfo(user.email);
      if (!Object.keys(userData).length || !userData.login_status) {
        throw new UnauthorizedException('Request unauthorized');
      }
      this.requestService.setUserInfo(userData);
      return userData;
    } catch (error: any) {
      return throwException(error);
    }
  }
}
