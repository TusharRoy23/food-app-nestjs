import { JwtSignOptions } from "@nestjs/jwt";

export const TOKEN_SERVICE = 'TOKEN_SERVICE';

export interface ITokenService {
    checkTokenValidity(token: string, options: JwtSignOptions): Promise<boolean>;
    generateToken(payload: any, options: JwtSignOptions): Promise<string>;
}