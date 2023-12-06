import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TokenService } from './token.service';
import { TOKEN_SERVICE } from './interfaces/IToken.service';

const tokenService = { provide: TOKEN_SERVICE, useClass: TokenService }

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({}),
  ],
  providers: [
    tokenService
  ],
  exports: [
    JwtModule,
    PassportModule,
    tokenService
  ]
})
export class TokenModule { }
