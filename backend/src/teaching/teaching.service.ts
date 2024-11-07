import { Injectable } from '@nestjs/common';
import { CreateTeachingDto } from './dto/create-teaching.dto';
import { UpdateTeachingDto } from './dto/update-teaching.dto';
import { PrismaService } from '../prisma.service';
import { Teaching, Prisma } from '@prisma/client';

@Injectable()
export class TeachingService {
  constructor(private prisma: PrismaService) {}
  create(createTeachingDto: CreateTeachingDto) {
    return 'This action adds a new teaching';
  }

  async findMyCourses(teacherID: number) {
    const sections =  await this.prisma.teaching.findMany({
      where: {
        teacherID: teacherID,
      },
    });

    const courseID = await this.prisma.section.findMany({
      where: {
        sectionID: {
          in: sections.map((section) => section.sectionID),
        },
      },
    });

    return this.prisma.course.findMany({
      where: {
        courseID: {
          in: courseID.map((course) => course.courseID),
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} teaching`;
  }

  update(id: number, updateTeachingDto: UpdateTeachingDto) {
    return `This action updates a #${id} teaching`;
  }

  remove(id: number) {
    return `This action removes a #${id} teaching`;
  }
}
