import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { isValidObjectId } from "../../shared/dto/custom.validators";

export class CartItemDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @isValidObjectId('id')
    id: string;

    @ApiProperty()
    @Min(1)
    @Max(50)
    @IsNotEmpty()
    @IsNumber()
    qty: number;
}