import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  UpdateUserDto,
  CreateUserDto,
  UserFilterType,
  UserPaginationResponseType,
} from './dtos/user.dto';
import { User } from '@prisma/client';
import { hashPassword } from '../utils/hash';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getAllUsers(
    filter: UserFilterType,
  ): Promise<UserPaginationResponseType> {
    const itemsPerPage = Number(filter.itemsPerPage) || 10;
    const page = Number(filter.page) || 1;
    const search = filter.search || '';

    const skip = page > 1 ? (page - 1) * itemsPerPage : 0;
    const users = await this.prismaService.user.findMany({
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
            email: {
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

    const total = await this.prismaService.user.count({
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            email: {
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
      data: users,
      total: total,
      currentPage: page,
      itemsPerPage: itemsPerPage,
    };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
        AND: [
          {
            deletedAt: null,
          },
        ],
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  async createUser(body: CreateUserDto): Promise<User> {
    // Check if user already exists
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });

    // If user exists, throw an error
    if (user) {
      throw new HttpException('User already exists', 400);
    }

    // Hash the password
    const hashedPassword = await hashPassword(body.password);
    const newUser = await this.prismaService.user.create({
      data: {
        ...body,
        password: hashedPassword,
        deletedAt: null,
      },
    });
    throw new HttpException(
      { message: 'Create User Successful!', newUser },
      201,
    );
  }

  async updateUser(id: string, body: UpdateUserDto): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
        AND: [
          {
            deletedAt: null,
          },
        ],
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const updatedUser = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });

    throw new HttpException(
      { message: 'Create User Successful!', updatedUser },
      200,
    );
  }

  async deleteUser(id: string): Promise<User> {
    const deleteUser = this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    if (!deleteUser) {
      throw new HttpException('User not found', 404);
    }
    throw new HttpException(
      { message: 'Delete User Successful!', deleteUser },
      404,
    );
  }
}
