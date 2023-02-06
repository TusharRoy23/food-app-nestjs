import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { USER_TYPE_KEY } from "../decorator/user-type.decorator";
import { UserType } from "../utils/enum";

@Injectable()
export class UserTypeGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const userType = this.reflector.getAllAndOverride<UserType>(USER_TYPE_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!userType) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        return user?.user_type === userType;
    }
}