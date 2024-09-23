import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { User } from '@prisma/client';
import { updateUserDto, UserDto, UserFilterType, UserPaginationResponseType } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAll(@Query() params: UserFilterType): Promise<UserPaginationResponseType> {
    return this.userService.getAllUsers(params);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  create(@Body() body: UserDto): Promise<User> {
    return this.userService.createUser(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: updateUserDto): Promise<User> {
    return this.userService.updateUser(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<User> {
    return this.userService.deleteUser(id);
  }
}
