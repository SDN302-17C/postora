import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryFilterType, CategoryPaginationResponseType, CreateCategoryDto, UpdateCategoryDto } from './dtos/category.dto';
import { Category } from '@prisma/client';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAll(@Query() params: CategoryFilterType): Promise<CategoryPaginationResponseType> {
    return this.categoryService.getAllCategories(params);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Category> {
    return this.categoryService.getCategoryById(id);
  }

  @Post()
  create(@Body() body: CreateCategoryDto): Promise<Category> {
    return this.categoryService.createCategory(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateCategoryDto): Promise<Category> {
    return this.categoryService.updateCategory(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Category> {
    return this.categoryService.deleteCategory(id);
  }
}
