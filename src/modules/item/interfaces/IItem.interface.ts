import { CreateItemDto, UpdateItemDto } from "../dto/index.dto";
import { Item } from "../schemas/item.schema";

export const ITEM_SERVICE = 'ITEM_SERVICE';
export interface IItemService {
    create(payload: CreateItemDto): Promise<string>;
    retrive(): Promise<Item[]>;
    update(payload: UpdateItemDto, id: string): Promise<Item>;
    delete(id: string): Promise<string>;
}