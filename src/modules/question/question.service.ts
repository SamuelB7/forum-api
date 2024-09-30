import { Injectable } from '@nestjs/common';
import { Question } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    private prismaService: PrismaService,
  ) { }

  private stringToSlug(str: string) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  async create(createQuestionDto: CreateQuestionDto, userId: string): Promise<Question> {
    return await this.prismaService.question.create({
      data: {
        title: createQuestionDto.title,
        content: createQuestionDto.content,
        slug: this.stringToSlug(createQuestionDto.title),
        userId
      }
    });
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ questions: Question[], total: number }> {
    const questions = await this.prismaService.question.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prismaService.question.count();

    return {
      questions,
      total,
    }
  }

  async findOne(id: string): Promise<Question> {
    return await this.prismaService.question.findUnique({
      where: {
        id
      }
    });
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    return await this.prismaService.question.update({
      where: {
        id
      },
      data: {
        title: updateQuestionDto.title,
        content: updateQuestionDto.content,
        slug: this.stringToSlug(updateQuestionDto.title),
      }
    })
  }

  async remove(id: string) {
    return await this.prismaService.question.delete({
      where: {
        id
      }
    })
  }
}
