import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";

export class ParseObjectIDPipe implements PipeTransform<string> {
    transform(value: any, metadata: ArgumentMetadata): string {
        const validObjId = Types.ObjectId.isValid(value);
        if (!validObjId) {
            throw new BadRequestException('Invalid ObjectId');
        }
        return value;
    }

}