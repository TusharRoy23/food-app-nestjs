import { ApiProperty } from "@nestjs/swagger"
import { IsDefined, IsEmail, IsString, MaxLength, MinLength } from "class-validator"

export class SignInCredentialsDto {
    @ApiProperty({ default: 'tushar@gmm.com' })
    @IsDefined()
    @IsEmail()
    email: string

    @ApiProperty({ default: 'tushar' })
    @IsDefined()
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    password: string
}