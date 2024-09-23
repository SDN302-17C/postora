import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Posts } from '@prisma/client';
import {
  createPostDto,
  PostFilterType,
  PostPaginationResponseType,
  updatePostDto,
} from './dto/post.dtos';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getAll(@Query() params: PostFilterType): Promise<PostPaginationResponseType> {
    return this.postService.getAllPosts(params);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Posts> {
    return this.postService.getPostById(id);
  }

  @Post()
  create(@Body() body: createPostDto): Promise<Posts> {
    return this.postService.createPost(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: updatePostDto): Promise<Posts> {
    return this.postService.updatePost(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Body() body: updatePostDto): Promise<Posts> {
    return this.postService.deletePost(id, body);
  }
}
