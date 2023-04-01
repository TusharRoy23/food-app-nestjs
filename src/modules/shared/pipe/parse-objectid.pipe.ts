import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

export class ParseObjectIDPipe implements PipeTransform<string> {
  transform(value: any): string {
    const validObjId = Types.ObjectId.isValid(value);
    if (!validObjId) {
      throw new BadRequestException('Must be a valid Id');
    }
    return value;
  }
}
