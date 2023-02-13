import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../shared/decorator/get-user.decorator';
import { IsPublic } from '../shared/decorator/public.decorator';
import { Roles } from '../shared/decorator/roles.decorator';
import { TypeOfUsers } from '../shared/decorator/user-type.decorator';
import { PaginationParams } from '../shared/dto/pagination-params';
import { ParseObjectIDPipe } from '../shared/pipe/parse-objectid.pipe';
import { UserRole, UserType } from '../shared/utils/enum';
import { User } from '../user/schemas/user.schema';
import { UpdateOrderDiscountDto, CreateOrderDiscountDto } from './dto/index.dto';
import { IRestaurantService, RESTAURANT_SERVICE } from './interfaces/IRestaurant.service';

@ApiTags('Restaurant')
@ApiBearerAuth()
@Controller('restaurant')
@IsPublic(false)
@Roles(UserRole.EMPLOYEE, UserRole.OWNER)
@TypeOfUsers(UserType.RESTAURANT_USER)
export class RestaurantController {
    constructor(
        @Inject(RESTAURANT_SERVICE) private readonly restaurantService: IRestaurantService
    ) { }

    @Get('/orders')
    public async getOrderList(
        @Query() paginationParams: PaginationParams,
        @GetUser() user: User
    ) {
        return this.restaurantService.getOrderList(user, paginationParams);
    }

    @Post('/order/:orderId/release')
    public async releaseOrder(
        @Param('orderId', ParseObjectIDPipe) orderId: string,
        @GetUser() user: User
    ) {
        return this.restaurantService.releaseOrder(orderId, user);
    }

    @Post('/order/:orderId/complete')
    public async completeOrder(
        @Param('orderId', ParseObjectIDPipe) orderId: string,
        @GetUser() user: User
    ) {
        return this.restaurantService.completeOrder(orderId, user);
    }

    @Post('order-discount')
    public async createOrderDiscount(
        @Body() createOrderDiscountDto: CreateOrderDiscountDto,
        @GetUser() user: User
    ) {
        return this.restaurantService.createOrderDiscount(createOrderDiscountDto, user);
    }

    @Get('order-discount')
    public async getOrderDiscount(
        @GetUser() user: User
    ) {
        return this.restaurantService.getOrderDiscount(user);
    }

    @Patch('order-discount/:discountId')
    public async updateOrderDiscount(
        @Param('discountId', ParseObjectIDPipe) discountId: string,
        @Body() updateOrderDiscountDto: UpdateOrderDiscountDto,
        @GetUser() user: User
    ) {
        return this.restaurantService.updateOrderDiscount(updateOrderDiscountDto, user, discountId);
    }

    @Delete('order-discount/:discountId')
    public async deleteOrderDiscount(
        @Param('discountId', ParseObjectIDPipe) discountId: string,
        @GetUser() user: User
    ) {
        return this.restaurantService.deleteOrderDiscount(user, discountId);
    }
}
