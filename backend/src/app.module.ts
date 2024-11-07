// src/app.module.ts
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';
import { RoleMiddleware } from './auth/role.middleware';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesGuard } from './auth/roles.guard';
import { SectionModule } from './section/section.module';
import { ExamModule } from './exam/exam.module';
import { TeachingModule } from './teaching/teaching.module';
import { CourseModule } from './course/course.module';
import { SessionModule } from './session/session.module';
import { GradeModule } from './grade/grade.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    JwtModule.register({
      secret: 'secretKey', // Use a secure secret key in production
      signOptions: { expiresIn: '60m' },
    }),
    SectionModule,
    ExamModule,
    TeachingModule,
    CourseModule,
    SessionModule,
    GradeModule,
  ],
  controllers: [AppController], // Ensure AppController is included
  providers: [PrismaService, AppService], // Ensure AppService is included
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RoleMiddleware).forRoutes('');
  // }
}
