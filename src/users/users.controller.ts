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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') guid: string) {
    return this.usersService.findOne(guid);
  }

  @Patch(':id')
  update(@Param('id') guid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(guid, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') guid: string) {
    return this.usersService.remove(guid);
  }
}