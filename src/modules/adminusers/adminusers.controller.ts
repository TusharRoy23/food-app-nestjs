import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminusersService } from './adminusers.service';
import { CreateAdminuserDto } from './dto/create-adminuser.dto';
import { UpdateAdminuserDto } from './dto/update-adminuser.dto';

@Controller('adminusers')
export class AdminusersController {
  constructor(private readonly adminusersService: AdminusersService) {}

  @Post()
  create(@Body() createAdminuserDto: CreateAdminuserDto) {
    return this.adminusersService.create(createAdminuserDto);
  }

  @Get()
  findAll() {
    return this.adminusersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminusersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminuserDto: UpdateAdminuserDto) {
    return this.adminusersService.update(+id, updateAdminuserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminusersService.remove(+id);
  }
}
