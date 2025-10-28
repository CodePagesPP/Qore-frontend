import { Routes } from '@angular/router';
import { authenticatedGuard } from './core/guards/authenticated-guard';
import { authGuard } from './core/guards/auth-guard';
import { Nav } from './features/layout/nav/nav';
import { roleGuard } from './core/guards/role-guard';
import { NavClient } from './features/layout/nav-client/nav-client';
import { NavInstructor } from './features/layout/nav-instructor/nav-instructor';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
//RUTAS ADMIN, MANAGER, STAFF
   {
    path: '',
    title: '',
    component: Nav,
    canActivate: [authGuard] ,
    children:[
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS', 'MANAGER_ACCESS', 'STAFF_ACCESS'] }
      },
      {
        path: 'clients',
        title: 'Clientes',
        loadComponent: () => import('./features/layout/crud-clients/crud-clients').then(m => m.CrudClients),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS', 'MANAGER_ACCESS', 'STAFF_ACCESS'] }
      },
      {
        path: 'workers',
        title: 'Personal',
        loadComponent: () => import('./features/layout/workers/workers').then(m => m.Workers),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS', 'MANAGER_ACCESS', 'STAFF_ACCESS'] }
      },
      {
        path: 'classes',
        title: 'Clases',
        loadComponent: () => import('./features/layout/clases/clases').then(m => m.Clases),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS', 'MANAGER_ACCESS', 'STAFF_ACCESS'] }
      },
      {
        path: 'roles',
        title: 'Roles',
        loadComponent: () => import('./features/layout/roles/roles').then(m => m.Roles),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS', 'MANAGER_ACCESS', 'STAFF_ACCESS']}
      },
      {
        path: 'disciplines',
        title: 'Disciplinas',
        loadComponent: () => import('./features/layout/disciplines/disciplines').then(m => m.Disciplines),
        canActivate: [roleGuard],
        data: { roles:['ADMIN_ACCESS', 'MANAGER_ACCESS', 'STAFF_ACCESS'] }
      },
      {
        path: 'rooms',
        title: 'Salas',
        loadComponent: () => import('./features/layout/rooms/rooms').then(m => m.Rooms),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS', 'MANAGER_ACCESS', 'STAFF_ACCESS']}
      },
      {
        path: 'plans',
        title: 'Planes',
        loadComponent: () => import('./features/layout/plans/plans').then(m => m.Plans),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS', 'MANAGER_ACCESS', 'STAFF_ACCESS'] }
      }
    ]
  },
//RUTAS CLIENTE
  {
    path: 'c',
    title: '',
    component: NavClient,
    canActivate: [authGuard] ,
    children:[
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./features/dashboard-client/dashboard-client').then(m => m.DashboardClient),
        canActivate: [roleGuard],
        data: { roles: ['CLIENT_ACCESS']}
      },
      {
        path: 'editClient',
        title: 'EditClient',
        loadComponent: () => import('./features/layout/edit-client/edit-client').then(m => m.EditClient),
        canActivate: [roleGuard],
        data: { roles: ['CLIENT_ACCESS']}
      },
      {
        path: 'classes',
        title: 'Clases',
        loadComponent: () => import('./features/layout/clases-client/clases-client').then(m => m.ClasesClient),
        canActivate: [roleGuard],
        data: { roles: ['CLIENT_ACCESS']}
      },
      
    ]
  },
  {
        path: 'payment-success',
        loadComponent: () => import('./features/payments/payment-success/payment-success').then(m => m.PaymentSuccess),
        canActivate: [roleGuard],
        data: { roles: ['CLIENT_ACCESS']}
      },
      {
        path: 'payment-pending',
        loadComponent: () => import('./features/payments/payment-pending/payment-pending').then(m => m.PaymentPending),
        canActivate: [roleGuard],
        data: { roles: ['CLIENT_ACCESS']}
      },
      {
        path: 'payment-failure',
        loadComponent: () => import('./features/payments/payment-failure/payment-failure').then(m => m.PaymentFailure),
        canActivate: [roleGuard],
        data: { roles: ['CLIENT_ACCESS']}
      },
//RUTAS INSTRUCTOR
  {
    path: 'i',
    title: '',
    component: NavInstructor,
    canActivate: [authGuard] ,
    children:[
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./features/dashboard-instructor/dashboard-instructor').then(m => m.DashboardInstructor),
        canActivate: [roleGuard],
        data: { roles: ['INSTRUCTOR_ACCESS']}
      },
       {
        path: 'classes',
        title: 'Clases',
        loadComponent: () => import('./features/layout/clases-instructor/clases-instructor').then(m => m.ClasesInstructor),
        canActivate: [roleGuard],
        data: { roles: ['INSTRUCTOR_ACCESS']}
      },
      {
        path: 'editInstructor',
        title: 'EditInstructor',
        loadComponent: () => import('./features/layout/edit-instructor/edit-instructor').then(m => m.EditInstructor),
        canActivate: [roleGuard],
        data: { roles: ['INSTRUCTOR_ACCESS']}
      }
    ]
  },
//RUTAS PUBLICAS
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [authenticatedGuard]
  },
  {
    path: 'recovery',
    loadComponent: () => import('./features/auth/recuperar-pass/recuperar-pass').then(m => m.RecuperarPass),
    canActivate: [authenticatedGuard]
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./features/auth/reset-password/reset-password').then(m => m.ResetPassword),
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
