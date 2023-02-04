import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { PUBLIC_SERVICE } from './interfaces/IPublic.service';

@Module({
  imports: [RestaurantModule],
  providers: [
    { provide: PUBLIC_SERVICE, useClass: PublicService }
  ],
  controllers: [PublicController]
})
export class PublicModule { }
