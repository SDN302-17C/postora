import { User } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
  phone: string;

  age: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class UpdateUserDto {
  name: string;

  @IsOptional()
  @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
  phone: string;

  age: number;
}

export interface UserFilterType {
  itemsPerPage?: number;
  page?: number;
  search?: string;
}

export interface UserPaginationResponseType {
  data: User[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
}
