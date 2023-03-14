import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsMongoId, IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class RatingDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsDefined()
    @IsMongoId({ message: 'Must be a valid Id' })
    restaurant_id: string;

    @ApiProperty()
    @IsDefined()
    @Min(1)
    @Max(5)
    @IsNumber()
    star: number;
}