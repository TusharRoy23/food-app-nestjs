import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AUTH_SERVICE } from '../interfaces/IAuth.service';
import { JwtRefreshStrategy } from '../strategy/jwt-refresh-strategy';
import { JwtStrategy } from '../strategy/jwt-strategy';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { useExisting: AuthService, provide: AUTH_SERVICE },
        JwtStrategy,
        JwtRefreshStrategy,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
