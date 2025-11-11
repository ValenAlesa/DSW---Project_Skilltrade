import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { MisReservasComponent } from './pages/mis-reservas/mis-reservas.component';
import { MisPublicacionesComponent } from './pages/mis-publicaciones/mis-publicaciones.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';

export const routes: Routes = [
  {
    path: 'main-page',
    component: DashboardComponent,
  },
  {
    path: 'mis-reservas',
    component: MisReservasComponent,
    canActivate: [authGuard],
  },
  {
    path: 'mis-publicaciones',
    component: MisPublicacionesComponent,
    canActivate: [authGuard],
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
    path: '',
    redirectTo: 'main-page',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
