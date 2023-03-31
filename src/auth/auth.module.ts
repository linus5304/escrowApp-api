import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { AtStrategy, RtStrategy } from './strategy';
// import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [UsersModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AuthService, PrismaService, AtStrategy, RtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
