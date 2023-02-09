import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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
    @ApiPropertyOptional()
    icon: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    image: string;

    @isValidEnum('item_type', ItemType)
    @ApiProperty({ enum: ItemType, default: ItemType.FOOD })
    item_type: string;

    @isValidEnum('meal_type', MealType)
    @ApiProperty({ enum: MealType, default: MealType.DAILYFOOD })
    meal_type: string;

    @isValidEnum('meal_state', MealState)
    @ApiProperty({ enum: MealState, default: MealState.HOT })
    meal_state: string;

    @isValidEnum('meal_flavor', MealFlavor)
    @ApiProperty({ enum: MealFlavor, default: MealFlavor.SPICY })
    meal_flavor: string;

    @Min(0)
    @IsNotEmpty()
    @isValidNumber('price')
    @ApiProperty({ type: Number })
    price: number;

    @isValidEnum('item_status', ItemStatus)
    @ApiProperty({ enum: ItemStatus, default: ItemStatus.ACTIVE })
    item_status: string;

    @Min(0)
    @IsNotEmpty()
    @isValidNumber('price')
    @ApiProperty({ type: Number })
    discount_rate: number;

    @Max(100)
    @IsNumber()
    @ApiProperty({ type: Number })
    max_order_qty: number;

    @Min(1)
    @IsNumber()
    @ApiProperty({ type: Number })
    min_order_qty: number;
}