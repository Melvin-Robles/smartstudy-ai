import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DocumentStatus, ArtifactType } from '@prisma/client';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import type { CreateAttemptDto } from './dto/create-attempt.dto';
import type { CreateSessionDto } from './dto/create-session.dto';

interface FlashcardsPayload {
  flashcards: Array<{ question: string; answer: string; explanation: string; sourceRef: unknown }>;
}

@Injectable()
export class StudyService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(userId: string, dto: CreateSessionDto) {
    const document = await this.prisma.document.findFirst({
      where: { id: dto.documentId, ownerId: userId, status: DocumentStatus.READY },
    });
    if (!document) {
      throw new NotFoundException('Documento no encontrado o todavía no está listo.');
    }

    const artifact = await this.prisma.generatedArtifact.findFirst({
      where: { documentId: document.id, type: ArtifactType.FLASHCARDS },
      orderBy: { createdAt: 'desc' },
    });
    if (!artifact) {
      throw new BadRequestException('Genera flashcards antes de iniciar una sesión.');
    }

    const payload = JSON.parse(artifact.payload) as FlashcardsPayload;
    const session = await this.prisma.studySession.create({
      data: {
        userId,
        documentId: document.id,
        artifactId: artifact.id,
      },
    });
    return {
      id: session.id,
      documentId: session.documentId,
      artifactId: session.artifactId,
      totalCards: payload.flashcards.length,
      createdAt: session.createdAt,
    };
  }

  async addAttempt(userId: string, sessionId: string, dto: CreateAttemptDto) {
    const session = await this.prisma.studySession.findFirst({
      where: { id: sessionId, userId },
      include: { artifact: true },
    });
    if (!session) {
      throw new NotFoundException('Sesión no encontrada.');
    }
    const payload = JSON.parse(session.artifact.payload) as FlashcardsPayload;
    if (dto.cardIndex >= payload.flashcards.length) {
      throw new BadRequestException('El índice de flashcard no existe.');
    }

    const attempt = await this.prisma.studyAttempt.create({
      data: { sessionId, cardIndex: dto.cardIndex, correct: dto.correct },
    });
    return {
      id: attempt.id,
      sessionId: attempt.sessionId,
      cardIndex: attempt.cardIndex,
      correct: attempt.correct,
      createdAt: attempt.createdAt,
    };
  }

  async getSession(userId: string, sessionId: string) {
    const session = await this.prisma.studySession.findFirst({
      where: { id: sessionId, userId },
      include: { attempts: { orderBy: { createdAt: 'asc' } }, artifact: true },
    });
    if (!session) {
      throw new NotFoundException('Sesión no encontrada.');
    }
    const payload = JSON.parse(session.artifact.payload) as FlashcardsPayload;
    return {
      id: session.id,
      documentId: session.documentId,
      artifactId: session.artifactId,
      totalCards: payload.flashcards.length,
      attempts: session.attempts,
      createdAt: session.createdAt,
    };
  }
}
