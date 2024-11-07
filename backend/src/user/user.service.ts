// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const { confirmPassword, password, ...rest } = data; // Destructuring to exclude confirmPassword
    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword, // Saving the hashed password
      },
    });

    const id = user.userID;
    if (data.role === 'student') {
      await this.prisma.student.create({
        data: { studentID: id },
      });
    } else if (data.role === 'teacher') {
      await this.prisma.teacher.create({
        data: { teacherID: id },
      });
    }

    return user;
  }

  async users(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  
  async getTeacherDashboard(username: string) {
    const user = await this.findByUsername(username);
    return this.prisma.teacher.findUnique({
      where: { teacherID: user.userID },
    });
  }

  async getStudentDashboard(username: string) {
    const user = await this.findByUsername(username);
    return this.prisma.student.findUnique({
      where: { studentID: user.userID },
    })
  }
}
