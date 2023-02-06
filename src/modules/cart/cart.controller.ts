import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../shared/decorator/get-user.decorator';
import { IsPublic } from '../shared/decorator/public.decorator';
import { Roles } from '../shared/decorator/roles.decorator';
import { TypeOfUser } from '../shared/decorator/user-type.decorator';
import { ParseObjectIDPipe } from '../shared/pipe/parse-objectid.pipe';
import { UserRole, UserType } from '../shared/utils/enum';
import { User } from '../user/schemas/user.schema';
import { CartItemDto } from './dto/cart-item.dto';
import { CART_SERVICE, ICartService } from './interfaces/ICart.interface';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
@IsPublic(false)
@Roles(UserRole.NONE)
@TypeOfUser(UserType.VISITOR)
export class CartController {
    constructor(
        @Inject(CART_SERVICE) private readonly cartService: ICartService
    ) { }

    @Post('/:restaurantId')
    public async create(
        @Body() cartItemDto: CartItemDto,
        @Param('restaurantId', ParseObjectIDPipe) restaurantId: string,
        @GetUser() user: User
    ) {
        return this.cartService.create(cartItemDto, user, restaurantId);
    }

    @Get('/:cartId')
    public async retrieve(
        @Param('cartId', ParseObjectIDPipe) cartId: string,
        @GetUser() user: User
    ) {
        return this.cartService.retrieve(cartId, user);
    }

    @Delete('/:cartId/:cartItemId')
    public async delete(
        @Param('cartId', ParseObjectIDPipe) cartId: string,
        @Param('cartItemId', ParseObjectIDPipe) cartItemId: string,
        @GetUser() user: User
    ) {
        return this.cartService.delete(cartItemId, cartId, user);
    }

    @Put('/:cartId')
    public async update(
        @Body() cartItemDto: CartItemDto,
        @Param('cartId', ParseObjectIDPipe) cartId: string,
        @GetUser() user: User
    ) {
        return this.cartService.update(cartItemDto, user, cartId);
    }
}
