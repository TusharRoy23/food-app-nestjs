import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class SearchRestaurantDto {
    @ApiProperty()
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    keyword: string
}