import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RatingDto } from '../restaurant/dto/rating.dto';
import { GetUser } from '../shared/decorator/get-user.decorator';
import { IsPublic } from '../shared/decorator/public.decorator';
import { Roles } from '../shared/decorator/roles.decorator';
import { TypeOfUsers } from '../shared/decorator/user-type.decorator';
import { ParseObjectIDPipe } from '../shared/pipe/parse-objectid.pipe';
import { UserRole, UserType } from '../shared/utils/enum';
import { User } from '../user/schemas/user.schema';
import { IOrderService, ORDER_SERVICE } from './interfaces/IOrder.service';

@ApiTags('Order')
@ApiBearerAuth()
@Controller('order')
@IsPublic(false)
@Roles(UserRole.NONE)
@TypeOfUsers(UserType.VISITOR)
export class OrderController {
    constructor(
        @Inject(ORDER_SERVICE) private readonly orderService: IOrderService
    ) { }

    @Post('/:cartId')
    public async create(
        @Param('cartId', ParseObjectIDPipe) cartId: string,
        @GetUser() user: User
    ) {
        return this.orderService.submitOrder(cartId, user);
    }

    @Get('/list')
    public async retrieve(
        @GetUser() user: User
    ) {
        return this.orderService.getOrdersByUser(user);
    }

    @Post('restaurant/rating')
    public async giveRating(
        @Body() ratingDto: RatingDto,
        @GetUser() user: User
    ) {
        return this.orderService.giveRating(user, ratingDto);
    }
}
