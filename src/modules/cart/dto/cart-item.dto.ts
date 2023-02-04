import { IsNotEmpty, IsNumber, IsString, IsUUID, Max, Min } from "class-validator";

export class CartItemDto {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    uuid: string;

    @Min(1)
    @Max(50)
    @IsNotEmpty()
    @IsNumber()
    qty: number;
}