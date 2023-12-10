import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { connectionName } from '../shared/utils/enum';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ORDER_SERVICE } from './interfaces/IOrder.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderItem, OrderItemSchema } from './schemas/order-item.schemas';
import {
  OrderDiscount,
  OrderDiscountSchema,
} from './schemas/order-discount.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Order.name, schema: OrderSchema },
        { name: OrderItem.name, schema: OrderItemSchema },
        { name: OrderDiscount.name, schema: OrderDiscountSchema },
      ],
      connectionName.MAIN_DB,
    ),
  ],
  controllers: [OrderController],
  providers: [{ useClass: OrderService, provide: ORDER_SERVICE }],
  exports: [MongooseModule],
})
export class OrderModule {}
