import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
          <span class="login-brand__mark" aria-hidden="true"><i class="uil uil-brain"></i></span>
          <span>SmartStudy<span>AI</span></span>
        </a>

        <div class="login-content">
          <h1 id="login-title">Entra a tu espacio</h1>
          <p class="login-intro">Continúa donde lo dejaste y convierte el estudio en avance.</p>

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

            <div class="field-heading"><label class="field-label" for="password">Contraseña</label><a href="/login">¿Olvidaste tu contraseña?</a></div>
            <div class="password-wrap">
              <i class="uil uil-lock input-icon" aria-hidden="true"></i>
              <input id="password" class="text-input" [type]="showPassword() ? 'text' : 'password'" formControlName="password" placeholder="Tu contraseña" autocomplete="current-password" [class.invalid]="passwordInvalid()" />
              <button type="button" class="password-toggle" (click)="showPassword.set(!showPassword())" [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"><i class="uil" [class.uil-eye-slash]="showPassword()" [class.uil-eye]="!showPassword()"></i></button>
            </div>
            @if (passwordInvalid()) { <span class="field-error">La contraseña es requerida.</span> }

            <div class="form-options"><label class="check-label"><input type="checkbox" formControlName="remember" /> <span>Recordarme en este dispositivo</span></label></div>
            <button class="primary-button full login-submit" type="submit">Iniciar sesión <i class="uil uil-arrow-right" aria-hidden="true"></i></button>
          </form>

          <div class="divider"><span>o</span></div>
          <a class="secondary-link login-signup" href="/login">Crear una cuenta gratuita <i class="uil uil-arrow-right" aria-hidden="true"></i></a>
          <p class="demo-hint">Demo local: utiliza cualquier email válido y una contraseña de 8 caracteres.</p>
        </div>
      </section>

      <aside class="login-visual" aria-label="Tu espacio de estudio">
        <img src="/assets/images/IsometricLogin.png" alt="Laptop con libros, una lista de tareas y una ruta de estudio" />
      </aside>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthStore);
  readonly submitted = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal('');
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember: [true]
  });

  emailInvalid(): boolean { const control = this.form.controls.email; return control.invalid && (control.touched || this.submitted()); }
  passwordInvalid(): boolean { const control = this.form.controls.password; return control.invalid && (control.touched || this.submitted()); }

  submit(): void {
    this.submitted.set(true);
    this.errorMessage.set('');
    if (this.form.invalid) return;
    this.auth.login(this.form.controls.email.value);
    void this.router.navigateByUrl('/dashboard');
  }
}
