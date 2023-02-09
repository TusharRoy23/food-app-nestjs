import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { isValidObjectId } from "../../shared/dto/custom.validators";

export class RatingDto {
    @ApiProperty()
    @IsNotEmpty()
    @isValidObjectId('restaurant_id')
    restaurant_id: string;

    @ApiProperty()
    @Min(1)
    @Max(5)
    @IsNumber()
    star: number;
}