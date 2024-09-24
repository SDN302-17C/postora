import { Category } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;
}

export class UpdateCategoryDto {
  name: string;

  description: string;
}

export interface CategoryFilterType {
  itemsPerPage?: number;
  page?: number;
  search?: string;
}

export interface CategoryPaginationResponseType {
  data: Category[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
}
