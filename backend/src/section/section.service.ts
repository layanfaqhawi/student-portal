import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Section } from '@prisma/client';
import { UserService } from '../user/user.service';

@Injectable()
export class SectionService {
  constructor(private prisma: PrismaService, private userService: UserService) {}

  async getAllSections(): Promise<(Section & { course: { courseName: string } })[]> {
    return await this.prisma.section.findMany({
      include: {
        course: {
          select: {
            courseName: true,
          },
        },
      },
    });
  }

  async registerSection(username: string, sectionID: number) {
    const student = await this.userService.findByUsername(username);
    const studentID = student.userID;
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentID,
      },
      include: {
        section: {
          include: {
            course: true,
          },
        }
      },
    });
    const course = await this.prisma.section.findUnique({
      where: {
        sectionID,
      },
    });
    const alreadyEnrolled = enrollments.some(enrollment => enrollment.section.courseID === course.courseID);
    if (alreadyEnrolled) {
      return null;
    }
    return this.prisma.enrollment.create({
      data: {
        student: {
          connect: { studentID },
        },
        section: {
          connect: { sectionID: Number(sectionID) }, // Ensure sectionID is parsed as an integer
        },
      },
    });
  }

  async teachSection(username: string, sectionID: number) {
    const teacher = await this.userService.findByUsername(username);
    const teacherID = teacher.userID;
    return this.prisma.teaching.create({
      data: {
        teacher: {
          connect: { teacherID },
        },
        section: {
          connect: { sectionID },
        },
      },
    });
  }
}
