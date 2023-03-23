import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRole } from "../../src/modules/shared/utils/enum";
import { User } from "../../src/modules/user/schemas/user.schema";
import { getUserInfo } from "./generate";

export class FakeJwtStrategy extends PassportStrategy(Strategy, 'access-jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'JWT_access_Token'
        });
    }

    async validate(user: User) {
        return user;
    }
}