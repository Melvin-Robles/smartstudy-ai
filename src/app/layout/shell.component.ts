import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from '../core/auth.store';
import { LoaderService } from '../core/loader.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="app-shell">
      <aside class="sidebar" aria-label="Navegación principal">
        <a class="brand" routerLink="/dashboard" aria-label="SmartStudyAI, ir al inicio">
          <span class="brand-mark" aria-hidden="true"><i class="uil uil-brain"></i></span>
          <span>SmartStudy<span>AI</span></span>
        </a>

        <div class="sidebar-section-label">Tu espacio</div>
        <nav class="main-nav">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"><i class="uil uil-home"></i> Inicio</a>
          <a routerLink="/documents" routerLinkActive="active"><i class="uil uil-file-alt"></i> Mis documentos</a>
          <a routerLink="/flashcards" routerLinkActive="active"><i class="uil uil-book-open"></i> Flashcards</a>
        </nav>

        <div class="sidebar-note">
          <span class="note-icon"><i class="uil uil-lightbulb-alt"></i></span>
          <strong>Estudia con intención</strong>
          <p>Convierte cada documento en progreso medible.</p>
        </div>

        <div class="sidebar-footer">
          <button class="profile" type="button" (click)="logout()">
            <span class="avatar">{{ initials() }}</span>
            <span class="profile-copy"><strong>{{ displayName() }}</strong><small>Cerrar sesión</small></span>
            <i class="uil uil-sign-out-alt" aria-hidden="true"></i>
          </button>
        </div>
      </aside>

      <main class="main-content">
        <header class="topbar">
          <div class="breadcrumb">SmartStudyAI <span>/</span> <strong>{{ currentSection() }}</strong></div>
          <div class="topbar-actions"><button class="icon-button" type="button" aria-label="Notificaciones"><i class="uil uil-bell"></i></button><button class="avatar small" type="button">{{ initials() }}</button></div>
        </header>
        <section class="page-content"><router-outlet /></section>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {
  private readonly auth = inject(AuthStore);
  private readonly loader = inject(LoaderService);
  private readonly router = inject(Router);
  readonly displayName = () => this.auth.user() || 'Estudiante';
  readonly initials = () => this.displayName().slice(0, 2).toUpperCase();
  readonly currentSection = () => 'Tu espacio de estudio';

  logout(): void {
    this.loader.skipNextNavigation();
    this.auth.logout();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
