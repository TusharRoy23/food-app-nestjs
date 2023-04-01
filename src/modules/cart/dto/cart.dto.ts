import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, ValidateNested } from 'class-validator';
import { CartItemDto } from './cart-item.dto';

export class CartDto {
  @ApiProperty()
  @IsDefined()
  @IsArray()
  @Type(() => CartItemDto)
  @ValidateNested({ each: true })
  cart_item: CartItemDto[];
}
