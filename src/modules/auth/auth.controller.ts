import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../shared/decorator/get-user.decorator';
import { IsPublic } from '../shared/decorator/public.decorator';
import { ResponseMessage } from '../shared/decorator/response-msg.decorator';
import { JwtRefreshTokenGuard } from '../shared/guards/jwt-refresh-token.guard';
import { User } from '../user/schemas/user.schema';
import { RefreshTokenDto, SignInCredentialsDto, SignUpCredentialsDto } from './dto';
import { AUTH_SERVICE, IAuthService } from './interfaces/IAuth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        @Inject(AUTH_SERVICE) private readonly authService: IAuthService
    ) { }

    @IsPublic(true)
    @Post('/signin')
    public async signIn(
        @Body() signInCredentialDto: SignInCredentialsDto
    ): Promise<{ user: User, accessToken: string, refreshToken: string }> {
        return await this.authService.signIn(signInCredentialDto);
    }

    @IsPublic(true)
    @Post('/signup')
    public async signUp(
        @Body() signUpCredentialDto: SignUpCredentialsDto
    ): Promise<string> {
        return this.authService.createUser(signUpCredentialDto);
    }

    @IsPublic(true)
    @UseGuards(JwtRefreshTokenGuard)
    @Post('/refresh-token')
    public async refreshToken(
        @Body() refreshTokenDto: RefreshTokenDto,
        @GetUser() user: User
    ) {
        return this.authService.getNewAccessAndRefreshToken(user);
    }

    @IsPublic(false)
    @ApiBearerAuth()
    @Post('/logout')
    @ResponseMessage('Logout successfully')
    public async logout(
        @GetUser() user: User
    ) {
        return this.authService.logout(user);
    }
}
