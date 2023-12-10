import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RatingDto } from '../restaurant/dto/rating.dto';
import { IsPublic } from '../shared/decorator/public.decorator';
import { Roles } from '../shared/decorator/roles.decorator';
import { TypeOfUsers } from '../shared/decorator/user-type.decorator';
import { PaginationParams } from '../shared/dto/pagination-params';
import { ParseObjectIDPipe } from '../shared/pipe/parse-objectid.pipe';
import { UserRole, UserType } from '../shared/utils/enum';
import { IOrderService, ORDER_SERVICE } from './interfaces/IOrder.service';

@ApiTags('Order')
@ApiBearerAuth()
@Controller('order')
@IsPublic(false)
@Roles(UserRole.NONE)
@TypeOfUsers(UserType.VISITOR)
@SerializeOptions({
  excludePrefixes: ['_'],
})
export class OrderController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly orderService: IOrderService,
  ) {}

  @Post('/:cartId')
  public async create(@Param('cartId', ParseObjectIDPipe) cartId: string) {
    return this.orderService.submitOrder(cartId);
  }

  @Get('/list')
  public async retrieve(@Query() paginationParams: PaginationParams) {
    return this.orderService.getOrdersByUser(paginationParams);
  }

  @Post('restaurant/rating')
  public async giveRating(@Body() ratingDto: RatingDto) {
    return this.orderService.giveRating(ratingDto);
  }
}
