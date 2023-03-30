import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Req,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserDto } from '../users/users.dto';
import { UserRequest } from './auth.interface';
import { AuthService } from './auth.service';
import { Public } from './scope.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
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
    return this.authService.signIn(data.email, data.password);
  }
}
