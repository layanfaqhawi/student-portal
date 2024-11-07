import { PartialType } from '@nestjs/mapped-types';
import { CreateExamDto } from './create-exam.dto';

export class UpdateExamDto {
  examName: string;
  examDate: string;
  questions: {
    questionID?: number;
    questionText: string;
    answers: {
      answerID?: number;
      answerText: string;
      isCorrect: boolean;
    }[];
  }[];
}
