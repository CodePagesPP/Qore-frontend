import { Routes } from '@angular/router';
import { authenticatedGuard } from './core/guards/authenticated-guard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
