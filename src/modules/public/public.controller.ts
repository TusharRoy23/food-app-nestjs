import { Body, Controller, Get, Inject, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../shared/decorator/public.decorator';
import { RegisterDto } from '../restaurant/dto/register.dto';
import { IPublicService, PUBLIC_SERVICE } from './interfaces/IPublic.service';
import { ParseObjectIDPipe } from '../shared/pipe/parse-objectid.pipe';
import { SearchRestaurantDto } from '../restaurant/dto/search-restaurant.dto';

@ApiTags('Public')
@Controller('public')
@IsPublic(true)
export class PublicController {
    constructor(
        @Inject(PUBLIC_SERVICE) private readonly publicService: IPublicService
    ) { }

    @Post('restaurant/register')
    public async register(
        @Body(new ValidationPipe({ skipMissingProperties: false })) registerDto: RegisterDto
    ) {
        console.log('registerDto cont: ', registerDto);
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

    @Post('restaurant/search')
    public async searchRestaurant(
        @Body() searchRestaurantDto: SearchRestaurantDto
    ) {
        return this.publicService.searchRestaurant(searchRestaurantDto.keyword);
    }
}
