import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { throwException } from '../shared/errors/all.exception';
import { connectionName, ItemStatus } from '../shared/utils/enum';
import { CreateItemDto, UpdateItemDto } from './dto/index.dto';
import { IItemService } from './interfaces/IItem.interface';
import { Item, ItemDocuement } from './schemas/item.schema';
import { IItem } from './interfaces/IItem.model';
import { ItemMessage } from './constants/enum';
import { User } from '../user/schemas/user.schema';
import { IRequestService, REQUEST_SERVICE } from '../shared/interfaces';

@Injectable()
export class ItemService implements IItemService {
  constructor(
    @InjectModel(Item.name, connectionName.MAIN_DB)
    private itemModel: Model<ItemDocuement>,
    @Inject(REQUEST_SERVICE) private readonly requestService: IRequestService,
  ) { }

  async create(payload: CreateItemDto): Promise<string> {
    try {
      const user: User = this.getUserDetailsFromRequest();
      const item = new Item();
      item.restaurant = user.restaurant;

      for (const key in payload) {
        item[key] = payload[key];
      }

      await this.itemModel.create(item);
      return ItemMessage.CREATED;
    } catch (error: any) {
      return throwException(error);
    }
  }

  async retrive(): Promise<IItem[]> {
    try {
      const user: User = this.getUserDetailsFromRequest();
      return await this.itemModel
        .find({ item_status: ItemStatus.ACTIVE, restaurant: user.restaurant })
        .exec();
    } catch (error: any) {
      return throwException(error);
    }
  }

  async update(payload: UpdateItemDto, id: string): Promise<IItem> {
    try {
      const user: User = this.getUserDetailsFromRequest();
      return await this.itemModel
        .findOneAndUpdate({ _id: id, restaurant: user.restaurant }, payload, {
          new: true,
        })
        .exec();
    } catch (error) {
      return throwException(error);
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const user: User = this.getUserDetailsFromRequest();
      const itemDelStatus = await this.itemModel
        .findOneAndDelete({ _id: id, restaurant: user.restaurant })
        .exec();
      if (itemDelStatus == null) {
        throw new NotFoundException('Item not found');
      }
      return ItemMessage.DELETED;
    } catch (error: any) {
      return throwException(error);
    }
  }

  private getUserDetailsFromRequest(): User {
    return this.requestService.getUserInfo();
  }
}
