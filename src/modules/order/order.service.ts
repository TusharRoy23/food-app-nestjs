import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { connectionName } from '../shared/utils/enum';
import { throwException } from '../shared/errors/all.exception';
import { OrderResponse, PaginationPayload, PaginatedOrderResponse } from '../shared/utils/response.utils';
import { OrderDto } from './dto/order.dto';
import { IOrderService } from './interfaces/IOrder.service';
import { Order, OrderDocument } from './schemas';
import { Model } from 'mongoose';

@Injectable()
export class OrderService implements IOrderService {
    constructor(
        @InjectModel(Order.name, connectionName.MAIN_DB) private orderModel: Model<OrderDocument>
    ) { }
    submitOrder(orderDto: OrderDto, userUuid: string): Promise<OrderResponse> {
        try {

        } catch (error: any) {
            return throwException(error);
        }
    }
    getOrdersByUser(userUuid: string, pagination: PaginationPayload): Promise<PaginatedOrderResponse> {
        throw new Error('Method not implemented.');
    }
}
