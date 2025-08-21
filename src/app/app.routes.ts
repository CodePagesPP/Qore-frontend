import { Routes } from '@angular/router';
import { authenticatedGuard } from './core/guards/authenticated-guard';
import { authGuard } from './core/guards/auth-guard';
import { Nav } from './features/layout/nav/nav';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

   {
    path: '',
    title: '',
    component: Nav,
    canActivate: [authGuard] ,
    children:[
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'clients',
        title: 'Clientes',
        loadComponent: () => import('./features/layout/crud-clients/crud-clients').then(m => m.CrudClients)
      },
      {
        path: 'workers',
        title: 'Personal',
        loadComponent: () => import('./features/layout/workers/workers').then(m => m.Workers)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [authenticatedGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [authenticatedGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./features/landing/landing').then(m => m.Landing),
    canActivate: [authenticatedGuard]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
