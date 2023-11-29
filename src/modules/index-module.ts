import { UserModule } from '../modules/user/user.module';
import { RestaurantModule } from '../modules/restaurant/restaurant.module';
import { OrderModule } from '../modules/order/order.module';
import { ItemModule } from '../modules/item/item.module';
import { CartModule } from '../modules/cart/cart.module';
import { AuthModule } from '../modules/auth/auth.module';
import { PublicModule } from '../modules/public/public.module';
import { SharedModule } from './shared/shared.module';

export const ALL_MODULES = [
    UserModule,
    RestaurantModule,
    OrderModule,
    ItemModule,
    CartModule,
    AuthModule,
    PublicModule,
    SharedModule
]