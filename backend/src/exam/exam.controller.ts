import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put, Query } from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Controller('exam')
export class ExamController {
  constructor(
    private readonly examService: ExamService,
    private readonly userService: UserService, // Add this line to inject the UserService
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  @Post()
  async create(@Body() createExamDto: CreateExamDto) {
    return await this.examService.create(createExamDto);
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  @Get('my-exams')
  async getExams(@Req() req: Request) {
    const username = req.user.username;
    const student = await this.userService.findByUsername(username);
    const studentID = student.userID;
    return await this.examService.getExams(studentID);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  @Get('my-examsT')
  async getExamsT(@Req() req: Request) {
    const username = req.user.username;
    const teacher = await this.userService.findByUsername(username);
    const teacherID = teacher.userID;
    return await this.examService.getExamsT(teacherID);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  @Get('edit/:examID')
  async getExam(@Param('examID') examID: string) {
    return await this.examService.getExam(parseInt(examID, 10));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  @Patch('edit/:examID')
  async updateExam(@Param('examID') examID: string, @Body() updateExamDto: UpdateExamDto) {
    console.log('test');
    console.log('updateExamDto:', updateExamDto);
    return await this.examService.updateExam(parseInt(examID, 10), updateExamDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  @Get(':examID')
  async getExamS(@Param('examID') examID: string) {
    return await this.examService.getExam(parseInt(examID, 10));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  @Post(':sessionID/submit')
  async submitExam(@Param('sessionID') sessionID: string, @Body() submitData: any, @Req() req: Request) {
    const username = req.user.username;
    const student = await this.userService.findByUsername(username);
    const studentID = student.userID;
    return await this.examService.submitExam(studentID, parseInt(sessionID, 10), submitData.answers);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  @Get('search-questions/:examID/:query')
  async searchQuestions(@Param('query') query: string) {
    return await this.examService.searchQuestions(query);
  }
}
