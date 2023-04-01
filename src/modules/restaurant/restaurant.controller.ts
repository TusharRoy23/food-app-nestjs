import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../shared/decorator/public.decorator';
import { Roles } from '../shared/decorator/roles.decorator';
import { TypeOfUsers } from '../shared/decorator/user-type.decorator';
import { PaginationParams } from '../shared/dto/pagination-params';
import { ParseObjectIDPipe } from '../shared/pipe/parse-objectid.pipe';
import { UserRole, UserType } from '../shared/utils/enum';
import {
  UpdateOrderDiscountDto,
  CreateOrderDiscountDto,
} from './dto/index.dto';
import {
  IRestaurantService,
  RESTAURANT_SERVICE,
} from './interfaces/IRestaurant.service';

@ApiTags('Restaurant')
@ApiBearerAuth()
@Controller('restaurant')
@IsPublic(false)
@Roles(UserRole.EMPLOYEE, UserRole.OWNER)
@TypeOfUsers(UserType.RESTAURANT_USER)
export class RestaurantController {
  constructor(
    @Inject(RESTAURANT_SERVICE)
    private readonly restaurantService: IRestaurantService,
  ) {}

  @Get('/orders')
  public async getOrderList(@Query() paginationParams: PaginationParams) {
    return this.restaurantService.getOrderList(paginationParams);
  }

  @Post('/order/:orderId/release')
  public async releaseOrder(
    @Param('orderId', ParseObjectIDPipe) orderId: string,
  ) {
    return this.restaurantService.releaseOrder(orderId);
  }

  @Post('/order/:orderId/complete')
  public async completeOrder(
    @Param('orderId', ParseObjectIDPipe) orderId: string,
  ) {
    return this.restaurantService.completeOrder(orderId);
  }

  @Post('order-discount')
  public async createOrderDiscount(
    @Body() createOrderDiscountDto: CreateOrderDiscountDto,
  ) {
    return this.restaurantService.createOrderDiscount(createOrderDiscountDto);
  }

  @Get('order-discount')
  public async getOrderDiscount() {
    return this.restaurantService.getOrderDiscount();
  }

  @Patch('order-discount/:discountId')
  public async updateOrderDiscount(
    @Param('discountId', ParseObjectIDPipe) discountId: string,
    @Body() updateOrderDiscountDto: UpdateOrderDiscountDto,
  ) {
    return this.restaurantService.updateOrderDiscount(
      updateOrderDiscountDto,
      discountId,
    );
  }

  @Delete('order-discount/:discountId')
  public async deleteOrderDiscount(
    @Param('discountId', ParseObjectIDPipe) discountId: string,
  ) {
    return this.restaurantService.deleteOrderDiscount(discountId);
  }
}
