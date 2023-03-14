import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsMongoId, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CartItemDto {
    @ApiProperty()
    @IsDefined()
    @IsString()
    @IsMongoId({ message: 'Must be a valid Id' })
    id: string;

    @ApiProperty()
    @Min(1)
    @Max(50)
    @IsDefined()
    @IsNumber()
    qty: number;
}