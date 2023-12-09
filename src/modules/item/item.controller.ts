import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  SerializeOptions,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../shared/decorator/public.decorator';
import { ResponseMessage } from '../shared/decorator/response-msg.decorator';
import { Roles } from '../shared/decorator/roles.decorator';
import { ParseObjectIDPipe } from '../shared/pipe/parse-objectid.pipe';
import { UserRole } from '../shared/utils/enum';
import { ItemMessage } from './constants/enum';
import { CreateItemDto, UpdateItemDto } from './dto/index.dto';
import { IItemService, ITEM_SERVICE } from './interfaces/IItem.interface';

@ApiTags('Item')
@ApiBearerAuth()
@Controller('item')
@IsPublic(false)
@Roles(UserRole.OWNER)
@SerializeOptions({
  excludePrefixes: ['_'],
})
export class ItemController {
  constructor(
    @Inject(ITEM_SERVICE) private readonly itemService: IItemService,
  ) {}

  @Post('/')
  @ResponseMessage(ItemMessage.CREATED)
  public async create(@Body() body: CreateItemDto) {
    return await this.itemService.create(body);
  }

  @Get('/')
  @ResponseMessage(ItemMessage.RETRIVED)
  public async retrive() {
    return await this.itemService.retrive();
  }

  @Delete('/:id')
  @ResponseMessage(ItemMessage.DELETED)
  public async delete(@Param('id', ParseObjectIDPipe) id: string) {
    return await this.itemService.delete(id);
  }

  @Put('/:id')
  @ResponseMessage(ItemMessage.UPDATED)
  public async update(
    @Body() body: UpdateItemDto,
    @Param('id', ParseObjectIDPipe) id: string,
  ) {
    return await this.itemService.update(body, id);
  }
}
