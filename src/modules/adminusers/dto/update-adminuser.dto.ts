import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminuserDto } from './create-adminuser.dto';

export class UpdateAdminuserDto extends PartialType(CreateAdminuserDto) {}
