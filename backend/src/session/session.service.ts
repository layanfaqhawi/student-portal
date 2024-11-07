import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PrismaService } from '../prisma.service';
import { Session, Prisma } from '@prisma/client';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async startSession(examID: number): Promise<Session> {
    console.log('Start session request received:', examID); // Debugging
    return this.prisma.session.create({
      data: {
        exam: {
          connect: { examID: examID }
        },
        startTime: new Date(),
        endTime: new Date(), // This should be updated when the student finishes the exam
        studentAnswers: {
          create: []
        },
      },
    });
  }

  async getSession(sessionID: number): Promise<Session> {
    return this.prisma.session.findUnique({
      where: { sessionID },
    });
  }

  async endSession(sessionID: number): Promise<Session> {
    return this.prisma.session.update({
      where: { sessionID },
      data: { endTime: new Date() },
    });
  }
}
