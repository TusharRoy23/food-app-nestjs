import { Body, Controller, Get, Inject, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../shared/decorator/get-user.decorator';
import { IsPublic } from '../shared/decorator/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { IRestaurantService, RESTAURANT_SERVICE } from './interfaces/IRestaurant.service';

@ApiTags('Restaurant')
@ApiBearerAuth()
@Controller('restaurant')
@IsPublic(false)
export class RestaurantController {
    constructor(
        @Inject(RESTAURANT_SERVICE) private readonly restaurantService: IRestaurantService
    ) { }
}
