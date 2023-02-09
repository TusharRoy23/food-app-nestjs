import { Body, Controller, Get, Inject, Param, Post, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../shared/decorator/public.decorator';
import { RegisterDto } from '../restaurant/dto/register.dto';
import { IPublicService, PUBLIC_SERVICE } from './interfaces/IPublic.service';
import { ParseObjectIDPipe } from '../shared/pipe/parse-objectid.pipe';

@ApiTags('Public')
@Controller('public')
@IsPublic(true)
export class PublicController {
    constructor(
        @Inject(PUBLIC_SERVICE) private readonly publicService: IPublicService
    ) { }

    @Post('restaurant/register')
    @UsePipes()
    public async register(
        @Body() registerDto: RegisterDto
    ) {
        return this.publicService.restaurantRegistration(registerDto);
    }

    @Get('restaurant/list')
    public async getRestaurantList() {
        return this.publicService.getRestaurantList();
    }

    @Get('restaurant/:restaurantId/item/list')
    public async getItemList(
        @Param('restaurantId', ParseObjectIDPipe) restaurantId: string,
    ) {
        return this.publicService.getItemList(restaurantId);
    }
}
