import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, Subject, map, switchMap, takeUntil, takeWhile, tap, timer } from 'rxjs';
import { API_BASE_URL } from './api.config';
import {
  ApiDocument,
  Flashcard,
  FlashcardPayload,
  GeneratedArtifact,
  StudyAttempt,
  StudyDocument,
  StudySession,
  SummaryPayload,
} from './models';

@Injectable({ providedIn: 'root' })
export class StudyStore {
  private readonly http = inject(HttpClient);
  private readonly polling = new Map<string, Subject<void>>();
  readonly documents = signal<StudyDocument[]>([]);
  readonly flashcards = signal<Flashcard[]>([]);
  readonly artifacts = signal<GeneratedArtifact[]>([]);
  readonly activeSession = signal<StudySession | null>(null);
  readonly completedCards = signal(0);

  loadDocuments(): Observable<StudyDocument[]> {
    return this.http.get<ApiDocument[]>(`${API_BASE_URL}/documents`).pipe(
      map((documents) => documents.map((document) => this.toStudyDocument(document))),
      tap((documents) => {
        this.documents.set(documents);
        documents
          .filter((document) => document.status === 'UPLOADED' || document.status === 'PROCESSING')
          .forEach((document) => this.startPolling(document.id));
      }),
    );
  }

  loadDocument(id: string): Observable<StudyDocument> {
    return this.http.get<ApiDocument>(`${API_BASE_URL}/documents/${id}`).pipe(
      map((document) => this.toStudyDocument(document)),
      tap((document) => this.upsertDocument(document)),
    );
  }

  getDocument(id: string): StudyDocument | undefined {
    return this.documents().find((document) => document.id === id);
  }

