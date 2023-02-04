import { User } from "../../../modules/user/schemas/user.schema";
import { TokenResponse, UserResponse } from "../../shared/utils/response.utils";
import { SignInCredentialsDto, SignUpCredentialsDto } from "../dto/index";

export const AUTH_SERVICE = 'AUTH_SERVICE';

export interface IAuthService {
    signIn(payload: SignInCredentialsDto): Promise<UserResponse>;
    createUser(signupDto: SignUpCredentialsDto): Promise<string>;
    getNewAccessAndRefreshToken(user: User): Promise<TokenResponse>;
    logout(user: User): Promise<boolean>;
}