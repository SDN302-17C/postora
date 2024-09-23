import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  createPostDto,
  PostFilterType,
  PostPaginationResponseType,
  updatePostDto,
} from './dto/post.dtos';
import { Posts } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  async getAllPosts(
    filter: PostFilterType,
  ): Promise<PostPaginationResponseType> {
    const itemsPerPage = Number(filter.itemsPerPage) || 10;
    const page = Number(filter.page) || 1;
    const search = filter.search || '';

    const skip = page > 1 ? (page - 1) * itemsPerPage : 0;
    const posts = await this.prismaService.posts.findMany({
      take: itemsPerPage,
      skip,
      where: {
        OR: [
          {
            title: {
              contains: search,
            },
          },
          {
            content: {
              contains: search,
            },
          },
          {
            summary: {
              contains: search,
            },
          },
        ],
        AND: [
          {
            deletedAt: null,
          },
        ],
      },
      include: {
        author: true,
        category: true,
      },
      orderBy: {
        title: 'asc',
      },
    });

    const total = await this.prismaService.posts.count({
      where: {
        OR: [
          {
            title: {
              contains: search,
            },
          },
          {
            content: {
              contains: search,
            },
          },
          {
            summary: {
              contains: search,
            },
          },
        ],
        AND: [
          {
            deletedAt: null,
          },
        ],
      },
    });

    return {
      data: posts,
      total: total,
      currentPage: page,
      itemsPerPage: itemsPerPage,
    };
  }

  async getPostById(id: string) {
    const post = this.prismaService.posts.findUnique({
      where: {
        id,
        AND: [
          {
            deletedAt: null,
          },
        ],
      },
      include: {
        author: true,
        category: true,
      },
    });
    if (!post) {
      throw new HttpException('Post not found', 404);
    }
    return post;
  }

  async createPost(data: createPostDto): Promise<Posts> {
    const newPost = this.prismaService.posts.create({
      data: { ...data, deletedAt: null },
    });
    throw new HttpException(
      { message: 'Create Post Successful!',newPost },
      201,
    );
  }

  async updatePost(id: string, data: updatePostDto): Promise<Posts> {
    const post = this.prismaService.posts.update({
      where: {
        id,
        AND: [
          {
            deletedAt: null,
          },
        ],
      },
      data,
    });
    throw new HttpException(
      { message: 'Update Post Successful!', post },
      200,
    );
  }

  async deletePost(id: string): Promise<Posts> {
    const post = this.prismaService.posts.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    throw new HttpException(
      { message: 'Delete Post Successful!', post },
      200,
    );
  }
}
