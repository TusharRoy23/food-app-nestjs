import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  IsEmail,
} from 'class-validator';

export class SignUpCredentialsDto {
  @ApiProperty({ default: 'tushar@gmm.com' })
  @IsDefined()
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'tushar' })
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  password: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  name: string;
}
