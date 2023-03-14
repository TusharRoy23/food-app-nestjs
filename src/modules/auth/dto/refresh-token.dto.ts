import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
    @ApiProperty()
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    token: string
}