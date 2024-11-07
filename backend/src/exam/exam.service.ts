import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from '@prisma/client';
import { connect } from 'http2';

type UpdatedQuestion = {
  isUpdated: boolean;
  questionID: number;
  questionText: string;
  answers: { answerID: number; answerText: string; isCorrect: boolean }[];
};

type NewQuestion = {
  questionText: string;
  answers: {
    create: {
      answerText: string;
      isCorrect: boolean;
    }[];
  };
};

type QuestionData = UpdatedQuestion | NewQuestion;

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    return await this.prisma.exam.create({
      data: {
        courseID: Number(createExamDto.courseID),
        examName: createExamDto.examName,
        examDate: new Date(createExamDto.examDate),
      },
    });
  }

  async getExams(studentID: number): Promise<Exam[]> {
    const sections = await this.prisma.enrollment.findMany({
      where: {
        studentID,
      },
      include: {
        section: true,
      },
    });
    const courses = sections.map((section) => section.section.courseID);
    return await this.prisma.exam.findMany({
      where: {
        courseID: {
          in: courses,
        },
      },
      orderBy: {
        examDate: 'asc',
      },
    });
  }

  async getExamsT(teacherID: number): Promise<Exam[]> {
    const sections = await this.prisma.teaching.findMany({
      where: {
        teacherID,
      },
      include: {
        section: true,
      },
    });
    const courses = sections.map((section) => section.section.courseID);
    return await this.prisma.exam.findMany({
      where: {
        courseID: {
          in: courses,
        },
      },
      orderBy: {
        examDate: 'asc',
      },
    });
  }

  async getExam(examID: number): Promise<Exam> {
    return await this.prisma.exam.findUnique({
      where: { examID },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });
  }

  async updateExam(examID: number, updateData: UpdateExamDto): Promise<Exam | { error: string }> {
    // Fetch the current exam data
    const currentExam = await this.prisma.exam.findUnique({
      where: { examID },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });
  
    // Debugging: Log current exam questions
    console.log('Current Exam Questions:', currentExam.questions);
  
    // Check for duplicate questions in the update data
    const existingQuestionTexts = new Set(currentExam.questions.map(q => q.questionText));
    for (const updatedQuestion of updateData.questions) {
      if (existingQuestionTexts.has(updatedQuestion.questionText) && !updatedQuestion.questionID) {
        return { error: `Question with text "${updatedQuestion.questionText}" already exists in this exam.` };
      }
    }
  
    // Process each question in updateData
    const questionsData = await Promise.all(updateData.questions.map(async (updatedQuestion) => {
      if (updatedQuestion.questionID) {
        // Existing question, check for updates
        const existingQuestion = currentExam.questions.find(q => q.questionID === updatedQuestion.questionID);
        if (existingQuestion) {
          // Update the question text if it has changed
          if (existingQuestion.questionText !== updatedQuestion.questionText) {
            await this.prisma.question.update({
              where: { questionID: updatedQuestion.questionID },
              data: { questionText: updatedQuestion.questionText },
            });
          } 
  
          // Update the answers if they have changed
          await Promise.all(updatedQuestion.answers.map(async (updatedAnswer) => {
            const existingAnswer = existingQuestion.answers.find(a => a.answerID === updatedAnswer.answerID);
            if (existingAnswer) {
              if (existingAnswer.answerText !== updatedAnswer.answerText || existingAnswer.isCorrect !== updatedAnswer.isCorrect) {
                await this.prisma.answer.update({
                  where: { answerID: updatedAnswer.answerID },
                  data: {
                    answerText: updatedAnswer.answerText,
                    isCorrect: updatedAnswer.isCorrect,
                  },
                });
              }
            } else {
              // If the answer does not exist, create a new one
              await this.prisma.answer.create({
                data: {
                  questionID: updatedQuestion.questionID,
                  answerText: updatedAnswer.answerText,
                  isCorrect: updatedAnswer.isCorrect,
                },
              });
            }
          }));
          return { ...updatedQuestion, isUpdated: true };
        }
      }
  
      // New question, create it
      return {
        questionText: updatedQuestion.questionText,
        answers: {
          create: updatedQuestion.answers.map((answer: any) => ({
            answerText: answer.answerText,
            isCorrect: answer.isCorrect,
          })),
        },
      };
    }));
  
    // Debugging: Log questions data before updating the exam
    console.log('Questions Data for Update:', questionsData);
  
    return await this.prisma.exam.update({
      where: { examID },
      data: {
        examName: updateData.examName,
        examDate: new Date(updateData.examDate),
      },
    });
  }
  

  createStudentAnswersArray(
    answers: { [questionID: number]: number },
    studentID: number,
    sessionID: number
  ) {
    return Object.entries(answers)
      .filter(([questionID, answerID]) => answerID !== null)
      .map(([questionID, answerID]) => ({
        student: { connect: { studentID } },
        answer: { connect: { answerID } },
      }));
  }

  async submitExam(
    studentID: number,
    sessionID: number,
    answers: { [questionID: number]: number }
  ) {
    const studentAnswersArray = this.createStudentAnswersArray(
      answers,
      studentID,
      sessionID
    );

    const updatedSession = await this.prisma.session.update({
      where: {
        sessionID,
      },
      data: {
        studentAnswers: {
          create: studentAnswersArray,
        },
      },
    });

    const correctAnswers = await this.prisma.answer.findMany({
      where: {
        question: {
          exam: {
            sessions: {
              some: {
                sessionID: sessionID,
              },
            },
          },
        },
        isCorrect: true,
      },
      include: {
        question: true,
      },
    });

    let totalQuestions = correctAnswers.length;
    let correctCount = 0;

    for (let [questionID, answerID] of Object.entries(answers)) {
      let correctAnswer = correctAnswers.find(
        (answer) => answer.question.questionID === Number(questionID)
      );
      if (correctAnswer && correctAnswer.answerID === answerID) {
        correctCount++;
      }
    }

    let grade = (correctCount / totalQuestions) * 100;

    await this.prisma.grade.create({
      data: {
        student: { connect: { studentID } },
        exam: { connect: { examID: updatedSession.examID } },
        grade: Math.round(grade),
        type: 'Exam',
      },
    });

    return updatedSession;
  }

  async searchQuestions(query: string) {
    // Fetch all questions for the given examID
    const questions = await this.prisma.question.findMany({
      include: {
        answers: true,
      },
    });

    // Filter questions based on the lowercased query string
    const filteredQuestions = questions.filter((question) =>
      question.questionText.toLowerCase().includes(query.toLowerCase())
    );

    return filteredQuestions;
  }
}
