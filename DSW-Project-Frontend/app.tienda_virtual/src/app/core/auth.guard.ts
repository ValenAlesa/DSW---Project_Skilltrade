import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Auth } from './auth'; // adjust path/name if your auth service file is different

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private auth = inject(Auth, { optional: true });
  private router = inject(Router);

  canActivate(): boolean | UrlTree {
    // prefer using your Auth service; fallback to localStorage token check
    const isLoggedIn = typeof this.auth?.isLoggedIn === 'function'
      ? this.auth!.isLoggedIn()
      : !!localStorage.getItem('auth_token');

    if (isLoggedIn) return true;
    return this.router.parseUrl('/login');
  }
}