import { CreateItemDto, UpdateItemDto } from '../dto/index.dto';
import { IItem } from './IItem.model';

export const ITEM_SERVICE = 'ITEM_SERVICE';
export interface IItemService {
  create(payload: CreateItemDto): Promise<string>;
  retrive(): Promise<IItem[]>;
  update(payload: UpdateItemDto, id: string): Promise<IItem>;
  delete(id: string): Promise<string>;
}
