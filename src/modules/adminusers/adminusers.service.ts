import { Injectable } from '@nestjs/common';
import { CreateAdminuserDto } from './dto/create-adminuser.dto';
import { UpdateAdminuserDto } from './dto/update-adminuser.dto';

@Injectable()
export class AdminusersService {
  create(createAdminuserDto: CreateAdminuserDto) {
    return 'This action adds a new adminuser';
  }

  findAll() {
    return `This action returns all adminusers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminuser`;
  }

  update(id: number, updateAdminuserDto: UpdateAdminuserDto) {
    return `This action updates a #${id} adminuser`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminuser`;
  }
}
