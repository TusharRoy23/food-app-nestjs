import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, MinLength, MaxLength, IsOptional, Min, IsNotEmpty, Max, IsNumber, IsDefined } from "class-validator";
import { isValidEnum, isValidNumber } from "../../shared/dto/custom.validators";
import { ItemType, MealType, MealState, MealFlavor, ItemStatus } from "../../shared/utils/enum";

export class CreateItemDto {
    @ApiProperty()
    @IsDefined()
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    name: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    icon: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    image: string;

    @ApiProperty({ enum: ItemType, default: ItemType.FOOD })
    @IsDefined()
    @isValidEnum('item_type', ItemType)
    item_type: string;

    @ApiProperty({ enum: MealType, default: MealType.DAILYFOOD })
    @IsDefined()
    @isValidEnum('meal_type', MealType)
    meal_type: string;

    @ApiProperty({ enum: MealState, default: MealState.HOT })
    @IsDefined()
    @isValidEnum('meal_state', MealState)
    meal_state: string;

    @ApiProperty({ enum: MealFlavor, default: MealFlavor.SPICY })
    @IsDefined()
    @isValidEnum('meal_flavor', MealFlavor)
    meal_flavor: string;

    @ApiProperty({ type: Number })
    @IsDefined()
    @Min(0)
    @IsNotEmpty()
    @isValidNumber('price')
    price: number;

    @ApiProperty({ enum: ItemStatus, default: ItemStatus.ACTIVE })
    @IsDefined()
    @isValidEnum('item_status', ItemStatus)
    item_status: string;

    @ApiProperty({ type: Number })
    @IsDefined()
    @Min(0)
    @IsNotEmpty()
    @isValidNumber('price')
    discount_rate: number;

    @ApiProperty({ type: Number })
    @IsDefined()
    @Max(100)
    @IsNumber()
    max_order_qty: number;

    @ApiProperty({ type: Number })
    @IsDefined()
    @Min(1)
    @IsNumber()
    min_order_qty: number;
}