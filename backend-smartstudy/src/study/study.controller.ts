import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../shared/current-user.decorator';
import type { AuthenticatedUser } from '../shared/authenticated-user';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { StudyService } from './study.service';

@Controller('study-sessions')
@UseGuards(AuthGuard)
export class StudyController {
  constructor(private readonly study: StudyService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateSessionDto) {
    return this.study.createSession(user.id, dto);
  }

  @Get(':id')
  get(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.study.getSession(user.id, id);
  }

  @Post(':id/attempts')
  attempt(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CreateAttemptDto,
  ) {
    return this.study.addAttempt(user.id, id, dto);
  }
}
