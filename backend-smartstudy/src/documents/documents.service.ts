import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentStatus } from '@prisma/client';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { DocumentParserService } from './document-parser.service';

@Injectable()
export class DocumentsService {
  private readonly storageDir: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly parser: DocumentParserService,
    config: ConfigService,
  ) {
    this.storageDir = config.get<string>('STORAGE_DIR', './storage');
  }

  async create(ownerId: string, file: Express.Multer.File) {
    if (!file?.buffer) {
      throw new ServiceUnavailableException('No se recibió el archivo.');
    }

    const parsed = await this.parser.validate(file.buffer, file.originalname);
    await mkdir(this.storageDir, { recursive: true });
    const storageKey = `${randomUUID()}.${parsed.extension}`;
    await writeFile(join(this.storageDir, storageKey), file.buffer, { flag: 'wx' });

    const document = await this.prisma.document.create({
      data: {
        ownerId,
        originalName: parsed.originalName,
        storageKey,
        mimeType: parsed.mimeType,
        sizeBytes: file.size,
        status: DocumentStatus.UPLOADED,
      },
    });

    setImmediate(() => {
      void this.process(document.id, storageKey, parsed.originalName);
    });

    return this.publicDocument(document);
  }

  async list(ownerId: string) {
    const documents = await this.prisma.document.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
    return documents.map((document) => this.publicDocument(document));
  }

  async get(ownerId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({ where: { id: documentId, ownerId } });
    if (!document) {
      throw new NotFoundException('Documento no encontrado.');
    }
    return this.publicDocument(document);
  }

  async delete(ownerId: string, documentId: string): Promise<{ deleted: true }> {
    const document = await this.prisma.document.findFirst({ where: { id: documentId, ownerId } });
    if (!document) {
      throw new NotFoundException('Documento no encontrado.');
    }

    await this.prisma.document.delete({ where: { id: document.id } });
    await unlink(join(this.storageDir, document.storageKey)).catch(() => undefined);
    return { deleted: true };
  }

  async retry(ownerId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({ where: { id: documentId, ownerId } });
    if (!document) {
      throw new NotFoundException('Documento no encontrado.');
    }

    await this.prisma.document.update({
      where: { id: document.id },
      data: {
        status: DocumentStatus.UPLOADED,
        extractedText: null,
        failureReason: null,
      },
    });
    setImmediate(() => {
      void this.process(document.id, document.storageKey, document.originalName);
    });
    return this.get(ownerId, documentId);
  }

  private async process(documentId: string, storageKey: string, originalName: string): Promise<void> {
    try {
      await this.prisma.document.update({
        where: { id: documentId },
        data: { status: DocumentStatus.PROCESSING, failureReason: null },
      });
      const buffer = await readFile(join(this.storageDir, storageKey));
      const parsed = await this.parser.parse(buffer, originalName);
      await this.prisma.document.update({
        where: { id: documentId },
        data: {
          status: DocumentStatus.READY,
          extractedText: parsed.text,
          failureReason: null,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message.slice(0, 500) : 'Error desconocido';
      await this.prisma.document.update({
        where: { id: documentId },
        data: { status: DocumentStatus.FAILED, failureReason: message },
      }).catch(() => undefined);
    }
  }

  private publicDocument(document: {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    status: DocumentStatus;
    failureReason: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: document.id,
      originalName: document.originalName,
      mimeType: document.mimeType,
      sizeBytes: document.sizeBytes,
      status: document.status,
      failureReason: document.failureReason,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
