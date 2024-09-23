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
      throw new HttpException('User not found', 404);
    }
    return post;
  }

  async createPost(data: createPostDto): Promise<Posts> {
    return this.prismaService.posts.create({
      data: data,
    });
  }

  async updatePost(id: string, data: updatePostDto): Promise<Posts> {
    return this.prismaService.posts.update({
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
  }

  async deletePost(id: string, data: updatePostDto): Promise<Posts> {
    return this.prismaService.posts.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
