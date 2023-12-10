import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ITokenService } from './interfaces/IToken.service';
import { throwException } from '../shared/errors/all.exception';

@Injectable()
export class TokenService implements ITokenService {
  constructor(private jwtService: JwtService) {}

  async checkTokenValidity(
    token: string,
    options: JwtSignOptions,
  ): Promise<boolean> {
    try {
      await this.jwtService.verify(token, options);
      return false;
    } catch (error: any) {
      return true;
    }
  }

  async generateToken(payload: any, options: JwtSignOptions): Promise<string> {
    try {
      return await this.jwtService.sign(payload, options);
    } catch (error: any) {
      return throwException(error);
    }
  }
}
