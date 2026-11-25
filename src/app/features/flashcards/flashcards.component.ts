import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudyStore } from '../../core/study.store';

@Component({
  selector: 'app-flashcards',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="practice-page"><a class="back-link" routerLink="/dashboard"><i class="uil uil-arrow-left"></i> Volver al inicio</a><div class="practice-heading"><div><h1>Repasa lo importante</h1></div><span class="practice-counter">{{ currentIndex() + 1 }} / {{ cards().length }}</span></div><div class="practice-layout"><section class="practice-main"><div class="practice-progress"><span>Progreso de la sesión</span><strong>{{ progress() }}%</strong></div><div class="progress-track"><span [style.width.%]="progress()"></span></div><button class="flashcard" type="button" (click)="flipped.set(!flipped())" [attr.aria-label]="flipped() ? 'Mostrar pregunta' : 'Mostrar respuesta'"><span class="flashcard-label">{{ flipped() ? 'RESPUESTA' : 'PREGUNTA' }}</span><strong>{{ flipped() ? currentCard().answer : currentCard().question }}</strong><span class="flashcard-source">{{ flipped() ? currentCard().source : 'Haz clic para revelar la respuesta' }}</span></button><div class="practice-actions"><button class="ghost-button" type="button" (click)="next()">Repasar después</button><button class="primary-button" type="button" (click)="markKnown()">Lo sé <i class="uil uil-arrow-right"></i></button></div></section><aside class="practice-aside panel"><span class="eyebrow">RESUMEN DE SESIÓN</span><div class="session-score"><strong>{{ study.completedCards() }}</strong><span>de {{ cards().length }} conocidas</span></div><div class="session-bar"><span [style.width.%]="progress()"></span></div><p>Las flashcards se generaron desde tus documentos listos y mantienen referencia a la fuente.</p><a routerLink="/documents" class="text-link">Ver documento fuente <i class="uil uil-arrow-right"></i></a></aside></div></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlashcardsComponent {
  readonly study = inject(StudyStore);
  readonly cards = this.study.flashcards;
  readonly currentIndex = signal(0);
  readonly flipped = signal(false);
  readonly currentCard = computed(() => this.cards()[this.currentIndex()] || { question: 'No hay flashcards', answer: 'Carga un documento para comenzar.', source: '', difficulty: 'Fácil' as const });
  readonly progress = computed(() => this.cards().length ? Math.round((this.study.completedCards() / this.cards().length) * 100) : 0);

  next(): void { this.currentIndex.update((index) => (index + 1) % Math.max(1, this.cards().length)); this.flipped.set(false); }
  markKnown(): void { this.study.markCardKnown(); this.next(); }
}
