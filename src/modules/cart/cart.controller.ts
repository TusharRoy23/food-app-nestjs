import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../shared/decorator/public.decorator';
import { Roles } from '../shared/decorator/roles.decorator';
import { TypeOfUsers } from '../shared/decorator/user-type.decorator';
import { ParseObjectIDPipe } from '../shared/pipe/parse-objectid.pipe';
import { UserRole, UserType } from '../shared/utils/enum';
import { CartItemDto } from './dto/cart-item.dto';
import { CART_SERVICE, ICartService } from './interfaces/ICart.interface';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
@IsPublic(false)
@Roles(UserRole.NONE)
@TypeOfUsers(UserType.VISITOR)
export class CartController {
    constructor(
        @Inject(CART_SERVICE) private readonly cartService: ICartService
    ) { }

    @Post('/:restaurantId')
    public async create(
        @Body() cartItemDto: CartItemDto,
        @Param('restaurantId', ParseObjectIDPipe) restaurantId: string
    ) {
        return this.cartService.create(cartItemDto, restaurantId);
    }

    @Get('/:cartId')
    public async retrieve(
        @Param('cartId', ParseObjectIDPipe) cartId: string
    ) {
        return this.cartService.retrieve(cartId);
    }

    @Delete('/:cartId/:cartItemId')
    public async delete(
        @Param('cartId', ParseObjectIDPipe) cartId: string,
        @Param('cartItemId', ParseObjectIDPipe) cartItemId: string
    ) {
        return this.cartService.delete(cartItemId, cartId);
    }

    @Put('/:cartId')
    public async update(
        @Body() cartItemDto: CartItemDto,
        @Param('cartId', ParseObjectIDPipe) cartId: string
    ) {
        return this.cartService.update(cartItemDto, cartId);
    }
}
