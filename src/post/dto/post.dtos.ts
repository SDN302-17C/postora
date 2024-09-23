import { Posts } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class createPostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  summary: string;

  @IsNotEmpty()
  authorId: string;

  @IsNotEmpty()
  categoryId: string;
}

export class updatePostDto {
  title: string;

  content: string;

  summary: string;

  authorId: string;

  categoryId: string;
}

export interface PostFilterType {
  itemsPerPage?: number;
  page?: number;
  search?: string;
}

export interface PostPaginationResponseType {
  data: Posts[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
}
