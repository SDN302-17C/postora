import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dtos/auth.dto';
import { User } from '@prisma/client';
import { hashPassword } from '../utils/hash';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  register = async (userData: RegisterDto): Promise<User> => {
    // Check if user already exists
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    // If user exists, throw an error
    if (user) {
      throw new HttpException({ message: 'User already exists!' }, 400);
    }

    // Hash the password
    const hashedPassword = await hashPassword(userData.password);

    // Create a new user
    const newUser = await this.prismaService.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    throw new HttpException(
      { message: 'Register Successful!', user: newUser },
      201,
    );
  };

  login = async (userData: {
    email: string;
    password: string;
  }): Promise<any> => {
    // Check if user exists
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    // If user does not exist, throw an error
    if (!user) {
      throw new HttpException({ message: 'User not found!' }, 404);
    }

    // Check if password is correct
    const passwordMatch = await compare(userData.password, user.password);

    // If password is incorrect, throw an error
    if (!passwordMatch) {
      throw new HttpException({ message: 'Password is incorrect!' }, 401);
    }

    // Generate token
    const payload = { id: user.id, name: user.name, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: '7d',
    });

    throw new HttpException(
      { message: 'Login Successful!', accessToken, refreshToken },
      200,
    );
  };
}
