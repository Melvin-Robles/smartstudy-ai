import { ChangeDetectionStrategy, Component, ElementRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { StudyStore } from '../../core/study.store';
import { DocumentStatus } from '../../core/models';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="documents-page">
      <div class="page-heading"><div><h1>Mis documentos</h1></div></div>
      <input #fileInput class="visually-hidden" type="file" accept=".pdf,.docx,.txt" (change)="onFileSelected($event)" />

      @if (uploadError()) { <div class="form-alert error" role="alert">{{ uploadError() }}</div> }
      <section class="upload-zone" [class.dragging]="isDragging()" (click)="fileInput.click()" (keydown.enter)="fileInput.click()" (dragover)="onDragOver($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)" tabindex="0" role="button"><div class="upload-icon"><i class="uil uil-upload"></i></div><h2>Arrastra un documento aquí</h2><p>o haz clic para seleccionar un archivo</p><small>PDF, DOCX o TXT | Máximo 10 MB</small></section>

      <div class="library-toolbar"><div><span class="eyebrow">TU COLECCIÓN</span><h2>{{ documents().length }} documentos</h2></div><label class="search-box"><i class="uil uil-search"></i><input type="search" placeholder="Buscar por nombre" aria-label="Buscar documentos" /></label></div>
      <section class="document-grid">
        @for (document of documents(); track document.id) {
          <article class="document-card">
            <div class="document-card-top"><span class="file-icon large">{{ document.type }}</span><button type="button" class="icon-button" (click)="remove(document.id)" [attr.aria-label]="'Eliminar ' + document.name"><i class="uil uil-trash-alt"></i></button></div>
            <a class="document-title" [routerLink]="['/documents', document.id]">{{ document.name }}</a>
            <p>{{ document.summary }}</p>
            @if (document.failureReason) { <p class="field-error">{{ document.failureReason }}</p> }
            <div class="document-meta"><span>{{ document.size }}</span><span>{{ document.pages ? document.pages + ' páginas' : 'Procesamiento automático' }}</span></div>
            <div class="document-status"><span class="status-chip" [class.success]="document.status === 'READY'" [class.warning]="document.status === 'PROCESSING'" [class.error]="document.status === 'FAILED'">{{ statusLabel(document.status) }}</span>@if (document.status === 'PROCESSING' || document.status === 'UPLOADED') {<span class="mini-progress"><i [style.width.%]="document.progress"></i></span>} @if (document.status === 'FAILED') {<button class="retry-button" type="button" (click)="retry(document.id)"><i class="uil uil-redo"></i> Reintentar</button>}</div>
          </article>
        } @empty {
          <div class="empty-state"><span><i class="uil uil-file-alt"></i></span><h2>Aún no tienes documentos</h2><p>Carga tu primer PDF, DOCX o TXT para comenzar.</p></div>
        }
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsComponent implements OnInit {
  private readonly study = inject(StudyStore);
  readonly documents = this.study.documents;
  readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  readonly uploadError = signal('');
  readonly isDragging = signal(false);

  ngOnInit(): void {
    this.study.loadDocuments().subscribe({ error: (error: unknown) => this.showError(error) });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.processFile(input.files?.[0]);
    input.value = '';
  }

  onDragOver(event: DragEvent): void { event.preventDefault(); this.isDragging.set(true); }
  onDragLeave(event: DragEvent): void { event.preventDefault(); this.isDragging.set(false); }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    this.processFile(event.dataTransfer?.files[0]);
  }

  remove(id: string): void {
    this.uploadError.set('');
    this.study.remove(id).subscribe({ error: (error: unknown) => this.showError(error) });
  }

  retry(id: string): void {
    this.uploadError.set('');
    this.study.retry(id).subscribe({ error: (error: unknown) => this.showError(error) });
  }

  statusLabel(status: DocumentStatus): string { return status === 'READY' ? 'Listo' : status === 'PROCESSING' ? 'Procesando' : status === 'FAILED' ? 'Falló' : 'Recibido'; }

  private processFile(file: File | undefined): void {
    if (!file) return;
    this.uploadError.set('');
    this.study.upload(file).subscribe({ error: (error: unknown) => this.showError(error) });
  }

  private showError(error: unknown): void {
    if (error instanceof HttpErrorResponse && typeof error.error?.message === 'string') {
      this.uploadError.set(error.error.message);
      return;
    }
    this.uploadError.set('No se pudo completar la operación.');
  }
}
