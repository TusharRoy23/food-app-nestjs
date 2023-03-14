import { ApiProperty } from "@nestjs/swagger";
import { IsDefined } from "class-validator";
import { isValidNumber, isValidNumberRange, isValidDate, isValidDateRange } from "../../shared/dto/custom.validators";

export class CreateOrderDiscountDto {
    @ApiProperty()
    @IsDefined()
    @isValidNumber('max_amount')
    max_amount: number;

    @ApiProperty()
    @IsDefined()
    @isValidNumber('min_amount')
    @isValidNumberRange('max_amount')
    min_amount: number;

    @ApiProperty()
    @IsDefined()
    @isValidNumber('discount_rate')
    discount_rate: number;

    @ApiProperty()
    @IsDefined()
    @isValidDate('start_date')
    start_date: string;

    @ApiProperty()
    @IsDefined()
    @isValidDate('end_date')
    @isValidDateRange('start_date')
    end_date: string;
}