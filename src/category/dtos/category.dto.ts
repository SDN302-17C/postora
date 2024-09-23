import { Category } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class createCategoryDto {
  @IsNotEmpty()
  name: String;

  @IsNotEmpty()
  description: String;
}

export class updateCategoryDto {
  name: String;

  description: String;
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
