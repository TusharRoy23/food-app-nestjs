import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";
import { SignInCredentialsDto } from "./signin-credentials.dto";

export class SignUpCredentialsDto extends PartialType(SignInCredentialsDto) {
    @ApiProperty()
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    name: string;
}