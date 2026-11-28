import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ArtifactType } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../shared/current-user.decorator';
import type { AuthenticatedUser } from '../shared/authenticated-user';
import { AiGenerationService } from '../ai/ai-generation.service';
import { DocumentsService } from './documents.service';

@Controller('documents')
@UseGuards(AuthGuard)
export class DocumentsController {
  constructor(
    private readonly documents: DocumentsService,
    private readonly ai: AiGenerationService,
  ) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.documents.list(user.id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024, files: 1 },
    }),
  )
  create(@CurrentUser() user: AuthenticatedUser, @UploadedFile() file: Express.Multer.File) {
    return this.documents.create(user.id, file);
  }

  @Get(':id')
  get(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.documents.get(user.id, id);
  }

  @Delete(':id')
  delete(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.documents.delete(user.id, id);
  }

  @Post(':id/retry')
  retry(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.documents.retry(user.id, id);
  }

  @Get(':id/artifacts')
  artifacts(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.ai.list(user.id, id);
  }

  @Post(':id/artifacts/summary')
  summary(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.ai.generate(user.id, id, ArtifactType.SUMMARY);
  }

  @Post(':id/artifacts/flashcards')
  flashcards(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.ai.generate(user.id, id, ArtifactType.FLASHCARDS);
  }
}
