import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { connectionName } from '../shared/utils/enum';
import {
    Restaurant,
    RestaurantSchema,
    RestaurantItem,
    RestaurantItemSchema,
    RestaurantRating,
    RestaurantRatingSchema
} from './schemas';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { UserModule } from '../user/user.module';
import { RESTAURANT_SERVICE } from './interfaces/IRestaurant.service';
import { OrderModule } from '../order/order.module';

const restaurantService = { useClass: RestaurantService, provide: RESTAURANT_SERVICE };

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Restaurant.name, schema: RestaurantSchema },
            { name: RestaurantItem.name, schema: RestaurantItemSchema },
            { name: RestaurantRating.name, schema: RestaurantRatingSchema }
        ], connectionName.MAIN_DB),
        UserModule,
        OrderModule
    ],
    controllers: [RestaurantController],
    providers: [
        restaurantService,
    ],
    exports: [
        MongooseModule,
        restaurantService
    ]
})
export class RestaurantModule { }
