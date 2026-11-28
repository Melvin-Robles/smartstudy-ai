export type DocumentStatus = 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';
export type ArtifactType = 'SUMMARY' | 'FLASHCARDS';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthenticatedUser;
}

export interface ApiDocument {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  status: DocumentStatus;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SourceReference {
  quote: string;
  location?: string;
}

export interface SummaryPayload {
  summary: string;
  keyPoints: string[];
  sourceRefs: SourceReference[];
}

export interface FlashcardPayload {
  flashcards: Array<{
    question: string;
    answer: string;
    explanation: string;
    sourceRef: SourceReference;
  }>;
}

export interface GeneratedArtifact {
  id: string;
  type: ArtifactType;
  payload: SummaryPayload | FlashcardPayload;
  model: string;
  promptVersion: string;
  createdAt: string;
}

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
  failureReason: string | null;
}

export interface Flashcard {
  id: string;
  documentId: string;
  question: string;
  answer: string;
  explanation: string;
  source: string;
}

export interface StudySession {
  id: string;
  documentId: string;
  artifactId: string;
  totalCards: number;
  createdAt: string;
  attempts?: StudyAttempt[];
}

export interface StudyAttempt {
  id: string;
  sessionId: string;
  cardIndex: number;
  correct: boolean;
  createdAt: string;
}
