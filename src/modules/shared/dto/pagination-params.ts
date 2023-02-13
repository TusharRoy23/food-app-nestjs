import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsMongoId, IsNumber, Min } from "class-validator";

export class PaginationParams {
    @ApiPropertyOptional()
    @IsOptional()
    @IsMongoId()
    startId: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    page: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    pageSize: number;
}