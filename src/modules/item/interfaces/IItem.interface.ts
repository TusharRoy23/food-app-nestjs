import { User } from "../../user/schemas/user.schema";
import { CreateItemDto, UpdateItemDto } from "../dto/index.dto";
import { Item } from "../schemas/item.schema";

export const ITEM_SERVICE = 'ITEM_SERVICE';
export interface IItemService {
    create(payload: CreateItemDto, user: User): Promise<string>;
    retrive(user: User): Promise<Item[]>;
    update(payload: UpdateItemDto, id: string, user: User): Promise<Item>;
    delete(id: string, user: User): Promise<string>;
}