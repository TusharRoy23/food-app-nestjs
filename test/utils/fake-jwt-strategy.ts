import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../src/modules/user/schemas/user.schema';

export class FakeJwtStrategy extends PassportStrategy(Strategy, 'access-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'JWT_access_Token',
    });
  }

  async validate(user: User) {
    return user;
  }
}
