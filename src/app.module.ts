import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.gaurd';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TransactionModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.at_secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
