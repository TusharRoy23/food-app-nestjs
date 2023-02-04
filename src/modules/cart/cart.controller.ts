import { Controller, Inject } from '@nestjs/common';
import { CART_SERVICE, ICartService } from './interfaces/ICart.interface';

@Controller('cart')
export class CartController {
    constructor(
        @Inject(CART_SERVICE) private readonly cartService: ICartService
    ) { }
}
