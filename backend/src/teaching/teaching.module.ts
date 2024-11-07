import { Module } from '@nestjs/common';
import { TeachingService } from './teaching.service';
import { TeachingController } from './teaching.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'secretKey', // Use a secure secret key in production
      signOptions: { expiresIn: '60m' },
    }),
    UserModule,
  ],
  controllers: [TeachingController],
  providers: [TeachingService, PrismaService, JwtAuthGuard, JwtStrategy],
})
export class TeachingModule {}
