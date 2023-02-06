import { Global, Module } from "@nestjs/common";
import { ItemModule } from "../item/item.module";
import { OrderModule } from "../order/order.module";
import { RestaurantModule } from "../restaurant/restaurant.module";
import { UserModule } from "../user/user.module";
import { SHARED_SERVICE } from "./interfaces/IShared.service";
import { SharedService } from "./service/shared.service";

const sharedService = { provide: SHARED_SERVICE, useClass: SharedService }

@Global()
@Module({
    imports: [RestaurantModule, UserModule, ItemModule, OrderModule],
    providers: [
        sharedService
    ],
    exports: [sharedService]
})
export class SharedModule { }