import { TokenResponse, UserResponse } from '../../shared/utils/response.utils';
import { SignInCredentialsDto, SignUpCredentialsDto } from '../dto/index';

export const AUTH_SERVICE = 'AUTH_SERVICE';

export interface IAuthService {
  signIn(payload: SignInCredentialsDto): Promise<UserResponse>;
  createUser(signupDto: SignUpCredentialsDto): Promise<string>;
  getNewAccessAndRefreshToken(): Promise<TokenResponse>;
  logout(): Promise<boolean>;
}
