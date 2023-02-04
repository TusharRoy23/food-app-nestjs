import { IsNotEmpty, IsNumber, IsUUID, Max, Min } from "class-validator";

export class RatingDto {
    @IsNotEmpty()
    @IsUUID()
    Restaurant_uuid: string;

    @Min(1)
    @Max(5)
    @IsNumber()
    star: number;
}