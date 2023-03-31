import {
  Injectable,
  NotAcceptableException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import { Tokens } from '../utils/types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user && passwordValid) {
      return user;
    }
    return null;
  }

  async me(id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  async register(email: string, pass: string): Promise<Tokens> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltOrRounds);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
    });
    const payload = { email: user.email, id: user.id };
    const { password, ...result } = user;

    const tokens = await this.getTokens({ id: user.id, email: user.email });
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async login(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.validateUser(email, pass);
    const payload = { email: user.email, id: user.id };
    const tokens = await this.getTokens({ id: user.id, email: user.email });

    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        rtHash: {
          not: null,
        },
      },
      data: { rtHash: null },
    });
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: { id: userId },
      data: { rtHash: hash },
    });
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    const rtMatches = await bcrypt.compare(rt, user.rtHash);
    if (!rtMatches) throw new ForbiddenException('refresh token is invalid');

    const tokens = await this.getTokens({ id: user.id, email: user.email });
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async getTokens({
    id,
    email,
  }: {
    id: string;
    email: string;
  }): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { id, email },
        { secret: jwtConstants.at_secret, expiresIn: 60 * 15 },
      ),
      this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: jwtConstants.rt_secret,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
