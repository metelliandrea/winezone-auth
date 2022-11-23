import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CheckUserRoles } from 'src/guards/role.guard';
import { RequiredRoles, Roles } from 'src/decorators/role.decorator';

@Controller('users')
@UseGuards(CheckUserRoles)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequiredRoles(Roles.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @RequiredRoles(Roles.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @RequiredRoles(Roles.ADMIN, Roles.PREMIUM, Roles.STANDARD)
  findOne(@Param('id') guid: string) {
    return this.usersService.findOne(guid);
  }

  @Patch(':id')
  @RequiredRoles(Roles.ADMIN, Roles.PREMIUM, Roles.STANDARD)
  update(@Param('id') guid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(guid, updateUserDto);
  }

  @Delete(':id')
  @RequiredRoles(Roles.ADMIN)
  remove(@Param('id') guid: string) {
    return this.usersService.remove(guid);
  }
}
