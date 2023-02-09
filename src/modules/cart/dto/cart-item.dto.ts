import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CartItemDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    id: string;

    @ApiProperty()
    @Min(1)
    @Max(50)
    @IsNotEmpty()
    @IsNumber()
    qty: number;
}