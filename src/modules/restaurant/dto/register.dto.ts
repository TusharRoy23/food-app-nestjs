import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { SignUpCredentialsDto } from "../../../modules/auth/dto/signup-credentials.dto";
import { isTime } from "../../shared/dto/custom.validators";

export class RegisterDto extends PartialType(SignUpCredentialsDto) {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    password: string;

    @ApiProperty()
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    restaurant_name: string;

    @ApiProperty()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    address: string;

    @ApiProperty()
    @IsString()
    @isTime('opening_time', { message: 'time must be valid' })
    opening_time: string;

    @ApiProperty()
    @IsString()
    @isTime('closing_time', { message: 'time must be valid' })
    closing_time: string;
}