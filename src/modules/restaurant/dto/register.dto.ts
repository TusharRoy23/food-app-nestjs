import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { SignUpCredentialsDto } from "../../../modules/auth/dto/signup-credentials.dto";
import { isTime, isRequired } from "../../shared/dto/custom.validators";

export class RegisterDto extends PartialType(SignUpCredentialsDto) {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsDefined()
    // @isRequired('password')
    @MinLength(3)
    @MaxLength(10)
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(15)
    restaurant_name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    address: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @isTime('opening_time', { message: 'time must be valid' })
    opening_time: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @isTime('closing_time', { message: 'time must be valid' })
    closing_time: string;
}