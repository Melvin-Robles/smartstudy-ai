import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
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
          <span class="brand-mark" aria-hidden="true"><img src="/assets/images/LogoSmart.png" alt="" /></span>
          <span>SmartStudy<span>AI</span></span>
        </a>

        <div class="sidebar-section-label">Tu espacio</div>
        <nav class="main-nav">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"><i class="uil uil-home"></i> Inicio</a>
          <a routerLink="/documents" routerLinkActive="active"><i class="uil uil-file-alt"></i> Mis documentos</a>
          <a routerLink="/flashcards" routerLinkActive="active"><i class="uil uil-book-open"></i> Flashcards</a>
        </nav>
      </aside>

      <main class="main-content">
        <header class="topbar">
          <div class="topbar-actions">
            @if (showUploadButton()) {
              <a routerLink="/documents" class="primary-button topbar-upload">Añadir documento <i class="uil uil-plus" aria-hidden="true"></i></a>
            }
            <div class="profile-menu-anchor" (click)="$event.stopPropagation()">
              <button class="avatar small profile-trigger" type="button" aria-label="Abrir menú de perfil" [attr.aria-expanded]="profileMenuOpen()" (click)="profileMenuOpen.set(!profileMenuOpen())">{{ initials() }}</button>
              @if (profileMenuOpen()) {
                <div class="profile-menu" role="menu" aria-label="Menú de perfil">
                  <div class="profile-menu-heading"><span class="avatar small">{{ initials() }}</span><div><strong>{{ displayName() }}</strong><small>Tu cuenta</small></div></div>
                  <button class="profile-menu-action" type="button" role="menuitem" (click)="logout()"><i class="uil uil-sign-out-alt" aria-hidden="true"></i> Cerrar sesión</button>
                </div>
              }
            </div>
          </div>
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
  readonly profileMenuOpen = signal(false);
  readonly showUploadButton = signal(true);
  readonly displayName = () => this.auth.user() || 'Estudiante';
  readonly initials = () => this.displayName().slice(0, 2).toUpperCase();

  constructor() {
    this.updateUploadButton(this.router.url);
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.updateUploadButton(event.urlAfterRedirects);
    });
  }

  private updateUploadButton(url: string): void {
    this.showUploadButton.set(url.split('?')[0] !== '/documents');
  }

  @HostListener('document:keydown.escape')
  closeProfileMenu(): void {
    this.profileMenuOpen.set(false);
  }

  logout(): void {
    this.profileMenuOpen.set(false);
    this.loader.skipNextNavigation();
    this.auth.logout();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
