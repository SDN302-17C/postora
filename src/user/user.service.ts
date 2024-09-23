import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  updateUserDto,
  UserDto,
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
            status: 1,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
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
            status: 1,
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
        id
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  async createUser(body: UserDto): Promise<User> {
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
      },
    });
    return newUser;
  }
  
  async updateUser(id: string, body: updateUserDto): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id
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

    return updatedUser;
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const deletedUser = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        status: 0,
      },
    });

    return deletedUser;
  }
}
