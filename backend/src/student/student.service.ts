import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from '../prisma.service';
import { Student, Prisma } from '@prisma/client';

@Injectable()
export class StudentService {
  getDashboard(user: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) {}

  async student(
    studentWhereUniqueInput: Prisma.StudentWhereUniqueInput
  ): Promise<Student | null> {
    return this.prisma.student.findUnique({
      where: studentWhereUniqueInput,
    });
  }

  async students(): Promise<Student[]> {
    return this.prisma.student.findMany();
  }

  // async createStudent(data: CreateStudentDto): Promise<Student> {
  //   return this.prisma.student.create({
  //     data,
  //   });
  // }

  // async updateStudent(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
  //   return this.prisma.student.update({
  //     where: { studentID: id },
  //     data: updateStudentDto,
  //   });
  // }

  async deleteStudent(
    where: Prisma.StudentWhereUniqueInput
  ): Promise<Student> {
    return this.prisma.student.delete({
      where,
    });
  }
}
