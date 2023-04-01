import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../user/schemas/user.schema';

export const GetUser = createParamDecorator(
  (data: any, context: ExecutionContext): { email: string } => {
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;
    return user;
  },
);
