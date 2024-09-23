import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from '@prisma/client';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getAll(@Query() params: UserFilterType): Promise<UserPaginationResponseType> {
    return this.postService.getAllUsers(params);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Post> {
    return this.postService.getUserById(id);
  }

  @Post()
  create(@Body() body: UserDto): Promise<Post> {
    return this.postService.createUser(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: updateUserDto): Promise<Post> {
    return this.postService.updateUser(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Post> {
    return this.postService.deleteUser(id);
  }
}
