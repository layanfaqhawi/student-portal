import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('start/:examID')
  async startSession(@Param('examID') examID: string ) {
    return await this.sessionService.startSession(parseInt(examID, 10));
  }

  @Get(':id')
  async getSession(@Param('id') id: string) {
    return await this.sessionService.getSession(parseInt(id, 10));
  }

  @Post('end/:id')
  async endSession(@Param('id') id: string) {
    return await this.sessionService.endSession(parseInt(id, 10));
  }
}
