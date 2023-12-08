import { ITokenResponse, IUserResponse } from '../../shared/utils/response.utils';
import { SignInCredentialsDto, SignUpCredentialsDto } from '../dto/index';

export const AUTH_SERVICE = 'AUTH_SERVICE';

export interface IAuthService {
  signIn(payload: SignInCredentialsDto): Promise<IUserResponse>;
  createUser(signupDto: SignUpCredentialsDto): Promise<string>;
  getNewAccessAndRefreshToken(): Promise<ITokenResponse>;
  logout(): Promise<boolean>;
  sendEmailVerificationLink(email: string): Promise<string>;
  mailValidation(token: string): Promise<string>;
}
