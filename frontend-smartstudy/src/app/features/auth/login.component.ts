import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from '../../core/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <main class="login-page">
      <section class="login-panel" aria-labelledby="login-title">
        <a class="login-brand" href="/login" aria-label="SmartStudyAI, ir al inicio">
          <span class="login-brand__mark" aria-hidden="true"><img src="/assets/images/LogoSmart.png" alt="" /></span>
          <span>SmartStudy<span>AI</span></span>
        </a>

        <div class="login-content">
          <h1 id="login-title">{{ isRegisterMode() ? 'Crea tu espacio' : 'Entra a tu espacio' }}</h1>
          <p class="login-intro">{{ isRegisterMode() ? 'Crea una cuenta y empieza a convertir tus documentos en avance.' : 'Continúa donde lo dejaste y convierte el estudio en avance.' }}</p>

          @if (submitted() && form.invalid) {
            <div class="form-alert error" role="alert">Revisa los campos marcados antes de continuar.</div>
          }
          @if (errorMessage()) {
            <div class="form-alert error" role="alert">{{ errorMessage() }}</div>
          }

          <form class="login-form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <label class="field-label" for="email">Email</label>
            <div class="input-wrap">
              <i class="uil uil-envelope input-icon" aria-hidden="true"></i>
              <input id="email" class="text-input" type="email" formControlName="email" placeholder="nombre@universidad.edu" autocomplete="email" [class.invalid]="emailInvalid()" />
            </div>
            @if (emailInvalid()) { <span class="field-error">Ingresa un email válido.</span> }

            <div class="field-heading"><label class="field-label" for="password">Contraseña</label>@if (!isRegisterMode()) { <a href="/login" (click)="$event.preventDefault()">¿Olvidaste tu contraseña?</a> }</div>
            <div class="password-wrap">
              <i class="uil uil-lock input-icon" aria-hidden="true"></i>
              <input id="password" class="text-input" [type]="showPassword() ? 'text' : 'password'" formControlName="password" placeholder="Tu contraseña" autocomplete="current-password" [class.invalid]="passwordInvalid()" />
              <button type="button" class="password-toggle" (click)="showPassword.set(!showPassword())" [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"><i class="uil" [class.uil-eye-slash]="showPassword()" [class.uil-eye]="!showPassword()"></i></button>
            </div>
            @if (passwordInvalid()) { <span class="field-error">La contraseña debe tener al menos 8 caracteres.</span> }

            <button class="primary-button full login-submit" type="submit" [disabled]="loading()">{{ loading() ? 'Conectando...' : (isRegisterMode() ? 'Crear cuenta' : 'Iniciar sesión') }}</button>
          </form>

          <div class="divider"><span>o</span></div>
          <button class="secondary-link login-signup full" type="button" (click)="toggleMode()">{{ isRegisterMode() ? 'Ya tengo una cuenta' : 'Crear una cuenta gratuita' }}</button>
        </div>
      </section>

      <aside class="login-visual" aria-label="Tu espacio de estudio">
        <img src="/assets/images/IsometricLogin.png" alt="Laptop con libros, una lista de tareas y una ruta de estudio" />
      </aside>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthStore);
  readonly submitted = signal(false);
  readonly showPassword = signal(false);
  readonly loading = signal(false);
  readonly isRegisterMode = signal(false);
  readonly errorMessage = signal('');
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  emailInvalid(): boolean { const control = this.form.controls.email; return control.invalid && (control.touched || this.submitted()); }
  passwordInvalid(): boolean { const control = this.form.controls.password; return control.invalid && (control.touched || this.submitted()); }

  toggleMode(): void {
    this.isRegisterMode.update((value) => !value);
    this.submitted.set(false);
    this.errorMessage.set('');
  }

  submit(): void {
    this.submitted.set(true);
    this.errorMessage.set('');
    if (this.form.invalid) return;
    this.loading.set(true);
    const { email, password } = this.form.getRawValue();
    const request = this.isRegisterMode() ? this.auth.register(email, password) : this.auth.login(email, password);
    request.subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigateByUrl('/dashboard');
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.errorMessage.set(this.getErrorMessage(error));
      },
    });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return typeof error.error?.message === 'string' ? error.error.message : 'No se pudo conectar con el backend.';
    }
    return 'No se pudo completar la operación.';
  }
}
