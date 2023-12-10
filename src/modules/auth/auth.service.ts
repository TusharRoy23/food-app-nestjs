import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashString } from '../shared/utils/hashing.utils';
import { throwException } from '../shared/errors/all.exception';
import { connectionName, CurrentStatus, UserRole } from '../shared/utils/enum';
import { IUserResponse, ITokenResponse } from '../shared/utils/response.utils';
import { User, UserDocument } from '../user/schemas/user.schema';
import { SignInCredentialsDto, SignUpCredentialsDto } from './dto';
import { IAuthService } from './interfaces/IAuth.service';
import {
  ISharedService,
  SHARED_SERVICE,
} from '../shared/interfaces/IShared.service';
import {
  IRequestService,
  REQUEST_SERVICE,
} from '../shared/interfaces/IRequest.service';
import { IMailService, MAIL_SERVICE } from '../mail/interfaces/IMail.service';
import { IUser } from "../shared/interfaces/shared.model";
import {
  UserVerificationLogger,
  UserVerificationLoggerDocuement,
} from './schemas/user-verification-logger.schema';
import {
  ITokenService,
  TOKEN_SERVICE,
} from '../token/interfaces/IToken.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectModel(User.name, connectionName.MAIN_DB)
    private userModel: Model<UserDocument>,
    @InjectModel(UserVerificationLogger.name, connectionName.MAIN_DB)
    private userVerificationLoggerModel: Model<UserVerificationLoggerDocuement>,
    @Inject(SHARED_SERVICE) private readonly sharedService: ISharedService,
    @Inject(REQUEST_SERVICE) private readonly requestService: IRequestService,
    @Inject(MAIL_SERVICE) private readonly mailService: IMailService,
    @Inject(TOKEN_SERVICE) private readonly tokenService: ITokenService,
  ) { }

  async signIn(payload: SignInCredentialsDto): Promise<IUserResponse> {
    try {
      const userData: IUser = await this.sharedService.getUserInfo(
        payload.email,
      );
      if (
        userData.current_status == CurrentStatus.NOT_VERIFIED ||
        userData.current_status == CurrentStatus.INACTIVE
      ) {
        throw new ForbiddenException({ message: 'User Not Found!' });
      }
      const user = new User();
      const isPasswordMatched = await user.validatePasswords(
        userData.password,
        payload.password,
      );
      if (!isPasswordMatched) {
        throw new NotFoundException('Username/Password not matched');
      }
      await this.updateUserStatus(userData, { login_status: true });
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
        role: UserRole.NONE,
      };
      const newUser: IUser = await this.userModel.create(payload);
      await this.sendEmailVerificationLink(newUser.email);
      return 'User successfully created !';
    } catch (error: any) {
      return throwException(error);
    }
  }

  async getNewAccessAndRefreshToken(): Promise<ITokenResponse> {
    try {
      const user: User = this.getUserDetailsFromRequest();
      const userData: IUser = await this.sharedService.getUserInfo(user.email);
      const refreshToken = await this.getRefreshToken(userData);
      await this.updateRefreshToken(refreshToken, user.email);

      return {
        accessToken: await this.getAccessToken(userData),
        refreshToken: refreshToken,
      };
    } catch (error: any) {
      return throwException(error);
    }
  }

  async logout(): Promise<boolean> {
    try {
      const user: User = this.getUserDetailsFromRequest();
      const updated = await this.userModel
        .findOneAndUpdate(
          { email: user.email, login_status: true },
          { hashedRefreshToken: '', login_status: false },
          { new: true },
        )
        .exec();
      if (!updated) {
        throw new ForbiddenException('Not allowed');
      }
      await this.updateUserStatus(user, { login_status: false });
      return true;
    } catch (error) {
      return throwException(error);
    }
  }

  async sendEmailVerificationLink(email: string): Promise<string> {
    try {
      const userInfo = await this.sharedService.getUserInfo(email);
      if (userInfo.current_status !== CurrentStatus.NOT_VERIFIED) {
        throw new BadRequestException({ message: 'User is already verified.' });
      }
      const result = await this.generateValidationToken(email);
      this.sendUserConfirmationMail(email, 'Welcome to Food App!', {
        name: userInfo.name,
        url: `${process.env.APP_HOST}${result.validation_token}/`,
      });
      return Promise.resolve('Mail Sent !');
    } catch (error: any) {
      return throwException(error);
    }
  }

  async mailValidation(token: string): Promise<string> {
    try {
      const logResult: UserVerificationLogger =
        await this.userVerificationLoggerModel
          .findOne({ verified_email_uuid: token })
          .exec();
      if (!logResult) {
        throw new BadRequestException({ message: 'Invalid Token.' });
      }

      const userInfo: IUser = await this.sharedService.getUserInfo(
        logResult.email,
      );
      if (userInfo.current_status !== CurrentStatus.NOT_VERIFIED) {
        throw new BadRequestException({ message: 'User is already verified.' });
      }

      const isExpired = await this.tokenService.checkTokenValidity(
        logResult.verified_email_token,
        { secret: process.env.JWT_GENERATE_ACCOUNT_VERIFY_SECRET },
      );
      if (isExpired) {
        throw new BadRequestException({ message: 'Token is expired.' });
      }

      await this.updateUserStatus(userInfo, {
        current_status: CurrentStatus.VERIFIED,
      });
      return Promise.resolve('User has been verified.');
    } catch (error: any) {
      return throwException(error);
    }
  }

  private async generateValidationToken(
    email: string,
  ): Promise<{ validation_token: string }> {
    try {
      const logResult: UserVerificationLogger =
        await this.userVerificationLoggerModel.findOne({ email }).exec();
      if (logResult?._id && logResult?.email_verify_token) {
        const isExpired = await this.tokenService.checkTokenValidity(
          logResult.email_verify_token,
          {
            secret: process.env.JWT_GENERATE_ACCOUNT_VERIFY_EMAIL_LINK_SECRET,
          },
        );
        if (!isExpired) {
          throw new BadRequestException({ message: 'please wait a bit.' });
        }
      }

      // re-send email token
      const mailToken = await this.tokenService.generateToken(
        {
          email: email,
          timer: Date.now(),
        },
        {
          secret: process.env.JWT_GENERATE_ACCOUNT_VERIFY_EMAIL_LINK_SECRET,
          expiresIn:
            process.env.JWT_GENERATE_ACCOUNT_VERIFY_EMAIL_LINK_DURATION,
        },
      );

      // email validation link token
      const validationToken = await this.tokenService.generateToken(
        {
          email: email,
          timer: Date.now(),
        },
        {
          secret: process.env.JWT_GENERATE_ACCOUNT_VERIFY_SECRET,
          expiresIn: process.env.JWT_GENERATE_ACCOUNT_VERIFY_DURATION,
        },
      );

      const result: UserVerificationLogger =
        await this.userVerificationLoggerModel
          .findOneAndUpdate(
            { email: email },
            {
              email_verify_token: mailToken,
              verified_email_token: validationToken,
              verified_email_uuid: uuidv4(),
              attempt: logResult?.attempt || 1 + 1,
            },
            {
              upsert: true,
              new: true,
            },
          )
          .exec();

      return {
        validation_token: result.verified_email_uuid,
      };
    } catch (error: any) {
      return throwException(error);
    }
  }

  private async sendUserConfirmationMail(
    email: string,
    subject: string,
    content: any,
  ) {
    try {
      await this.mailService.sendUserConfirmationMail(email, {
        subject: subject,
        data: content,
      });
    } catch (error: any) {
      return throwException(error);
    }
  }

  private async getAccessToken(payload: IUser): Promise<string> {
    try {
      return await this.tokenService.generateToken(
        {
          email: payload.email,
          name: payload.name,
        },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        },
      );
    } catch (error: any) {
      return throwException(error);
    }
  }

  private async getRefreshToken(payload: IUser): Promise<string> {
    try {
      return await this.tokenService.generateToken(
        {
          email: payload.email,
          name: payload.name,
        },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        },
      );
    } catch (error: any) {
      return throwException(error);
    }
  }

  private async updateRefreshToken(refreshToken: string, email: string) {
    try {
      if (refreshToken) {
        const hashedString = await hashString(refreshToken);
        await this.userModel
          .findOneAndUpdate(
            { email: email },
            { hashedRefreshToken: hashedString },
          )
          .exec();
        return;
      }
      throw new NotFoundException('No Refresh found.');
    } catch (error: any) {
      return throwException(error);
    }
  }

  private async updateUserStatus(
    user: IUser,
    payload: { current_status?: string; login_status?: boolean },
  ): Promise<User> {
    try {
      return await this.userModel
        .findOneAndUpdate({ _id: user._id }, payload, { new: true })
        .exec();
    } catch (error: any) {
      return throwException(error);
    }
  }

  private getUserDetailsFromRequest(): User {
    return this.requestService.getUserInfo();
  }
}
