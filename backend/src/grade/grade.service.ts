import { Injectable } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { PrismaService } from '../prisma.service';
import { Grade, Prisma } from '@prisma/client';

@Injectable()
export class GradeService {
  constructor(private prisma: PrismaService) {}

  async getAllGrades(teacherID: number): Promise<Grade[]> {
    const sections = await this.prisma.teaching.findMany({
      where: {
        teacherID,
      },
      include: {
        section: true,
      },
    });

    const courses = sections.map((section) => section.section.courseID);
    const exams = await this.prisma.exam.findMany({
      where: {
        courseID: {
          in: courses,
        },
      },
    });

    const examIDs = exams.map((exam) => exam.examID);
    const grades = await this.prisma.grade.findMany({
      where: {
        examID: {
          in: examIDs,
        },
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        exam: true,
      },
    });
    return grades;
  }

  async releaseGrade(gradeID: number): Promise<Grade> {
    return this.prisma.grade.update({
      where: { gradeID },
      data: { released: true },
    });
  }

  async getReleasedGrades(studentID: number): Promise<Grade[]> {
    return this.prisma.grade.findMany({
      where: {
        studentID,
        released: true,
      },
      include: {
        exam: true,
      },
    });
  }


}
