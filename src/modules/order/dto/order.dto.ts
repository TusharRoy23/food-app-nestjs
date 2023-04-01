import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class OrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsMongoId({ message: 'Must be a valid Id' })
  id: string;
}
