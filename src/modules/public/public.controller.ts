import { Body, Controller, Get, Inject, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../shared/decorator/public.decorator';
import { RegisterDto } from '../restaurant/dto/register.dto';
import { IPublicService, PUBLIC_SERVICE } from './interfaces/IPublic.service';

@ApiTags('Public')
@Controller('public')
@IsPublic(true)
export class PublicController {
    constructor(
        @Inject(PUBLIC_SERVICE) private readonly publicService: IPublicService
    ) { }

    @Post('restaurant/register')
    @UsePipes(ValidationPipe)
    public async register(
        @Body() registerDto: RegisterDto
    ) {
        return this.publicService.restaurantRegistration(registerDto);
    }

    @Get('restaurant/list')
    public async getRestaurantList() {
        return this.publicService.getRestaurantList();
    }
}