  upload(file: File): Observable<StudyDocument> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<ApiDocument>(`${API_BASE_URL}/documents`, formData).pipe(
      map((document) => this.toStudyDocument(document)),
      tap((document) => this.upsertDocument(document)),
      switchMap((document) => this.watchDocument(document.id)),
    );
  }

  retry(id: string): Observable<StudyDocument> {
    return this.http.post<ApiDocument>(`${API_BASE_URL}/documents/${id}/retry`, {}).pipe(
      map((document) => this.toStudyDocument(document)),
      tap((document) => this.upsertDocument(document)),
      switchMap((document) => this.watchDocument(document.id)),
    );
  }

  remove(id: string): Observable<{ deleted: true }> {
    return this.http.delete<{ deleted: true }>(`${API_BASE_URL}/documents/${id}`).pipe(
      tap(() => {
        this.documents.update((documents) => documents.filter((document) => document.id !== id));
        this.flashcards.update((cards) => cards.filter((card) => card.documentId !== id));
      }),
    );
  }

  loadArtifacts(documentId: string): Observable<GeneratedArtifact[]> {
    return this.http.get<GeneratedArtifact[]>(`${API_BASE_URL}/documents/${documentId}/artifacts`).pipe(
      tap((artifacts) => {
        this.artifacts.set(artifacts);
        this.updateDerivedContent(documentId, artifacts);
      }),
    );
  }

  generateSummary(documentId: string): Observable<GeneratedArtifact> {
    return this.http.post<GeneratedArtifact>(`${API_BASE_URL}/documents/${documentId}/artifacts/summary`, {}).pipe(
      tap((artifact) => {
        this.artifacts.update((artifacts) => [artifact, ...artifacts]);
        this.updateDerivedContent(documentId, this.artifacts());
      }),
    );
  }

  generateFlashcards(documentId: string): Observable<GeneratedArtifact> {
    return this.http.post<GeneratedArtifact>(`${API_BASE_URL}/documents/${documentId}/artifacts/flashcards`, {}).pipe(
      tap((artifact) => {
        this.artifacts.update((artifacts) => [artifact, ...artifacts]);
        this.updateDerivedContent(documentId, this.artifacts());
      }),
    );
  }

  createSession(documentId: string): Observable<StudySession> {
    return this.http.post<StudySession>(`${API_BASE_URL}/study-sessions`, { documentId }).pipe(
      tap((session) => {
        this.activeSession.set(session);
        this.completedCards.set(0);
      }),
    );
  }

  loadSession(sessionId: string): Observable<StudySession> {
    return this.http.get<StudySession>(`${API_BASE_URL}/study-sessions/${sessionId}`).pipe(
      tap((session) => {
        this.activeSession.set(session);
        this.completedCards.set(session.attempts?.filter((attempt) => attempt.correct).length ?? 0);
      }),
    );
  }

  recordAttempt(sessionId: string, cardIndex: number, correct: boolean): Observable<StudyAttempt> {
    return this.http.post<StudyAttempt>(`${API_BASE_URL}/study-sessions/${sessionId}/attempts`, {
      cardIndex,
      correct,
    }).pipe(
      tap((attempt) => {
        const session = this.activeSession();
        if (!session || session.id !== sessionId) return;
        this.activeSession.set({
          ...session,
          attempts: [...(session.attempts ?? []), attempt],
        });
        if (correct) this.completedCards.update((value) => value + 1);
      }),
    );
  }

  private watchDocument(id: string): Observable<StudyDocument> {
    this.stopPolling(id);
    const stop$ = new Subject<void>();
    this.polling.set(id, stop$);
    return timer(0, 1000).pipe(
      switchMap(() => this.loadDocument(id)),
      takeUntil(stop$),
      takeWhile((document) => document.status === 'UPLOADED' || document.status === 'PROCESSING', true),
      tap((document) => {
        if (document.status === 'READY' || document.status === 'FAILED') this.stopPolling(id);
      }),
    );
  }

  private startPolling(id: string): void {
    if (this.polling.has(id)) return;
    this.watchDocument(id).subscribe({ error: () => this.stopPolling(id) });
  }

  private stopPolling(id: string): void {
    const stop$ = this.polling.get(id);
    if (!stop$) return;
    stop$.next();
    stop$.complete();
    this.polling.delete(id);
  }

  private updateDerivedContent(documentId: string, artifacts: GeneratedArtifact[]): void {
    const summaryArtifact = artifacts.find((artifact) => artifact.type === 'SUMMARY');
    const flashcardArtifact = artifacts.find((artifact) => artifact.type === 'FLASHCARDS');
    if (summaryArtifact && this.isSummary(summaryArtifact.payload)) {
      const summary = summaryArtifact.payload;
      this.documents.update((documents) => documents.map((document) => document.id === documentId ? { ...document, summary: summary.summary } : document));
    }
    if (flashcardArtifact && this.isFlashcards(flashcardArtifact.payload)) {
      const flashcards = flashcardArtifact.payload.flashcards;
      this.flashcards.update((cards) => [
        ...cards.filter((card) => card.documentId !== documentId),
        ...flashcards.map((card, index) => ({
          id: `${flashcardArtifact.id}-${index}`,
          documentId,
          question: card.question,
          answer: card.answer,
          explanation: card.explanation,
          source: card.sourceRef.location ? `${card.sourceRef.location}: ${card.sourceRef.quote}` : card.sourceRef.quote,
        })),
      ]);
    }
  }

  private toStudyDocument(document: ApiDocument): StudyDocument {
    const extension = document.originalName.split('.').pop()?.toUpperCase();
    const type = extension === 'PDF' || extension === 'DOCX' ? extension : 'TXT';
    const progress = document.status === 'READY' ? 100 : document.status === 'PROCESSING' ? 50 : document.status === 'FAILED' ? 0 : 10;
    return {
      id: document.id,
      name: document.originalName,
      type,
      size: this.formatBytes(document.sizeBytes),
      uploadedAt: this.formatDate(document.createdAt),
      status: document.status,
      progress,
      pages: 0,
      summary: document.status === 'READY' ? 'Documento listo para generar material de estudio.' : document.status === 'FAILED' ? 'No se pudo procesar el documento.' : 'Procesando el contenido del documento.',
      failureReason: document.failureReason,
    };
  }

  private upsertDocument(document: StudyDocument): void {
    this.documents.update((documents) => {
      const existing = documents.some((item) => item.id === document.id);
      return existing ? documents.map((item) => item.id === document.id ? document : item) : [document, ...documents];
    });
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-SV', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  }

  private isSummary(payload: SummaryPayload | FlashcardPayload): payload is SummaryPayload {
    return 'summary' in payload;
  }

  private isFlashcards(payload: SummaryPayload | FlashcardPayload): payload is FlashcardPayload {
    return 'flashcards' in payload;
  }
}
