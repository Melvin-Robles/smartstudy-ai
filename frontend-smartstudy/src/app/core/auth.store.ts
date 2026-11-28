import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { AuthResponse, AuthenticatedUser } from './models';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'smartstudy.accessToken';
  readonly token = signal<string | null>(this.readToken());
  readonly user = signal<AuthenticatedUser | null>(null);
  readonly isAuthenticated = computed(() => Boolean(this.token()));

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/session`, { email, password }).pipe(
      tap((response) => this.setSession(response)),
    );
  }

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/register`, { email, password }).pipe(
      tap((response) => this.setSession(response)),
    );
  }

  restoreSession(): Observable<AuthenticatedUser | null> {
    return this.http.get<AuthenticatedUser>(`${API_BASE_URL}/auth/me`).pipe(
      tap((user) => this.user.set(user)),
      catchError(() => {
        this.clearSession();
        return of(null);
      }),
    );
  }

  logout(): void {
    this.clearSession();
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    this.token.set(null);
    this.user.set(null);
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.accessToken);
    this.token.set(response.accessToken);
    this.user.set(response.user);
  }

  private readToken(): string | null {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(this.tokenKey);
  }
}
