import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "../../src/modules/shared/decorator/public.decorator";
import { ROLES_KEY } from "../../src/modules/shared/decorator/roles.decorator";
import { UserRole } from "../../src/modules/shared/utils/enum";

export class FakeRoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {
        console.log('reflector: ', reflector);

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        console.log('reflector: ', this.reflector);
        console.log('getClass: ', context.getClass());
        console.log('getHandler: ', context.getHandler());
        return true;
    }

}

export class FakeJwtAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        console.log('reflector: ', this.reflector);
        console.log('getClass: ', context.getClass());
        console.log('getHandler: ', context.getHandler());
        return true;
    }
}