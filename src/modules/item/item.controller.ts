import { Body, Controller, Delete, Get, Inject, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../shared/decorator/get-user.decorator';
import { IsPublic } from '../shared/decorator/public.decorator';
import { ResponseMessage } from '../shared/decorator/response-msg.decorator';
import { Roles } from '../shared/decorator/roles.decorator';
import { ParseObjectIDPipe } from '../shared/pipe/parse-objectid.pipe';
import { UserRole } from '../shared/utils/enum';
import { User } from '../user/schemas/user.schema';
import { ItemMessage } from './constants/enum';
import { CreateItemDto, UpdateItemDto } from './dto/index.dto';
import { IItemService, ITEM_SERVICE } from './interfaces/IItem.interface';

@ApiTags('Item')
@ApiBearerAuth()
@Controller('item')
@IsPublic(false)
@Roles(UserRole.OWNER)
export class ItemController {
    constructor(
        @Inject(ITEM_SERVICE) private readonly itemService: IItemService
    ) { }

    @Post('/')
    @ResponseMessage(ItemMessage.CREATED)
    public async create(
        @Body(ValidationPipe) body: CreateItemDto,
        @GetUser() user: User
    ) {
        return await this.itemService.create(body, user);
    }

    @Get('/')
    @ResponseMessage(ItemMessage.RETRIVED)
    public async retrive(@GetUser() user: User) {
        return await this.itemService.retrive(user);
    }

    @Delete('/:id')
    @ResponseMessage(ItemMessage.DELETED)
    public async delete(
        @Param('id', ParseObjectIDPipe) id: string,
        @GetUser() user: User
    ) {
        return await this.itemService.delete(id, user);
    }

    @Put('/:id')
    @ResponseMessage(ItemMessage.UPDATED)
    public async update(
        @Body(ValidationPipe) body: UpdateItemDto,
        @Param('id', ParseObjectIDPipe) id: string,
        @GetUser() user: User
    ) {
        return await this.itemService.update(body, id, user);
    }
}
