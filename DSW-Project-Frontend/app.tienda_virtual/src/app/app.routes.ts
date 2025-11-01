import { Routes } from '@angular/router';
import { Login } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component.js';
import { authGuard } from './guards/auth.guard.js';
import { RegisterComponent } from './components/register/register.component.js';

export const routes: Routes = [
  {
    path: 'main-page',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
