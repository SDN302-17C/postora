import { Category } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class createCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;
}

export class updateCategoryDto {
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
