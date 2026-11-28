import { ConfigService } from '@nestjs/config';
import { DocumentParserService } from '../src/documents/document-parser.service';

describe('DocumentParserService', () => {
  const parser = new DocumentParserService(
    new ConfigService({ MAX_UPLOAD_BYTES: '10000' }),
  );

  it('validates and extracts TXT content', async () => {
    const buffer = Buffer.from('  Línea uno\r\n\r\nLínea dos  ');
    const parsed = await parser.parse(buffer, 'mis notas.txt');

    expect(parsed.mimeType).toBe('text/plain');
    expect(parsed.originalName).toBe('mis_notas.txt');
    expect(parsed.text).toBe('Línea uno\n\nLínea dos');
  });

  it('rejects a PDF with invalid magic bytes', async () => {
    await expect(parser.validate(Buffer.from('not a pdf'), 'document.pdf')).rejects.toThrow(
      'PDF válido',
    );
  });
});
