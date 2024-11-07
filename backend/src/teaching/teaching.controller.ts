import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TeachingService } from './teaching.service';
import { CreateTeachingDto } from './dto/create-teaching.dto';
import { UpdateTeachingDto } from './dto/update-teaching.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserService } from 'src/user/user.service';

@Controller('teaching')
export class TeachingController {
  constructor(
    private readonly teachingService: TeachingService, 
    private readonly userService: UserService,
  ) {}

  @Post()
  create(@Body() createTeachingDto: CreateTeachingDto) {
    return this.teachingService.create(createTeachingDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  @Get('my-courses')
  async findMyCourses(@Req() req: Request) {
    const username = req.user.username;
    const teacher = await this.userService.findByUsername(username);
    const teacherID = teacher.userID;
    return await this.teachingService.findMyCourses(teacherID);
  }s

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeachingDto: UpdateTeachingDto) {
    return this.teachingService.update(+id, updateTeachingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachingService.remove(+id);
  }
}
