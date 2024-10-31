import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';
import { FindOneByIdParam } from './dto/find-one-by-id.param';
import { FindUserQuery } from './dto/find-user.query';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const hashedPassword = await argon2.hash(createUserDto.password);
    const createdUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser;
  }

  @Get()
  async findAll(@Query() queryParam: FindUserQuery) {
    return await this.usersService.findAll(queryParam);
  }

  // Can be either id or email.
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const a = await this.usersService.update(id, updateUserDto);
    console.log('hihihihi');
    console.log(a);
    return a;
  }

  @Delete(':id')
  async remove(@Param() deleteUserParam: FindOneByIdParam) {
    return await this.usersService.remove(deleteUserParam.id);
  }
}
