import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionService } from './question.service';

interface CustomRequest extends Request {
  user: Partial<User>;
}

@ApiTags('Question')
@UseGuards(JwtGuard)
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @ApiOperation({ summary: 'Create a new question' })
  @ApiResponse({ status: 201, description: 'Question created successfully' })
  @ApiBody({ type: CreateQuestionDto })
  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto, @Req() request: CustomRequest) {
    const userId = request.user.id
    return this.questionService.create(createQuestionDto, userId);
  }

  @ApiOperation({ summary: 'Get a list of questions' })
  @ApiResponse({ status: 200, description: 'List of questions' })
  @ApiParam({ name: 'page', required: false, type: Number })
  @ApiParam({ name: 'limit', required: false, type: Number })
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.questionService.findAll(page, limit);
  }

  @ApiOperation({ summary: 'Get a question by ID' })
  @ApiResponse({ status: 200, description: 'Question found' })
  @ApiParam({ name: 'id', required: true, type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a question' })
  @ApiResponse({ status: 200, description: 'Question updated' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateQuestionDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(id, updateQuestionDto);
  }

  @ApiOperation({ summary: 'Delete a question' })
  @ApiResponse({ status: 200, description: 'Question deleted' })
  @ApiParam({ name: 'id', required: true, type: String })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(id);
  }
}
