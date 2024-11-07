import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from '../prisma.service';
import { Teacher, Prisma } from '@prisma/client';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async teacher(
    teacherWhereUniqueInput: Prisma.TeacherWhereUniqueInput
  ): Promise<Teacher | null> {
    return this.prisma.teacher.findUnique({
      where: teacherWhereUniqueInput,
    });
  }

  async teachers(): Promise<Teacher[]> {
    return this.prisma.teacher.findMany();
  }

  // async createTeacher(data: CreateTeacherDto): Promise<Teacher> {
  //   return this.prisma.teacher.create({
  //     data,
  //   });
  // }

  // async updateTeacher(id: number, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
  //   return this.prisma.teacher.update({
  //     where: { teacherID: id },
  //     data: updateTeacherDto,
  //   });
  // }

  async deleteTeacher(
    where: Prisma.TeacherWhereUniqueInput
  ): Promise<Teacher> {
    return this.prisma.teacher.delete({
      where,
    });
  }
}
