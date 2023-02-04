import { Controller, Inject } from '@nestjs/common';
import { IOrderService, ORDER_SERVICE } from './interfaces/IOrder.service';

@Controller('order')
export class OrderController {
    constructor(
        @Inject(ORDER_SERVICE) private readonly orderService: IOrderService
    ) { }
}
