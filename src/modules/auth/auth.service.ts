import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashString } from '../shared/utils/hashing.utils';
import { throwException } from '../shared/errors/all.exception';
import { connectionName, UserRole } from '../shared/utils/enum';
import { UserResponse, TokenResponse } from '../shared/utils/response.utils';
import { User, UserDocument } from '../user/schemas/user.schema';
import { SignInCredentialsDto, SignUpCredentialsDto } from './dto';
import { IAuthService } from './interfaces/IAuth.service';
import { ISharedService, SHARED_SERVICE } from '../shared/interfaces/IShared.service';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @InjectModel(User.name, connectionName.MAIN_DB) private userModel: Model<UserDocument>,
        @Inject(SHARED_SERVICE) private readonly sharedService: ISharedService,
        private jwtService: JwtService
    ) { }

    async signIn(payload: SignInCredentialsDto): Promise<UserResponse> {
        try {
            const userData: User = await this.sharedService.getUserInfo(payload.email);
            const user = new User();
            const isPasswordMatched = await user.validatePasswords(userData.password, payload.password);
            if (!isPasswordMatched) {
                throw new NotFoundException('Username/Password not matched');
            }

            const refreshToken = await this.getRefreshToken(userData);
            await this.updateRefreshToken(refreshToken, payload.email);

            return {
                user: userData,
                accessToken: await this.getAccessToken(userData),
                refreshToken: refreshToken,
            };
        } catch (error: any) {
            return throwException(error);
        }
    }
    async createUser(signupDto: SignUpCredentialsDto): Promise<string> {
        try {
            const user = new User();
            const payload = {
                ...signupDto,
                password: await user.doPasswordHashing(signupDto.password),
                role: UserRole.NONE
            };
            await new this.userModel(payload).save();
            return 'User successfully created !'
        } catch (error: any) {
            return throwException(error);
        }
    }

    async getNewAccessAndRefreshToken(user: User): Promise<TokenResponse> {
        try {
            const userData: User = await this.sharedService.getUserInfo(user.email);
            const refreshToken = await this.getRefreshToken(userData);
            await this.updateRefreshToken(refreshToken, user.email);

            return {
                accessToken: await this.getAccessToken(userData),
                refreshToken: refreshToken
            }
        } catch (error: any) {
            return throwException(error);
        }
    }

    async logout(user: User): Promise<boolean> {
        try {
            const updated = await this.userModel.findOneAndUpdate({ email: user.email }, { hashedRefreshToken: '' }).exec();
            if (!updated) {
                throw new ForbiddenException('Not allowed');
            }
            return true;
        } catch (error) {
            return throwException(error);
        }
    }

    private async getAccessToken(payload: User): Promise<string> {
        try {
            const accessToken = await this.jwtService.sign({
                email: payload.email,
                name: payload.name,
            }, {
                secret: process.env.JWT_ACCESS_TOKEN_SECRET,
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
            });
            return accessToken;
        } catch (error: any) {
            return throwException(error);
        }

    }

    private async getRefreshToken(payload: User): Promise<string> {
        try {
            const refreshToken = await this.jwtService.sign({
                email: payload.email,
                name: payload.name,
            }, {
                secret: process.env.JWT_REFRESH_TOKEN_SECRET,
                expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
            });
            return refreshToken;
        } catch (error: any) {
            return throwException(error);
        }
    }

    private async updateRefreshToken(refreshToken: string, email: string) {
        try {
            if (refreshToken) {
                const hashedString = await hashString(refreshToken);
                await this.userModel.findOneAndUpdate({ email: email }, { hashedRefreshToken: hashedString });
                return;
            }
            throw new NotFoundException('No Refresh found.');
        } catch (error: any) {
            return throwException(error);
        }
    }
}
