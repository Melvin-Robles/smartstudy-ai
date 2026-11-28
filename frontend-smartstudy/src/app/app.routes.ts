import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent) },
      { path: 'documents', loadComponent: () => import('./features/documents/documents.component').then((m) => m.DocumentsComponent) },
      { path: 'documents/:id', loadComponent: () => import('./features/documents/document-detail.component').then((m) => m.DocumentDetailComponent) },
      { path: 'flashcards', loadComponent: () => import('./features/flashcards/flashcards.component').then((m) => m.FlashcardsComponent) }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
