import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import { extname, basename } from 'node:path';

export interface ParsedDocument {
  originalName: string;
  mimeType: string;
  extension: 'pdf' | 'docx' | 'txt';
  text: string;
}

export type ValidatedDocument = Omit<ParsedDocument, 'text'>;

@Injectable()
export class DocumentParserService {
  private readonly maxBytes: number;

  constructor(config: ConfigService) {
    this.maxBytes = config.get<number>('MAX_UPLOAD_BYTES', 10 * 1024 * 1024);
  }

  async parse(buffer: Buffer, originalName: string): Promise<ParsedDocument> {
    const validated = await this.validate(buffer, originalName);
    const text = await this.extract(buffer, validated.extension);
    return { ...validated, text };
  }

  async validate(buffer: Buffer, originalName: string): Promise<ValidatedDocument> {
    if (!buffer.length) {
      throw new BadRequestException('El archivo está vacío.');
    }
    if (buffer.length > this.maxBytes) {
      throw new BadRequestException(`El archivo supera el límite de ${this.maxBytes} bytes.`);
    }

    const safeName = this.safeName(originalName);
    const extensionValue = extname(safeName).slice(1).toLowerCase();
    if (extensionValue !== 'pdf' && extensionValue !== 'docx' && extensionValue !== 'txt') {
      throw new BadRequestException('Solo se aceptan archivos PDF, DOCX o TXT.');
    }
    const extension = extensionValue as ValidatedDocument['extension'];

    if (extension === 'pdf' && buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
      throw new BadRequestException('El contenido no corresponde a un PDF válido.');
    }
    if (extension === 'docx') {
      if (buffer.subarray(0, 2).toString('ascii') !== 'PK') {
        throw new BadRequestException('El contenido no corresponde a un DOCX válido.');
      }
      try {
        const zip = await JSZip.loadAsync(buffer);
        if (!zip.file('[Content_Types].xml') || !zip.file('word/document.xml')) {
          throw new Error('Missing DOCX parts');
        }
      } catch {
        throw new BadRequestException('El contenido no corresponde a un DOCX procesable.');
      }
    }
    if (extension === 'txt' && buffer.includes(0)) {
      throw new BadRequestException('El archivo TXT contiene bytes no válidos.');
    }

    return {
      originalName: safeName,
      mimeType: extension === 'pdf'
        ? 'application/pdf'
        : extension === 'docx'
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : 'text/plain',
      extension,
    };
  }

  private async extract(buffer: Buffer, extension: ValidatedDocument['extension']): Promise<string> {
    if (extension === 'pdf') {
      const result = await pdfParse(buffer);
      return this.normalize(result.text);
    }
    if (extension === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      return this.normalize(result.value);
    }
    return this.normalize(buffer.toString('utf8'));
  }

  private normalize(text: string): string {
    const normalized = text.replace(/\r\n?/g, '\n').replace(/[ \t]+\n/g, '\n').trim();
    if (!normalized) {
      throw new BadRequestException('No se pudo extraer texto útil del documento.');
    }
    return normalized;
  }

  private safeName(input: string): string {
    const name = basename(input || 'document');
    const sanitized = name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
    return sanitized || 'document.txt';
  }
}
