import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator"

export class SignInCredentialsDto {
    @ApiProperty({ default: 'tushar@gm.com' })
    @IsEmail()
    email: string

    @ApiProperty({ default: 'tushar' })
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    password: string
}