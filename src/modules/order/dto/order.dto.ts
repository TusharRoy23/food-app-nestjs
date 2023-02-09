import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { isValidObjectId } from "../../shared/dto/custom.validators";

export class OrderDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @isValidObjectId('id')
    id: string;
}