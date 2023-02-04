import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { throwException } from 'src/modules/shared/errors/all.exception';
import { ISharedService, SHARED_SERVICE } from 'src/modules/shared/interfaces/IShared.service';
import { CartReponse } from 'src/modules/shared/utils/response.utils';
import { connectionName } from '../shared/utils/enum';
import { CreateItemDto } from '../item/dto/create-item.dto';
import { UpdateItemDto } from '../item/dto/update-item.dto';
import { Item } from '../item/schemas/item.schema';
import { Restaurant } from '../restaurant/schemas';
import { CartItemDto } from './dto/cart-item.dto';
import { ICartService } from './interfaces/ICart.interface';
import { Cart, CartDocument, CartItem, CartItemDocument } from './schemas';

@Injectable()
export class CartService implements ICartService {
    constructor(
        @InjectModel(Cart.name, connectionName.MAIN_DB) private cartModel: Model<CartDocument>,
        @InjectModel(CartItem.name, connectionName.MAIN_DB) private cartItemModel: Model<CartItemDocument>,
        @Inject(SHARED_SERVICE) private readonly sharedService: ISharedService,
    ) { }

    async create(cartItemDto: CartItemDto, userUuid: string, restaurentUuid: string): Promise<CartReponse> {
        try {
            const restaurantInfo = await this.sharedService.getRestaurantInfo(restaurentUuid);

        } catch (error: any) {
            return throwException(error);
        }
    }
    retrieve(cartUuid: string, userUuid: string): Promise<CartReponse> {
        throw new Error('Method not implemented.');
    }
    update(cartItemDto: CartItemDto, userUuid: string, cartUuid: string): Promise<CartReponse> {
        throw new Error('Method not implemented.');
    }
    delete(itemUuid: string, cartUuid: string, userUuid: string): Promise<CartReponse> {
        throw new Error('Method not implemented.');
    }
}
