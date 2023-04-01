import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';

export const throwException = (error: any) => {
  if (error instanceof NotFoundException)
    throw new NotFoundException(`${error.message}`);
  else if (error instanceof BadRequestException)
    throw new BadRequestException(`${error.message}`);
  else if (error instanceof UnauthorizedException)
    throw new UnauthorizedException(`${error.message}`);
  else if (error instanceof ForbiddenException)
    throw new ForbiddenException(`${error.message}`);
  else if (error instanceof ConflictException)
    throw new ConflictException(`${error.message}`);
  else if (error instanceof MethodNotAllowedException)
    throw new MethodNotAllowedException(`${error.message}`);
  else if (error instanceof RequestTimeoutException)
    throw new RequestTimeoutException(`${error.message}`);
  else throw new InternalServerErrorException(`${error.message}`);
};
