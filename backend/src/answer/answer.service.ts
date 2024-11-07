import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { PrismaService } from '../prisma.service';
import { Answer, Prisma } from '@prisma/client';

@Injectable()
export class AnswerService {
  constructor(private prisma: PrismaService) {} 

  async answer(
    answerWhereUniqueInput: Prisma.AnswerWhereUniqueInput
  ): Promise<Answer | null> {
    return this.prisma.answer.findUnique({
      where: answerWhereUniqueInput,
    });
  }

  async answers(): Promise<Answer[]> {
    return this.prisma.answer.findMany();
  }
  
  create(createAnswerDto: CreateAnswerDto) {
    return 'This action adds a new answer';
  }

  findAll() {
    return `This action returns all answer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} answer`;
  }

  update(id: number, updateAnswerDto: UpdateAnswerDto) {
    return `This action updates a #${id} answer`;
  }

  remove(id: number) {
    return `This action removes a #${id} answer`;
  }
}
