import { Injectable, signal } from '@angular/core';
import { DocumentStatus, Flashcard, StudyDocument } from './models';

const INITIAL_DOCUMENTS: StudyDocument[] = [
  {
    id: 'doc-1',
    name: 'Fundamentos de arquitectura de software.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadedAt: 'Hoy, 09:42',
    status: 'READY',
    progress: 100,
    pages: 24,
    summary: 'Principios de diseño, modularidad y decisiones arquitectónicas para sistemas mantenibles.'
  },
  {
    id: 'doc-2',
    name: 'Apuntes de inteligencia artificial.docx',
    type: 'DOCX',
    size: '1.1 MB',
    uploadedAt: 'Ayer, 18:15',
    status: 'PROCESSING',
    progress: 68,
    pages: 18,
    summary: 'Procesando el contenido y preparando materiales de estudio trazables.'
  },
  {
    id: 'doc-3',
    name: 'Repaso de bases de datos.txt',
    type: 'TXT',
    size: '42 KB',
    uploadedAt: '12 nov 2026',
    status: 'FAILED',
    progress: 0,
    pages: 6,
    summary: 'No se pudo completar el procesamiento. Puedes reintentarlo.'
  }
];

const INITIAL_FLASHCARDS: Flashcard[] = [
  { id: 'card-1', documentId: 'doc-1', question: '¿Qué busca la Clean Architecture?', answer: 'Separar las reglas de negocio de los detalles externos para facilitar el cambio y las pruebas.', source: 'p. 4, Fundamentos de arquitectura', difficulty: 'Fácil' },
  { id: 'card-2', documentId: 'doc-1', question: '¿Qué principio evita que un módulo conozca detalles innecesarios?', answer: 'La separación de responsabilidades, apoyada por contratos explícitos y bajo acoplamiento.', source: 'p. 9, Fundamentos de arquitectura', difficulty: 'Media' },
  { id: 'card-3', documentId: 'doc-1', question: '¿Por qué son importantes los adaptadores?', answer: 'Permiten cambiar proveedores externos sin acoplar el dominio a una tecnología específica.', source: 'p. 15, Fundamentos de arquitectura', difficulty: 'Difícil' }
];

@Injectable({ providedIn: 'root' })
export class StudyStore {
  readonly documents = signal<StudyDocument[]>(INITIAL_DOCUMENTS);
  readonly flashcards = signal<Flashcard[]>(INITIAL_FLASHCARDS);
  readonly completedCards = signal(1);

  getDocument(id: string): StudyDocument | undefined {
    return this.documents().find((document) => document.id === id);
  }

  upload(file: File): void {
    const extension = file.name.split('.').pop()?.toUpperCase();
    if (extension !== 'PDF' && extension !== 'DOCX' && extension !== 'TXT') {
      throw new Error('Solo se permiten archivos PDF, DOCX o TXT.');
    }

    const document: StudyDocument = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: extension,
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      uploadedAt: 'Ahora',
      status: 'UPLOADED',
      progress: 0,
      pages: 0,
      summary: 'El archivo fue recibido y está listo para procesarse.'
    };
    this.documents.update((documents) => [document, ...documents]);

    window.setTimeout(() => this.updateProgress(document.id, 'PROCESSING', 42), 700);
    window.setTimeout(() => this.updateProgress(document.id, 'PROCESSING', 78), 1500);
    window.setTimeout(() => this.updateProgress(document.id, 'READY', 100), 2400);
  }

  retry(id: string): void {
    this.updateProgress(id, 'PROCESSING', 20);
    window.setTimeout(() => this.updateProgress(id, 'READY', 100), 1600);
  }

  remove(id: string): void {
    this.documents.update((documents) => documents.filter((document) => document.id !== id));
    this.flashcards.update((cards) => cards.filter((card) => card.documentId !== id));
  }

  markCardKnown(): void {
    this.completedCards.update((value) => Math.min(value + 1, this.flashcards().length));
  }

  private updateProgress(id: string, status: DocumentStatus, progress: number): void {
    this.documents.update((documents) => documents.map((document) =>
      document.id === id ? { ...document, status, progress, pages: status === 'READY' ? 12 : document.pages } : document
    ));
  }
}
