import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly user = signal<string | null>(null);
  readonly isAuthenticated = signal(false);

  login(email: string): void {
    this.user.set(email.split('@')[0] || 'estudiante');
    this.isAuthenticated.set(true);
  }

  logout(): void {
    this.user.set(null);
    this.isAuthenticated.set(false);
  }
}
