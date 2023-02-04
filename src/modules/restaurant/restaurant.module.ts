import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { connectionName } from '../shared/utils/enum';
import {
    Restaurant,
    RestaurantItem,
    RestaurantItemSchema,
    RestaurantRating,
    RestaurantRatingSchema,
    RestaurantSchema
} from './schemas';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { UserModule } from '../user/user.module';
import { RESTAURANT_SERVICE } from './interfaces/IRestaurant.service';

const restaurantService = { useClass: RestaurantService, provide: RESTAURANT_SERVICE };

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Restaurant.name, schema: RestaurantSchema },
            { name: RestaurantItem.name, schema: RestaurantItemSchema },
            { name: RestaurantRating.name, schema: RestaurantRatingSchema }
        ], connectionName.MAIN_DB),
        UserModule
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
