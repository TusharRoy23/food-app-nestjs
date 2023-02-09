import { ApiProperty } from "@nestjs/swagger";
import { isValidNumber, isValidNumberRange, isValidDate, isValidDateRange } from "../../shared/dto/custom.validators";

export class CreateOrderDiscountDto {
    @ApiProperty()
    @isValidNumber('max_amount')
    max_amount: number;

    @ApiProperty()
    @isValidNumber('min_amount')
    @isValidNumberRange('max_amount')
    min_amount: number;

    @ApiProperty()
    @isValidNumber('discount_rate')
    discount_rate: number;

    @ApiProperty()
    @isValidDate('start_date')
    start_date: string;

    @ApiProperty()
    @isValidDate('end_date')
    @isValidDateRange('start_date')
    end_date: string;
}