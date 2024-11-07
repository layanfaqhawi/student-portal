import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
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
  controllers: [ExamController],
  providers: [ExamService, PrismaService, JwtAuthGuard, JwtStrategy],
})
export class ExamModule {}
