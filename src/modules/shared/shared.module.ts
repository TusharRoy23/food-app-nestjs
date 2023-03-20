import { Global, Module } from "@nestjs/common";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { CartModule } from "../cart/cart.module";
import { ItemModule } from "../item/item.module";
import { OrderModule } from "../order/order.module";
import { RestaurantModule } from "../restaurant/restaurant.module";
import { UserModule } from "../user/user.module";
import { REQUEST_SERVICE, SHARED_SERVICE, ELASTICSEARCH_SERVICE } from "./interfaces";
import { RequestService, SharedService, CustomElasticService } from "./service";

const sharedService = { provide: SHARED_SERVICE, useClass: SharedService };
const requestService = { provide: REQUEST_SERVICE, useClass: RequestService };
const elasticSearchService = { provide: ELASTICSEARCH_SERVICE, useClass: CustomElasticService };

@Global()
@Module({
    imports: [
        RestaurantModule,
        UserModule,
        ItemModule,
        OrderModule,
        CartModule,
        ElasticsearchModule.registerAsync({
            useFactory: async () => ({
                node: process.env.ELASTICSEARCH_NODE,
                auth: {
                    username: process.env.ELASTICSEARCH_USERNAME,
                    password: process.env.ELASTICSEARCH_PASSWORD
                }
            })
        }),
    ],
    providers: [
        sharedService,
        requestService,
        elasticSearchService
    ],
    exports: [
        sharedService,
        requestService,
        elasticSearchService,
        ElasticsearchModule
    ]
})
export class SharedModule { }