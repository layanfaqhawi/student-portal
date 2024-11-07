import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { SectionService } from './section.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Request } from 'express';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get()
  async getAllSections() {
    return await this.sectionService.getAllSections();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  @Post('register/:sectionID')
  async registerSection(@Param('sectionID') sectionID: string, @Req() req: Request) {
    const username = req.user.username;
    const response = await this.sectionService.registerSection(username, parseInt(sectionID, 10));
    return response === null ? 'Already registered for course' : 'Successfully registered for section';
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  @Post('teach/:sectionID')
  async teachSection(@Param('sectionID') sectionID: string, @Req() req: Request) {
    const username = req.user.username;
    return await this.sectionService.teachSection(username, parseInt(sectionID, 10));
  }
}
