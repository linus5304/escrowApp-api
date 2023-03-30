import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './users.dto';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: UserDto): Promise<User> {
    try {
      const result = await this.prisma.user.create({ data });
      return result;
    } catch (err) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findById(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOne(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
