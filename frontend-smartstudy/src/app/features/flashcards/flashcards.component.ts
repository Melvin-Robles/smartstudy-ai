import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { StudyStore } from '../../core/study.store';

@Component({
  selector: 'app-flashcards',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="practice-page"><a class="back-link" routerLink="/dashboard"><i class="uil uil-arrow-left"></i> Volver al inicio</a><div class="practice-heading"><div><h1>Repasa lo importante</h1></div>@if (cards().length) {<span class="practice-counter">{{ currentIndex() + 1 }} / {{ cards().length }}</span>}</div>
      @if (errorMessage()) { <div class="form-alert error" role="alert">{{ errorMessage() }}</div> }
      @if (currentCard(); as card) {
        <div class="practice-layout"><section class="practice-main"><div class="practice-progress"><span>Progreso de la sesión</span><strong>{{ progress() }}%</strong></div><div class="progress-track"><span [style.width.%]="progress()"></span></div><button class="flashcard" type="button" (click)="flipped.set(!flipped())" [attr.aria-label]="flipped() ? 'Mostrar pregunta' : 'Mostrar respuesta'"><span class="flashcard-label">{{ flipped() ? 'RESPUESTA' : 'PREGUNTA' }}</span><strong>{{ flipped() ? card.answer : card.question }}</strong><span class="flashcard-source">{{ flipped() ? card.source : 'Haz clic para revelar la respuesta' }}</span></button><div class="practice-actions"><button class="ghost-button" type="button" (click)="mark(false)">Repasar después</button><button class="primary-button" type="button" (click)="mark(true)">Lo sé <i class="uil uil-arrow-right"></i></button></div></section><aside class="practice-aside panel"><span class="eyebrow">RESUMEN DE SESIÓN</span><div class="session-score"><strong>{{ study.completedCards() }}</strong><span>de {{ cards().length }} conocidas</span></div><div class="session-bar"><span [style.width.%]="progress()"></span></div><p>Las flashcards se generaron desde tus documentos y mantienen referencia a la fuente.</p><a routerLink="/documents" class="text-link">Ver documentos <i class="uil uil-arrow-right"></i></a></aside></div>
      } @else {
        <div class="empty-state"><span><i class="uil uil-book-open"></i></span><h2>No hay flashcards disponibles</h2><p>Abre un documento listo y genera flashcards con IA para comenzar.</p><a routerLink="/documents" class="primary-button">Ir a documentos</a></div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlashcardsComponent implements OnInit {
  readonly study = inject(StudyStore);
  readonly cards = this.study.flashcards;
  readonly currentIndex = signal(0);
  readonly flipped = signal(false);
  readonly errorMessage = signal('');
  readonly currentCard = computed(() => this.cards()[this.currentIndex()] ?? null);
  readonly progress = computed(() => this.cards().length ? Math.round((this.study.completedCards() / this.cards().length) * 100) : 0);

  ngOnInit(): void {
    this.study.loadDocuments().pipe(
      switchMap((documents) => {
        const document = documents.find((item) => item.status === 'READY');
        return document ? this.study.loadArtifacts(document.id).pipe(
          switchMap((artifacts) => artifacts.some((artifact) => artifact.type === 'FLASHCARDS') ? this.study.createSession(document.id).pipe(switchMap((session) => this.study.loadSession(session.id))) : of(null)),
        ) : of(null);
      }),
    ).subscribe({ error: (error: unknown) => this.setError(error) });
  }

  mark(correct: boolean): void {
    const session = this.study.activeSession();
    const card = this.currentCard();
    if (!session || !card) return;
    this.study.recordAttempt(session.id, this.currentIndex(), correct).subscribe({
      next: () => this.next(),
      error: (error: unknown) => this.setError(error),
    });
  }

  private next(): void {
    this.currentIndex.update((index) => (index + 1) % Math.max(1, this.cards().length));
    this.flipped.set(false);
  }

  private setError(error: unknown): void {
    this.errorMessage.set(error instanceof HttpErrorResponse && typeof error.error?.message === 'string' ? error.error.message : 'No se pudo cargar la sesión de estudio.');
  }
}
