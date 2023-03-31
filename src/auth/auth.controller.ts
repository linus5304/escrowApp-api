import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { UserDto } from '../users/users.dto';
import { Tokens } from '../utils/types';
import { UserRequest } from './auth.interface';
import { AuthService } from './auth.service';
import { Public } from './scope.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  me(@Req() req: UserRequest): Promise<Omit<User, 'password'>> {
    return this.authService.me(req.user.id);
  }

  @Public()
  @Post('register')
  register(@Body() data: UserDto) {
    return this.authService.register(data.email, data.password);
  }

  @Public()
  @Post('login')
  signIn(@Body() data: UserDto) {
    return this.authService.login(data.email, data.password);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(@Req() req: Request): Promise<void> {
    const user = req.user;
    this.authService.logout(user['id']);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request): Promise<Tokens> {
    const user = req.user;
    return this.authService.refreshTokens(user['id'], user['refreshToken']);
  }
}
