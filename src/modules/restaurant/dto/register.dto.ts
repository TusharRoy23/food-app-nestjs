import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { isTime } from "../../shared/dto/custom.validators";

export class RegisterDto {
    @ApiProperty({ default: 'restaurant@gm.com' })
    @IsEmail()
    @IsDefined()
    email: string;

    @ApiProperty()
    @IsString()
    @IsDefined()
    @MinLength(3)
    @MaxLength(10)
    password: string;

    @ApiProperty({ default: 'New restaurant' })
    @IsString()
    @IsDefined()
    @MinLength(3)
    @MaxLength(15)
    restaurant_name: string;

    @ApiProperty({ default: 'Dhaka, bangladesh' })
    @IsString()
    @IsDefined()
    @MinLength(3)
    @MaxLength(50)
    address: string;

    @ApiProperty({ default: '08:08:08' })
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    @isTime('opening_time', { message: 'time must be valid' })
    opening_time: string;

    @ApiProperty({ default: '12:00:00' })
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    @isTime('closing_time', { message: 'time must be valid' })
    closing_time: string;

    @ApiProperty({ default: 'Rahsut' })
    @IsDefined()
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    name: string;
}