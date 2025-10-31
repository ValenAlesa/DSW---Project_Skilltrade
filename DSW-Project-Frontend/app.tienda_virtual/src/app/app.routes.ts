import { Routes } from '@angular/router';
import { Login } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component.js';

export const routes: Routes = [
  {
    path: 'inicio',
    component: DashboardComponent
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  }
];
