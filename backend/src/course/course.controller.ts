import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  @Get('my-courses')
  async getMyCourses(@Req() req: Request) {
    console.log('getMyCourses'); // Debugging
    const username = req.user.username;
    console.log('Username:', username); //   Debugging
    const student = await this.userService.findByUsername(username);
    const studentID = student.userID;
    return await this.courseService.getMyCourses(studentID);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('student')
  // @Get('schedule')
  // async getSchedule(@Req() req: Request) {
  //   const username = req.user.username;
  //   const student = await this.userService.findByUsername(username);
  //   const studentID = student.userID;
  //   return await this.courseService.getSchedule(studentID);
  // }
}
