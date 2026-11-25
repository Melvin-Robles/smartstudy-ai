import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../core/auth.store';
import { StudyStore } from '../../core/study.store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard-page">
      <div class="page-heading"><div><span class="eyebrow teal">MI ESPACIO DE ESTUDIO</span><h1>Hola, {{ displayName() }} <i class="uil uil-star wave" aria-hidden="true"></i></h1><p>Un pequeño paso hoy mantiene vivo tu progreso.</p></div><div class="heading-visual"><img class="dashboard-hero" src="/assets/images/Workspace.png" alt="Laptop con una ruta de estudio y libros" /><a routerLink="/documents" class="primary-button">Añadir documento <i class="uil uil-plus" aria-hidden="true"></i></a></div></div>

      <section class="stats-grid" aria-label="Resumen de aprendizaje">
        <article class="stat-card"><span class="stat-icon indigo"><i class="uil uil-file-alt"></i></span><div><span>Documentos</span><strong>{{ documents().length }}</strong><small>en tu biblioteca</small></div></article>
        <article class="stat-card"><span class="stat-icon teal-bg"><i class="uil uil-book-open"></i></span><div><span>Flashcards</span><strong>{{ flashcards().length }}</strong><small>listas para practicar</small></div></article>
        <article class="stat-card"><span class="stat-icon green"><i class="uil uil-chart-line"></i></span><div><span>Progreso semanal</span><strong>68%</strong><small class="positive"><i class="uil uil-arrow-up"></i> 12% esta semana</small></div></article>
      </section>

      <div class="content-grid">
        <section class="panel progress-panel"><div class="panel-heading"><div><span class="eyebrow">CONTINÚA APRENDIENDO</span><h2>Tu sesión de hoy</h2></div><a routerLink="/flashcards" class="text-link">Ver práctica <i class="uil uil-arrow-right"></i></a></div><div class="focus-card"><div class="focus-card-top"><div class="document-badge">PDF</div><div><strong>Fundamentos de arquitectura de software</strong><span>3 flashcards pendientes | 12 min estimados</span></div><span class="status-chip success">Listo</span></div><div class="progress-label"><span>Progreso de la sesión</span><strong>25%</strong></div><div class="progress-track"><span style="width: 25%"></span></div><a routerLink="/flashcards" class="secondary-button">Continuar práctica <i class="uil uil-arrow-right"></i></a></div></section>
        <section class="panel activity-panel"><div class="panel-heading"><div><span class="eyebrow">ACTIVIDAD RECIENTE</span><h2>Tus documentos</h2></div><a routerLink="/documents" class="text-link">Ver todos <i class="uil uil-arrow-right"></i></a></div><div class="activity-list">@for (document of documents().slice(0, 3); track document.id) {<a class="activity-item" [routerLink]="['/documents', document.id]"><span class="file-icon">{{ document.type }}</span><span class="activity-copy"><strong>{{ document.name }}</strong><small>{{ document.uploadedAt }} | {{ document.size }}</small></span><span class="status-chip" [class.success]="document.status === 'READY'" [class.warning]="document.status === 'PROCESSING'" [class.error]="document.status === 'FAILED'">{{ statusLabel(document.status) }}</span></a>}</div></section>
      </div>

      <section class="ai-banner"><div class="ai-banner-icon"><i class="uil uil-brain"></i></div><div><span class="eyebrow teal">PENSADO PARA TI</span><h2>El aprendizaje se vuelve más fácil cuando puedes verlo.</h2><p>SmartStudyAI convierte tus materiales en una ruta de estudio clara, trazable y a tu propio ritmo.</p></div><a routerLink="/documents" class="secondary-button">Explorar biblioteca <i class="uil uil-arrow-right"></i></a></section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly auth = inject(AuthStore);
  private readonly study = inject(StudyStore);
  readonly documents = this.study.documents;
  readonly flashcards = this.study.flashcards;
  readonly displayName = () => this.auth.user() || 'estudiante';

  statusLabel(status: string): string { return status === 'READY' ? 'Listo' : status === 'PROCESSING' ? 'Procesando' : status === 'FAILED' ? 'Revisar' : 'Recibido'; }
}
