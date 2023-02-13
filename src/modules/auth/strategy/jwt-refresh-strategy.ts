import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../../user/schemas/user.schema";
import { throwException } from "../../shared/errors/all.exception";
import { Request } from "express";
import { SHARED_SERVICE, ISharedService } from "../../shared/interfaces/IShared.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(
        @Inject(SHARED_SERVICE) private readonly sharedService: ISharedService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('token'),
            secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
            passReqToCallback: true,
        })
    }

    async validate(req: Request, user: User): Promise<User> {
        try {
            const userData: User = await this.sharedService.getUserInfo(user.email);
            const isValid: boolean = await this.sharedService.isValidRefreshToken(req.body?.token, userData.hashedRefreshToken);
            if (!isValid || !userData.login_status) {
                throw new ForbiddenException('Not allowed');
            }
            return userData;
        } catch (error: any) {
            return throwException(error);
        }
    }
}