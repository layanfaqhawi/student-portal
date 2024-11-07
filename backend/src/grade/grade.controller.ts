import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { GradeService } from './grade.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Controller('grade')
export class GradeController {
  constructor(
    private readonly gradeService: GradeService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  @Get('studentGrades')
  async getAllGrades(@Req() req: Request) {
    const username = req.user.username;
    const teacher = await this.userService.findByUsername(username);
    const teacherID = teacher.userID;
    return await this.gradeService.getAllGrades(teacherID);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  @Patch('release/:gradeID')
  async releaseGrade(@Param('gradeID') gradeID: string) {
    return this.gradeService.releaseGrade(parseInt(gradeID, 10));
  }

  @UseGuards(JwtAuthGuard)
  @Roles('student')
  @Get('released')
  async getReleasedGrades(@Req() req: Request) {
    const username = req.user.username;
    const student = await this.userService.findByUsername(username);
    const studentID = student.userID;
    return this.gradeService.getReleasedGrades(studentID);
  }
}
