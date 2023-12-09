import { CreateItemDto, UpdateItemDto } from '../dto/index.dto';
import { IItem } from "../../shared/interfaces/shared.model";

export const ITEM_SERVICE = 'ITEM_SERVICE';
export interface IItemService {
  create(payload: CreateItemDto): Promise<string>;
  retrive(): Promise<IItem[]>;
  update(payload: UpdateItemDto, id: string): Promise<IItem>;
  delete(id: string): Promise<string>;
}
