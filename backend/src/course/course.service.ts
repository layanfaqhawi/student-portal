import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from '../prisma.service';
import { Course, Prisma } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}
  
  async getMyCourses(studentID: number): Promise<Course[]> {
    const sections = await this.prisma.enrollment.findMany({
      where: {
        studentID,
      },
      include: {
        section: {
          include: {
            course: true,
          },
        },
      },
    });
    console.log('Sections:', sections); // Debugging
    return sections.map((section) => section.section.course);
  }

  // async getSchedule(studentID: number): Promise<Course[]> {
  //   const sections = await this.prisma.enrollment.findMany({
  //     where: {
  //       studentID,
  //     },
  //     include: {
  //       section: {
  //         include: {
  //           course: true,
  //         },
  //       },
  //     },
  //   })


  // }
}
