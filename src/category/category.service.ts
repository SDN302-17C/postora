import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Category } from '@prisma/client';
import {
  CategoryFilterType,
  CategoryPaginationResponseType,
  createCategoryDto,
  updateCategoryDto,
} from './dtos/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async getAllCategories(
    filter: CategoryFilterType,
  ): Promise<CategoryPaginationResponseType> {
    const itemsPerPage = Number(filter.itemsPerPage) || 10;
    const page = Number(filter.page) || 1;
    const search = filter.search || '';

    const skip = page > 1 ? (page - 1) * itemsPerPage : 0;
    const categories = await this.prismaService.category.findMany({
      take: itemsPerPage,
      skip,
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            description: {
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
      orderBy: {
        name: 'asc',
      },
    });

    const total = await this.prismaService.category.count({
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            description: {
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
      data: categories,
      total: total,
      currentPage: page,
      itemsPerPage: itemsPerPage,
    };
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = this.prismaService.category.findUnique({
      where: {
        id,
        AND: [
          {
            deletedAt: null,
          },
        ],
      },
    });
    if (!category) {
      throw new HttpException('Category not found', 404);
    }
    return category;
  }

  async createCategory(data: createCategoryDto): Promise<Category> {
    const newCategory = this.prismaService.category.create({
      data: { ...data, deletedAt: null },
    });

    throw new HttpException(
      { message: 'Create Category Successful!', newCategory },
      201,
    );
  }

  async updateCategory(id: string, data: updateCategoryDto): Promise<Category> {
    const updateCategory = this.prismaService.category.update({
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
    if (!updateCategory) {
      throw new HttpException('Category not found', 404);
    }
    throw new HttpException({ message: 'Update Category Successful!', updateCategory }, 200);
  }

  async deleteCategory(id: string): Promise<Category> {
    const deleteCategory = this.prismaService.category.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    if (!deleteCategory) {
      throw new HttpException('Category not found', 404);
    }
    throw new HttpException({ message: 'Delete Category Successful!', deleteCategory }, 200);
  }
}
