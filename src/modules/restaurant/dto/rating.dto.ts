import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class RatingDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    restaurant_id: string;

    @ApiProperty()
    @Min(1)
    @Max(5)
    @IsNumber()
    star: number;
}