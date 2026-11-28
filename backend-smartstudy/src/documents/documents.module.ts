import { Module } from '@nestjs/common';
import { AiGenerationService } from '../ai/ai-generation.service';
import { AuthModule } from '../auth/auth.module';
import { DocumentParserService } from './document-parser.service';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

@Module({
  imports: [AuthModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentParserService, AiGenerationService],
})
export class DocumentsModule {}
