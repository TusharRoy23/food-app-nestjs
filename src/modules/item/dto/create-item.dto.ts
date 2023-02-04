import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, MaxLength, IsOptional, Min, IsNotEmpty, Max, IsNumber } from "class-validator";
import { isValidEnum, isValidNumber } from "../../shared/dto/custom.validators";
import { ItemType, MealType, MealState, MealFlavor, ItemStatus } from "../../shared/utils/enum";

export class CreateItemDto {
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @ApiProperty()
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    icon: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    image: string;

    @isValidEnum('item_type', ItemType)
    @ApiProperty()
    item_type: string;

    @isValidEnum('meal_type', MealType)
    @ApiProperty()
    meal_type: string;

    @isValidEnum('meal_state', MealState)
    @ApiProperty()
    meal_state: string;

    @isValidEnum('meal_flavor', MealFlavor)
    @ApiProperty()
    meal_flavor: string;

    @Min(0)
    @IsNotEmpty()
    @isValidNumber('price')
    @ApiProperty()
    price: number;

    @isValidEnum('item_status', ItemStatus)
    @ApiProperty()
    item_status: string;

    @Min(0)
    @IsNotEmpty()
    @isValidNumber('price')
    @ApiProperty()
    discount_rate: number;

    @Max(100)
    @IsNumber()
    @ApiProperty()
    max_order_qty: number;

    @Min(1)
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    min_order_qty: number;
}