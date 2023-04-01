import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { connectionName } from '../shared/utils/enum';
import { ItemSchema, Item } from './schemas/item.schema';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { ITEM_SERVICE } from './interfaces/IItem.interface';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Item.name, schema: ItemSchema }],
      connectionName.MAIN_DB,
    ),
  ],
  controllers: [ItemController],
  providers: [{ useClass: ItemService, provide: ITEM_SERVICE }],
  exports: [MongooseModule],
})
export class ItemModule {}
