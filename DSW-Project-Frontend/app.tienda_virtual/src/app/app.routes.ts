import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { MisReservasComponent } from './pages/mis-reservas/mis-reservas.component';
import { MisPublicacionesComponent } from './pages/mis-publicaciones/mis-publicaciones.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { adminGuard, clienteGuard } from './guards/admin.guard.js';

export const routes: Routes = [
  {
    path: 'main-page',
    component: DashboardComponent,
  },
  {
    path: 'mis-reservas',
    component: MisReservasComponent,
    canActivate: [authGuard, clienteGuard],
  },
  {
    path: 'mis-publicaciones',
    component: MisPublicacionesComponent,
    canActivate: [authGuard, clienteGuard],
  },
  {
    path: 'mi-perfil',
    component: MiPerfilComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.component')
      .then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/usuarios',
    loadComponent: () => import('./pages/admin/admin-usuarios/admin-usuarios.component')
      .then(m => m.AdminUsuariosComponent),
    canActivate: [authGuard, adminGuard],
  },
  {
  path: 'admin/servicios',
  loadComponent: () => import('./pages/admin/admin-servicios/admin-servicios.component')
    .then(m => m.AdminServiciosComponent),
  canActivate: [authGuard, adminGuard],
},
  {
    path: '',
    redirectTo: 'main-page',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
