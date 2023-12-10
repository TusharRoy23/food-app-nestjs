import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../shared/decorator/public.decorator';
import { ResponseMessage } from '../shared/decorator/response-msg.decorator';
import { JwtRefreshTokenGuard } from '../shared/guards/jwt-refresh-token.guard';
import {
  RefreshTokenDto,
  SignInCredentialsDto,
  SignUpCredentialsDto,
} from './dto';
import { AUTH_SERVICE, IAuthService } from './interfaces/IAuth.service';
import { ValidationMailDto } from './dto/validation-mail.dto';
import { IUser } from "../shared/interfaces/shared.model";

@ApiTags('Auth')
@Controller('auth')
@SerializeOptions({
  excludePrefixes: ['_'],
})
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: IAuthService,
  ) { }

  @IsPublic(true)
  @Post('/signin')
  public async signIn(
    @Body() signInCredentialDto: SignInCredentialsDto,
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    return await this.authService.signIn(signInCredentialDto);
  }

  @IsPublic(true)
  @Post('/signup')
  public async signUp(
    @Body() signUpCredentialDto: SignUpCredentialsDto,
  ): Promise<string> {
    return this.authService.createUser(signUpCredentialDto);
  }

  @IsPublic(true)
  @UseGuards(JwtRefreshTokenGuard)
  @Post('/refresh-token')
  public async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.getNewAccessAndRefreshToken();
  }

  @IsPublic(false)
  @ApiBearerAuth()
  @Post('/logout')
  @ResponseMessage('Logout successfully')
  public async logout() {
    return this.authService.logout();
  }

  @IsPublic(true)
  @Post('/send-validation-mail')
  @ResponseMessage('Mail Sent')
  public async resendValidationMail(
    @Body() validationMailDto: ValidationMailDto,
  ) {
    return this.authService.sendEmailVerificationLink(validationMailDto.email);
  }

  @IsPublic(true)
  @Get('/email-validation/:token')
  public async mailValidation(@Param('token', ParseUUIDPipe) token: string) {
    return this.authService.mailValidation(token);
  }
}
