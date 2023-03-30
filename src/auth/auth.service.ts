import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async me(id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  async register(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.create({ email, password: pass });
    const payload = { email: user.email, sub: user.id };
    const { password, ...result } = user;

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, sub: user.id };
    const { password, ...result } = user;

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
