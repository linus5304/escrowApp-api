import { Controller, Get, Req } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRequest } from '../auth/auth.interface';
import { Public } from '../auth/scope.decorator';
import { fromPrismaUserToUserDto } from '../mapper';
import { UserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get('me')
  me(@Req() req: UserRequest): Promise<Omit<User, 'password'>> {
    return this.userService.me(req.user.id);
  }

  @Get()
  @Public()
  async findAll(): Promise<Omit<Omit<UserDto, 'password'>, 'rtHash'>[]> {
    return (await this.userService.findAll()).map(fromPrismaUserToUserDto);
  }
}
