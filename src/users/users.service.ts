import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      const result = await this.prisma.user.create({ data });
      return result;
    } catch (err) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOne(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
