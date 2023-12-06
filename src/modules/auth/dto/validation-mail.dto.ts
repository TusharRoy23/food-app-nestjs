import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail } from "class-validator";

export class ValidationMailDto {
    @ApiProperty({ default: 'tushar+@binate-solutions.com' })
    @IsDefined()
    @IsEmail()
    email: string;
}