import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service.js';
import { map } from 'rxjs/operators';


export const adminGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  return loginService.currentUserData.pipe(
    map (user => {
      if (user?.rol === 'ADMINISTRADOR') {
        return true;
      } 
      router.navigate(['/']);
      return false;
    })
  );
}

export const clienteGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  return loginService.currentUserData.pipe(
    map (user => {
      if (user?.rol === 'CLIENTE') {
        return true;
      }
      router.navigate(['/']);
      return false;
    })
  );
}