import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FlashcardPayload, GeneratedArtifact, SummaryPayload } from '../../core/models';
import { StudyStore } from '../../core/study.store';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (document(); as item) {
      <div class="detail-page">
        <a class="back-link" routerLink="/documents"><i class="uil uil-arrow-left"></i> Volver a documentos</a>
        <div class="detail-heading"><div><div class="detail-title-line"><span class="file-icon large">{{ item.type }}</span><div><span class="eyebrow teal">{{ item.status === 'READY' ? 'DOCUMENTO LISTO' : 'PROCESANDO DOCUMENTO' }}</span><h1>{{ item.name }}</h1><p>{{ item.size }} | Cargado {{ item.uploadedAt.toLowerCase() }}</p></div></div></div><div class="detail-actions"><button class="icon-button danger" type="button" (click)="remove()" aria-label="Eliminar documento"><i class="uil uil-trash-alt"></i></button></div></div>
        @if (errorMessage()) { <div class="form-alert error" role="alert">{{ errorMessage() }}</div> }
        <div class="detail-grid"><section class="panel summary-panel"><div class="panel-heading"><div><span class="eyebrow teal">RESUMEN GENERADO</span><h2>Lo esencial, en contexto</h2></div><span class="status-chip" [class.success]="summaryArtifact()">{{ summaryArtifact() ? 'Trazable' : 'Pendiente' }}</span></div>
          @if (summaryArtifact(); as summary) {
            @if (isSummary(summary.payload)) {
              <div class="summary-callout"><span class="summary-mark"><i class="uil uil-brain"></i></span><p>{{ summary.payload.summary }}</p></div><h3>Ideas principales</h3><ol class="insight-list">@for (point of summary.payload.keyPoints; track point) {<li><strong>{{ point }}</strong><span>Idea extraída y validada desde el documento.</span></li>}</ol>
            }
          } @else {
            <div class="summary-callout"><span class="summary-mark"><i class="uil uil-brain"></i></span><p>{{ item.summary }}</p></div><button class="secondary-button" type="button" (click)="generateSummary()" [disabled]="item.status !== 'READY' || generatingSummary()">{{ generatingSummary() ? 'Generando...' : 'Generar resumen con IA' }}</button>
          }
        </section><aside class="detail-side"><div class="panel artifact-panel"><span class="eyebrow">MATERIAL DE ESTUDIO</span><h2>Listo para practicar</h2><p>{{ cardsCount() ? 'Este documento tiene material generado con referencia a su contenido fuente.' : 'Genera flashcards para practicar este documento.' }}</p><div class="artifact-row"><span class="artifact-icon teal-bg"><i class="uil uil-book-open"></i></span><div><strong>{{ cardsCount() }} flashcards</strong><small>Conceptos clave para repasar</small></div><a routerLink="/flashcards"><i class="uil uil-arrow-right"></i></a></div>@if (!cardsCount()) {<button class="secondary-button full" type="button" (click)="generateFlashcards()" [disabled]="item.status !== 'READY' || generatingFlashcards()">{{ generatingFlashcards() ? 'Generando...' : 'Generar flashcards con IA' }}</button>} @else {<a class="secondary-button full" routerLink="/flashcards">Practicar flashcards <i class="uil uil-arrow-right"></i></a>}</div><div class="panel trace-panel"><span class="eyebrow teal">TRAZABILIDAD</span><h3>Cómo se generó</h3><div class="trace-item"><span><i class="uil uil-check"></i></span><div><strong>Contenido extraído</strong><small>Texto normalizado del documento</small></div></div><div class="trace-item"><span><i class="uil uil-check"></i></span><div><strong>Fuente conservada</strong><small>Las generaciones guardan citas del contenido</small></div></div><div class="trace-item"><span><i class="uil uil-check"></i></span><div><strong>Validación estructurada</strong><small>Resultado verificado antes de mostrar</small></div></div></div></aside></div>
      </div>
    } @else {
      <div class="empty-state"><span><i class="uil uil-search"></i></span><h2>Documento no encontrado</h2><a routerLink="/documents" class="primary-button">Volver a documentos</a></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly study = inject(StudyStore);
  readonly document = computed(() => this.study.getDocument(this.documentId));
  readonly artifacts = this.study.artifacts;
  readonly cardsCount = computed(() => this.study.flashcards().filter((card) => card.documentId === this.documentId).length);
  readonly errorMessage = signal('');
  readonly generatingSummary = signal(false);
  readonly generatingFlashcards = signal(false);
  private readonly documentId = this.route.snapshot.paramMap.get('id') || '';

  summaryArtifact(): GeneratedArtifact | undefined { return this.artifacts().find((artifact) => artifact.type === 'SUMMARY'); }

  ngOnInit(): void {
    if (!this.documentId) return;
    this.study.loadDocument(this.documentId).subscribe({ error: (error: unknown) => this.setError(error) });
    this.study.loadArtifacts(this.documentId).subscribe({ error: (error: unknown) => this.setError(error) });
  }

  generateSummary(): void {
    this.generatingSummary.set(true);
    this.errorMessage.set('');
    this.study.generateSummary(this.documentId).subscribe({ next: () => this.generatingSummary.set(false), error: (error: unknown) => { this.generatingSummary.set(false); this.setError(error); } });
  }

  generateFlashcards(): void {
    this.generatingFlashcards.set(true);
    this.errorMessage.set('');
    this.study.generateFlashcards(this.documentId).subscribe({ next: () => this.generatingFlashcards.set(false), error: (error: unknown) => { this.generatingFlashcards.set(false); this.setError(error); } });
  }

  remove(): void {
    this.study.remove(this.documentId).subscribe({ next: () => void this.router.navigateByUrl('/documents'), error: (error: unknown) => this.setError(error) });
  }

  isSummary(payload: SummaryPayload | FlashcardPayload): payload is SummaryPayload { return 'summary' in payload; }

  private setError(error: unknown): void {
    this.errorMessage.set(error instanceof HttpErrorResponse && typeof error.error?.message === 'string' ? error.error.message : 'No se pudo completar la operación.');
  }
}
