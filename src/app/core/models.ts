export type DocumentStatus = 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';

export interface StudyDocument {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'TXT';
  size: string;
  uploadedAt: string;
  status: DocumentStatus;
  progress: number;
  pages: number;
  summary: string;
}

export interface Flashcard {
  id: string;
  documentId: string;
  question: string;
  answer: string;
  source: string;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
}
