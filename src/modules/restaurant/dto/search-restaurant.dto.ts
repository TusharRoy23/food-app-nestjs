import { IsString, MaxLength, MinLength } from "class-validator";

export class SearchRestaurantDto {
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    keyword: string
}